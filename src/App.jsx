import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import CameraView from "./components/CameraView.jsx";
import TranslateMode from "./components/TranslateMode.jsx";
import PracticeMode from "./components/PracticeMode.jsx";
import LearnMode from "./components/LearnMode.jsx";
import { classifyFrame, resetClassifierState } from "./lib/aslClassifier.js";
import { createStabilityBuffer } from "./lib/stability.js";

const MODES = [
  { id: "translate", label: "Translate", icon: "💬" },
  { id: "practice", label: "Practice", icon: "🎯" },
  { id: "learn", label: "Learn", icon: "📚" },
];

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("signbridge:theme") ?? "dark",
  );
  const [mode, setMode] = useState("translate");
  const [cameraOn, setCameraOn] = useState(false);

  // The "live" prediction is whatever the classifier saw in the last frame —
  // it flickers every frame, so it's only used for the on-screen badge and
  // for Practice mode's instant feedback. The "committed" stream goes through
  // the stability buffer and is what feeds the script.
  const [livePrediction, setLivePrediction] = useState(null);
  const [committedSign, setCommittedSign] = useState(null);
  const [handCount, setHandCount] = useState(0);

  const stabilityRef = useRef(createStabilityBuffer());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("signbridge:theme", theme);
  }, [theme]);

  // Reset the stability buffer whenever we toggle the camera or switch
  // modes — old detections from a different context aren't useful.
  useEffect(() => {
    stabilityRef.current.reset();
    resetClassifierState();
    setLivePrediction(null);
    setCommittedSign(null);
  }, [cameraOn, mode]);

  const handleFrame = useCallback((result) => {
    const hands = result?.landmarks ?? [];
    setHandCount(hands.length);

    if (hands.length === 0) {
      setLivePrediction(null);
      const committed = stabilityRef.current.tick(null);
      if (committed) setCommittedSign({ sign: committed, at: Date.now() });
      return;
    }

    // classifyFrame checks two-handed signs (Heart, More) when both hands
    // are visible, and falls back to the first hand for fingerspelling.
    const prediction = classifyFrame(hands);
    setLivePrediction(prediction);

    const committed = stabilityRef.current.tick(prediction?.sign ?? null);
    if (committed) setCommittedSign({ sign: committed, at: Date.now() });
  }, []);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const cameraSlot = useMemo(
    () => (
      <CameraView
        enabled={cameraOn}
        onToggle={setCameraOn}
        onFrame={handleFrame}
        livePrediction={livePrediction}
        handCount={handCount}
      />
    ),
    [cameraOn, handleFrame, livePrediction, handCount],
  );

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        modes={MODES}
        currentMode={mode}
        onModeChange={setMode}
      />

      <main className="app-main">
        <div className="app-grid">
          <section className="app-camera">{cameraSlot}</section>

          <section className="app-panel">
            {mode === "translate" && (
              <TranslateMode
                committedSign={committedSign}
                livePrediction={livePrediction}
                cameraOn={cameraOn}
              />
            )}
            {mode === "practice" && (
              <PracticeMode
                livePrediction={livePrediction}
                cameraOn={cameraOn}
              />
            )}
            {mode === "learn" && <LearnMode />}
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <span>SignBridge · TensorFlow.js + MediaPipe Hands</span>
        <span className="dot" />
        <span>Built so colleagues can communicate.</span>
      </footer>
    </div>
  );
}
