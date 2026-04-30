import assert from "node:assert/strict";

import {
  WRIST,
  THUMB_CMC,
  THUMB_MCP,
  THUMB_IP,
  THUMB_TIP,
  INDEX_MCP,
  INDEX_PIP,
  INDEX_DIP,
  INDEX_TIP,
  MIDDLE_MCP,
  MIDDLE_PIP,
  MIDDLE_DIP,
  MIDDLE_TIP,
  RING_MCP,
  RING_PIP,
  RING_DIP,
  RING_TIP,
  PINKY_MCP,
  PINKY_PIP,
  PINKY_DIP,
  PINKY_TIP,
} from "../src/lib/landmarks.js";

let classifyFrame;
let classifyHand;
let LABELS;
let resetClassifierState;
try {
  ({ LABELS, classifyFrame, classifyHand, resetClassifierState } = await import("../src/lib/aslClassifier.js"));
} catch (error) {
  console.error(
    "Unable to import ../src/lib/aslClassifier.js. The app imports this classifier too, so restore that module before running the smoke test.",
  );
  throw error;
}

const FINGERS = {
  index: { mcp: INDEX_MCP, pip: INDEX_PIP, dip: INDEX_DIP, tip: INDEX_TIP, x: -0.36 },
  middle: { mcp: MIDDLE_MCP, pip: MIDDLE_PIP, dip: MIDDLE_DIP, tip: MIDDLE_TIP, x: 0 },
  ring: { mcp: RING_MCP, pip: RING_PIP, dip: RING_DIP, tip: RING_TIP, x: 0.36 },
  pinky: { mcp: PINKY_MCP, pip: PINKY_PIP, dip: PINKY_DIP, tip: PINKY_TIP, x: 0.7 },
};

const DEFAULT_FINGERS = {
  index: "down",
  middle: "down",
  ring: "down",
  pinky: "down",
};

function point(x, y, z = 0) {
  return { x, y, z };
}

function translated(points, dx) {
  return points.map((p) => point(p.x + dx, p.y, p.z ?? 0));
}

function makeFace({ mouth = point(0, 0), chin = mouth } = {}) {
  const face = Array.from({ length: 455 }, () => point(mouth.x, mouth.y));
  face[1] = point(mouth.x, mouth.y - 0.12);
  face[10] = point(mouth.x, mouth.y - 0.28);
  face[13] = point(mouth.x, mouth.y - 0.02);
  face[14] = point(mouth.x, mouth.y + 0.02);
  face[152] = chin;
  face[234] = point(mouth.x - 0.14, mouth.y);
  face[454] = point(mouth.x + 0.14, mouth.y);
  return face;
}

function makePose({ chest = point(0, 0.5), scale = 0.8 } = {}) {
  const pose = Array.from({ length: 33 }, () => point(chest.x, chest.y, 0));
  pose[11] = point(chest.x - scale / 2, chest.y - 0.2);
  pose[12] = point(chest.x + scale / 2, chest.y - 0.2);
  pose[23] = point(chest.x - scale / 3, chest.y + 0.2);
  pose[24] = point(chest.x + scale / 3, chest.y + 0.2);
  return pose;
}

function setFinger(landmarks, finger, pose) {
  const spec = FINGERS[finger];
  const spread = typeof pose === "object" ? pose.spread ?? 0 : 0;
  const name = typeof pose === "string" ? pose : pose.name;
  const tipX = spec.x + spread;

  landmarks[spec.mcp] = point(spec.x, 0);
  if (name === "up") {
    landmarks[spec.pip] = point((spec.x + tipX) / 2, -0.72);
    landmarks[spec.dip] = point(tipX, -1.15);
    landmarks[spec.tip] = point(tipX, -1.6);
    return;
  }

  landmarks[spec.pip] = point(spec.x, -0.5);
  landmarks[spec.dip] = point(spec.x, -0.22);
  landmarks[spec.tip] = point(spec.x, 0.02);
}

function setThumb(landmarks, pose) {
  landmarks[THUMB_CMC] = point(-0.28, 0.36);
  landmarks[THUMB_MCP] = point(-0.62, 0.12);

  if (pose === "up") {
    landmarks[THUMB_IP] = point(-1.0, 0.08);
    landmarks[THUMB_TIP] = point(-1.34, 0.06);
    return;
  }

  landmarks[THUMB_IP] = point(-0.28, 0.36);
  landmarks[THUMB_TIP] = point(0.35, 0.55);
}

function makeHand({ thumb = "down", fingers = {}, x = 0 } = {}) {
  const landmarks = Array.from({ length: 21 }, () => point(0, 0));
  landmarks[WRIST] = point(0, 1);
  setThumb(landmarks, thumb);

  const mergedFingers = { ...DEFAULT_FINGERS, ...fingers };
  for (const [finger, pose] of Object.entries(mergedFingers)) {
    setFinger(landmarks, finger, pose);
  }

  return translated(landmarks, x);
}

const fixtures = [
  {
    name: "B",
    hand: makeHand({
      fingers: { index: "up", middle: "up", ring: "up", pinky: "up" },
    }),
  },
  {
    name: "A",
    hand: makeHand({ thumb: "up" }),
  },
  {
    name: "L",
    hand: makeHand({ thumb: "up", fingers: { index: "up" } }),
  },
  {
    name: "Y",
    hand: makeHand({ thumb: "up", fingers: { pinky: "up" } }),
  },
  {
    name: "I",
    hand: makeHand({ fingers: { pinky: "up" } }),
  },
  {
    name: "V",
    hand: makeHand({
      fingers: {
        index: { name: "up", spread: -0.1 },
        middle: { name: "up", spread: 0.1 },
      },
    }),
  },
  {
    name: "U",
    hand: makeHand({
      fingers: {
        index: { name: "up", spread: 0.23 },
        middle: { name: "up", spread: 0.05 },
      },
    }),
  },
  {
    name: "W",
    hand: makeHand({
      fingers: { index: "up", middle: "up", ring: "up" },
    }),
  },
];

for (const { name, hand } of fixtures) {
  const result = classifyHand(hand, { phrases: false });
  assert.equal(result?.sign, name, `${name} fixture classified as ${result?.sign ?? "null"}`);
  assert.ok(result.confidence >= 0.72, `${name} confidence ${result.confidence} is below threshold`);
}

for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  assert.equal(LABELS[letter], letter, `missing classifier label for ${letter}`);
}

const more = classifyFrame([makeHand(), makeHand({ x: 0.18 })]);
assert.equal(more?.sign, "More", `More frame classified as ${more?.sign ?? "null"}`);

resetClassifierState();
const frameFallback = classifyFrame([fixtures[0].hand]);
assert.equal(frameFallback?.sign, "B", `single-hand frame classified as ${frameFallback?.sign ?? "null"}`);

const foodHand = makeHand();
foodHand[THUMB_TIP] = point(-0.25, 0.02);
const foodFocus = point(-0.15, 0.26);
const food = classifyFrame([foodHand], { faceLandmarks: [makeFace({ mouth: foodFocus })] });
assert.equal(food?.sign, "Food", `face-context O hand classified as ${food?.sign ?? "null"}`);

resetClassifierState();
const meHand = makeHand({ fingers: { index: "up" } });
const me = classifyFrame([meHand], { poseLandmarks: [makePose({ chest: point(-0.1, 0.35) })] });
assert.equal(me?.sign, "Me", `body-context pointing hand classified as ${me?.sign ?? "null"}`);

console.log(`Classifier smoke test passed: ${fixtures.length + 30} assertions`);
