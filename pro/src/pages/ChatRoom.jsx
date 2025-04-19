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
  setDoc,
  deleteDoc,
  getDocs,
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
  IconButton,
  Badge,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const ChatRoom = () => {
  const { topicId } = useParams();
  const [topicTitle, setTopicTitle] = useState("読み込み中...");
  const [messages, setMessages] = useState([]);
  const [likesMap, setLikesMap] = useState({});
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

  // メッセージ取得 & いいね数取得
  useEffect(() => {
    const q = query(
      collection(db, "topics", topicId, "messages"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);

      const newLikesMap = {};
      for (const msg of msgs) {
        const likesSnapshot = await getDocs(
          collection(db, "topics", topicId, "messages", msg.id, "likes")
        );
        newLikesMap[msg.id] = likesSnapshot.size;
      }
      setLikesMap(newLikesMap);
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

  const handleLikeToggle = async (msgId) => {
    const likeRef = doc(db, "topics", topicId, "messages", msgId, "likes", auth.currentUser.uid);
    const currentLike = await getDoc(likeRef);

    if (currentLike.exists()) {
      await deleteDoc(likeRef); // いいね解除
    } else {
      await setDoc(likeRef, {}); // いいね追加
    }
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

              {/* 吹き出し＋名前＋いいね */}
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
                    maxWidth: "90vw",
                    wordBreak: "break-word",
                  }}
                />
                <Box display="flex" alignItems="center" gap={1} ml={1} mt={0.5}>
                  <Typography variant="caption" sx={{ color: "#333" }}>
                    {msg.senderName || "匿名"}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleLikeToggle(msg.id)}
                  >
                    <Badge badgeContent={likesMap[msg.id] || 0} color="primary">
                      <ThumbUpIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </Box>
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
