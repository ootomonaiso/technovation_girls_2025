import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ユーザードキュメントがあるか確認
export const userDocExists = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists();
};

// 新規ユーザーを作成
export const createUserDocument = async (uid, name, email) => {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    uid,
    name,
    email,
    createdAt: new Date(),
  });
};
