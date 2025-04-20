import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  Box,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const theme = useTheme(); // ← テーマを取得

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header
      style={{
        padding: "12px 16px",
        background: theme.palette.primary.main,         // ← 背景にテーマ色
        color: theme.palette.primary.contrastText,      // ← テキスト色
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Link
          to="/"
          style={{
            color: theme.palette.primary.contrastText,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          {isMobile ? "🏠" : "ホーム"}
        </Link>
        {user && !isMobile && (
          <Link
            to="/create"
            style={{
              color: theme.palette.primary.contrastText,
              textDecoration: "none",
            }}
          >
            トピック作成
          </Link>
        )}
      </Box>

      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: isMobile ? 16 : 20,
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        おきてがみ
      </div>

      <Box display="flex" alignItems="center" gap={1}>
        {user && (
          <Tooltip title="設定">
            <IconButton component={Link} to="/setting" sx={{ color: theme.palette.primary.contrastText }}>
              <SettingsIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        )}
        {user && !isMobile && (
          <button
            onClick={handleLogout}
            style={{
              background: theme.palette.primary.contrastText,
              color: theme.palette.primary.main,
              border: "none",
              borderRadius: 4,
              padding: "6px 12px",
              fontWeight: "bold",
            }}
          >
            ログアウト
          </button>
        )}
        {user && isMobile && (
          <Tooltip title="ログアウト">
            <IconButton onClick={handleLogout} sx={{ color: theme.palette.primary.contrastText }}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </header>
  );
};

export default Header;
