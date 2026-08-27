import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { UserProfile, UserRole } from "@/lib/types";

export async function signIn(email: string, password: string) {
  if (!auth) throw new Error("Firebase Auth not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string, displayName: string) {
  if (!auth) throw new Error("Firebase Auth not configured");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(cred.user.uid, {
    id: cred.user.uid,
    displayName,
    email,
    role: "resident",
    createdAt: Date.now(),
  });
  return cred;
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase Auth not configured");
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const existing = await getUserProfile(cred.user.uid);
  if (!existing) {
    await createUserProfile(cred.user.uid, {
      id: cred.user.uid,
      displayName: cred.user.displayName || "User",
      email: cred.user.email || undefined,
      role: "resident",
      createdAt: Date.now(),
    });
  }
  return cred;
}

export async function signOut() {
  if (!auth) return;
  return firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function createUserProfile(uid: string, profile: UserProfile): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "users", uid), profile);
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "users", uid), { role }, { merge: true });
}
