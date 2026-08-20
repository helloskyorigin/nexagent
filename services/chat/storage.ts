import {
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  imageUrl?: string;
  imagePrompt?: string;
  imageStyle?: string;
  imageAspectRatio?: string;
  isImageError?: boolean;
  sourcesUsed?: Array<{
    id?: string;
    title: string;
    url?: string;
    domain?: string;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    size?: string;
    type?: string;
    content?: string;
  }>;
}

export interface Conversation {
  id: string;
  userId?: string;
  type: 'chat' | 'agent';
  title: string;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  mode?: string;
  pinned?: boolean;
  unread?: boolean;
}

const LOCAL_STORAGE_CONVS_KEY = 'nexorbit_conversations_v2';
const LOCAL_STORAGE_MSGS_PREFIX = 'nexorbit_messages_v2_';

/**
 * Helper to get local conversations from localStorage
 */
export function getLocalConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CONVS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local conversations:', e);
    return [];
  }
}

/**
 * Helper to save local conversations to localStorage
 */
export function saveLocalConversations(convs: Conversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CONVS_KEY, JSON.stringify(convs));
    window.dispatchEvent(new Event('nexorbit_conversations_updated'));
  } catch (e) {
    console.error('Error saving local conversations:', e);
  }
}

/**
 * Helper to get local messages for a conversation
 */
export function getLocalMessages(conversationId: string): ChatMessage[] {
  if (typeof window === 'undefined' || !conversationId) return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_MSGS_PREFIX}${conversationId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading local messages for ${conversationId}:`, e);
    return [];
  }
}

/**
 * Helper to save local messages for a conversation
 */
export function saveLocalMessages(conversationId: string, msgs: ChatMessage[]): void {
  if (typeof window === 'undefined' || !conversationId) return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_MSGS_PREFIX}${conversationId}`, JSON.stringify(msgs));
    window.dispatchEvent(new CustomEvent('nexorbit_messages_updated', { detail: { conversationId } }));
  } catch (e) {
    console.error(`Error saving local messages for ${conversationId}:`, e);
  }
}

/**
 * Create a new persistent conversation
 */
