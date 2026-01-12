import React from "react";
import "./TopBar.css";

export default function TopBar({ title, userEmail, onLogout }) {
  const username = userEmail ? userEmail.email.split("@")[0] : "User";

  return (
    <header className="topbar">
      <div className="topbar-container">
        <h1 className="topbar-title">{title}</h1>
        <div className="topbar-actions">
          <span className="topbar-username">Welcome, {username}</span>
          <button className="topbar-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
