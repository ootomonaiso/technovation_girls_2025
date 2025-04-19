import React, { useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
} from "@mui/material";

const CreateTopic = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!category.trim() || !title.trim()) {
      setError("すべてのフィールドを入力してください。");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "topics"), {
        title,
        category,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
      });
      navigate(`/topics/${docRef.id}`);
    } catch (error) {
      console.error("トピック作成エラー:", error);
      setError("作成に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          トピック作成
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="カテゴリ"
            fullWidth
            margin="normal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="例: アニメ, プログラミング, ゲーム"
            required
          />

          <TextField
            label="トピック名"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 2025春アニメ語ろうぜ"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            作成する
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateTopic;
