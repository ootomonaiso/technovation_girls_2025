// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { Box } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header
      style={{
        padding: "12px 24px",
        background: "#1976d2",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* 左リンク */}
      <Box display="flex" gap={2}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          ホーム
        </Link>
        {user && (
          <Link to="/create" style={{ color: "#fff", textDecoration: "none" }}>
            トピック作成
          </Link>
        )}
      </Box>

      {/* 中央タイトル */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: 20, fontWeight: "bold" }}>
        ここにタイトルを挿入
      </div>

      {/* 右：ログアウト */}
      {user ? (
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
      ) : (
        <div />
      )}
    </header>
  );
};

export default Header;
