// 公式ドキュメント読みながら書いたけど合ってるかしらねえ
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

// メール認証リンクを送信
export const sendVerificationEmail = async (email) => {
  const auth = getAuth();
  const actionCodeSettings = {
    // ユーザーがリンクをクリックした後のリダイレクト
    url: "/",
    handleCodeInApp: true,
  };
  try {
    // メールリンクを送信
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    return true;
  } catch (error) {
    throw new Error("メール送信エラー: " + error.message);
  }
};

// メールリンクの有効性を確認して認証
export const verifyEmailCode = async (email, url) => {
  const auth = getAuth();
  try {
    if (isSignInWithEmailLink(auth, url)) {
      const emailToVerify = email || window.localStorage.getItem("emailForSignIn");
      if (!emailToVerify) throw new Error("メールアドレスが見つかりません");
      await signInWithEmailLink(auth, emailToVerify, url);
      window.localStorage.removeItem("emailForSignIn");
      return true;
    } else {
      throw new Error("無効な認証リンクです");
    }
  } catch (error) {
    throw new Error("認証エラー: " + error.message);
  }
};
