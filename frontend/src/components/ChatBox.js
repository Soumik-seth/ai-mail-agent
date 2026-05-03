import { useState } from "react";
import axios from "axios";
import Message from "./Message";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const send = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/agent/run",
      { query: input },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    setMessages([
      ...messages,
      { role: "You", text: input },
      { role: "AI", text: res.data.result },
    ]);

    setInput("");
  };

  return (
    <div>
      {messages.map((m, i) => <Message key={i} msg={m} />)}

      <input value={input} onChange={(e)=>setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}