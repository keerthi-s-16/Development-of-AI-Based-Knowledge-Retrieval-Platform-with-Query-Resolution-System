import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const sendMessage = async (text = msg) => {
    if (!text.trim() || loading) return;

    const userMessage = text;

    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/query/",
        {
          query: userMessage,
        },
        {
          withCredentials: true,
        }
      );

      const answer = res.data.answer;

      setChat((prev) => [
        ...prev,
        {
          user: userMessage,
          ai: answer,
        },
      ]);

      speak(answer);
    } catch (error) {
      console.error("Query error:", error);

      setChat((prev) => [
        ...prev,
        {
          user: userMessage,
          ai:
            error.response?.data?.detail ||
            "Failed to get response from AI.",
        },
      ]);
    }

    setLoading(false);
  };

  const startVoiceChat = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

      setMsg(text);
      sendMessage(text);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const resetChat = () => {
    setChat([]);
    setMsg("");
    window.speechSynthesis?.cancel();
  };

  return (
    <main className="knowledge-page">

      <section className="page-banner assistant-banner">
        <div>
          <h1>Knowledge Assistant</h1>

          <p>
            Ask questions about your uploaded documents
            using text or voice.
          </p>
        </div>
      </section>

      <section className="interaction-card">

        <p className="interaction-title">
          INTERACTION MODE
        </p>

        <div className="mode-switch">

          <button className="mode-active">
            💬 Text Chat
          </button>

          <button
            className="mode-button"
            onClick={startVoiceChat}
            disabled={listening || loading}
          >
            {listening
              ? "🎙 Listening..."
              : "🎙 Voice Agent"}
          </button>

        </div>

      </section>

      <button
        className="reset-chat-btn"
        onClick={resetChat}
      >
        Reset chat
      </button>

      <section className="chat-container">

        {chat.length === 0 && (
          <div className="welcome-message">

            <div className="ai-avatar">
              🤖
            </div>

            <div>
              <strong>AI Assistant</strong>

              <p>
                Ask a question about your uploaded documents.
              </p>
            </div>

          </div>
        )}

        {chat.map((item, index) => (
          <div
            className="conversation"
            key={index}
          >

            <div className="user-message">

              <div className="message-avatar">
                👤
              </div>

              <div>
                <span>You</span>
                <p>{item.user}</p>
              </div>

            </div>

            <div className="ai-message">

              <div className="message-avatar">
                🤖
              </div>

              <div>
                <span>Knowledge Assistant</span>

                <p>{item.ai}</p>

                <button
                  onClick={() => speak(item.ai)}
                  className="speak-button"
                >
                  🔊
                </button>
              </div>

            </div>

          </div>
        ))}

        {loading && (
          <div className="ai-message">

            <div className="message-avatar">
              🤖
            </div>

            <div>
              <span>Knowledge Assistant</span>
              <p>Thinking...</p>
            </div>

          </div>
        )}

      </section>

      <section className="chat-input-area">

        <input
          value={msg}
          onChange={(e) =>
            setMsg(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask a question about your documents"
        />

        <button
          onClick={() => sendMessage()}
          disabled={loading || !msg.trim()}
        >
          ↑
        </button>

        <button
          onClick={startVoiceChat}
          disabled={listening || loading}
          title="Voice Chat"
        >
          🎙
        </button>

      </section>

    </main>
  );
}
