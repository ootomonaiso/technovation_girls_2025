import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ← 追加

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // ← 変更！
  const location = useLocation();

  if (loading) return null; // またはローディングUI

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
