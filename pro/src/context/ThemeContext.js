import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { useFontSize } from "./FontSizeContext";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [accessibility, setAccessibility] = useState("default"); // "default" | "high-contrast"
  const { fontSize } = useFontSize();

  useEffect(() => {
    const saved = localStorage.getItem("accessibility");
    if (saved) setAccessibility(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("accessibility", accessibility);
  }, [accessibility]);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode === "light" ? "light" : "dark",
        ...(accessibility === "high-contrast" && {
          background: {
            default: "#000",
            paper: "#111",
          },
          text: {
            primary: "#fff",
          },
        }),
      },
      typography: {
        fontSize: fontSize,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              border: undefined,
            },
          },
        },
      },
    });
  }, [mode, accessibility, fontSize]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, accessibility, setAccessibility }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};