import "./Header.css";
import SignIcon from "./SignIcon.jsx";

export default function Header({
  theme,
  onToggleTheme,
  modes,
  currentMode,
  onModeChange,
}) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <SignIcon type="brand" size="md" />
          </span>
          <div className="brand-text">
            <h1 className="brand-name">JC-Signs</h1>
            <p className="brand-tag">Real-time ASL practice & translation</p>
          </div>
        </div>

        <nav className="mode-tabs" aria-label="Mode">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mode-tab ${currentMode === m.id ? "is-active" : ""}`}
              onClick={() => onModeChange(m.id)}
              aria-pressed={currentMode === m.id}
            >
              <span className="mode-icon" aria-hidden="true">
                <SignIcon type={m.id} size="sm" />
              </span>
              <span>{m.label}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <SignIcon type={theme === "dark" ? "sun" : "moon"} size="sm" />
        </button>
      </div>
    </header>
  );
}
