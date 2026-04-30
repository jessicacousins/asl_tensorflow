# 🤟 Sign — ASL Practice & Real-time Translation

A privacy-first web app that recognizes American Sign Language in real time and turns it into text and speech. Built with **Vite + React + TensorFlow.js + MediaPipe Hands**, designed to help hearing colleagues communicate with people who use ASL.

Everything runs locally in your browser. Nothing is uploaded.

## What it does

- **Translate mode** — turns your signs into a live script. Tap **Speak** to read it aloud (Web Speech API), copy it, or have each sign spoken as it's committed so a hearing colleague can follow along in conversation.
- **Practice mode** — shows you a target sign and scores you when you make and hold it. Pick a starter set, the easy alphabet, the full static alphabet, or phrases.
- **Learn mode** — searchable library of every sign the model recognises, with handshape descriptions.

## Recognised signs

- **Letters:** A-Z. J and Z use short motion tracking; the rest are single-hand landmark shapes.
- **Everyday phrases:** Hello, Thank You, Please, Home, Yes, No, Unsure, Help, Please Help Me, More, I Love You.
- **Two-hand shortcuts:** Help, Please Help Me, More, and Unsure use two visible hands when possible.

Some ASL signs depend on face/body location or motion that MediaPipe Hands cannot see. For those, SignBridge uses practical hand-shape and motion shortcuts while keeping letter recognition stricter so A and I Love You do not dominate nearby signs.

## Why it works

SignBridge uses the modern `@mediapipe/tasks-vision` HandLandmarker (21 normalised landmarks per hand), a geometric classifier for ASL handshapes, a small motion buffer for J/Z and phrase shortcuts, and a stability buffer so the script only commits a sign once you've held it.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run test:smoke
npm run build    # production bundle in /dist
npm run preview  # serve the production build
```

You'll need a modern browser with WebGL and webcam access (Chrome, Edge, Safari, Firefox all work). The hand-tracking model (~6 MB) is fetched once from Google's CDN on first launch.

## Project layout

```
asl_tensorflow/
├── index.html               # Vite entry
├── vite.config.js
├── src/
│   ├── main.jsx             # React mount
│   ├── App.jsx              # mode router + frame pipeline
│   ├── App.css / index.css  # design tokens & layout
│   ├── hooks/
│   │   ├── useHandTracker.js  # MediaPipe HandLandmarker lifecycle
│   │   └── useSpeech.js       # Web Speech API wrapper
│   ├── lib/
│   │   ├── landmarks.js       # MediaPipe landmark indices + bone connections
│   │   ├── aslClassifier.js   # geometric ASL classifier
│   │   ├── stability.js       # debounce/commit buffer
│   │   └── signLibrary.js     # sign metadata for Practice & Learn
│   └── components/
│       ├── Header.jsx
│       ├── CameraView.jsx     # video, skeleton overlay, controls
│       ├── TranslateMode.jsx  # live script + speech
│       ├── PracticeMode.jsx   # target sign + scoring
│       └── LearnMode.jsx      # searchable library
```

## Privacy

- Model inference and webcam frames stay on your device.
- The only network call is the one-time download of the MediaPipe model and WASM runtime from Google's public CDN.
- No analytics, no telemetry, no accounts.

## License

MIT.
