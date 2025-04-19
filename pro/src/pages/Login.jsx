import React, { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { userDocExists } from "../services/userService";

import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const exists = await userDocExists(result.user.uid);
      navigate(exists ? "/" : "/setup");
    } catch (err) {
      setError("ログインに失敗しました: " + err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Googleでログイン
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            size="large"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Googleアカウントでログイン
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
