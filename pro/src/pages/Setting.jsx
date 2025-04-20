import React from "react";
import { useFontSize } from "../context/FontSizeContext";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Setting = () => {
  const { fontSizeKey, setFontSizeKey } = useFontSize();
  const { accessibility, setAccessibility } = useContext(ThemeContext);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        表示設定
      </Typography>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="fontsize-label">文字サイズ</InputLabel>
        <Select
          labelId="fontsize-label"
          value={fontSizeKey}
          label="文字サイズ"
          onChange={(e) => setFontSizeKey(e.target.value)}
        >
          <MenuItem value="small">小</MenuItem>
          <MenuItem value="medium">中（デフォルト）</MenuItem>
          <MenuItem value="large">大</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 4 }}>
        <InputLabel id="accessibility-label">アクセシビリティ</InputLabel>
        <Select
          labelId="accessibility-label"
          value={accessibility}
          label="アクセシビリティ"
          onChange={(e) => setAccessibility(e.target.value)}
        >
          <MenuItem value="default">通常</MenuItem>
          <MenuItem value="high-contrast">みやすさ</MenuItem>
        </Select>
      </FormControl>

      <Typography sx={{ mt: 4 }}>
        プレビュー：これは現在の文字サイズと配色です。
      </Typography>
    </Container>
  );
};

export default Setting;
