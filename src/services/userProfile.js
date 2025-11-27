import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getUserProfile(uid) {
  if (!db) return null;
  const d = doc(db, "users", uid);
  const snap = await getDoc(d);
  return snap.exists() ? snap.data() : null;
}

export async function setUserProfile(uid, data) {
  if (!db) return null;
  const d = doc(db, "users", uid);
  await setDoc(d, data, { merge: true });
  return true;
}

export default { getUserProfile, setUserProfile };
