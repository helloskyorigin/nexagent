import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { ErrorCode, NexorbitError } from '@/types/errors';
import appletConfig from '../firebase-applet-config.json';

let adminApp: App | null = null;

export function getFirebaseAdminApp(): App {
  if (!adminApp) {
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else {
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || appletConfig?.projectId;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

      if (projectId && clientEmail && privateKey) {
        adminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } else if (projectId) {
        adminApp = initializeApp({ projectId });
      } else {
        throw new Error(
          'Firebase Admin SDK is missing server credentials. Please configure FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.'
        );
      }
    }
  }
  return adminApp;
}

export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}

/**
 * Server-side helper to verify Bearer authorization tokens sent in HTTP request headers.
 */
export async function verifyAuthToken(req: Request) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) return null;

  try {
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Failed to verify Firebase ID token:', error);
    return null;
  }
}

/**
 * Server-side helper to require an authenticated user in protected API endpoints.
 * Throws a NexorbitError with 401 status if authentication fails.
 */
export async function requireAuthenticatedUser(req: Request): Promise<DecodedIdToken> {
  const decodedToken = await verifyAuthToken(req);
  if (!decodedToken) {
    throw new NexorbitError(
      ErrorCode.UNAUTHORIZED,
      'Authentication token is invalid or missing. Please log in.',
      401
    );
  }
  return decodedToken;
}
