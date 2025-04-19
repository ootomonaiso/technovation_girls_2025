import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";

const ChatRoom = () => {
  const { topicId } = useParams();
  const [topicTitle, setTopicTitle] = useState("読み込み中...");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  // トピックタイトルの取得
  useEffect(() => {
    const fetchTopicTitle = async () => {
      const topicRef = doc(db, "topics", topicId);
      const snapshot = await getDoc(topicRef);
      if (snapshot.exists()) {
        setTopicTitle(snapshot.data().title || "無題のルーム");
      } else {
        setTopicTitle("不明なルーム");
      }
    };

    fetchTopicTitle();
  }, [topicId]);

  // メッセージ取得
  useEffect(() => {
    const q = query(
      collection(db, "topics", topicId, "messages"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [topicId]);

  // スクロール追従
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "topics", topicId, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      senderId: auth.currentUser?.uid,
      senderName: auth.currentUser?.displayName || "匿名",
      senderAvatar: auth.currentUser?.photoURL || "",
    });

    setNewMessage("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {topicTitle}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          height: 400,
          overflowY: "auto",
          mb: 2,
          bgcolor: "#f9f9f9",
          borderRadius: 2,
        }}
      >
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection:
                  msg.senderId === auth.currentUser?.uid ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 1,
                mb: 1,
              }}
            >
              {/* アバター */}
              <Avatar
                src={msg.senderAvatar || ""}
                alt={msg.senderName || "匿名"}
                sx={{ width: 32, height: 32 }}
              />

              {/* 吹き出し＋名前 */}
              <Box>
                <ListItemText
                  primary={msg.text}
                  sx={{
                    bgcolor:
                      msg.senderId === auth.currentUser?.uid ? "#1976d2" : "#e0e0e0",
                    color:
                      msg.senderId === auth.currentUser?.uid ? "#fff" : "#000",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "90vw", // ← 横幅制限を拡張
                    wordBreak: "break-word", // ← 長文折り返し対応
                  }}
                />
                <Typography variant="caption" sx={{ color: "#333", ml: 1 }}>
                  {msg.senderName || "匿名"}
                </Typography>
              </Box>
            </ListItem>
          ))}
          <div ref={bottomRef} />
        </List>
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="メッセージを入力"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          送信
        </Button>
      </Box>
    </Container>
  );
};

export default ChatRoom;
