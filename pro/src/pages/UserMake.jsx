import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createUserDocument } from "../services/userService";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Googleアカウントでログインしたユーザーにサービスアカウントを作成するページ
const UserMake = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null); 
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleServiceAccountCreation = async () => {
    // ユーザーIDとユーザーネームが空でないかを確認
    if (!userId.trim() || !userName.trim()) {
      setError("ユーザーIDとユーザーネーム書いてないよ"); 
      return;
    }

    try {
      const settings = { theme: "light", notifications: true };
      await createUserDocument(user.uid, userId, userName, settings);
      alert("サービスアカウントが作成されました！");
      navigate("/");
    } catch (error) {
      console.error("Service Account Creation Error:", error.message);
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
          サービスアカウント作成
        </Typography>
        {error && <Typography color="error">{error}</Typography>} {/* エラーメッセージの表示 */}
        <TextField
          label="User ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <TextField
          label="User Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleServiceAccountCreation}
        >
          作成する
        </Button>
      </Box>
    </Container>
  );
};

export default UserMake;
