import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button
} from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Layout from "../components/Layout";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const UserReadingHistoryPage = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState("");
  const [history, setHistory] = useState([]);
  const [bookshelf, setBookshelf] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);

      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        setUserName(userSnapshot.data().userName || "Unknown User");
      } else {
        setUserName("ユーザー不明");
        return;
      }

      const userBooksQuery = collection(db, "users", userId, "userBooks");
      const userBooksSnapshot = await getDocs(userBooksQuery);
      const bookshelfData = await Promise.all(
        userBooksSnapshot.docs.map(async (userBookDoc) => {
          const bookData = userBookDoc.data();
          const bookId = bookData.bookId;
          const bookDocRef = doc(db, "books", bookId);
          const bookSnapshot = await getDoc(bookDocRef);
          const bookTitle = bookSnapshot.exists()
            ? bookSnapshot.data().title
            : "タイトル不明";
          return { ...bookData, title: bookTitle, bookId };
        })
      );
      setBookshelf(bookshelfData);

      const historyData = await Promise.all(
        userBooksSnapshot.docs.flatMap(async (userBookDoc) => {
          const bookId = userBookDoc.id;
          const statusHistoryQuery = collection(
            db,
            "users",
            userId,
            "userBooks",
            bookId,
            "statusHistory"
          );
          const statusHistorySnapshot = await getDocs(statusHistoryQuery);
          return statusHistorySnapshot.docs.map((doc) => ({
            bookId,
            bookTitle: bookshelfData.find((b) => b.bookId === bookId)?.title || "タイトル不明",
            ...doc.data(),
            changedAt: doc.data().changedAt.toDate(),
          }));
        })
      );

      setHistory(historyData.flat().sort((a, b) => b.changedAt - a.changedAt));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchRecommendations = async () => {
    if (bookshelf.length === 0) {
      alert("蔵書がありません。");
      return;
    }

    try {
      setRecommendationLoading(true);

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const bookTitles = bookshelf.map((book) => book.title).join(", ");
      const prompt = `以下の本に基づいて、おすすめの本を提案してください: ${bookTitles}`;

      const result = await model.generateContent(prompt);

      console.log("Gemini APIレスポンス (フォーマット済):", JSON.stringify(result, null, 2));

      if (result.response?.candidates?.length > 0) {
        const content = result.response.candidates[0]?.content?.parts[0]?.text || "";
        const sections = content.split("\n\n").filter((section) => section.trim() !== "");

        const formattedRecommendations = sections.map((section) => {
          const [title, ...details] = section.split("\n");
          return { title: title.trim(), details: details.join("\n").trim() };
        });

        setRecommendedBooks(formattedRecommendations);
      } else {
        console.error("Unexpected response structure:", JSON.stringify(result, null, 2));
        alert("APIレスポンスの形式が不正です。");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("おすすめ本の取得中にエラーが発生しました。");
    } finally {
      setRecommendationLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  const customRenderers = {
    p: ({ children }) => <div>{children}</div>,
    ul: ({ children }) => <ul style={{ marginLeft: "20px" }}>{children}</ul>,
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
          {userName ? `${userName}さんの読書履歴` : "読み込み中..."}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Box sx={{ my: 4 }}>
              <Typography variant="h5" gutterBottom>
                読書履歴
              </Typography>
              <Grid container spacing={3}>
                {history.map((entry, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          component={Link}
                          to={`/books/${entry.bookId}/threads`}
                          sx={{
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {entry.bookTitle || "タイトル不明"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>ステータス:</strong> {entry.status || "不明"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>変更日:</strong> {entry.changedAt.toLocaleString("ja-JP")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ my: 4 }}>
              <Typography variant="h5" gutterBottom>
                蔵書一覧
              </Typography>
              <Grid container spacing={3}>
                {bookshelf.map((book, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          component={Link}
                          to={`/books/${book.bookId}/threads`}
                          sx={{
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {book.title || "タイトル不明"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ my: 4, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchRecommendations}
                disabled={recommendationLoading}
                sx={{
                  padding: "10px 20px",
                  borderRadius: "50px",
                  transition: "background-color 0.3s, transform 0.3s",
                  "&:hover": {
                    backgroundColor: "#004d40",
                    transform: "scale(1.05)",
                  },
                }}
              >
                {recommendationLoading ? "おすすめを取得中..." : "おすすめ本を取得"}
              </Button>

              {recommendedBooks.length > 0 && (
                <Box sx={{ my: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    おすすめ本
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          borderRadius: "10px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          padding: "16px",
                        }}
                      >
                        {recommendedBooks.map((rec, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                              {rec.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              <ReactMarkdown remarkPlugins={[remarkGfm]} components={customRenderers}>
                                {rec.details}
                              </ReactMarkdown>
                            </Typography>
                          </Box>
                        ))}
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default UserReadingHistoryPage;
