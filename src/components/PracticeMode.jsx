import { useEffect, useMemo, useRef, useState } from "react";
import "./PracticeMode.css";
import { SIGN_LIBRARY, SIGN_BY_KEY } from "../lib/signLibrary.js";

const HOLD_MS = 800; // how long the correct sign must be held to score it

const PRACTICE_SETS = [
  {
    id: "starter",
    label: "Starter (5)",
    signs: ["A", "B", "L", "Y", "Hello"],
  },
  {
    id: "alphabet-basic",
    label: "Easy letters (8)",
    signs: ["A", "B", "C", "D", "I", "L", "O", "Y"],
  },
  {
    id: "alphabet-full",
    label: "Static alphabet (13)",
    signs: ["A", "B", "C", "D", "E", "F", "I", "L", "O", "R", "U", "V", "W", "Y"],
  },
  {
    id: "phrases",
    label: "Phrases (2)",
    signs: ["Hello", "I Love You"],
  },
];

export default function PracticeMode({ livePrediction, cameraOn }) {
  const [setId, setSetId] = useState(PRACTICE_SETS[0].id);
  const [target, setTarget] = useState(PRACTICE_SETS[0].signs[0]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("idle"); // idle | hold | correct
  const holdStartRef = useRef(0);

  const activeSet = useMemo(
    () => PRACTICE_SETS.find((s) => s.id === setId) ?? PRACTICE_SETS[0],
    [setId],
  );

  // When the set changes, pick a fresh target from it.
  useEffect(() => {
    setTarget(pickRandom(activeSet.signs, target));
    setFeedback("idle");
    holdStartRef.current = 0;
  }, [setId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch the live prediction for a match; the user has to hold it briefly
  // so an incidental flicker doesn't count.
  useEffect(() => {
    if (!cameraOn) {
      holdStartRef.current = 0;
      setFeedback("idle");
      return;
    }
    const matched = livePrediction?.sign === target;
    if (!matched) {
      holdStartRef.current = 0;
      setFeedback((f) => (f === "correct" ? f : "idle"));
      return;
    }

    if (!holdStartRef.current) {
      holdStartRef.current = performance.now();
      setFeedback("hold");
      return;
    }

    if (performance.now() - holdStartRef.current >= HOLD_MS && feedback !== "correct") {
      setFeedback("correct");
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      // Move on after a brief celebration window so the user sees the success.
      setTimeout(() => {
        setTarget((prev) => pickRandom(activeSet.signs, prev));
        setFeedback("idle");
        holdStartRef.current = 0;
      }, 900);
    }
  }, [livePrediction, target, cameraOn, feedback, activeSet.signs]);

  const meta = SIGN_BY_KEY[target] ?? SIGN_LIBRARY[0];

  const skip = () => {
    setStreak(0);
    setTarget((prev) => pickRandom(activeSet.signs, prev));
    setFeedback("idle");
    holdStartRef.current = 0;
  };

  const reset = () => {
    setScore(0);
    setStreak(0);
    setTarget(pickRandom(activeSet.signs, target));
    setFeedback("idle");
    holdStartRef.current = 0;
  };

  return (
    <div className={`panel practice-panel ${feedback}`}>
      <div className="panel-head">
        <div>
          <h2>Practice</h2>
          <p className="panel-sub">
            Make the sign and hold it. We'll score it when the model is sure.
          </p>
        </div>
        <div className="score-block">
          <div>
            <span className="score-label">Score</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span className="score-label">Streak</span>
            <strong>{streak}</strong>
          </div>
        </div>
      </div>

      <div className="set-picker" role="tablist" aria-label="Practice set">
        {PRACTICE_SETS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`set-chip ${setId === s.id ? "is-active" : ""}`}
            onClick={() => setSetId(s.id)}
            role="tab"
            aria-selected={setId === s.id}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={`target-card target-${feedback}`}>
        <div className="target-emoji" aria-hidden="true">
          {meta.emoji}
        </div>
        <div className="target-body">
          <span className="target-label">Sign</span>
          <h3 className="target-sign">{target}</h3>
          <p className="target-desc">{meta.description}</p>
        </div>
        <FeedbackBadge state={feedback} cameraOn={cameraOn} live={livePrediction} />
      </div>

      <div className="practice-controls">
        <button type="button" className="btn btn-secondary" onClick={skip}>
          Skip
        </button>
        <button type="button" className="btn btn-ghost" onClick={reset}>
          Reset score
        </button>
      </div>
    </div>
  );
}

function FeedbackBadge({ state, cameraOn, live }) {
  if (!cameraOn) {
    return <span className="feedback off">Turn on the camera to start</span>;
  }
  if (state === "correct") return <span className="feedback ok">✓ Nice!</span>;
  if (state === "hold") return <span className="feedback hold">Hold it…</span>;
  return (
    <span className="feedback idle">
      {live ? `Seeing ${live.label}` : "Show me the sign"}
    </span>
  );
}

function pickRandom(list, exclude) {
  if (list.length <= 1) return list[0];
  let pick = exclude;
  while (pick === exclude) {
    pick = list[Math.floor(Math.random() * list.length)];
  }
  return pick;
}
