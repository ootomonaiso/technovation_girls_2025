import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

import {
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
} from "@mui/material";

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      const querySnapshot = await getDocs(collection(db, "topics"));
      const topicList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTopics(topicList);
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((topic) => {
    const term = searchTerm.toLowerCase();
    return (
      topic.title.toLowerCase().includes(term) ||
      topic.category?.toLowerCase().includes(term)
    );
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        トピック一覧
      </Typography>

      <TextField
        fullWidth
        placeholder="タイトルやカテゴリで検索"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Grid container spacing={3}>
        {filteredTopics.map((topic) => (
          <Grid item xs={12} sm={6} md={4} key={topic.id}>
            <Card
              component={Link}
              to={`/topics/${topic.id}`}
              sx={{
                textDecoration: "none",
                color: "inherit",
                height: "100%",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {topic.title}
                </Typography>
                {topic.category && (
                  <Box mt={1}>
                    <Chip label={topic.category} size="small" color="primary" />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
