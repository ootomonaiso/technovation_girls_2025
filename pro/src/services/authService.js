import { auth, googleProvider } from "../firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendEmailVerification 
} from "firebase/auth";

// 新規登録（メールとパスワード）
export const signUpWithEmail = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// ログイン（メールとパスワード）
export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Googleログイン
export const loginWithGoogle = async () => {
  googleProvider.setCustomParameters({
    prompt: "select_account", 
  });
  return await signInWithPopup(auth, googleProvider);
};


// ログアウト
export const logout = async () => {
  return await signOut(auth);
};

// メール認証用
export const sendVerificationEmail = async (user) => {
  if (!user) throw new Error("ユーザー情報が見つかりません。");
  await sendEmailVerification(user); 
};
