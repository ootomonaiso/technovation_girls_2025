import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useFontSize } from "./context/FontSizeContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import CreateTopic from "./pages/CreateTopic";
import SetupUser from "./pages/SetupUser";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Setting from "./pages/Setting"; // ← 追加

const App = () => {
  const { fontSize } = useFontSize(); // ← フォントサイズ取得

  const theme = createTheme({
    typography: {
      fontSize: fontSize, // ← ここに反映
    },
  });

  return (
    <ThemeProvider theme={theme}>
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
  );
};

export default App;
