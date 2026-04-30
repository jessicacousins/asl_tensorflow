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
  { id: "translate", label: "Translate" },
  { id: "practice", label: "Practice" },
  { id: "learn", label: "Learn" },
];

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("jc-signs:theme") ?? "dark",
  );
  const [mode, setMode] = useState("translate");
  const [cameraOn, setCameraOn] = useState(false);
  const [livePrediction, setLivePrediction] = useState(null);
  const [committedSign, setCommittedSign] = useState(null);
  const [handCount, setHandCount] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [poseCount, setPoseCount] = useState(0);

  const stabilityRef = useRef(createStabilityBuffer());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("jc-signs:theme", theme);
  }, [theme]);

  useEffect(() => {
    stabilityRef.current.reset();
    resetClassifierState();
    setLivePrediction(null);
    setCommittedSign(null);
  }, [cameraOn, mode]);

  const handleFrame = useCallback((result) => {
    const hands = result?.landmarks ?? [];
    const faces = result?.faceLandmarks ?? [];
    const poses = result?.poseLandmarks ?? [];
    setHandCount(hands.length);
    setFaceCount(faces.length);
    setPoseCount(poses.length);

    if (hands.length === 0) {
      setLivePrediction(null);
      const committed = stabilityRef.current.tick(null);
      if (committed) setCommittedSign({ sign: committed, at: Date.now() });
      return;
    }

    const prediction = classifyFrame(hands, {
      faceLandmarks: faces,
      poseLandmarks: poses,
    });
    setLivePrediction(prediction);

    const committed = stabilityRef.current.tick(prediction?.sign ?? null);
    if (committed) setCommittedSign({ sign: committed, at: Date.now() });
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const cameraSlot = useMemo(
    () => (
      <CameraView
        enabled={cameraOn}
        onToggle={setCameraOn}
        onFrame={handleFrame}
        livePrediction={livePrediction}
        handCount={handCount}
        faceCount={faceCount}
        poseCount={poseCount}
      />
    ),
    [cameraOn, handleFrame, livePrediction, handCount, faceCount, poseCount],
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
        <span>JC-Signs - TensorFlow.js + MediaPipe Holistic Tracking</span>
        <span className="dot" />
        <span>Built for communication</span>
      </footer>
    </div>
  );
}
