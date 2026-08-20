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
import { GoalItem } from '../../components/goals/types';

/**
 * Creates a new Goal in Firestore under 'goals' collection.
 */
export async function createGoal(
  userId: string,
  goalData: Omit<GoalItem, 'id'>
): Promise<string> {
  const path = 'goals';
  try {
    const colRef = collection(db, 'goals');
    const docRef = await addDoc(colRef, {
      ...goalData,
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
 * Updates an existing Goal in Firestore.
 */
export async function updateGoalInDb(
  goalId: string,
  updates: Partial<Omit<GoalItem, 'id' | 'userId'>>
): Promise<void> {
  const path = `goals/${goalId}`;
  try {
    const docRef = doc(db, 'goals', goalId);
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
 * Deletes a Goal from Firestore.
 */
export async function deleteGoalFromDb(goalId: string): Promise<void> {
  const path = `goals/${goalId}`;
  try {
    const docRef = doc(db, 'goals', goalId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.DELETE, path);
    throw error;
  }
}

/**
 * Subscribes to user's Goals in real-time.
 */
export function subscribeToGoals(
  userId: string,
  onUpdate: (goals: GoalItem[]) => void,
  onError?: (err: any) => void,
  maxLimit: number = 30
): () => void {
  const path = 'goals';
  const colRef = collection(db, 'goals');
  const q = query(
    colRef,
    where('userId', '==', userId),
    limit(maxLimit)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const goals: GoalItem[] = [];
      snapshot.forEach((doc) => {
        goals.push({
          id: doc.id,
          ...doc.data(),
        } as GoalItem);
      });
      onUpdate(goals);
    },
    (error) => {
      handleFirestoreError(error, FirestoreOperation.GET, path);
      if (onError) onError(error);
    }
  );
}
