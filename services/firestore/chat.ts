import {
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { handleFirestoreError, FirestoreOperation } from './userProfile';

export interface ChatMessage {
  id?: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: any;
  modeUsed?: string;
  userId: string;
}

export interface ChatConversation {
  id?: string;
  title: string;
  updatedAt?: any;
  mode: string;
  userId: string;
}

/**
 * Creates a new conversation for a user.
 */
export async function createConversation(
  userId: string,
  title: string,
  mode: string
): Promise<string> {
  const path = 'conversations';
  try {
    const colRef = collection(db, 'conversations');
    const docRef = await addDoc(colRef, {
      userId,
      title,
      mode,
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
    throw error;
  }
}

/**
 * Adds a message to a conversation.
 */
export async function addMessage(
  conversationId: string,
  userId: string,
  message: Omit<ChatMessage, 'userId'>
): Promise<string> {
  const path = `conversations/${conversationId}/messages`;
  try {
    const colRef = collection(db, 'conversations', conversationId, 'messages');
    const docRef = await addDoc(colRef, {
      ...message,
      userId,
      timestamp: serverTimestamp(),
    });

    // Also update conversation updatedAt timestamp
    const convRef = doc(db, 'conversations', conversationId);
    await updateDoc(convRef, {
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
    throw error;
  }
}

/**
 * Subscribes to a user's conversations.
 */
export function subscribeToConversations(
  userId: string,
  onUpdate: (conversations: ChatConversation[]) => void,
  onError?: (err: any) => void,
  maxLimit: number = 20
): () => void {
  const path = 'conversations';
  const colRef = collection(db, 'conversations');
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(maxLimit)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const conversations: ChatConversation[] = [];
      snapshot.forEach((doc) => {
        conversations.push({
          id: doc.id,
          ...doc.data(),
        } as ChatConversation);
      });
      onUpdate(conversations);
    },
    (error) => {
      handleFirestoreError(error, FirestoreOperation.GET, path);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribes to messages of a conversation.
 */
export function subscribeToMessages(
  conversationId: string,
  onUpdate: (messages: ChatMessage[]) => void,
  onError?: (err: any) => void,
  maxLimit: number = 50
): () => void {
  const path = `conversations/${conversationId}/messages`;
  const colRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(colRef, orderBy('timestamp', 'asc'), limit(maxLimit));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as ChatMessage);
      });
      onUpdate(messages);
    },
    (error) => {
      handleFirestoreError(error, FirestoreOperation.GET, path);
      if (onError) onError(error);
    }
  );
}
