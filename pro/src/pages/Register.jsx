import React, { useState } from "react";
import { signUpWithEmail, sendVerificationEmail, loginWithEmail } from "../services/authService";
import { useNavigate } from "react-router-dom"; // リダイレクト用
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // リダイレクト用

  const handleSignUp = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    // 入力チェック
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("正しいメールアドレスを入力してください。");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上である必要があります。");
      setLoading(false);
      return;
    }

    try {
      // ユーザー登録
      const userCredential = await signUpWithEmail(email, password);
      const user = userCredential.user;
      console.log("新規ユーザー:", user);

      // メール認証を送信
      await sendVerificationEmail(user);

      setSuccess("確認メールを送信しました。メールを確認してください。メールアドレス検証に成功しているとこのサービスで使用するアカウントの作成画面へ遷移します。");

      // メール確認をチェック
      const interval = setInterval(async () => {
        await user.reload(); // Firebase でユーザー情報を更新
        if (user.emailVerified) {
          clearInterval(interval); 
          console.log("メール確認が完了しました。");

          // メール確認後、自動的にログインしトップページにリダイレクト
          await loginWithEmail(email, password); // 再ログイン
          navigate("/"); // トップページへリダイレクト
        }
      }, 3000); // 3秒ごとに確認
    } catch (error) {
      console.error("登録エラー:", error.message);
      setError("登録に失敗しました: " + error.message);
    } finally {
      setLoading(false);
    }
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
          新規アカウント登録
        </Typography>
        {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: "100%", mb: 2 }}>{success}</Alert>}
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
          sx={{ mt: 2 }}
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? "登録中..." : "サインアップ"}
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
