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
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { handleFirestoreError, FirestoreOperation } from './userProfile';

export interface RelatedSourceContext {
  sourceId: string;
  sourceName: string;
  title: string;
  snippet?: string;
  timestamp?: string;
}

export interface ChangeFeedItem {
  id?: string;
  userId: string;
  title: string;
  contextSubtitle: string;
  sourceId: string;
  sourceName: string;
  timeSection: 'Today' | 'Yesterday' | 'Earlier';
  timestamp: string;
  importance: 'important' | 'relevant' | 'informational';
  category: 'all' | 'messages' | 'calendar' | 'files';
  isRead: boolean;
  iconType: 'mail' | 'calendar' | 'doc' | 'task' | 'mention' | 'code';
  priorityBadge?: string;
  personName?: string;
  personAvatar?: string;
  whatChanged: string;
  whyItMatters: string;
  relatedContext?: RelatedSourceContext[];
  createdAt?: any;
}

/**
 * Creates a new change signal in the notifications collection.
 */
export async function addChangeSignal(
  userId: string,
  changeData: Omit<ChangeFeedItem, 'userId' | 'createdAt'>
): Promise<string> {
  const path = 'notifications';
  try {
    const colRef = collection(db, 'notifications');
    const docRef = await addDoc(colRef, {
      ...changeData,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
    throw error;
  }
}

/**
 * Subscribes to the user's change notifications.
 */
export function subscribeToChanges(
  userId: string,
  onUpdate: (items: ChangeFeedItem[]) => void,
  onError?: (err: any) => void,
  maxLimit: number = 30
): () => void {
  const path = 'notifications';
  const colRef = collection(db, 'notifications');
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(maxLimit)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: ChangeFeedItem[] = [];
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        } as ChangeFeedItem);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, FirestoreOperation.GET, path);
      if (onError) onError(error);
    }
  );
}

/**
 * Dismisses/deletes a single change notification.
 */
export async function dismissChange(changeId: string): Promise<void> {
  const path = `notifications/${changeId}`;
  try {
    const docRef = doc(db, 'notifications', changeId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.DELETE, path);
    throw error;
  }
}

/**
 * Updates read state of a single change signal.
 */
export async function updateChangeReadState(
  changeId: string,
  isRead: boolean
): Promise<void> {
  const path = `notifications/${changeId}`;
  try {
    const docRef = doc(db, 'notifications', changeId);
    await updateDoc(docRef, { isRead });
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.UPDATE, path);
    throw error;
  }
}

/**
 * Marks all unread change signals as read.
 */
export async function markAllChangesAsRead(userId: string): Promise<void> {
  const path = 'notifications';
  try {
    const colRef = collection(db, 'notifications');
    const q = query(
      colRef,
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.UPDATE, path);
    throw error;
  }
}
