import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { sendVerificationEmail } from "../services/authService";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    try {
      await sendVerificationEmail(user);
      alert("確認メールを再送信しました。メールを確認してください。");
    } catch (error) {
      alert("メールの再送信に失敗しました: " + error.message);
    }
  };

  const handleCheckVerification = async () => {
    await refreshUser();
    if (auth.currentUser.emailVerified) {
      alert("メールが確認されました。ホームページにリダイレクトします。");
      navigate("/"); // ホームページにリダイレクト
    } else {
      alert("メールがまだ確認されていません。");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login"); // ログインページにリダイレクト
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          メールアドレスの確認
        </Typography>
        <Typography variant="body1" gutterBottom>
          登録されたメールアドレスに確認メールを送信しました。メール内のリンクをクリックしてメールアドレスを確認してください。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleResendEmail}
          sx={{ mt: 2 }}
        >
          確認メールを再送信
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCheckVerification}
          sx={{ mt: 2, ml: 2 }}
        >
          検証状態を確認
        </Button>
        <Button
          variant="text"
          color="error"
          onClick={handleLogout}
          sx={{ mt: 2, ml: 2 }}
        >
          ログアウト
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
