import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  HandLandmarker,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const HAND_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const POSE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task";

let trackersPromise = null;

/**
 * Lazily build and cache the vision stack. Hand landmarks identify
 * handshape; face and pose landmarks give ASL signs the location context
 * that a hand-only classifier cannot infer.
 */
function getTrackers() {
  if (!trackersPromise) {
    trackersPromise = (async () => {
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
      const [hands, face, pose] = await Promise.all([
        HandLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: HAND_MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        }),
        FaceLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: FACE_MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        }),
        PoseLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: POSE_MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        }),
      ]);
      return { hands, face, pose };
    })().catch((err) => {
      // Allow a retry on next mount if the first attempt failed.
      trackersPromise = null;
      throw err;
    });
  }
  return trackersPromise;
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
    let trackers = null;

    (async () => {
      try {
        setStatus("loading");
        trackers = await getTrackers();
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
            const now = performance.now();
            const handResult = trackers.hands.detectForVideo(video, now);
            const faceResult = trackers.face.detectForVideo(video, now);
            const poseResult = trackers.pose.detectForVideo(video, now);
            callbackRef.current?.({
              ...handResult,
              faceLandmarks: faceResult.faceLandmarks ?? [],
              faceBlendshapes: faceResult.faceBlendshapes ?? [],
              poseLandmarks: poseResult.landmarks ?? [],
              poseWorldLandmarks: poseResult.worldLandmarks ?? [],
            });
          } catch (err) {
            console.error("Vision tracker detection error:", err);
          }
        };
        loop();
      } catch (err) {
        console.error("Failed to initialise vision trackers:", err);
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
