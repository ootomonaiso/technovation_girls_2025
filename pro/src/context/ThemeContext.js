import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useAuth } from "./AuthContext";

// テーマリストの定義
const themeList = {
  white: {
    name: "ホワイトテーマ",
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#ff4081" },
      background: { default: "#ffffff", paper: "#f5f5f5" },
      text: { primary: "#000000" },
    },
  },
  dark: {
    name: "ダークテーマ",
    palette: {
      mode: "dark",
      primary: { main: "#90caf9" },
      secondary: { main: "#f48fb1" },
      background: { default: "#303030", paper: "#424242" },
      text: { primary: "#ffffff" },
    },
  },
  custom: {
    name: "カスタムテーマ",
    palette: {
      mode: "light",
      primary: { main: "#4caf50" },
      secondary: { main: "#ff9800" },
      background: { default: "#ffffff", paper: "#f5f5f5" },
      text: { primary: "#000000" },
    },
  },
};

// コンテキストの作成
const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

const ThemeContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [themeId, setThemeId] = useState("white");
  const [customTheme, setCustomTheme] = useState(themeList.custom.palette);

  useEffect(() => {
    const fetchUserTheme = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const settings = userDocSnap.data().settings || {};
          console.log("Firestoreから取得したテーマ設定:", settings);
          setThemeId(settings.theme || "white");
          if (settings.customTheme) setCustomTheme(settings.customTheme);
        }
      } catch (error) {
        console.error("Firestoreからテーマを取得できませんでした:", error);
      }
    };

    fetchUserTheme();
  }, [user]);

  const saveCustomTheme = async (newCustomTheme) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        "settings.customTheme": newCustomTheme,
      });
      setCustomTheme(newCustomTheme);
      console.log("カスタムテーマをFirestoreに保存しました:", newCustomTheme);
    } catch (error) {
      console.error("カスタムテーマを保存できませんでした:", error);
    }
  };

  const theme = React.useMemo(() => {
    console.log("現在のテーマID:", themeId);

    let selectedTheme;

    if (themeId === "custom") {
      selectedTheme = {
        ...themeList.custom.palette,
        primary: { main: customTheme.primary.main },
        secondary: { main: customTheme.secondary.main },
      };
    } else {
      selectedTheme = themeList[themeId]?.palette || themeList.white.palette;
    }

    console.log("生成前のテーマオブジェクト:", selectedTheme);

    return createTheme({
      palette: {
        ...selectedTheme,
        mode: themeId === "dark" ? "dark" : selectedTheme.mode || "light",
      },
    });
  }, [themeId, customTheme]);

  return (
    <ThemeContext.Provider
      value={{ themeId, setThemeId, saveCustomTheme, customTheme, themeList }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
