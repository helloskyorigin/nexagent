import {
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { handleFirestoreError, FirestoreOperation } from './userProfile';

export interface Activity {
  id?: string;
  userId: string;
  title: string;
  description: string;
  actionType: 'task_created' | 'task_completed' | 'connector_connected' | 'connector_disconnected' | 'query_composer' | 'other';
  source?: string; // e.g. 'gmail', 'github', 'drive', 'calendar', or 'system'
  timestamp?: any;
}

/**
 * Logs a new activity to Firestore.
 */
export async function logActivity(userId: string, activityData: Omit<Activity, 'userId' | 'timestamp'>): Promise<string> {
  const path = 'activities';
  try {
    const colRef = collection(db, 'activities');
    const docRef = await addDoc(colRef, {
      ...activityData,
      userId,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
    throw error;
  }
}

/**
 * Fetches recent activity for a user, limited to prevent unbounded reads.
 */
export async function getActivities(userId: string, maxLimit: number = 10): Promise<Activity[]> {
  const path = 'activities';
  try {
    const colRef = collection(db, 'activities');
    const q = query(
      colRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(maxLimit)
    );
    const snapshot = await getDocs(q);
    const activities: Activity[] = [];
    snapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data(),
      } as Activity);
    });
    return activities;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.GET, path);
    throw error;
  }
}

/**
 * Subscribes to recent user activities in real-time.
 */
export function subscribeToActivities(userId: string, onUpdate: (activities: Activity[]) => void, onError?: (err: any) => void, maxLimit: number = 10): () => void {
  const path = 'activities';
  const colRef = collection(db, 'activities');
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(maxLimit)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const activities: Activity[] = [];
      snapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data(),
        } as Activity);
      });
      onUpdate(activities);
    },
    (error) => {
      handleFirestoreError(error, FirestoreOperation.GET, path);
      if (onError) onError(error);
    }
  );
}
