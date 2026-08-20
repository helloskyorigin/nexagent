import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import appletConfig from '../firebase-applet-config.json';

export const isFirebaseConfigured = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || appletConfig?.apiKey;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || appletConfig?.projectId;
  return (
    !!apiKey &&
    apiKey !== 'demo-api-key' &&
    !!projectId &&
    projectId !== 'nexorbit-demo'
  );
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || appletConfig?.apiKey || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || appletConfig?.authDomain || 'nexorbit-demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || appletConfig?.projectId || 'nexorbit-demo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || appletConfig?.storageBucket || 'nexorbit-demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || appletConfig?.messagingSenderId || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || appletConfig?.appId || '1:1234567890:web:1234567890',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// In-Memory store fallback for server operations during Phase 0 & 1 local execution
class InMemoryStore {
  private collections: Map<string, Map<string, Record<string, unknown>>> = new Map();

  getCollection(name: string): Map<string, Record<string, unknown>> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }
    return this.collections.get(name)!;
  }

  getDoc(collectionName: string, id: string): Record<string, unknown> | null {
    const col = this.getCollection(collectionName);
    return col.get(id) || null;
  }

  setDoc(collectionName: string, id: string, data: Record<string, unknown>): void {
    const col = this.getCollection(collectionName);
    col.set(id, { ...data, updatedAt: new Date().toISOString() });
  }

  updateDoc(collectionName: string, id: string, updates: Record<string, unknown>): void {
    const col = this.getCollection(collectionName);
    const existing = col.get(id) || {};
    col.set(id, { ...existing, ...updates, updatedAt: new Date().toISOString() });
  }

  deleteDoc(collectionName: string, id: string): boolean {
    const col = this.getCollection(collectionName);
    return col.delete(id);
  }

  queryCollection(
    collectionName: string,
    field: string,
    value: unknown
  ): Array<Record<string, unknown>> {
    const col = this.getCollection(collectionName);
    const results: Array<Record<string, unknown>> = [];
    for (const item of col.values()) {
      if (item[field] === value) {
        results.push(item);
      }
    }
    return results;
  }
}

export const inMemoryStore = new InMemoryStore();
