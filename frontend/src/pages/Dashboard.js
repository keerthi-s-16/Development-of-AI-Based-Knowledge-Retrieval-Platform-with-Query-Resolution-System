import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="app-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="main-content">

        {/* Top Header */}
        <header className="top-header">
          <div>
            <p className="small-heading">AI-POWERED KNOWLEDGE PLATFORM</p>

            <h1>
              Welcome back, <span>Keerthi</span> 👋
            </h1>

            <p className="header-description">
              Search, analyze and interact with your knowledge using AI.
            </p>
          </div>

          <div className="profile-circle">
            K
          </div>
        </header>

        {/* Hero */}
        <section className="hero-section">

          <div className="hero-content">
            <span className="hero-badge">
              ✨ INTELLIGENT QUERY SYSTEM
            </span>

            <h2>
              Your Knowledge.
              <br />
              <span>Powered by AI.</span>
            </h2>

            <p>
              Upload your documents, ask questions and get
              intelligent answers from your knowledge base.
            </p>

            <div className="hero-buttons">

              <Link to="/chat" className="primary-btn">
                🤖 Open Assistant
              </Link>

              <Link to="/upload" className="secondary-btn">
                📂 Upload Documents
              </Link>

            </div>
          </div>

          <div className="hero-visual">
            <div className="ai-circle">
              <span>⚡</span>
            </div>

            <div className="floating-card card-one">
              📄 Documents
              <strong>Ready</strong>
            </div>

            <div className="floating-card card-two">
              🧠 AI Engine
              <strong>Active</strong>
            </div>

            <div className="floating-card card-three">
              💬 Queries
              <strong>Smart</strong>
            </div>
          </div>

        </section>

        {/* About */}
        <section className="section-block">

          <div className="section-heading">
            <div>
              <p className="small-heading">ABOUT THE PLATFORM</p>
              <h2>Everything you need in one workspace</h2>
            </div>
          </div>

          <div className="feature-grid">

            <div className="feature-card">
              <div className="feature-icon blue">📂</div>
              <h3>Knowledge Base</h3>
              <p>
                Upload PDF documents and build your own
                searchable knowledge base.
              </p>

              <Link to="/upload">
                Manage Documents →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">🤖</div>
              <h3>Knowledge Assistant</h3>
              <p>
                Ask natural language questions and receive
                AI-powered answers from your documents.
              </p>

              <Link to="/chat">
                Start Chat →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">📊</div>
              <h3>Query Analytics</h3>
              <p>
                Monitor queries and understand how your
                intelligent assistant is performing.
              </p>

              <Link to="/analytics">
                View Analytics →
              </Link>
            </div>

          </div>

        </section>

        {/* Quick Workspace */}
        <section className="workspace-section">

          <div>
            <p className="small-heading">QUICK ACCESS</p>

            <h2>Open your workspace</h2>

            <p>
              Continue working with your documents and AI assistant.
            </p>
          </div>

          <div className="workspace-buttons">

            <Link to="/upload" className="workspace-btn">
              <span>📁</span>
              <div>
                <strong>Knowledge Base</strong>
                <small>Upload & manage files</small>
              </div>
              <b>→</b>
            </Link>

            <Link to="/chat" className="workspace-btn">
              <span>💬</span>
              <div>
                <strong>AI Assistant</strong>
                <small>Ask your questions</small>
              </div>
              <b>→</b>
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}