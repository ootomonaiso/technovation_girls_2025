import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button, Container, Typography, Box, Alert } from "@mui/material";
import Layout from "../components/Layout";

const PasswordReset = () => { // コンポーネント名を修正
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendResetEmail = async () => {
    setMessage("");
    setError("");

    const user = auth.currentUser;

    if (!user || !user.email) {
      setError("ログインしているユーザー情報が取得できませんでした。再ログインしてください。");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage(
        `パスワードリセットメールを登録済みのメールアドレス (${user.email}) に送信しました。メールを確認してください。`
      );
    } catch (err) {
      setError("メール送信に失敗しました。サポートにお問い合わせください。");
      console.error("パスワードリセットメール送信エラー:", err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            パスワードリセットメール送信
          </Typography>
          <Typography variant="body1" gutterBottom>
            登録済みのメールアドレスにリセットメールを送信します。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendResetEmail}
            fullWidth
            sx={{ mt: 2 }}
          >
            リセットメールを送信
          </Button>
          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default PasswordReset;
