import React, { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError("ログインに失敗しました: " + err.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Googleでログイン</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleGoogleLogin}>Googleアカウントでログイン</button>
    </div>
  );
};

export default Login;
