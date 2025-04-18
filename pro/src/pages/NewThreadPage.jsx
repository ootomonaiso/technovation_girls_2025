import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Container, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const NewThreadPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // ユーザーデータが取得できたか確認
  useEffect(() => {
    if (userData?.userName) {
      setLoading(false); // ローディング解除
    }
  }, [userData]);

  const handleCreateThread = async () => {
    if (!title || !userData?.userName) return;

    try {
      const threadsRef = collection(db, `books/${bookId}/threads`);
      await addDoc(threadsRef, {
        title: title,
        createdBy: userData.userName, // Firestoreのユーザー名を使用
        createdAt: serverTimestamp(),
      });
      navigate(`/books/${bookId}/threads`);
    } catch (error) {
      console.error("スレッド作成エラー:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            新しいスレッドを作成
          </Typography>
          <TextField
            label="スレッドタイトル"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateThread}
            disabled={!userData?.userName}
          >
            作成
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default NewThreadPage;
