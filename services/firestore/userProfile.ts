import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  provider: string;
  country: string;
  language: string;
  onboardingCompleted: boolean;
  createdAt: string | Timestamp | any;
  updatedAt: string | Timestamp | any;
  lastLoginAt: string | Timestamp | any;
  timezone?: string;
  workStyle?: string;
}

export enum FirestoreOperation {
  GET = 'get',
  CREATE = 'create',
  UPDATE = 'update',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: FirestoreOperation;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: FirestoreOperation,
  path: string | null
): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

/**
 * Fetch a user profile document from Firestore (`users/{uid}`)
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.GET, path);
    return null;
  }
}

/**
 * Create a new user profile document in Firestore (`users/{uid}`)
 */
export async function createUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const path = `users/${uid}`;
  const now = serverTimestamp();

  const newProfile: UserProfile = {
    uid,
    displayName: data.displayName || '',
    email: data.email || '',
    photoURL: data.photoURL || null,
    provider: data.provider || 'password',
    country: data.country || '',
    language: data.language || 'en',
    onboardingCompleted: data.onboardingCompleted ?? false,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
    timezone: data.timezone,
    workStyle: data.workStyle,
  };

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
    throw error;
  }
}

/**
 * Update an existing user profile document in Firestore (`users/{uid}`)
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const updateData: Record<string, any> = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    // Ensure sensitive/immutable fields are not overwritten
    delete updateData.uid;
    delete updateData.createdAt;

    await setDoc(userRef, updateData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.UPDATE, path);
    throw error;
  }
}

// Deduplication map for concurrent in-flight profile requests during login
const inFlightProfileRequests = new Map<string, Promise<UserProfile>>();

/**
 * Get or create a user profile document upon login/authentication
 * - If user profile exists: Preserves existing user profile data, repairs onboardingCompleted to true if needed, and updates `lastLoginAt` & `updatedAt`
 * - If user profile does not exist: Automatically creates new user profile with initial defaults and onboardingCompleted: true
 */
export async function getOrCreateUserProfile(authUser: {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  providerData?: Array<{ providerId?: string | null }>;
}): Promise<UserProfile> {
  const uid = authUser.uid;
  const path = `users/${uid}`;

  if (inFlightProfileRequests.has(uid)) {
    console.log('[Auth Lifecycle] Reusing in-flight profile request for UID:', uid);
    return inFlightProfileRequests.get(uid)!;
  }

  const profilePromise = (async (): Promise<UserProfile> => {
    let attempts = 0;
    const maxAttempts = 3;

    // Detect browser language / locale if available
    let detectedLang = 'en';
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.startsWith('hi')) {
        detectedLang = 'hi';
      }
    }

    // Detect timezone safely without requesting location
    let detectedTimezone = 'Asia/Kolkata';
    try {
      if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
      }
    } catch (e) {}

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[Auth Lifecycle] [Attempt ${attempts}/${maxAttempts}] Fetching Firestore profile for UID:`, uid);
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const existingData = snapshot.data() as UserProfile;
          console.log('[Auth Lifecycle] Existing user profile found for UID:', uid, '| onboardingCompleted:', existingData.onboardingCompleted);

          // Non-blocking metadata updates (last login, provider updates, ensuring onboardingCompleted: true)
          const metadataUpdates: Record<string, any> = {
            lastLoginAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            onboardingCompleted: true, // Automatically ensure completed
          };

          if (!existingData.displayName && authUser.displayName) {
            metadataUpdates.displayName = authUser.displayName;
          }
          if (!existingData.photoURL && authUser.photoURL) {
            metadataUpdates.photoURL = authUser.photoURL;
          }

          // Merge updates into existing document without deleting existing custom settings
          await setDoc(userRef, metadataUpdates, { merge: true });

          const derivedName =
            existingData.displayName ||
            authUser.displayName ||
            (authUser.email ? authUser.email.split('@')[0] : 'User');

          return {
            ...existingData,
            displayName: derivedName,
            photoURL: existingData.photoURL || authUser.photoURL || null,
            onboardingCompleted: true,
          };
        } else {
          // First-time login: automatically create new user profile document in Firestore
          console.log('[Auth Lifecycle] Creating automatic user profile document in Firestore for UID:', uid);
          const provider = authUser.providerData?.[0]?.providerId || 'password';
          const derivedDisplayName =
            authUser.displayName ||
            (authUser.email ? authUser.email.split('@')[0] : 'User');

          const initialProfile: UserProfile = {
            uid,
            displayName: derivedDisplayName,
            email: authUser.email || '',
            photoURL: authUser.photoURL || null,
            provider,
            country: '',
            language: detectedLang,
            onboardingCompleted: true, // Automatically completed - no manual wizard
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            timezone: detectedTimezone,
            workStyle: 'General Productivity',
          };

          await setDoc(userRef, initialProfile, { merge: true });
          console.log('[Auth Lifecycle] Successfully created initial profile document in Firestore for UID:', uid);

          const nowIso = new Date().toISOString();
          return {
            ...initialProfile,
            createdAt: nowIso,
            updatedAt: nowIso,
            lastLoginAt: nowIso,
          };
        }
      } catch (error: any) {
        console.error(`[Auth Lifecycle] [Attempt ${attempts}/${maxAttempts}] Firestore operation error for UID: ${uid}:`, error);
        handleFirestoreError(error, FirestoreOperation.WRITE, path);

        if (attempts < maxAttempts) {
          console.log(`[Auth Lifecycle] Retrying profile fetch/creation in 500ms...`);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    // Safe in-memory fallback if all Firestore attempts fail
    console.warn('[Auth Lifecycle] All Firestore attempts exhausted. Using safe in-memory initial profile for UID:', uid);
    const provider = authUser.providerData?.[0]?.providerId || 'password';
    const derivedDisplayName =
      authUser.displayName ||
      (authUser.email ? authUser.email.split('@')[0] : 'User');
    const nowIso = new Date().toISOString();
    return {
      uid,
      displayName: derivedDisplayName,
      email: authUser.email || '',
      photoURL: authUser.photoURL || null,
      provider,
      country: '',
      language: detectedLang,
      onboardingCompleted: true,
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: nowIso,
      timezone: detectedTimezone,
      workStyle: 'General Productivity',
    };
  })().finally(() => {
    inFlightProfileRequests.delete(uid);
  });

  inFlightProfileRequests.set(uid, profilePromise);
  return profilePromise;
}
