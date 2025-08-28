import { auth, db } from '../lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Prefs } from '../store/prefs';

export async function ensureAnonUser(): Promise<string> {
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  await signInAnonymously(auth);
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u?.uid) {
        unsub();
        resolve(u.uid);
      }
    }, reject);
  });
}

export async function saveUserPrefs(uid: string, prefs: Prefs) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { prefs }, { merge: true });
}

export async function getUserPrefs(uid: string): Promise<Prefs | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const data = snap.data() as any;
  return data?.prefs ?? null;
}

export async function addHistory(uid: string, message: string, aiResponse: string) {
  const col = collection(db, 'users', uid, 'history');
  await addDoc(col, { message, aiResponse, ts: serverTimestamp() });
}
