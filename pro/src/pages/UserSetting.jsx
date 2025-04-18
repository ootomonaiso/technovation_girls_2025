import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ChromePicker } from "react-color";
import Layout from "../components/Layout";
import { useThemeContext } from "../context/ThemeContext";

const UserSetting = () => {
  const { userData, refreshUser } = useAuth();
  const { themeId, setThemeId, saveCustomTheme, customTheme, themeList } = useThemeContext();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [primaryColor, setPrimaryColor] = useState(customTheme.primary.main);
  const [secondaryColor, setSecondaryColor] = useState(customTheme.secondary.main);

  useEffect(() => {
    if (userData) {
      setUsername(userData.userName || "");
      const settings = userData.settings || {};
      if (settings.theme) setThemeId(settings.theme);
      if (settings.customTheme) {
        setPrimaryColor(settings.customTheme.primary?.main || "");
        setSecondaryColor(settings.customTheme.secondary?.main || "");
      }
    }
  }, [userData, setThemeId]);

  const handleSaveUsername = async () => {
    if (!auth.currentUser) {
      setMessage("認証されていません。再ログインしてください。");
      return;
    }

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { userName: username });
      await updateProfile(auth.currentUser, { displayName: username });
      await refreshUser();
      setMessage("ユーザーネームの更新に成功しました！");
    } catch (error) {
      setMessage("ユーザーネームの更新に失敗しました。");
      console.error("エラー内容:", error);
    }
  };

  const handleSaveTheme = async () => {
    if (!auth.currentUser) {
      setMessage("認証されていません。再ログインしてください。");
      return;
    }

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const dataToUpdate = { "settings.theme": themeId };

      if (themeId === "custom") {
        dataToUpdate["settings.customTheme"] = {
          primary: { main: primaryColor },
          secondary: { main: secondaryColor },
        };
        saveCustomTheme(dataToUpdate["settings.customTheme"]);
      }

      await updateDoc(userDocRef, dataToUpdate);
      await refreshUser();
      setMessage("テーマの更新に成功しました！");
    } catch (error) {
      setMessage("テーマの更新に失敗しました。");
      console.error("エラー内容:", error);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            ユーザー設定
          </Typography>
          {message && (
            <Alert severity={message.includes("成功") ? "success" : "error"} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          {/* ユーザーネーム変更 */}
          <TextField
            label="ユーザーネーム"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveUsername}
            fullWidth
            sx={{ mt: 2 }}
          >
            ユーザーネームを保存
          </Button>

          {/* テーマ選択 */}
          <Typography variant="h6" sx={{ mt: 4 }}>
            テーマ選択
          </Typography>
          <RadioGroup value={themeId} onChange={(e) => setThemeId(e.target.value)} sx={{ mt: 2 }}>
            {Object.keys(themeList).map((key) => (
              <FormControlLabel key={key} value={key} control={<Radio />} label={themeList[key].name} />
            ))}
          </RadioGroup>

          {themeId === "custom" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">カスタムテーマ設定</Typography>

              {/* カラーピッカー（プライマリカラー） */}
              <Typography variant="body1" sx={{ mt: 2 }}>
                プライマリカラー
              </Typography>
              <Box sx={{ mt: 2, display: "inline-block" }}>
                <ChromePicker
                  color={primaryColor}
                  onChangeComplete={(color) => setPrimaryColor(color.hex)}
                />
              </Box>

              {/* カラーピッカー（セカンダリカラー） */}
              <Typography variant="body1" sx={{ mt: 2 }}>
                セカンダリカラー
              </Typography>
              <Box sx={{ mt: 2, display: "inline-block" }}>
                <ChromePicker
                  color={secondaryColor}
                  onChangeComplete={(color) => setSecondaryColor(color.hex)}
                />
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveTheme}
            fullWidth
            sx={{ mt: 3 }}
          >
            テーマを保存
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default UserSetting;
