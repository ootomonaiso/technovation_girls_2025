import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, reload } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase認証ユーザー
  const [userData, setUserData] = useState(null); // Firestoreのデータ
  const [isEmailVerified, setIsEmailVerified] = useState(false); // メール検証状態
  const [loading, setLoading] = useState(true); // ローディング状態

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        console.log("認証状態が変更されました:", currentUser);

        if (currentUser) {
          // Firebase認証データを設定
          setUser(currentUser);
          setIsEmailVerified(currentUser.emailVerified);

          // Firestoreからユーザーデータを取得
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            console.log("Firestoreからのユーザーデータ:", userDoc.data());
            setUserData(userDoc.data());
          } else {
            console.warn("Firestoreに該当するユーザーデータが見つかりません。");
            setUserData({
              displayName: "NotFoundMan",
              email: "unknown@example.com",
              userName: "UnknownUser",
            });
          }
        } else {
          // 未認証ユーザー用のデフォルト値
          console.log("ユーザーは未認証です。デフォルト値を設定します。");
          setUser(null);
          setUserData({
            displayName: "Guest",
            email: "guest@example.com",
            userName: "Guest",
          });
          setIsEmailVerified(false);
        }
      } catch (error) {
        console.error("認証状態変更時のエラー:", error);
        setUser(null);
        setUserData({
          displayName: "ErrorMan",
          email: "error@example.com",
          userName: "ErrorUser",
        });
        setIsEmailVerified(false);
      } finally {
        setLoading(false); // ローディング終了
      }
    });

    return () => unsubscribe();
  }, []);

  // ユーザー情報をリロード
  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        await reload(auth.currentUser);
        setUser(auth.currentUser);
        setIsEmailVerified(auth.currentUser.emailVerified);
        console.log("ユーザー情報がリロードされました:", auth.currentUser);
      } catch (error) {
        console.error("ユーザーリロード中のエラー:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        setUser,
        isEmailVerified,
        refreshUser,
      }}
    >
      {!loading ? children : <p>ユーザーデータをロード中...</p>}
    </AuthContext.Provider>
  );
};
