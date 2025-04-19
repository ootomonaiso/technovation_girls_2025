import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const ChatRoom = () => {
  const { topicId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "topics", topicId, "messages"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [topicId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "topics", topicId, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>チャットルーム: {topicId}</h2>
      <div style={{ maxHeight: 300, overflowY: "scroll", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg) => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="メッセージを入力"
        style={{ width: "80%" }}
      />
      <button onClick={handleSendMessage}>送信</button>
    </div>
  );
};

export default ChatRoom;
