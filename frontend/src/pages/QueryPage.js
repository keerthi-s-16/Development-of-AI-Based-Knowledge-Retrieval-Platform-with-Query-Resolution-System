import { useState } from "react";
import axios from "axios";

function QueryPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const askAI = async () => {
    const newMsg = { type: "user", text: query };
    setMessages([...messages, newMsg]);

    const res = await axios.post("http://localhost:8000/query/", {
      query: query,
    });

    const aiMsg = { type: "ai", text: res.data.answer };

    setMessages((prev) => [...prev, aiMsg]);
    setQuery("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🤖 AI Assistant</h2>

      <div style={{ height: "400px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.type === "user" ? "right" : "left",
              margin: "10px",
            }}
          >
            <span
              style={{
                background: msg.type === "user" ? "#4f46e5" : "#e5e7eb",
                color: msg.type === "user" ? "white" : "black",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "70%", padding: "10px" }}
      />

      <button onClick={askAI}>Send</button>
    </div>
  );
}

export default QueryPage;