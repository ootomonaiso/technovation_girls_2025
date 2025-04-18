import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  LibraryBooks as BookshelfIcon,
  Search as SearchIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
  History as HistoryIcon, // 新しいアイコンのインポート
} from "@mui/icons-material";

const Layout = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {!isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ReadNext
          </Typography>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        // スマホ用
        <>
          <Box
            component="main"
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              px: 2,
              mt: 8, // ヘッダーの高さ分
              pb: 11, // フッターの高さ分
            }}
          >
            {children || <Typography>どうやってここまで?</Typography>}
          </Box>
          <BottomNavigation
            showLabels
            sx={{ position: "fixed", bottom: 0, width: "100%" }}
          >
            <BottomNavigationAction
              label="ホーム"
              icon={<HomeIcon />}
              component={Link}
              to="/"
            />
            <BottomNavigationAction
              label="本棚"
              icon={<BookshelfIcon />}
              component={Link}
              to="/bookshelf"
            />
            <BottomNavigationAction
              label="検索"
              icon={<SearchIcon />}
              component={Link}
              to="/book-search"
            />
            <BottomNavigationAction
              label="読書履歴"
              icon={<HistoryIcon />}
              component={Link}
              to={`/user/${user?.uid}/reading-history`}
            />
            {user && (
              <BottomNavigationAction
                label="ログアウト"
                icon={<ExitToAppIcon />}
                onClick={handleLogout}
              />
            )}
          </BottomNavigation>
        </>
      ) : (
        // PC版 サイドバー宣言もここにあるよ
        <Box sx={{ display: "flex" }}>
          <Drawer
            variant="persistent"
            open={drawerOpen}
            anchor="left"
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerOpen ? 240 : 0,
                boxSizing: "border-box",
                marginTop: "64px", // ヘッダーの高さ分
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "calc(100vh - 64px)", // ヘッダーの高さを引いた高さにしないと食い込むぞ
                overflow: "hidden",
              },
            }}
          >
            <List>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="ホーム" />
              </ListItemButton>
              <ListItemButton component={Link} to="/bookshelf">
                <ListItemIcon>
                  <BookshelfIcon />
                </ListItemIcon>
                <ListItemText primary="本棚" />
              </ListItemButton>
              <ListItemButton component={Link} to="/book-search">
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="検索" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to={`/user/${user?.uid}/reading-history`}
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="読書履歴" />
              </ListItemButton>
            </List>
            {user && (
              <Box sx={{ mt: "auto", px: 2, pb: 2 }}>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="ログアウト" />
                </ListItemButton>
              </Box>
            )}
          </Drawer>

          <Box
            component="main"
            sx={{
              flex: 1,
              p: 3,
              marginLeft: drawerOpen ? "240px" : "0",
              marginTop: "64px",
              transition: "margin-left 0.3s",
            }}
          >
            {children || <Typography>PC版: コンテンツがありません。</Typography>}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
