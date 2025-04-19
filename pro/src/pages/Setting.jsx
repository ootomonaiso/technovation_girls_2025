import React from "react";
import { useFontSize } from "../context/FontSizeContext";
import { Container, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const Setting = () => {
  const { fontSizeKey, setFontSizeKey } = useFontSize();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        表示設定
      </Typography>

      <FormControl fullWidth>
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

      <Typography sx={{ mt: 4 }}>
        プレビュー：これは現在の文字サイズです。
      </Typography>
    </Container>
  );
};

export default Setting;
