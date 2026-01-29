import React, { useState } from "react";
import Message from "./Message";

const BACKEND_URL = "https://chatbot-backend-2-2gcq.onrender.com/api/chat";

export default function ChatWindow({
  dark,
  setDark,
  history,
  setHistory,
  sidebarOpen,
  setSidebarOpen
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 📨 SEND MESSAGE
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      user: input,
      bot: "",
      editing: false
    };

    setHistory(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    })
      .then(res => {
        if (!res.ok) throw new Error("Backend error");
        return res.json();
      })
      .then(data => {
        setHistory(prev =>
          prev.map((item, i) =>
            i === prev.length - 1
              ? { ...item, bot: data.reply }
              : item
          )
        );
        setLoading(false);
      })
      .catch(err => {
        console.error("Chat error:", err);
        setHistory(prev =>
          prev.map((item, i) =>
            i === prev.length - 1
              ? {
                  ...item,
                  bot: "⚠️ Prakruti AI is not responding right now. Please try again."
                }
              : item
          )
        );
        setLoading(false);
      });
  };

  // ✏️ START EDIT
  const startEdit = (index) => {
    setHistory(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, editing: true } : item
      )
    );
  };

  // 💾 SAVE EDIT + REQUERY AI
  const saveEdit = (index, value) => {
    setHistory(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, user: value, editing: false, bot: "" }
          : item
      )
    );

    setLoading(true);

    fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: value })
    })
      .then(res => res.json())
      .then(data => {
        setHistory(prev =>
          prev.map((item, i) =>
            i === index ? { ...item, bot: data.reply } : item
          )
        );
        setLoading(false);
      })
      .catch(() => {
        setHistory(prev =>
          prev.map((item, i) =>
            i === index
              ? { ...item, bot: "⚠️ Unable to regenerate reply." }
              : item
          )
        );
        setLoading(false);
      });
  };

  return (
    <div className="chat-window">

      {/* 🔝 TOP BAR */}
      <div className="top-bar">
        {!sidebarOpen && (
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
        )}

        <button className="theme-btn" onClick={() => setDark(!dark)}>
          🌙 / ☀️
        </button>
      </div>

      {/* 💬 MESSAGES */}
      <div className="messages">
        {history.map((h, i) => (
          <div key={i} className="chat-row">

            {/* USER MESSAGE */}
            <div className="msg-right">
              <Message
                msg={h.user}
                sender="user"
                isEditing={h.editing}
                onSave={(val) => saveEdit(i, val)}
              />

              {!h.editing && (
                <span className="edit-icon" onClick={() => startEdit(i)}>
                  ✏️
                </span>
              )}
            </div>

            {/* BOT MESSAGE */}
            {h.bot && (
              <div className="msg-left">
                <Message msg={h.bot} sender="bot" />
              </div>
            )}
          </div>
        ))}

        {loading && <div className="loader">Prakruti is typing...</div>}
      </div>

      {/* ⌨️ INPUT */}
      <div className="input-box">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
