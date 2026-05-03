import React, { useState } from "react";
import axios from "axios";
import "./auth.css";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // 📎 NEW

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input;
    setInput("");

    const userMsg = { role: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      // 📦 USE FORMDATA (IMPORTANT)
      const formData = new FormData();
      formData.append("query", userInput);

      if (file) {
        formData.append("resume", file);
      }

      const res = await axios.post(
        "http://localhost:5000/api/agent/run",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const botMsg = { role: "bot", text: res.data.result };

      setMessages((prev) => [...prev, botMsg]);

      setFile(null); // ✅ clear file after send

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Error connecting to server" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">

      {/* ===== HEADER ===== */}
      <div className="app-header">
        🤖 AI Mail Sender
      </div>

      {/* ===== CHAT AREA ===== */}
      <div className="chat-box-container">

        {/* ===== MESSAGES ===== */}
        <div className="messages-display">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <b>AI:</b> typing...
            </div>
          )}
        </div>

        {/* ===== INPUT AREA ===== */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">

            {/* 📎 FILE INPUT */}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ color: "white", fontSize: "12px" }}
            />

            {/* TEXT INPUT */}
            <input
              type="text"
              className="chat-field"
              placeholder="Ask AI to send email..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              autoFocus
            />

            {/* SEND BUTTON */}
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path
                  fill="currentColor"
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                />
              </svg>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}