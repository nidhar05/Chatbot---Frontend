import React, { useState } from "react";
import Message from "./Message";

export default function ChatWindow({ dark, setDark, history, setHistory, sidebarOpen, setSidebarOpen }) {

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = () => {
        if (!input.trim()) return;

        // const userMsg = { user: input, bot: "" };
        const userMsg = { user: input, bot: "", editing: false };
        setHistory(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);



        fetch("http://10.10.168.91:8080/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input })
        })
            .then(res => res.json())
            .then(data => {
                setHistory(prev =>
                    prev.map((item, i) =>
                        i === prev.length - 1 ? { ...item, bot: data.reply } : item
                    )
                );
                setLoading(false);
            });

    };

    const startEdit = (index) => {
        setHistory(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, editing: true } : item
            )
        );
    };

    const saveEdit = (index, value) => {

        setHistory(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, user: value, editing: false, bot: "" } : item
            )
        );

        setLoading(true);

        fetch("http://10.10.168.91:8080/api/chat", {
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
            });
    };



    return (
        <div className="chat-window">
            <div className="top-bar">
                {!sidebarOpen ? (
                    <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                ) : (
                    <span></span>
                )}

                <button className="theme-btn" onClick={() => setDark(!dark)}>🌙 / ☀️</button>
            </div>


            <div className="messages">
                {history.map((h, i) => (
                    <div key={i} className="chat-row">
                        <div className="msg-right">
                            <Message
                                msg={h.user}
                                sender="user"
                                isEditing={h.editing}
                                onSave={(val, close) => saveEdit(i, val, close)}
                            />

                            <div className="edit-icon" onClick={() => startEdit(i)}>✏️</div>

                        </div>

                        {h.bot && (
                            <div className="msg-left">
                                <Message msg={h.bot} sender="bot" />
                            </div>
                        )}
                    </div>
                ))}

                {loading && <div className="loader">Prakruti is typing...</div>}
            </div>

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
