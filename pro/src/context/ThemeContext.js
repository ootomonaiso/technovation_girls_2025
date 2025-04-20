import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [accessibility, setAccessibility] = useState("default"); // "default" | "high-contrast" | "colorblind"

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
        ...(accessibility === "colorblind" && {
          primary: { main: "#007acc" },
          secondary: { main: "#ff9800" },
        }),
      },
      typography: {
        fontSize: accessibility === "high-contrast" ? 18 : 14,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              border:
                accessibility === "colorblind" ? "2px dashed #1976d2" : undefined,
            },
          },
        },
      },
    });
  }, [mode, accessibility]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, accessibility, setAccessibility }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
