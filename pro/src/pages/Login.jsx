import React, { useState } from "react";
import { loginWithEmail, loginWithGoogle, sendVerificationEmail } from "../services/authService";
import { verifyEmailCode } from "../services/emailVerificationService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // 電子メールでログイン
  const handleEmailLogin = async () => {
    setError(null);
    try {
      const userCredential = await loginWithEmail(email, password);
      setUser(userCredential.user);

      // 二段階認証のための確認メールを送信
      await sendVerificationEmail(email);
      setRequires2FA(true);
      setSuccess("確認メールを送信しました。認証コードを入力してください。");
    } catch (error) {
      setError("ログインに失敗しました: " + error.message);
    }
  };

  // 認証コードを検証
  const handleVerifyCode = async () => {
    setError(null);
    try {
      const result = await verifyEmailCode(email, verificationCode);
      if (result) {
        setSuccess("ログイン成功");
        navigate("/"); // ログイン成功後にホームへリダイレクト
      } else {
        setError("認証コードが正しくありません。");
      }
    } catch (error) {
      setError("コードの検証に失敗しました: " + error.message);
    }
  };

  // Googleログイン
  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const userCredential = await loginWithGoogle();
      setUser(userCredential.user);
      navigate("/"); // Googleログイン成功後にホームへリダイレクト
    } catch (error) {
      setError("Googleログインに失敗しました: " + error.message);
    }
  };

  // 新規登録ページへの遷移
  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          ログイン
        </Typography>
        {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: "100%", mb: 2 }}>{success}</Alert>}

        {!requires2FA ? (
          <>
            <TextField
              label="Eメール"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="パスワード"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              onClick={handleEmailLogin}
            >
              電子メールでログイン
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{ mb: 2 }}
            >
              Googleでログイン
            </Button>
            <Button
              variant="text"
              color="primary"
              fullWidth
              onClick={navigateToRegister}
            >
              新規アカウント登録
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="認証コード"
              variant="outlined"
              fullWidth
              margin="normal"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleVerifyCode}
            >
              認証コードを検証
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Login;
