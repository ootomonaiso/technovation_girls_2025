import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FontSizeProvider } from "./context/FontSizeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FontSizeProvider>
    <App />
  </FontSizeProvider>
);
