import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

/**
 * @param {string} uid - Firebase AuthenticationのユーザーUID
 * @param {string} userId - ユーザーID
 * @param {string} userName - ユーザー名
 * @param {object} settings - ユーザーの設定情報
 */
export const createUserDocument = async (uid, userId, userName, settings = {}) => {
  // Firestoreの `users` コレクションにユーザー情報を保存
  await setDoc(doc(db, "users", uid), {
    userId,
    userName,
    settings,
    createdAt: new Date()
  });
};
