# JC-Signs - ASL Practice & Real-Time Translation

A privacy-first web app that recognizes American Sign Language in real time and turns it into text and speech. Built with **Vite + React + TensorFlow.js + MediaPipe hand, face, and body tracking**, designed to help hearing colleagues communicate with people who use ASL.

Everything runs locally in your browser. Nothing is uploaded.

## What It Does

- **Translate mode** - turns your signs into a live script. Tap **Speak** to read it aloud, copy it, or have each sign spoken as it is committed.
- **Practice mode** - shows a target sign and scores you when you make and hold it.
- **Learn mode** - searchable library of every sign the recognizer supports, with handshape and location notes.

## Recognized Signs

- **Letters:** A-Z. J and Z use short motion tracking; the rest are single-hand landmark shapes.
- **Everyday phrases:** Hello, Thank You, Please, Home, Food, Water, Drink, Bathroom, Yes, No, Unsure, Help, Me, You, Need, Please Help Me, More, I Love You.
- **Face/body-aware signs:** Home, Food, Water, Drink, Thank You, Please, Me, You, Need, and Bathroom use face or torso landmarks so the same handshape can mean different things in different locations.
- **Two-hand shortcuts:** Help, Please Help Me, More, and Unsure use two visible hands when possible.

Some ASL signs still require nuance that deterministic rules cannot fully capture, but JC-Signs now tracks hands, face landmarks, and upper-body pose so location-based signs are handled much closer to real ASL than a hand-only recognizer.

## Why It Works

JC-Signs uses modern `@mediapipe/tasks-vision` landmarkers: HandLandmarker for handshape, FaceLandmarker for mouth/chin/forehead location, and PoseLandmarker for shoulder/chest context. A geometric classifier combines those signals with a small motion buffer for J/Z and phrase shortcuts, then a stability buffer commits signs only after they are held consistently.

## Run It

```bash
npm install
npm run dev      # http://localhost:3000
npm run test:smoke
npm run build    # production bundle in /dist
npm run preview  # serve the production build
```

You need a modern browser with WebGL and webcam access. The MediaPipe hand, face, and pose models are fetched from Google's CDN on first launch and cached by the browser.

## Project Layout

```text
asl_tensorflow/
|-- index.html
|-- vite.config.js
|-- src/
|   |-- main.jsx
|   |-- App.jsx
|   |-- App.css / index.css
|   |-- hooks/
|   |   |-- useHandTracker.js
|   |   `-- useSpeech.js
|   |-- lib/
|   |   |-- landmarks.js
|   |   |-- aslClassifier.js
|   |   |-- stability.js
|   |   `-- signLibrary.js
|   `-- components/
|       |-- Header.jsx
|       |-- CameraView.jsx
|       |-- TranslateMode.jsx
|       |-- PracticeMode.jsx
|       |-- LearnMode.jsx
|       `-- SignIcon.jsx
```

## Privacy

- Model inference and webcam frames stay on your device.
- The only network calls are the one-time downloads of the MediaPipe models and WASM runtime from Google's public CDN.
- No analytics, no telemetry, no accounts.

## License

MIT. See `LICENSE` and `THIRD_PARTY_NOTICES.md`.
