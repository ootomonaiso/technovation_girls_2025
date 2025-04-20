import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext"; // ← 追加

import Home from "./pages/Home";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import CreateTopic from "./pages/CreateTopic";
import SetupUser from "./pages/SetupUser";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Setting from "./pages/Setting";

const App = () => {
  return (
    <AuthProvider> {/* ← これで初回のauth.currentUser取得を管理 */}
      <ThemeProvider>
        <CssBaseline />
        <Router basename="/technovation_girls_2025">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateTopic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <SetupUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topics/:topicId"
              element={
                <ProtectedRoute>
                  <ChatRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setting"
              element={
                <ProtectedRoute>
                  <Setting />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
