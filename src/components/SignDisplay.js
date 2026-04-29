import React, { useState, useEffect } from "react";
import "./SignDisplay.css";

const SignDisplay = ({ sign, confidence, isListening }) => {
  const [signHistory, setSignHistory] = useState([]);
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    if (sign && confidence > 0.6) {
      // Add to history with timestamp
      const newEntry = {
        id: Date.now(),
        sign,
        confidence,
        timestamp: new Date().toLocaleTimeString(),
      };

      setSignHistory((prev) => {
        const updated = [newEntry, ...prev.slice(0, 9)]; // Keep last 10
        return updated;
      });

      // Update translation
      setTranslation(sign);
    }
  }, [sign, confidence]);

  const clearHistory = () => {
    setSignHistory([]);
    setTranslation("");
  };

  const getSignDescription = (signName) => {
    const descriptions = {
      Hello: "Open hand with fingers spread, waving motion",
      "Thank You": "Both hands together near chest, moving forward",
      Yes: "Fist with thumb extended upward",
      Please: "Flat hand rubbing chest in circular motion",
      Good: "Thumbs up gesture with fist",
      A: "Fist with thumb tucked inside curled fingers",
      B: "Flat hand with all fingers extended together",
      C: "Hand curved in C-shape, thumb and pinky close",
      I: "Pinky finger extended, other fingers curled",
      Love: "Both hands crossed over heart area",
    };

    return (
      descriptions[signName] || "Sign detected - performing recognition..."
    );
  };

  return (
    <div className="display-container surface">
      <div className="display-header">
        <h2>Sign Recognition</h2>
        <div className="listening-indicator">
          <span className={`indicator-dot ${isListening ? "listening" : ""}`} />
          <span className="indicator-text">
            {isListening ? "Listening..." : "Standby"}
          </span>
        </div>
      </div>

      <div className="sign-display">
        {translation ? (
          <div className="sign-recognized fadeIn">
            <div className="sign-emoji">🤟</div>
            <h1 className="recognized-sign">{translation}</h1>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{
                  width: `${Math.min(confidence * 100, 100)}%`,
                }}
              />
            </div>
            <p className="confidence-text">
              {Math.round(confidence * 100)}% Confidence
            </p>
            <p className="sign-description">
              {getSignDescription(translation)}
            </p>
          </div>
        ) : (
          <div className="no-sign-detected">
            <div className="no-sign-emoji">👀</div>
            <p>No sign detected yet</p>
            <p className="text-muted">Make gestures in front of the camera</p>
          </div>
        )}
      </div>

      <div className="history-section">
        <div className="history-header">
          <h3>Recognition History</h3>
          {signHistory.length > 0 && (
            <button className="btn-clear" onClick={clearHistory}>
              Clear
            </button>
          )}
        </div>

        {signHistory.length > 0 ? (
          <div className="history-list">
            {signHistory.map((entry) => (
              <div key={entry.id} className="history-item fadeIn">
                <div className="history-sign">{entry.sign}</div>
                <div className="history-details">
                  <span className="history-confidence">
                    {Math.round(entry.confidence * 100)}%
                  </span>
                  <span className="history-time">{entry.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted history-empty">
            Signs will appear here as they are recognized
          </p>
        )}
      </div>

      <div className="tips-section">
        <h4>💡 Tips for Best Results</h4>
        <ul>
          <li>Ensure good lighting from the front</li>
          <li>Face the camera directly</li>
          <li>Move signs slowly and clearly</li>
          <li>Raise hands above shoulder level</li>
          <li>Keep gestures within frame</li>
        </ul>
      </div>
    </div>
  );
};

export default SignDisplay;
