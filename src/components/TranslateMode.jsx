import { useEffect, useRef, useState } from "react";
import "./TranslateMode.css";
import { useSpeech } from "../hooks/useSpeech.js";

const SPACE_GAP_MS = 1500; // a pause this long inserts a space between letters

export default function TranslateMode({ committedSign, livePrediction, cameraOn }) {
  const [tokens, setTokens] = useState([]); // ordered list of committed signs
  const [autoSpeak, setAutoSpeak] = useState(false);
  const lastCommitAtRef = useRef(0);
  const { supported: speechSupported, speak, stop, speaking } = useSpeech();

  // Append every newly-committed sign to the script. A long pause between
  // commits is treated as a word boundary so multi-letter words read
  // naturally when spoken.
  useEffect(() => {
    if (!committedSign) return;
    const now = committedSign.at;
    const gap = now - lastCommitAtRef.current;
    lastCommitAtRef.current = now;

    setTokens((prev) => {
      const next = [...prev];
      if (prev.length > 0 && gap > SPACE_GAP_MS) next.push(" ");
      next.push(committedSign.sign);
      return next.slice(-200);
    });
  }, [committedSign]);

  const renderedScript = tokens.length ? formatScript(tokens) : "";

  useEffect(() => {
    if (!autoSpeak || !committedSign) return;
    // Speak the latest token only — speaking the whole script every time
    // would be incoherent.
    speak(committedSign.sign);
  }, [committedSign, autoSpeak, speak]);

  const handleClear = () => {
    setTokens([]);
    lastCommitAtRef.current = 0;
    stop();
  };

  const handleBackspace = () => {
    setTokens((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setTokens((prev) => (prev.length && prev[prev.length - 1] !== " " ? [...prev, " "] : prev));
  };

  const handleCopy = async () => {
    if (!renderedScript) return;
    try {
      await navigator.clipboard.writeText(renderedScript);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  };

  return (
    <div className="panel translate-panel">
      <div className="panel-head">
        <div>
          <h2>Live script</h2>
          <p className="panel-sub">
            What you sign turns into text — share it, copy it, or have it read
            aloud so a hearing colleague can follow along.
          </p>
        </div>
        <div className="now-pill">
          <span className="now-label">Now</span>
          <strong>{livePrediction ? livePrediction.label : cameraOn ? "—" : "Camera off"}</strong>
        </div>
      </div>

      <div className="script-box" aria-live="polite">
        {renderedScript ? (
          <p className="script-text">{renderedScript}</p>
        ) : (
          <p className="script-empty">
            {cameraOn
              ? "Start signing — committed signs will appear here."
              : "Turn on the camera to begin translating."}
          </p>
        )}
      </div>

      <div className="action-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => speak(renderedScript)}
          disabled={!speechSupported || !renderedScript || speaking}
          title={
            speechSupported
              ? "Read the script aloud"
              : "Your browser doesn't support speech synthesis"
          }
        >
          🔊 Speak script
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSpace}
          disabled={!tokens.length}
        >
          Add space
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBackspace}
          disabled={!tokens.length}
        >
          ⌫ Backspace
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleCopy}
          disabled={!renderedScript}
        >
          Copy
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleClear}
          disabled={!tokens.length}
        >
          Clear
        </button>
      </div>

      <label className="auto-speak">
        <input
          type="checkbox"
          checked={autoSpeak}
          onChange={(e) => setAutoSpeak(e.target.checked)}
          disabled={!speechSupported}
        />
        <span>
          Speak each sign as it's committed
          {!speechSupported && " (not supported in this browser)"}
        </span>
      </label>

      <div className="recent-row">
        <span className="recent-label">Recent</span>
        <ul className="recent-list">
          {tokens
            .filter((t) => t !== " ")
            .slice(-12)
            .reverse()
            .map((t, i) => (
              <li key={`${t}-${i}`} className="recent-pill fade-in">
                {t}
              </li>
            ))}
          {!tokens.length && <li className="recent-empty">Nothing yet</li>}
        </ul>
      </div>
    </div>
  );
}

// Letter tokens like "A", "B" should render glued together (fingerspelling),
// while phrase tokens like "Hello" or "I Love You" should sit between spaces
// so the result reads naturally.
function formatScript(tokens) {
  let out = "";
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === " ") {
      if (out && !out.endsWith(" ")) out += " ";
      continue;
    }
    const isPhrase = t.length > 1 && /[a-z]/.test(t);
    if (isPhrase) {
      if (out && !out.endsWith(" ")) out += " ";
      out += t;
      out += " ";
    } else {
      out += t;
    }
  }
  return out.trim();
}
