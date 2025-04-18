import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Bookmark as BookmarkIcon,
  MenuBook as MenuBookIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import Layout from "../components/Layout";

const HomePage = () => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Container>
          <Grid container spacing={3}>
            {/* ユーザー情報 */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${
                    theme.palette.primary.light || theme.palette.primary.main
                  } 90%)`,
                  color: "white",
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {user ? `ようこそ、${user.email}さん` : "ログインしてください"}
                  </Typography>
                  {user && (
                    <Button
                      component={Link}
                      to="/user-settings"
                      startIcon={<SettingsIcon />}
                      sx={{ color: "white", mt: 1 }}
                    >
                      プロフィール設定
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* 本棚へのリンク */}
            <Grid item xs={12}>
              <Card
                elevation={3}
                sx={{
                  position: "relative",
                  overflow: "visible",
                  backgroundColor: theme.palette.background.paper,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease-in-out",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MenuBookIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.secondary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="h4" component="h2" fontWeight="bold">
                      あなたの本棚へ行く
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.1rem", color: theme.palette.text.primary }}
                  >
                    あなたの蔵書を一覧表示し、編集や追加ができます。やったね！
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    component={Link}
                    to="/bookshelf"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<BookmarkIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: "bold",
                    }}
                  >
                    本棚へ移動
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* 図書館リンクの下に読書履歴ページへのリンクを追加 */}
            <Grid item xs={12}>
              <Card
                elevation={3}
                sx={{
                  position: "relative",
                  overflow: "visible",
                  backgroundColor: theme.palette.background.paper,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease-in-out",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MenuBookIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.secondary.main,
                        mr: 2,
                      }}
                    />
                    <Typography variant="h4" component="h2" fontWeight="bold">
                      あなたの図書館へ行く
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.1rem", color: theme.palette.text.primary }}
                  >
                    あなたの読書履歴を一覧表示し、過去の読書を振り返ることができます。
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    component={Link}
                    to={user ? `/user/${user.uid}/reading-history` : "#"}
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<BookmarkIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: "bold",
                    }}
                    disabled={!user}
                  >
                    読書履歴を見る
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;
