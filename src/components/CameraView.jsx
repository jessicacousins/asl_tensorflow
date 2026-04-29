import { useCallback, useEffect, useRef, useState } from "react";
import "./CameraView.css";
import { useHandTracker } from "../hooks/useHandTracker.js";
import { HAND_CONNECTIONS } from "../lib/landmarks.js";

export default function CameraView({
  enabled,
  onToggle,
  onFrame,
  livePrediction,
  handCount,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [streamError, setStreamError] = useState(null);

  // Manage the camera MediaStream lifecycle. We deliberately keep this
  // separate from the hand-tracker hook so that a stream failure (e.g.
  // permission denied) doesn't tear down the model loading.
  useEffect(() => {
    if (!enabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      return undefined;
    }

    let cancelled = false;
    setStreamError(null);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera access failed:", err);
        if (!cancelled) {
          setStreamError(
            err?.name === "NotAllowedError"
              ? "Camera permission was denied. Allow access in your browser settings to use SignBridge."
              : "We couldn't access your camera. Make sure no other app is using it.",
          );
          onToggle(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, onToggle]);

  // Draw the hand skeleton on top of the video and forward the result to
  // the parent's frame handler in the same tick.
  const handleResult = useCallback(
    (result) => {
      drawHands(canvasRef.current, videoRef.current, result?.landmarks ?? []);
      onFrame?.(result);
    },
    [onFrame],
  );

  const { status, error: trackerError } = useHandTracker({
    videoRef,
    enabled,
    onResult: handleResult,
  });

  const loading = enabled && status !== "ready";
  const errorMessage =
    streamError ||
    (status === "error"
      ? "Hand-tracking model failed to load. Check your internet connection and reload."
      : null);

  return (
    <div className="camera-card">
      <div className="camera-head">
        <div className="camera-title">
          <h2>Camera</h2>
          <span className={`status ${enabled ? "live" : "off"}`}>
            <span className="status-dot" />
            {enabled ? (loading ? "Loading model" : "Live") : "Off"}
          </span>
        </div>
        <div className="hand-count" title="Hands detected this frame">
          {handCount} {handCount === 1 ? "hand" : "hands"}
        </div>
      </div>

      <div className="camera-stage">
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="camera-canvas" />

        {!enabled && (
          <div className="camera-placeholder">
            <span className="placeholder-icon">📷</span>
            <h3>Camera is off</h3>
            <p>
              Click <strong>Start camera</strong> to begin. Everything runs
              locally — your video never leaves this device.
            </p>
          </div>
        )}

        {loading && (
          <div className="camera-overlay">
            <div className="spinner" aria-hidden="true" />
            <p>Loading hand-tracking model…</p>
            <p className="overlay-hint">Only happens once per session.</p>
          </div>
        )}

        {errorMessage && (
          <div className="camera-overlay error">
            <span className="overlay-icon">⚠️</span>
            <p>{errorMessage}</p>
          </div>
        )}

        {enabled && livePrediction && (
          <div className="live-badge fade-in" key={livePrediction.sign}>
            <span className="live-badge-label">{livePrediction.label}</span>
            <span className="live-badge-confidence">
              {Math.round(livePrediction.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      <div className="camera-controls">
        {!enabled ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onToggle(true)}
          >
            Start camera
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onToggle(false)}
          >
            Stop camera
          </button>
        )}
        <p className="camera-hint">
          {enabled
            ? "Hold each sign for about a second so it gets committed to the script."
            : "Tip: face an evenly lit wall and keep your hand fully in frame."}
        </p>
      </div>
    </div>
  );
}

// ---- canvas drawing -----------------------------------------------------

function drawHands(canvas, video, hands) {
  if (!canvas || !video) return;
  const w = video.videoWidth;
  const h = video.videoHeight;
  if (!w || !h) return;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  if (!hands.length) return;

  const palette = ["#7c5cff", "#34d399"];

  hands.forEach((landmarks, handIndex) => {
    const color = palette[handIndex % palette.length];

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, Math.min(w, h) * 0.005);
    ctx.lineCap = "round";

    for (const [a, b] of HAND_CONNECTIONS) {
      const pa = landmarks[a];
      const pb = landmarks[b];
      if (!pa || !pb) continue;
      ctx.beginPath();
      ctx.moveTo(pa.x * w, pa.y * h);
      ctx.lineTo(pb.x * w, pb.y * h);
      ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    const r = Math.max(3, Math.min(w, h) * 0.006);
    for (const lm of landmarks) {
      ctx.beginPath();
      ctx.arc(lm.x * w, lm.y * h, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
