import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

let landmarkerPromise = null;

/**
 * Lazily build (and cache across the whole session) one HandLandmarker
 * instance. The model file is ~6MB, so we never want to fetch it twice.
 */
function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
      return HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    })().catch((err) => {
      // Allow a retry on next mount if the first attempt failed.
      landmarkerPromise = null;
      throw err;
    });
  }
  return landmarkerPromise;
}

/**
 * Streams hand-landmark detections from a <video> element by repeatedly
 * calling MediaPipe's `detectForVideo`. Callers receive the latest result
 * via the `onResult` callback in the same tick the result arrived, so they
 * can run their own per-frame logic (classifier + canvas overlay).
 */
export function useHandTracker({ videoRef, enabled, onResult }) {
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState(null);
  const callbackRef = useRef(onResult);
  const rafRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  // Keep the latest callback without re-triggering the detection loop.
  useEffect(() => {
    callbackRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;
    let landmarker = null;

    (async () => {
      try {
        setStatus("loading");
        landmarker = await getLandmarker();
        if (cancelled) return;
        setStatus("ready");

        const loop = () => {
          if (cancelled) return;
          rafRef.current = requestAnimationFrame(loop);

          const video = videoRef.current;
          if (!video || video.readyState < 2) return;
          if (video.currentTime === lastVideoTimeRef.current) return;
          lastVideoTimeRef.current = video.currentTime;

          try {
            const result = landmarker.detectForVideo(video, performance.now());
            callbackRef.current?.(result);
          } catch (err) {
            console.error("HandLandmarker detection error:", err);
          }
        };
        loop();
      } catch (err) {
        console.error("Failed to initialise HandLandmarker:", err);
        if (!cancelled) {
          setError(err);
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastVideoTimeRef.current = -1;
    };
  }, [enabled, videoRef]);

  return { status, error };
}
