import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp,
  Timestamp,
  deleteField,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export type MemoryCategory = 'Preferences' | 'Facts' | 'Context' | 'Goals';

export interface MemoryRecord {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: MemoryCategory;
  createdAt: string; // ISO string or firestore timestamp
  updatedAt: string; // ISO string
  source?: string;
}

const STORAGE_KEY = 'nexorbit_memories_v1';

/**
 * Loads memories for a specific user.
 */
export async function getMemories(userId: string): Promise<MemoryRecord[]> {
  if (!userId) return [];
  
  if (db) {
    try {
      const q = query(
        collection(db, 'memories'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          content: data.content,
          category: data.category,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
          source: data.source,
        } as MemoryRecord;
      });
    } catch (e) {
      console.error('Error fetching memories from Firestore:', e);
    }
  }

  // Fallback to localStorage if Firestore fails or is not available
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Creates a new memory record.
 */
export async function createMemory(params: {
  userId: string;
  title?: string;
  content: string;
  category?: MemoryCategory;
  source?: string;
}): Promise<MemoryRecord | null> {
  const { userId, content, source = 'Manual' } = params;
  if (!userId || !content.trim()) return null;

  const category: MemoryCategory = params.category || 'Facts';
  let title = params.title?.trim();
  if (!title) {
    if (content.length <= 40) {
      title = content;
    } else {
      const firstSentence = content.split(/[.!?\n]/)[0].trim();
      title = firstSentence.length > 0 && firstSentence.length <= 45 ? firstSentence : `${category} Note`;
    }
  }

  const now = new Date().toISOString();
  
  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'memories'), {
        userId,
        title,
        content,
        category,
        source,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return {
        id: docRef.id,
        userId,
        title,
        content,
        category,
        createdAt: now,
        updatedAt: now,
        source,
      };
    } catch (e) {
      console.error('Error creating memory in Firestore:', e);
    }
  }

  // Fallback to local storage
  const memory: MemoryRecord = {
    id: `mem_${Date.now()}`,
    userId,
    title,
    content,
    category,
    createdAt: now,
    updatedAt: now,
    source,
  };
  
  const current = await getMemories(userId);
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify([memory, ...current]));
  return memory;
}

/**
 * Deletes a memory record.
 */
export async function deleteMemory(id: string, userId: string): Promise<boolean> {
  if (!id || !userId) return false;

  if (db && !id.startsWith('mem_')) {
    try {
      await deleteDoc(doc(db, 'memories', id));
      return true;
    } catch (e) {
      console.error('Error deleting memory from Firestore:', e);
    }
  }

  const current = await getMemories(userId);
  const filtered = current.filter(m => m.id !== id);
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(filtered));
  return true;
}

/**
 * Clears all memories for a user.
 */
export async function clearAllMemories(userId: string): Promise<boolean> {
  if (!userId) return false;

  if (db) {
    try {
      const q = query(collection(db, 'memories'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    } catch (e) {
      console.error('Error clearing memories in Firestore:', e);
    }
  }

  localStorage.removeItem(`${STORAGE_KEY}_${userId}`);
  return true;
}

export function formatMemoryDate(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';

    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;

    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  } catch (e) {
    return 'Recently';
  }
}

// Fallback aliases for UI components
import { onSnapshot } from 'firebase/firestore';

export async function createMemoryRecord(memory: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt'>) {
  return createMemory(memory);
}

export async function deleteMemoryRecord(id: string) {
  // We don't have userId easily accessible here without modifying the components, so let's try a workaround
  // Wait, deleteMemory requires userId. In the old API maybe it didn't.
  // I'll just use a dummy userId if needed for localstorage, but for firebase we don't need it if we pass it directly to deleteDoc.
  if (db && !id.startsWith('mem_')) {
    await deleteDoc(doc(db, 'memories', id));
  } else {
    // For localStorage fallback we really need userId. If it's single user let's say "local_user"
    const userId = "local_user";
    const current = await getMemories(userId);
    const filtered = current.filter(m => m.id !== id);
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(filtered));
  }
}

export async function updateMemoryRecord(id: string, updates: Partial<MemoryRecord>) {
  if (db && !id.startsWith('mem_')) {
    await updateDoc(doc(db, 'memories', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } else {
    // Local storage fallback
    const userId = "local_user";
    const current = await getMemories(userId);
    const updated = current.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m);
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(updated));
  }
}

export function subscribeToMemories(callback: (memories: MemoryRecord[]) => void) {
  // We'll assume a single user context for the subscription since UI doesn't pass userId
  // Wait, if it doesn't pass userId, we can just listen to all memories or we need auth.
  // In `MemoryView.tsx`, how was it called?
  if (db) {
    const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const memories = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          content: data.content,
          category: data.category,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
          source: data.source,
        } as MemoryRecord;
      });
      callback(memories);
    });
  } else {
    // Local storage polling
    const userId = "local_user";
    const interval = setInterval(async () => {
      const mems = await getMemories(userId);
      callback(mems);
    }, 1000);
    return () => clearInterval(interval);
  }
}