export async function createNewConversation(
  userId: string | null,
  title: string,
  type: 'chat' | 'agent' = 'chat',
  mode: string = 'Auto'
): Promise<Conversation> {
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const conversation: Conversation = {
    id: newId,
    userId: userId || undefined,
    type,
    title: title || (type === 'agent' ? 'New Agent Task' : 'New Chat'),
    createdAt: timeFormatted,
    updatedAt: timeFormatted,
    archived: false,
    mode,
  };

  // 1. Always save to Local Storage first for immediate UI availability
  const currentLocal = getLocalConversations();
  const updatedLocal = [conversation, ...currentLocal.filter((c) => c.id !== newId)];
  saveLocalConversations(updatedLocal);

  // 2. If user logged in and db initialized, persist to Firestore
  if (userId && db) {
    try {
      const colRef = collection(db, 'conversations');
      const docRef = await addDoc(colRef, {
        userId,
        type,
        title: conversation.title,
        mode,
        archived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      conversation.id = docRef.id;

      // Update local storage entry with actual firestore ID
      const remappedLocal = updatedLocal.map((c) => (c.id === newId ? conversation : c));
      saveLocalConversations(remappedLocal);
    } catch (e) {
      console.warn('Firestore create conversation fallback to local storage:', e);
    }
  }

  return conversation;
}

/**
 * Add a message to a conversation
 */
export async function addMessageToConversation(
  conversationId: string,
  userId: string | null,
  sender: 'user' | 'ai',
  text: string,
  sourcesUsed?: ChatMessage['sourcesUsed'],
  attachments?: ChatMessage['attachments'],
  imageUrl?: string,
  imagePrompt?: string,
  imageStyle?: string,
  imageAspectRatio?: string,
  isImageError?: boolean
): Promise<ChatMessage> {
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const message: ChatMessage = {
    id: msgId,
    conversationId,
    sender,
    text,
    timestamp: timeFormatted,
    sourcesUsed,
    attachments,
    imageUrl,
    imagePrompt,
    imageStyle,
    imageAspectRatio,
    isImageError,
  };

  // 1. Save locally
  const currentMsgs = getLocalMessages(conversationId);
  const updatedMsgs = [...currentMsgs, message];
  saveLocalMessages(conversationId, updatedMsgs);

  // Update conversation timestamp locally
  const currentLocal = getLocalConversations();
  const updatedLocal = currentLocal.map((c) => {
    if (c.id === conversationId) {
      return { ...c, updatedAt: timeFormatted };
    }
    return c;
  });
  saveLocalConversations(updatedLocal);

  // 2. If Firestore available and user logged in
  if (userId && db && !conversationId.startsWith('conv-')) {
    try {
      const colRef = collection(db, 'conversations', conversationId, 'messages');
      await addDoc(colRef, {
        userId,
        sender,
        text,
        timestamp: serverTimestamp(),
        sourcesUsed: sourcesUsed || null,
        attachments: attachments || null,
        imageUrl: imageUrl || null,
        imagePrompt: imagePrompt || null,
        imageStyle: imageStyle || null,
        imageAspectRatio: imageAspectRatio || null,
        isImageError: isImageError || null,
      });

      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore add message fallback to local storage:', e);
    }
  }

  return message;
}

/**
 * Rename a conversation
 */
export async function renameConversationTitle(
  conversationId: string,
  newTitle: string
): Promise<void> {
  if (!conversationId || !newTitle.trim()) return;

  const titleClean = newTitle.trim();

  // 1. Update locally
  const currentLocal = getLocalConversations();
  const updatedLocal = currentLocal.map((c) =>
    c.id === conversationId ? { ...c, title: titleClean } : c
  );
  saveLocalConversations(updatedLocal);

  // 2. Update in Firestore if not temporary local ID
  if (db && !conversationId.startsWith('conv-')) {
    try {
      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        title: titleClean,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore rename error:', e);
    }
  }
}

/**
 * Archive a conversation
 */
export async function archiveConversationById(conversationId: string): Promise<void> {
  if (!conversationId) return;

  // 1. Local update
  const currentLocal = getLocalConversations();
  const updatedLocal = currentLocal.map((c) =>
    c.id === conversationId ? { ...c, archived: true } : c
  );
  saveLocalConversations(updatedLocal);

  // 2. Firestore update
  if (db && !conversationId.startsWith('conv-')) {
    try {
      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        archived: true,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore archive error:', e);
    }
  }
}

/**
 * Delete a conversation and its messages
 */
export async function deleteConversationById(conversationId: string): Promise<void> {
  if (!conversationId) return;

  // 1. Delete locally
  const currentLocal = getLocalConversations();
  const updatedLocal = currentLocal.filter((c) => c.id !== conversationId);
  saveLocalConversations(updatedLocal);

  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${LOCAL_STORAGE_MSGS_PREFIX}${conversationId}`);
  }

  // 2. Delete from Firestore if applicable
  if (db && !conversationId.startsWith('conv-')) {
    try {
      const convRef = doc(db, 'conversations', conversationId);
      await deleteDoc(convRef);
    } catch (e) {
      console.warn('Firestore delete error:', e);
    }
  }
}

/**
 * Toggle pin state for a conversation
 */
export async function togglePinConversation(conversationId: string): Promise<boolean> {
  if (!conversationId) return false;

  const currentLocal = getLocalConversations();
  let nextPinned = false;
  const updatedLocal = currentLocal.map((c) => {
    if (c.id === conversationId) {
      nextPinned = !c.pinned;
      return { ...c, pinned: nextPinned };
    }
    return c;
  });
  saveLocalConversations(updatedLocal);

  if (db && !conversationId.startsWith('conv-')) {
    try {
      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        pinned: nextPinned,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore pin error:', e);
    }
  }

  return nextPinned;
}

/**
 * Toggle unread state for a conversation
 */
export async function toggleUnreadConversation(conversationId: string): Promise<boolean> {
  if (!conversationId) return false;

  const currentLocal = getLocalConversations();
  let nextUnread = false;
  const updatedLocal = currentLocal.map((c) => {
    if (c.id === conversationId) {
      nextUnread = !c.unread;
      return { ...c, unread: nextUnread };
    }
    return c;
  });
  saveLocalConversations(updatedLocal);

  if (db && !conversationId.startsWith('conv-')) {
    try {
      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        unread: nextUnread,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore unread error:', e);
    }
  }

  return nextUnread;
}

/**
 * Duplicate a conversation and its messages
 */
export async function duplicateConversationById(conversationId: string): Promise<string | null> {
  if (!conversationId) return null;

  const currentLocal = getLocalConversations();
  const source = currentLocal.find((c) => c.id === conversationId);
  if (!source) return null;

  const newId = `conv-${Date.now()}`;
  const nowFormatted = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const duplicatedConv: Conversation = {
    ...source,
    id: newId,
    title: `${source.title} (Copy)`,
    createdAt: nowFormatted,
    updatedAt: nowFormatted,
    pinned: false,
    unread: false,
  };

  // Copy messages
  const originalMsgs = getLocalMessages(conversationId);
  const clonedMsgs = originalMsgs.map((m, idx) => ({
    ...m,
    id: `msg-dup-${Date.now()}-${idx}`,
    conversationId: newId,
  }));

  saveLocalMessages(newId, clonedMsgs);
  saveLocalConversations([duplicatedConv, ...currentLocal]);

  return newId;
}

/**
 * Subscribe to conversation updates (combines localStorage listener & Firestore)
 */
export function subscribeToAllConversations(
  userId: string | null,
  onUpdate: (conversations: Conversation[]) => void
): () => void {
  // Sync initial state
  const notify = () => {
    const local = getLocalConversations().filter((c) => !c.archived);
    onUpdate(local);
  };

  notify();

  // Listen for local storage updates
  const handleLocalUpdate = () => {
    notify();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('nexorbit_conversations_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);
  }

  // If user logged in and Firestore db active, set up live listener
  let unsubscribeFs: (() => void) | null = null;
  if (userId && db) {
    try {
      const colRef = collection(db, 'conversations');
      const q = query(
        colRef,
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc'),
        limit(50)
      );

      unsubscribeFs = onSnapshot(
        q,
        (snapshot) => {
          const fsConvs: Conversation[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (!data.archived) {
              fsConvs.push({
                id: docSnapshot.id,
                userId: data.userId,
                type: data.type || 'chat',
                title: data.title || 'Untitled Conversation',
                createdAt: data.createdAt
                  ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Just now',
                updatedAt: data.updatedAt
                  ? new Date(data.updatedAt.seconds * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Just now',
                archived: data.archived || false,
                mode: data.mode || 'Auto',
                pinned: data.pinned || false,
                unread: data.unread || false,
              });
            }
          });

          // Merge Firestore conversations with local ones, preferring Firestore doc entries
          if (fsConvs.length > 0) {
            const currentLocal = getLocalConversations();
            const unpushedLocal = currentLocal.filter((c) => c.id.startsWith('conv-'));
            const merged = [...unpushedLocal, ...fsConvs];
            saveLocalConversations(merged);
            onUpdate(merged.filter((c) => !c.archived));
          }
        },
        (err) => {
          console.warn('Firestore conversations subscription error:', err);
        }
      );
    } catch (err) {
      console.warn('Failed to set up Firestore listener:', err);
    }
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('nexorbit_conversations_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    }
    if (unsubscribeFs) {
      unsubscribeFs();
    }
  };
}

/**
 * Subscribe to messages for a specific conversation ID
 */
export function subscribeToConversationMessages(
  conversationId: string,
  userId: string | null,
  onUpdate: (messages: ChatMessage[]) => void
): () => void {
  if (!conversationId) {
    onUpdate([]);
    return () => {};
  }

  // Load from local storage
  const notify = () => {
    const localMsgs = getLocalMessages(conversationId);
    onUpdate(localMsgs);
  };

  notify();

  const handleLocalUpdate = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.conversationId === conversationId) {
      notify();
    } else if (!customEvent.detail) {
      // General storage change or fallback
      notify();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('nexorbit_messages_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);
  }

  let unsubscribeFs: (() => void) | null = null;

  if (userId && db && !conversationId.startsWith('conv-')) {
    try {
      const colRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(colRef, orderBy('timestamp', 'asc'), limit(100));

      unsubscribeFs = onSnapshot(
        q,
        (snapshot) => {
          const fsMsgs: ChatMessage[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            fsMsgs.push({
              id: docSnapshot.id,
              conversationId,
              sender: data.sender || 'user',
              text: data.text || '',
              timestamp: data.timestamp
                ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sourcesUsed: data.sourcesUsed || undefined,
              attachments: data.attachments || undefined,
              imageUrl: data.imageUrl || undefined,
            });
          });

          if (fsMsgs.length > 0) {
            saveLocalMessages(conversationId, fsMsgs);
            onUpdate(fsMsgs);
          }
        },
        (err) => {
          console.warn(`Firestore messages subscription error for ${conversationId}:`, err);
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to Firestore messages:', e);
    }
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('nexorbit_messages_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    }
    if (unsubscribeFs) {
      unsubscribeFs();
    }
  };
}
