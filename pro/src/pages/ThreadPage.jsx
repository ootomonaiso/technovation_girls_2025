import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Container, Typography, List, ListItem, ListItemText, TextField, Button, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ThreadPage = () => {
  const { bookId, threadId } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [quote, setQuote] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState({ commentId: "", commentText: "", reason: "" });
  const [loading, setLoading] = useState(false);

  // Gemini API の初期化
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fetchComments = useCallback(async () => {
    const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
    const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
    const commentSnapshot = await getDocs(commentsQuery);

    const commentList = await Promise.all(
      commentSnapshot.docs.map(async (docSnap) => {
        const commentData = { id: docSnap.id, ...docSnap.data() };

        if (commentData.userId) {
          try {
            const userDocRef = doc(db, "users", commentData.userId);
            const userDoc = await getDoc(userDocRef);
            commentData.userName = userDoc.exists() ? userDoc.data().userName : "不明なユーザー";
          } catch (error) {
            console.error(`Error fetching userName for user ${commentData.userId}:`, error);
            commentData.userName = "取得エラー";
          }
        } else {
          commentData.userName = "未設定";
        }

        if (commentData.createdAt) {
          commentData.createdAtFormatted = commentData.createdAt.toDate().toLocaleString();
        } else {
          commentData.createdAtFormatted = "日時不明";
        }

        return commentData;
      })
    );

    setComments(commentList);
  }, [bookId, threadId]);

  useEffect(() => {
    const fetchThread = async () => {
      const threadRef = doc(db, `books/${bookId}/threads`, threadId);
      const threadDoc = await getDoc(threadRef);

      if (threadDoc.exists()) {
        setThread(threadDoc.data());
      } else {
        console.error("Thread not found");
      }
    };

    fetchThread();
    fetchComments();
  }, [bookId, threadId, fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const userId = user?.uid || null;

    try {
      const commentsRef = collection(db, `books/${bookId}/threads/${threadId}/comments`);
      await addDoc(commentsRef, {
        text: newComment,
        userId: userId,
        createdAt: serverTimestamp(),
        replyTo: replyTo || null,
        quote: quote || null,
      });
      setNewComment("");
      setReplyTo(null);
      setQuote(null);
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleQuote = (comment) => {
    setQuote(comment.text);
    setReplyTo(comment.id);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setQuote(null);
  };

  const scrollToComment = (commentId) => {
    const commentElement = document.getElementById(commentId);
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReportOpen = (commentId, commentText) => {
    setReportData({ commentId, commentText, reason: "" });
    setReportOpen(true);
  };

  const handleReportClose = () => {
    setReportOpen(false);
  };

  const handleReportSubmit = async () => {
    if (!reportData.reason) {
      alert("通報理由を選択してください");
      return;
    }

    setLoading(true);

    try {
      const prompt = `次の文章が公序良俗に反するか判定してください。「不適切」または「問題なし」のいずれかで回答してください。\n\n文章: "${reportData.commentText}"`;
      const result = await model.generateContent(prompt);

      let aiJudgment = "判定エラー";
      if (result.response?.candidates?.length > 0) {
        aiJudgment = result.response.candidates[0]?.content?.parts[0]?.text.trim() || "判定エラー";
      }

      const isInappropriate = aiJudgment.includes("不適切");

      await addDoc(collection(db, "reports"), {
        reportedBy: user.uid,
        bookId,
        threadId,
        commentId: reportData.commentId,
        reason: reportData.reason,
        commentText: reportData.commentText,
        createdAt: serverTimestamp(),
        aiJudgment,
        status: isInappropriate ? "削除済み" : "未対応",
      });

      if (isInappropriate) {
        const commentRef = doc(db, `books/${bookId}/threads/${threadId}/comments/${reportData.commentId}`);
        await deleteDoc(commentRef);
        fetchComments();
        alert("AIが不適切と判断し、コメントを削除しました");
      } else {
        alert("通報が完了しました (問題なし判定)");
      }

    } catch (error) {
      console.error("通報エラー:", error);
      alert("通報の送信に失敗しました");
    } finally {
      setLoading(false);
      handleReportClose();
    }
  };

  if (!thread) {
    return (
      <Layout>
        <Typography variant="h6">Loading...</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">{thread.title}</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            作成日時: {thread.createdAt?.toDate().toLocaleString()}
          </Typography>

          <Typography variant="h6" gutterBottom>コメント</Typography>
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id} alignItems="flex-start" id={comment.id}>
                <ListItemText
                  primary={
                    <>
                      <Typography variant="subtitle2">{comment.userName}</Typography>
                      {comment.quote && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ pl: 2, borderLeft: "2px solid #ccc", mb: 1 }}
                        >
                          {`引用: "${comment.quote}"`}
                        </Typography>
                      )}
                      <Typography variant="body1">{comment.text}</Typography>
                      {comment.replyTo && (
                        <Button
                          size="small"
                          onClick={() => scrollToComment(comment.replyTo)}
                          sx={{ textTransform: "none", padding: 0 }}
                        >
                          返信元を表示
                        </Button>
                      )}
                    </>
                  }
                  secondary={`送信日時: ${comment.createdAtFormatted}`}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" onClick={() => handleQuote(comment)}>引用</Button>
                  <Button size="small" color="secondary" onClick={() => handleReportOpen(comment.id, comment.text)}>
                    通報
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 4 }}>
            {quote && (
              <Typography variant="body2" color="textSecondary" sx={{ pl: 2, borderLeft: "2px solid #ccc", mb: 1 }}>
                {`引用: "${quote}"`}
              </Typography>
            )}
            <TextField
              label="コメントを入力"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddComment}>
              コメントを追加
            </Button>
            {replyTo && (
              <Button variant="text" color="secondary" onClick={handleCancelReply} sx={{ ml: 1 }}>
                返信をキャンセル
              </Button>
            )}
          </Box>
        </Box>
      </Container>

      <Dialog open={reportOpen} onClose={handleReportClose}>
        <DialogTitle>コメントの通報</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>通報するコメント:</Typography>
          <Typography variant="body1" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1, mb: 2 }}>
            {reportData.commentText}
          </Typography>
          <Select
            value={reportData.reason}
            onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
            fullWidth
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>通報理由を選択</MenuItem>
            <MenuItem value="暴力的な発言">暴力的な発言</MenuItem>
            <MenuItem value="差別的な発言">差別的な発言</MenuItem>
            <MenuItem value="スパム">スパム</MenuItem>
            <MenuItem value="その他">その他</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportClose} color="secondary">キャンセル</Button>
          <Button onClick={handleReportSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "通報"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ThreadPage;