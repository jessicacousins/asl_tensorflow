import React from "react";
import "./ThemeToggle.css";

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="theme-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  );
};

export default ThemeToggle;
