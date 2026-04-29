import React, { useState } from "react";
import "./App.css";
import Camera from "./components/Camera";
import SignDisplay from "./components/SignDisplay";
import ThemeToggle from "./components/ThemeToggle";
import Info from "./components/Info";

function App() {
  const [theme, setTheme] = useState("dark");
  const [recognizedSign, setRecognizedSign] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignDetected = (sign, conf) => {
    setRecognizedSign(sign);
    setConfidence(conf);
  };

  return (
    <div className={`app app-${theme}`}>
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🤟 ASL Recognition</h1>
          <p className="app-subtitle">American Sign Language to Text</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <main className="app-main">
        <div className="container">
          <div className="content-wrapper">
            <div className="camera-section">
              <Camera
                onSignDetected={handleSignDetected}
                onListeningChange={setIsListening}
              />
            </div>

            <div className="display-section">
              <SignDisplay
                sign={recognizedSign}
                confidence={confidence}
                isListening={isListening}
              />
            </div>
          </div>

          <Info />
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with TensorFlow.js • ASL Recognition v1.0</p>
      </footer>
    </div>
  );
}

export default App;
