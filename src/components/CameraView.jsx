import { useCallback, useEffect, useRef, useState } from "react";
import "./CameraView.css";
import { useHandTracker } from "../hooks/useHandTracker.js";
import { HAND_CONNECTIONS } from "../lib/landmarks.js";
import SignIcon from "./SignIcon.jsx";

export default function CameraView({
  enabled,
  onToggle,
  onFrame,
  livePrediction,
  handCount,
  faceCount,
  poseCount,
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
              ? "Camera permission was denied. Allow access in your browser settings to use JC-Signs."
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
      drawTracking(canvasRef.current, videoRef.current, result);
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
      ? "Tracking models failed to load. Check your internet connection and reload."
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
        <div className="tracking-counts" title="Tracking signals detected this frame">
          <span>{handCount} {handCount === 1 ? "hand" : "hands"}</span>
          <span>{faceCount} {faceCount === 1 ? "face" : "faces"}</span>
          <span>{poseCount} {poseCount === 1 ? "pose" : "poses"}</span>
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
            <span className="placeholder-icon">
              <SignIcon type="camera" size="lg" />
            </span>
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
            <p>Loading hand, face, and body tracking models...</p>
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
            ? "Keep your face, torso, and hands in frame so location-based signs can be read."
            : "Tip: face an evenly lit wall and keep your upper body and hands in frame."}
        </p>
      </div>
    </div>
  );
}

// ---- canvas drawing -----------------------------------------------------

const POSE_CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
];

const FACE_ANCHORS = [1, 10, 13, 14, 33, 61, 152, 263, 291];

function drawTracking(canvas, video, result) {
  if (!canvas || !video) return;
  const w = video.videoWidth;
  const h = video.videoHeight;
  if (!w || !h) return;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, w, h);

  drawPose(ctx, w, h, result?.poseLandmarks?.[0]);
  drawFaceAnchors(ctx, w, h, result?.faceLandmarks?.[0]);
  drawHands(ctx, w, h, result?.landmarks ?? []);
}

function drawHands(ctx, w, h, hands) {
  if (!hands.length) return;

  const palette = ["#7c3aed", "#14b8a6"];

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

function drawPose(ctx, w, h, pose) {
  if (!pose?.length) return;

  ctx.strokeStyle = "#7c3aed";
  ctx.lineWidth = Math.max(2, Math.min(w, h) * 0.004);
  ctx.lineCap = "round";
  for (const [a, b] of POSE_CONNECTIONS) {
    const pa = pose[a];
    const pb = pose[b];
    if (!pa || !pb || (pa.visibility ?? 1) < 0.35 || (pb.visibility ?? 1) < 0.35) continue;
    ctx.beginPath();
    ctx.moveTo(pa.x * w, pa.y * h);
    ctx.lineTo(pb.x * w, pb.y * h);
    ctx.stroke();
  }
}

function drawFaceAnchors(ctx, w, h, face) {
  if (!face?.length) return;

  ctx.fillStyle = "#14b8a6";
  const r = Math.max(2, Math.min(w, h) * 0.004);
  for (const idx of FACE_ANCHORS) {
    const lm = face[idx];
    if (!lm) continue;
    ctx.beginPath();
    ctx.arc(lm.x * w, lm.y * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
}
