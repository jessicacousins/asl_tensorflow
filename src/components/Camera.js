import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "./Camera.css";

const Camera = ({ onSignDetected, onListeningChange }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [lastResults, setLastResults] = useState(null);

  // Initialize TensorFlow.js and Handpose model
  useEffect(() => {
    const initializeModel = async () => {
      try {
        console.log("Initializing TensorFlow.js and Handpose model...");
        await tf.setBackend('webgl');
        await tf.ready();
        console.log("TensorFlow.js ready, loading handpose model...");

        const handposeModel = await handpose.load();
        console.log("Handpose model loaded successfully!");

        setModel(handposeModel);
        setIsLoading(false);
        onListeningChange && onListeningChange(true);
      } catch (error) {
        console.error("Error loading Handpose model:", error);
        setIsLoading(false);
      }
    };

    initializeModel();
  }, [onListeningChange]);

  // Start camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        onListeningChange(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
      onListeningChange(false);
    }
  };

  // Detect hands and recognize sign
  useEffect(() => {
    if (!model || !isCameraActive) return;

    const detectHands = async () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
        try {
          // Detect hands using handpose model
          const predictions = await model.estimateHands(videoRef.current);

          setLastResults(predictions);

          // Debug logging
          if (predictions && predictions.length > 0) {
            console.log("Hands detected:", predictions.length);
            console.log("First hand prediction:", predictions[0]);
            // For testing, just detect presence of hands
            onSignDetected("Hand Detected", 0.9);
          } else {
            console.log("No hands detected");
          }

          // Draw hand landmarks on canvas
          drawHands(predictions);

          // Recognize sign based on hand predictions
          const sign = recognizeSign(predictions);
          if (sign) {
            console.log("Sign recognized:", sign.name, "confidence:", sign.confidence);
            onSignDetected(sign.name, sign.confidence);
          }
        } catch (error) {
          console.error("Error detecting hands:", error);
        }
      }

      requestAnimationFrame(detectHands);
    };

    console.log("Starting hand detection loop...");
    detectHands();
  }, [model, isCameraActive, onSignDetected]);

  // Draw hand landmarks on canvas
  const drawHands = (predictions) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each detected hand
    if (predictions) {
      predictions.forEach((prediction, handIndex) => {
        // Draw landmarks
        if (prediction.landmarks) {
          prediction.landmarks.forEach((landmark, index) => {
            const x = landmark[0];
            const y = landmark[1];

            // Different colors for left/right hands
            ctx.fillStyle = handIndex === 0 ? "#1abc9c" : "#9b59b6";
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Label important landmarks
            if (index === 0) {
              // Wrist
              ctx.fillStyle = "#ffffff";
              ctx.font = "10px Arial";
              ctx.fillText(`Hand ${handIndex + 1}`, x + 8, y - 5);
            }
          });
        }

        // Draw annotations (finger connections)
        if (prediction.annotations) {
          Object.keys(prediction.annotations).forEach(key => {
            const points = prediction.annotations[key];
            if (points && points.length > 1) {
              ctx.strokeStyle = "#9b59b6";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(points[0][0], points[0][1]);
              for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
              }
              ctx.stroke();
            }
          });
        }
      });
    }
  };

  // Draw connections between hand landmarks
  const drawHandConnections = (landmarks, ctx) => {
    const connections = [
      // Thumb
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      // Index finger
      [0, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      // Middle finger
      [0, 9],
      [9, 10],
      [10, 11],
      [11, 12],
      // Ring finger
      [0, 13],
      [13, 14],
      [14, 15],
      [15, 16],
      // Pinky
      [0, 17],
      [17, 18],
      [18, 19],
      [19, 20],
      // Palm connections
      [5, 9],
      [9, 13],
      [13, 17],
    ];

    ctx.strokeStyle = "#9b59b6";
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];

      if (startPoint && endPoint) {
        ctx.beginPath();
        ctx.moveTo(
          startPoint.x * ctx.canvas.width,
          startPoint.y * ctx.canvas.height,
        );
        ctx.lineTo(
          endPoint.x * ctx.canvas.width,
          endPoint.y * ctx.canvas.height,
        );
        ctx.stroke();
      }
    });
  };

  // Recognize sign based on hand predictions
  const recognizeSign = (predictions) => {
    if (!predictions || predictions.length === 0) {
      return null;
    }

    const signs = [
      {
        name: "Hello",
        detect: (hands) => detectHello(hands),
        confidence: 0.85,
      },
      {
        name: "Thank You",
        detect: (hands) => detectThankYou(hands),
        confidence: 0.8,
      },
      {
        name: "Yes",
        detect: (hands) => detectYes(hands),
        confidence: 0.75,
      },
      {
        name: "Please",
        detect: (hands) => detectPlease(hands),
        confidence: 0.7,
      },
      {
        name: "Good",
        detect: (hands) => detectGood(hands),
        confidence: 0.78,
      },
      {
        name: "A",
        detect: (hands) => detectA(hands),
        confidence: 0.82,
      },
      {
        name: "B",
        detect: (hands) => detectB(hands),
        confidence: 0.85,
      },
      {
        name: "C",
        detect: (hands) => detectC(hands),
        confidence: 0.8,
      },
      {
        name: "I",
        detect: (hands) => detectI(hands),
        confidence: 0.75,
      },
      {
        name: "Love",
        detect: (hands) => detectLove(hands),
        confidence: 0.8,
      },
    ];

    for (let sign of signs) {
      if (sign.detect(predictions)) {
        return { name: sign.name, confidence: sign.confidence };
      }
    }

    return null;
  };

  // ASL Sign Detection Functions

  // Hello: Open hand waving (fingers spread, palm facing out)
  const detectHello = (hands) => {
    if (hands.length === 0) return false;

    const hand = hands[0]; // Use first detected hand
    const landmarks = hand.landmarks;

    // Check if fingers are extended (Hello sign)
    const fingersExtended = [
      isFingerExtended(landmarks, 4, 3, 2), // Thumb
      isFingerExtended(landmarks, 8, 7, 6), // Index
      isFingerExtended(landmarks, 12, 11, 10), // Middle
      isFingerExtended(landmarks, 16, 15, 14), // Ring
      isFingerExtended(landmarks, 20, 19, 18), // Pinky
    ];

    return fingersExtended.filter(Boolean).length >= 4; // At least 4 fingers extended
  };

  // Thank You: Both hands together, moving forward
  const detectThankYou = (hands) => {
    if (hands.length < 2) return false;

    const hand1 = hands[0];
    const hand2 = hands[1];

    // Check if hands are close together
    const wrist1 = hand1[0];
    const wrist2 = hand2[0];
    const distance = Math.sqrt(
      Math.pow(wrist1.x - wrist2.x, 2) + Math.pow(wrist1.y - wrist2.y, 2),
    );

    return distance < 0.15; // Hands are close together
  };

  // Yes: Fist with thumb up (or just detect raised hand)
  const detectYes = (hands) => {
    if (hands.length === 0) return false;

    const hand = hands[0];
    const thumb = hand[4];
    const index = hand[8];

    // Thumb extended up, other fingers curled
    return (
      isFingerExtended(hand, 4, 3, 2) && // Thumb extended
      !isFingerExtended(hand, 8, 7, 6) && // Index curled
      !isFingerExtended(hand, 12, 11, 10) // Middle curled
    );
  };

  // Please: Flat hand rubbing chest in circle
  const detectPlease = (hands) => {
    if (hands.length === 0) return false;

    const hand = hands[0];
    const landmarks = hand.landmarks;

    // Check if hand is relatively flat (all fingers extended or semi-extended)
    const fingersExtended = [
      isFingerExtended(landmarks, 8, 7, 6), // Index
      isFingerExtended(landmarks, 12, 11, 10), // Middle
      isFingerExtended(landmarks, 16, 15, 14), // Ring
      isFingerExtended(landmarks, 20, 19, 18), // Pinky
    ];

    return fingersExtended.filter(Boolean).length >= 3;
  };

  // Good: Thumbs up
  const detectGood = (hands) => {
    return detectYes(hands); // Same as Yes for now
  };

  // A: Fist with thumb tucked in
  const detectA = (hands) => {
    if (hands.length === 0) return false;

    const hand = hands[0];
    const landmarks = hand.landmarks;

    // Thumb tucked into palm, fingers curled over it
    return (
      !isFingerExtended(landmarks, 4, 3, 2) && // Thumb not extended
      !isFingerExtended(landmarks, 8, 7, 6) && // Index curled
      !isFingerExtended(landmarks, 12, 11, 10) && // Middle curled
      !isFingerExtended(landmarks, 16, 15, 14) && // Ring curled
      !isFingerExtended(landmarks, 20, 19, 18) // Pinky curled
    );
  };

  // B: Flat hand, fingers together
  const detectB = (hands) => {
    if (hands.length === 0) return false;

    const hand = hands[0];

    // All fingers extended and close together
    const fingersExtended = [
      isFingerExtended(hand, 8, 7, 6), // Index
      isFingerExtended(hand, 12, 11, 10), // Middle
      isFingerExtended(hand, 16, 15, 14), // Ring
      isFingerExtended(hand, 20, 19, 18), // Pinky
    ];

    return fingersExtended.filter(Boolean).length >= 4;
  };

  // C: Hand curved like C shape
  const detectC = (hands) => {
    if (hands.length === 0) return false;

    const hand = hands[0];
    const thumb = hand[4];
    const index = hand[8];
    const pinky = hand[20];

    // Thumb and pinky close, other fingers curved
    const thumbPinkyDistance = Math.sqrt(
      Math.pow(thumb.x - pinky.x, 2) + Math.pow(thumb.y - pinky.y, 2),
    );

    return thumbPinkyDistance < 0.1 && isFingerExtended(hand, 8, 7, 6);
  };

  // I: Pinky finger extended
  const detectI = (hands) => {
    if (hands.length === 0) return false;

    const hand = hands[0];

    return (
      !isFingerExtended(hand, 4, 3, 2) && // Thumb curled
      !isFingerExtended(hand, 8, 7, 6) && // Index curled
      !isFingerExtended(hand, 12, 11, 10) && // Middle curled
      !isFingerExtended(hand, 16, 15, 14) && // Ring curled
      isFingerExtended(hand, 20, 19, 18) // Pinky extended
    );
  };

  // Love: Both hands crossed over heart
  const detectLove = (hands) => {
    if (hands.length < 2) return false;

    const hand1 = hands[0];
    const hand2 = hands[1];
    const wrist1 = hand1[0];
    const wrist2 = hand2[0];

    // Hands are close together (crossed)
    const distance = Math.sqrt(
      Math.pow(wrist1.x - wrist2.x, 2) + Math.pow(wrist1.y - wrist2.y, 2),
    );

    return distance < 0.12; // Hands very close (crossed)
  };

  // Helper function to check if a finger is extended
  const isFingerExtended = (landmarks, tipIndex, pipIndex, mcpIndex) => {
    const tip = landmarks[tipIndex];
    const pip = landmarks[pipIndex];
    const mcp = landmarks[mcpIndex];

    if (!tip || !pip || !mcp) return false;

    // Check if fingertip is higher than PIP joint (extended)
    // This is a simplified check - in practice, you'd want more sophisticated analysis
    const fingerLength = Math.sqrt(
      Math.pow(pip[0] - mcp[0], 2) + Math.pow(pip[1] - mcp[1], 2),
    );
    const extensionLength = Math.sqrt(
      Math.pow(tip[0] - pip[0], 2) + Math.pow(tip[1] - pip[1], 2),
    );

    return extensionLength > fingerLength * 0.3; // Tip is sufficiently extended
  };

  return (
    <div className="camera-container surface">
      <div className="camera-header">
        <h2>Camera Feed</h2>
        <span
          className={`status-badge ${isCameraActive ? "active" : "inactive"}`}
        >
          {isCameraActive ? "🟢 Live" : "🔴 Offline"}
        </span>
      </div>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-feed"
        />
        <canvas ref={canvasRef} className="pose-canvas" />

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p>Loading TensorFlow.js Model...</p>
          </div>
        )}
      </div>

      <div className="camera-controls">
        {!isCameraActive ? (
          <button
            className="btn btn-primary"
            onClick={startCamera}
            disabled={isLoading}
          >
            📹 Start Camera
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={stopCamera}>
            ⏹️ Stop Camera
          </button>
        )}
      </div>

      <p className="camera-info text-muted">
        {isLoading
          ? "Loading MediaPipe Hand Landmarker..."
          : isCameraActive
            ? "Detecting hands and recognizing signs..."
            : 'Click "Start Camera" to begin'}
      </p>
    </div>
  );
};

export default Camera;
