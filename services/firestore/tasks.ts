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
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { handleFirestoreError, FirestoreOperation } from './userProfile';

export interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt?: any;
  updatedAt?: any;
  connectorId?: string;
}

/**
 * Creates a new task in Firestore.
 */
export async function createTask(userId: string, taskData: Omit<Task, 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = 'tasks';
  try {
    const colRef = collection(db, 'tasks');
    const docRef = await addDoc(colRef, {
      ...taskData,
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
 * Fetches recent tasks for a user, limited to prevent unbounded reads.
 */
export async function getTasks(userId: string, maxLimit: number = 10): Promise<Task[]> {
  const path = 'tasks';
  try {
    const colRef = collection(db, 'tasks');
    const q = query(
      colRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(maxLimit)
    );
    const snapshot = await getDocs(q);
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      } as Task);
    });
    return tasks;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.GET, path);
    throw error;
  }
}

/**
 * Updates a task in Firestore.
 */
export async function updateTask(taskId: string, updates: Partial<Omit<Task, 'userId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const path = `tasks/${taskId}`;
  try {
    const docRef = doc(db, 'tasks', taskId);
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
 * Subscribes to tasks in real-time, limited to recent ones.
 */
export function subscribeToTasks(userId: string, onUpdate: (tasks: Task[]) => void, onError?: (err: any) => void, maxLimit: number = 10): () => void {
  const path = 'tasks';
  const colRef = collection(db, 'tasks');
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(maxLimit)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = [];
      snapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data(),
        } as Task);
      });
      onUpdate(tasks);
    },
    (error) => {
      handleFirestoreError(error, FirestoreOperation.GET, path);
      if (onError) onError(error);
    }
  );
}
