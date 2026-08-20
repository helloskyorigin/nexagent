import {
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { handleFirestoreError, FirestoreOperation } from './userProfile';

export interface MemorySourceInfo {
  type: string;
  name: string;
  detail?: string;
  email?: string;
  url?: string;
  path?: string;
  fileName?: string;
}

export interface KeyDetailItem {
  label: string;
  value: string;
}

export interface MemoryItem {
  id?: string;
  userId: string;
  title: string;
  description: string;
  category: 'People' | 'Preferences' | 'Projects' | 'Knowledge' | 'Decisions';
  source: MemorySourceInfo;
  tag: string;
  timestamp?: any;
  createdAt?: any;
  updatedAt?: any;
  keyDetails?: KeyDetailItem[];
  isPinned?: boolean;
}

/**
 * Creates a new memory.
 */
export async function createMemory(
  userId: string,
  memoryData: Omit<MemoryItem, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const path = 'memories';
  try {
    const colRef = collection(db, 'memories');
    const docRef = await addDoc(colRef, {
      ...memoryData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
    throw error;
  }
}

/**
 * Updates a memory.
 */
export async function updateMemory(
  memoryId: string,
  updates: Partial<Omit<MemoryItem, 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const path = `memories/${memoryId}`;
  try {
    const docRef = doc(db, 'memories', memoryId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.UPDATE, path);
    throw error;
  }
}

/**
 * Deletes a memory.
 */
export async function deleteMemory(memoryId: string): Promise<void> {
  const path = `memories/${memoryId}`;
  try {
    const docRef = doc(db, 'memories', memoryId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.DELETE, path);
    throw error;
  }
}

/**
 * Subscribes to a user's memories.
 */
export function subscribeToMemories(
  userId: string,
  onUpdate: (memories: MemoryItem[]) => void,
  onError?: (err: any) => void,
  maxLimit: number = 50
): () => void {
  const path = 'memories';
  const colRef = collection(db, 'memories');
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(maxLimit)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const memories: MemoryItem[] = [];
      snapshot.forEach((doc) => {
        memories.push({
          id: doc.id,
          ...doc.data(),
        } as MemoryItem);
      });
      onUpdate(memories);
    },
    (error) => {
      handleFirestoreError(error, FirestoreOperation.GET, path);
      if (onError) onError(error);
    }
  );
}
