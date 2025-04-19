import React, { createContext, useContext, useState, useEffect } from "react";

const FontSizeContext = createContext();

export const useFontSize = () => useContext(FontSizeContext);

const fontSizeMap = {
  small: 12,
  medium: 16,
  large: 20,
};

export const FontSizeProvider = ({ children }) => {
  const [fontSizeKey, setFontSizeKey] = useState("medium");

  useEffect(() => {
    const saved = localStorage.getItem("fontSize");
    if (saved && fontSizeMap[saved]) {
      setFontSizeKey(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSizeKey);
  }, [fontSizeKey]);

  return (
    <FontSizeContext.Provider value={{ fontSizeKey, setFontSizeKey, fontSize: fontSizeMap[fontSizeKey] }}>
      {children}
    </FontSizeContext.Provider>
  );
};
