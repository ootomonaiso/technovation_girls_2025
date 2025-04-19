import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { createUserDocument } from "../services/userService";

import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";

const SetupUser = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!name.trim()) {
      setError("名前を入力してください");
      return;
    }

    try {
      await createUserDocument(auth.currentUser.uid, name, auth.currentUser.email);
      navigate("/");
    } catch (e) {
      setError("保存に失敗しました: " + e.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          ニックネームを設定してください
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="ニックネーム"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
          保存して始める
        </Button>
      </Paper>
    </Container>
  );
};

export default SetupUser;
