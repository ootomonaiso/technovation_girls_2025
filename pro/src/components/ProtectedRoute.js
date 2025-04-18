import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ProtectedRoute = ({ children }) => {
  const { user, isEmailVerified } = useAuth(); // AuthContext から isEmailVerified を取得
  const [hasServiceAccount, setHasServiceAccount] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を追加

  useEffect(() => {
    const checkServiceAccount = async () => {
      if (user) {
        try {
          const serviceAccountRef = doc(db, 'users', user.uid); // 'users' コレクションを参照
          const docSnap = await getDoc(serviceAccountRef);

          if (docSnap.exists()) {
            setHasServiceAccount(true);
          } else {
            setHasServiceAccount(false);
          }
        } catch (error) {
          console.error("Firestore のユーザードキュメント取得中にエラーが発生しました:", error);
          setHasServiceAccount(false);
        }
      }
      setLoading(false); // チェック完了後にローディングを終了
    };

    checkServiceAccount();
  }, [user]);

  // ローディング中はローディング表示
  if (loading) {
    return <p>読み込み中...</p>; 
  }

  // ユーザーが認証されていない場合はログインページへ
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // メールアドレスが未検証の場合はメール検証ページへ
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // サービスアカウントが存在しない場合はアカウント作成ページへ
  if (hasServiceAccount === false) {
    return <Navigate to="/usermake" replace />;
  }

  // すべての条件を満たしている場合は子コンポーネントを表示させられるよ
  return children;
};

export default ProtectedRoute;
