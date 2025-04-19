import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { Box, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header
      style={{
        padding: "12px 16px",
        background: "#1976d2",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      {/* 左ナビ（スマホなら簡略化） */}
      <Box display="flex" alignItems="center" gap={2}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          {isMobile ? "🏠" : "ホーム"}
        </Link>
        {user && !isMobile && (
          <Link to="/create" style={{ color: "#fff", textDecoration: "none" }}>
            トピック作成
          </Link>
        )}
      </Box>

      {/* 中央タイトル */}
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
        ここにタイトルを挿入
      </div>

      {/* 右側（設定・ログアウト） */}
      <Box display="flex" alignItems="center" gap={1}>
        {user && (
          <Tooltip title="設定">
            <IconButton component={Link} to="/setting" sx={{ color: "#fff" }}>
              <SettingsIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        )}
        {user && !isMobile && (
          <button
            onClick={handleLogout}
            style={{
              background: "white",
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
            <IconButton onClick={handleLogout} sx={{ color: "#fff" }}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </header>
  );
};

export default Header;
