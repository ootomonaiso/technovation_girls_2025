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
} from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";

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
      <Typography variant="h4" fontWeight="bold" gutterBottom>
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

      <Grid container spacing={3} justifyContent="center">
        {filteredTopics.map((topic) => (
          <Grid item key={topic.id}>
            <Card
              component={Link}
              to={`/topics/${topic.id}`}
              elevation={3}
              sx={{
                width: 300,
                textDecoration: "none",
                color: "inherit",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {topic.title}
                </Typography>

                {topic.category && (
                  <Chip
                    icon={<LabelIcon />}
                    label={topic.category}
                    size="small"
                    color="primary"
                    sx={{ mt: 1 }}
                  />
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
