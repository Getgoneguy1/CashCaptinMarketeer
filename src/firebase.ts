import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with the provisioned named database
export const firestoreDatabaseId = (firebaseConfig as any).firestoreDatabaseId || '(default)';
export const db = getFirestore(app, firestoreDatabaseId);

// Test connection on boot per Firebase skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline status check:', error.message);
    }
  }
}
testConnection();

/**
 * Ensures the user has an active authenticated session.
 * Automatically falls back to anonymous authentication so users immediately have an isolated UID.
 */
export async function ensureAuthUser(): Promise<User> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          unsubscribe();
          resolve(cred.user);
        } catch (err) {
          console.warn('Anonymous auth initialization warning:', err);
          // Return simulated guest user object with stable local UID if offline
          const fallbackUid = localStorage.getItem('cashcaptin_local_uid') || `user_${Date.now()}`;
          localStorage.setItem('cashcaptin_local_uid', fallbackUid);
          unsubscribe();
          resolve({ uid: fallbackUid, email: 'guest@cashcaptain.local' } as unknown as User);
        }
      }
    });
  });
}
