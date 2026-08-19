import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { to: "/dashboard", icon: "🏠", label: "Home" },
    { to: "/upload", icon: "📂", label: "Knowledge Base" },
    { to: "/chat", icon: "🤖", label: "Knowledge Assistant" },
    { to: "/analytics", icon: "📊", label: "Query Analytics" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <div>
          <h2>AI Query</h2>
          <p>Intelligent System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-title">MAIN MENU</p>

        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link ${
              location.pathname === item.to ? "active" : ""
            }`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="status-box">
          <span className="status-dot"></span>
          <div>
            <strong>System Online</strong>
            <small>AI services active</small>
          </div>
        </div>

        <p className="version">AI Query System v1.0</p>
      </div>
    </aside>
  );
}