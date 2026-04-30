import {
  WRIST,
  THUMB_CMC,
  THUMB_MCP,
  THUMB_IP,
  THUMB_TIP,
  INDEX_MCP,
  INDEX_PIP,
  INDEX_TIP,
  MIDDLE_MCP,
  MIDDLE_PIP,
  MIDDLE_TIP,
  RING_MCP,
  RING_PIP,
  RING_TIP,
  PINKY_MCP,
  PINKY_PIP,
  PINKY_TIP,
} from "./landmarks.js";

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const handScale = (lm) => dist(lm[WRIST], lm[MIDDLE_MCP]) || 1e-6;

function angleCos(lm, a, b, c) {
  const ax = lm[a].x - lm[b].x;
  const ay = lm[a].y - lm[b].y;
  const cx = lm[c].x - lm[b].x;
  const cy = lm[c].y - lm[b].y;
  const mag = Math.hypot(ax, ay) * Math.hypot(cx, cy);
  if (mag < 1e-9) return 1;
  return (ax * cx + ay * cy) / mag;
}

function jointExtension(lm, mcp, pip, tip) {
  return clamp((1 - angleCos(lm, mcp, pip, tip)) / 2);
}

function thumbExtension(lm) {
  return clamp((1 - angleCos(lm, THUMB_CMC, THUMB_MCP, THUMB_IP)) / 2);
}

function softUp(v) {
  if (v >= 0.74) return 1;
  if (v <= 0.46) return 0;
  return (v - 0.46) / 0.28;
}

function softDown(v) {
  if (v <= 0.34) return 1;
  if (v >= 0.62) return 0;
  return (0.62 - v) / 0.28;
}

function softMid(v, target = 0.52, halfWidth = 0.24) {
  const d = Math.abs(v - target);
  if (d <= halfWidth * 0.35) return 1;
  if (d >= halfWidth) return 0;
  return 1 - (d - halfWidth * 0.35) / (halfWidth * 0.65);
}

function inRange(v, low, high, fade = 0.06) {
  if (v < low - fade || v > high + fade) return 0;
  if (v < low) return (v - low + fade) / fade;
  if (v > high) return (high + fade - v) / fade;
  return 1;
}

function greaterThan(v, target, fade = 0.08) {
  if (v >= target) return 1;
  if (v <= target - fade) return 0;
  return (v - target + fade) / fade;
}

function lessThan(v, target, fade = 0.08) {
  if (v <= target) return 1;
  if (v >= target + fade) return 0;
  return (target + fade - v) / fade;
}

function geo(values) {
  if (!values.length) return 0;
  return Math.pow(values.reduce((acc, v) => acc * clamp(v), 1), 1 / values.length);
}

function fingers(f, wanted) {
  const e = f.ext;
  return geo(
    Object.entries(wanted).map(([finger, state]) => {
      if (state === "up") return softUp(e[finger]);
      if (state === "down") return softDown(e[finger]);
      if (state === "mid") return softMid(e[finger]);
      return 1;
    }),
  );
}

function getFeatures(lm) {
  const scale = handScale(lm);
  const d = (a, b) => dist(lm[a], lm[b]) / scale;
  const dy = (a, b) => (lm[a].y - lm[b].y) / scale;
  const dx = (a, b) => (lm[a].x - lm[b].x) / scale;
  const absDx = (a, b) => Math.abs(dx(a, b));
  const absDy = (a, b) => Math.abs(dy(a, b));

  const ext = {
    thumb: thumbExtension(lm),
    index: jointExtension(lm, INDEX_MCP, INDEX_PIP, INDEX_TIP),
    middle: jointExtension(lm, MIDDLE_MCP, MIDDLE_PIP, MIDDLE_TIP),
    ring: jointExtension(lm, RING_MCP, RING_PIP, RING_TIP),
    pinky: jointExtension(lm, PINKY_MCP, PINKY_PIP, PINKY_TIP),
  };

  return {
    lm,
    ext,
    scale,
    thumbIndex: d(THUMB_TIP, INDEX_TIP),
    thumbMiddle: d(THUMB_TIP, MIDDLE_TIP),
    thumbRing: d(THUMB_TIP, RING_TIP),
    thumbPinky: d(THUMB_TIP, PINKY_TIP),
    indexMiddleSpread: d(INDEX_TIP, MIDDLE_TIP),
    middleRingSpread: d(MIDDLE_TIP, RING_TIP),
    ringPinkySpread: d(RING_TIP, PINKY_TIP),
    indexTipToMcp: d(INDEX_TIP, INDEX_MCP),
    middleTipToMcp: d(MIDDLE_TIP, MIDDLE_MCP),
    thumbAcrossPalm: d(THUMB_TIP, PINKY_MCP),
    indexVertical: absDy(INDEX_TIP, INDEX_MCP),
    indexHorizontal: absDx(INDEX_TIP, INDEX_MCP),
    middleVertical: absDy(MIDDLE_TIP, MIDDLE_MCP),
    middleHorizontal: absDx(MIDDLE_TIP, MIDDLE_MCP),
    ringVertical: absDy(RING_TIP, RING_MCP),
    indexAboveMcp: -dy(INDEX_TIP, INDEX_MCP),
    middleAboveMcp: -dy(MIDDLE_TIP, MIDDLE_MCP),
    pinkyAboveMcp: -dy(PINKY_TIP, PINKY_MCP),
  };
}

const openPalm = (f) =>
  fingers(f, { thumb: "up", index: "up", middle: "up", ring: "up", pinky: "up" });

const closedFist = (f) =>
  fingers(f, { index: "down", middle: "down", ring: "down", pinky: "down" });

const twoUp = (f) =>
  fingers(f, { thumb: "down", index: "up", middle: "up", ring: "down", pinky: "down" });

const POSE = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
};

const FACE = {
  FOREHEAD: 10,
  NOSE: 1,
  UPPER_LIP: 13,
  LOWER_LIP: 14,
  CHIN: 152,
  LEFT_CHEEK: 234,
  RIGHT_CHEEK: 454,
};

const SCORERS = {
  A: (f) =>
    closedFist(f) *
    softUp(f.ext.thumb) *
    greaterThan(f.thumbIndex, 0.38, 0.12) *
    greaterThan(f.thumbPinky, 0.35, 0.12),

  B: (f) =>
    fingers(f, { thumb: "down", index: "up", middle: "up", ring: "up", pinky: "up" }) *
    lessThan(f.thumbAcrossPalm, 1.2, 0.2),

  C: (f) =>
    fingers(f, { thumb: "mid", index: "mid", middle: "mid", ring: "mid", pinky: "mid" }) *
    inRange(f.thumbIndex, 0.55, 1.3, 0.16),

  D: (f) =>
    fingers(f, { index: "up", middle: "down", ring: "down", pinky: "down" }) *
    lessThan(f.thumbMiddle, 0.42, 0.1) *
    greaterThan(f.indexAboveMcp, 0.6, 0.16),

  E: (f) =>
    closedFist(f) *
    softDown(f.ext.thumb) *
    lessThan(Math.min(f.thumbIndex, f.thumbMiddle), 0.55, 0.12),

  F: (f) =>
    fingers(f, { index: "down", middle: "up", ring: "up", pinky: "up" }) *
    lessThan(f.thumbIndex, 0.42, 0.1),

  G: (f) =>
    fingers(f, { index: "up", middle: "down", ring: "down", pinky: "down" }) *
    softUp(f.ext.thumb) *
    greaterThan(f.indexHorizontal, f.indexVertical + 0.15, 0.15),

  H: (f) =>
    twoUp(f) *
    lessThan(f.indexMiddleSpread, 0.28, 0.08) *
    greaterThan(f.indexHorizontal + f.middleHorizontal, f.indexVertical + f.middleVertical + 0.2, 0.18),

  I: (f) =>
    fingers(f, { thumb: "down", index: "down", middle: "down", ring: "down", pinky: "up" }) *
    greaterThan(f.pinkyAboveMcp, 0.45, 0.16),

  K: (f) =>
    twoUp(f) *
    inRange(f.indexMiddleSpread, 0.22, 0.75, 0.08) *
    lessThan(f.thumbMiddle, 0.75, 0.12) *
    greaterThan(f.indexAboveMcp + f.middleAboveMcp, 1.0, 0.2),

  L: (f) =>
    fingers(f, { thumb: "up", index: "up", middle: "down", ring: "down", pinky: "down" }) *
    greaterThan(f.thumbIndex, 0.75, 0.14) *
    greaterThan(f.indexAboveMcp, 0.45, 0.14),

  M: (f) =>
    closedFist(f) *
    softDown(f.ext.thumb) *
    lessThan(f.thumbRing, 0.55, 0.12) *
    greaterThan(f.thumbIndex, 0.25, 0.08),

  N: (f) =>
    closedFist(f) *
    softDown(f.ext.thumb) *
    lessThan(f.thumbMiddle, 0.55, 0.12) *
    greaterThan(f.thumbRing, 0.36, 0.1),

  O: (f) =>
    closedFist(f) *
    inRange(Math.min(f.thumbIndex, f.thumbMiddle), 0, 0.5, 0.12),

  P: (f) =>
    twoUp(f) *
    inRange(f.indexMiddleSpread, 0.22, 0.78, 0.08) *
    lessThan(f.indexAboveMcp + f.middleAboveMcp, 0.2, 0.2),

  Q: (f) =>
    fingers(f, { thumb: "up", index: "up", middle: "down", ring: "down", pinky: "down" }) *
    greaterThan(f.indexHorizontal, f.indexVertical + 0.1, 0.16) *
    lessThan(f.indexAboveMcp, 0.15, 0.18),

  R: (f) =>
    twoUp(f) *
    lessThan(f.indexMiddleSpread, 0.12, 0.05) *
    greaterThan(f.indexAboveMcp + f.middleAboveMcp, 0.85, 0.2),

  S: (f) =>
    closedFist(f) *
    softDown(f.ext.thumb) *
    greaterThan(Math.min(f.thumbIndex, f.thumbMiddle), 0.5, 0.12),

  T: (f) =>
    closedFist(f) *
    inRange(f.thumbIndex, 0.2, 0.55, 0.1) *
    greaterThan(f.thumbMiddle, 0.25, 0.08),

  U: (f) =>
    twoUp(f) *
    lessThan(f.indexMiddleSpread, 0.24, 0.07) *
    greaterThan(f.indexAboveMcp + f.middleAboveMcp, 1.0, 0.18),

  V: (f) =>
    twoUp(f) *
    greaterThan(f.indexMiddleSpread, 0.32, 0.08) *
    greaterThan(f.indexAboveMcp + f.middleAboveMcp, 1.0, 0.18),

  W: (f) =>
    fingers(f, { thumb: "down", index: "up", middle: "up", ring: "up", pinky: "down" }) *
    greaterThan(f.indexMiddleSpread + f.middleRingSpread, 0.45, 0.12),

  X: (f) =>
    fingers(f, { index: "mid", middle: "down", ring: "down", pinky: "down" }) *
    softDown(f.ext.thumb) *
    inRange(f.indexTipToMcp, 0.35, 0.9, 0.12),

  Y: (f) =>
    fingers(f, { thumb: "up", index: "down", middle: "down", ring: "down", pinky: "up" }) *
    greaterThan(f.thumbPinky, 0.9, 0.16),

  Hello: (f) => openPalm(f),
  No: (f) =>
    fingers(f, { thumb: "up", index: "up", middle: "up", ring: "down", pinky: "down" }) *
    lessThan(f.thumbIndex, 0.8, 0.16),
  Point: (f) =>
    fingers(f, { index: "up", middle: "down", ring: "down", pinky: "down" }) *
    greaterThan(f.indexAboveMcp, 0.45, 0.14),
  "I Love You": (f) =>
    fingers(f, { thumb: "up", index: "up", middle: "down", ring: "down", pinky: "up" }) *
    greaterThan(f.thumbIndex, 0.72, 0.14) *
    greaterThan(f.thumbPinky, 0.85, 0.14) *
    greaterThan(f.indexAboveMcp, 0.45, 0.14),
};

export const LABELS = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  H: "H",
  I: "I",
  J: "J",
  K: "K",
  L: "L",
  M: "M",
  N: "N",
  O: "O",
  P: "P",
  Q: "Q",
  R: "R",
  S: "S",
  T: "T",
  U: "U",
  V: "V",
  W: "W",
  X: "X",
  Y: "Y",
  Z: "Z",
  Hello: "Hello",
  "Thank You": "Thank You",
  Please: "Please",
  Home: "Home",
  Food: "Food",
  Water: "Water",
  Drink: "Drink",
  Bathroom: "Bathroom",
  Yes: "Yes",
  No: "No",
  Unsure: "Unsure",
  Help: "Help",
  Me: "Me",
  You: "You",
  Need: "Need",
  "Please Help Me": "Please Help Me",
  More: "More",
  "I Love You": "I Love You",
};

const LETTERS = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
const PHRASE_IDS = new Set([
  "Hello",
  "Thank You",
  "Please",
  "Home",
  "Food",
  "Water",
  "Drink",
  "Bathroom",
  "No",
  "Unsure",
  "Me",
  "You",
  "Need",
  "I Love You",
]);

const MIN_SCORE = 0.72;
const PHRASE_MIN_SCORE = 0.86;
const MARGIN = 0.08;

let motionHistory = [];
let lastFrameAt = 0;

const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: ((a.z ?? 0) + (b.z ?? 0)) / 2 });
const centroid = (points) => ({
  x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
  y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
  z: points.reduce((sum, p) => sum + (p.z ?? 0), 0) / points.length,
});

function faceScale(face) {
  if (!face?.length) return null;
  const xs = face.map((p) => p.x);
  const ys = face.map((p) => p.y);
  return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 0.08);
}

function bodyScale(pose, face) {
  if (pose?.[POSE.LEFT_SHOULDER] && pose?.[POSE.RIGHT_SHOULDER]) {
    return Math.max(dist(pose[POSE.LEFT_SHOULDER], pose[POSE.RIGHT_SHOULDER]), 0.12);
  }
  return faceScale(face) ?? 0.18;
}

function getContext(context = {}) {
  const face = context.faceLandmarks?.[0] ?? null;
  const pose = context.poseLandmarks?.[0] ?? null;
  const scale = bodyScale(pose, face);

  const mouth =
    face?.[FACE.UPPER_LIP] && face?.[FACE.LOWER_LIP]
      ? midpoint(face[FACE.UPPER_LIP], face[FACE.LOWER_LIP])
      : pose?.[POSE.NOSE] ?? null;
  const chin = face?.[FACE.CHIN] ?? mouth;
  const forehead = face?.[FACE.FOREHEAD] ?? null;
  const cheek =
    face?.[FACE.LEFT_CHEEK] && face?.[FACE.RIGHT_CHEEK]
      ? midpoint(face[FACE.LEFT_CHEEK], face[FACE.RIGHT_CHEEK])
      : mouth;
  const shoulders =
    pose?.[POSE.LEFT_SHOULDER] && pose?.[POSE.RIGHT_SHOULDER]
      ? midpoint(pose[POSE.LEFT_SHOULDER], pose[POSE.RIGHT_SHOULDER])
      : null;
  const hips =
    pose?.[POSE.LEFT_HIP] && pose?.[POSE.RIGHT_HIP]
      ? midpoint(pose[POSE.LEFT_HIP], pose[POSE.RIGHT_HIP])
      : null;
  const chest = shoulders && hips ? midpoint(shoulders, hips) : shoulders;

  return { face, pose, scale, mouth, chin, forehead, cheek, shoulders, chest };
}

function near(a, b, radius, scale) {
  if (!a || !b) return 0;
  return lessThan(dist(a, b) / scale, radius, radius * 0.35);
}

function handFocus(lm) {
  return centroid([lm[THUMB_TIP], lm[INDEX_TIP], lm[MIDDLE_TIP], lm[WRIST]]);
}

function classifyContextualPhrase(handsLandmarks, context) {
  if (!handsLandmarks?.length) return null;
  const ctx = getContext(context);
  const primary = handsLandmarks[0];
  const features = getFeatures(primary);
  const focus = handFocus(primary);

  const atMouth = Math.max(near(focus, ctx.mouth, 1.0, ctx.scale), near(primary[THUMB_TIP], ctx.mouth, 0.85, ctx.scale));
  const atChin = near(focus, ctx.chin, 1.0, ctx.scale);
  const atCheek = near(focus, ctx.cheek, 1.05, ctx.scale);
  const atForehead = near(focus, ctx.forehead, 1.1, ctx.scale);
  const atChest = Math.max(near(primary[WRIST], ctx.chest, 1.15, ctx.scale), near(focus, ctx.chest, 1.35, ctx.scale));

  if (SCORERS.O(features) > 0.74 && atMouth > 0.72) {
    return { sign: "Food", label: LABELS.Food, confidence: 0.88 };
  }

  if (SCORERS.O(features) > 0.74 && atCheek > 0.72 && atCheek > atMouth + 0.08) {
    return { sign: "Home", label: LABELS.Home, confidence: 0.9 };
  }

  if (SCORERS.W(features) > 0.72 && Math.max(atMouth, atChin) > 0.65) {
    return { sign: "Water", label: LABELS.Water, confidence: 0.88 };
  }

  if (SCORERS.C(features) > 0.68 && atMouth > 0.68) {
    return { sign: "Drink", label: LABELS.Drink, confidence: 0.86 };
  }

  if (openPalm(features) > 0.82 && Math.max(atMouth, atChin) > 0.68) {
    return { sign: "Thank You", label: LABELS["Thank You"], confidence: 0.88 };
  }

  if (openPalm(features) > 0.82 && atChest > 0.72) {
    return { sign: "Please", label: LABELS.Please, confidence: 0.86 };
  }

  if (SCORERS.Point(features) > 0.72 && atChest > 0.68) {
    return { sign: "Me", label: LABELS.Me, confidence: 0.88 };
  }

  if (SCORERS.Point(features) > 0.72 && ctx.chest && dist(focus, ctx.chest) / ctx.scale > 1.35) {
    return { sign: "You", label: LABELS.You, confidence: 0.84 };
  }

  if (SCORERS.X(features) > 0.68 && atChest > 0.55) {
    return { sign: "Need", label: LABELS.Need, confidence: 0.84 };
  }

  if (SCORERS.T(features) > 0.7 && Math.max(atChest, atForehead) > 0.45) {
    return { sign: "Bathroom", label: LABELS.Bathroom, confidence: 0.82 };
  }

  return null;
}

function rememberMotion(handsLandmarks, staticSign, context) {
  const now = performance.now();
  if (!handsLandmarks?.length || now - lastFrameAt > 600) motionHistory = [];
  lastFrameAt = now;

  const hand = handsLandmarks?.[0];
  if (!hand) return;
  const ctx = getContext(context);
  motionHistory.push({
    at: now,
    staticSign,
    wrist: hand[WRIST],
    index: hand[INDEX_TIP],
    thumb: hand[THUMB_TIP],
    pinky: hand[PINKY_TIP],
    context: {
      scale: ctx.scale,
      mouth: ctx.mouth,
      chest: ctx.chest,
    },
  });
  motionHistory = motionHistory.filter((p) => now - p.at <= 900).slice(-24);
}

function span(points, axis) {
  let lo = Infinity;
  let hi = -Infinity;
  for (const p of points) {
    lo = Math.min(lo, p[axis]);
    hi = Math.max(hi, p[axis]);
  }
  return hi - lo;
}

function directionReversals(points, axis) {
  let reversals = 0;
  let lastDir = 0;
  for (let i = 1; i < points.length; i += 1) {
    const dir = Math.sign(points[i][axis] - points[i - 1][axis]);
    if (dir && lastDir && dir !== lastDir) reversals += 1;
    if (dir) lastDir = dir;
  }
  return reversals;
}

function classifyMotion() {
  if (motionHistory.length < 6) return null;
  const recent = motionHistory;

  const iFrames = recent.filter((p) => p.staticSign === "I");
  if (iFrames.length >= 5) {
    const first = iFrames[0].pinky;
    const last = iFrames[iFrames.length - 1].pinky;
    const dx = Math.abs(last.x - first.x);
    const dy = last.y - first.y;
    if (dx > 0.035 && dy > 0.045) {
      return { sign: "J", label: LABELS.J, confidence: 0.9 };
    }
  }

  const sFrames = recent.filter((p) => p.staticSign === "S");
  if (sFrames.length >= 6) {
    const wrists = sFrames.map((p) => p.wrist);
    if (span(wrists, "y") > 0.035 && directionReversals(wrists, "y") >= 1) {
      return { sign: "Yes", label: LABELS.Yes, confidence: 0.88 };
    }
  }

  const oFrames = recent.filter((p) => p.staticSign === "O");
  if (oFrames.length >= 6) {
    const thumbs = oFrames.map((p) => p.thumb);
    if (span(thumbs, "x") + span(thumbs, "y") > 0.08) {
      return { sign: "Home", label: LABELS.Home, confidence: 0.86 };
    }
  }

  const openFrames = recent.filter((p) => p.staticSign === "Hello");
  if (openFrames.length >= 7) {
    const wrists = openFrames.map((p) => p.wrist);
    const indexes = openFrames.map((p) => p.index);
    const xSpan = span(indexes, "x");
    const ySpan = span(indexes, "y");
    if (xSpan > 0.08 && ySpan > 0.04 && directionReversals(indexes, "x") >= 1) {
      return { sign: "Please", label: LABELS.Please, confidence: 0.86 };
    }
    if (span(wrists, "y") > 0.07 && directionReversals(wrists, "y") === 0) {
      return { sign: "Thank You", label: LABELS["Thank You"], confidence: 0.86 };
    }
  }

  const pointFrames = recent.filter((p) => p.staticSign === "G" || p.staticSign === "Q" || p.staticSign === "D");
  if (pointFrames.length >= 7) {
    const indexes = pointFrames.map((p) => p.index);
    if (directionReversals(indexes, "x") >= 2 && span(indexes, "x") > 0.08 && span(indexes, "y") > 0.035) {
      return { sign: "Z", label: LABELS.Z, confidence: 0.88 };
    }
  }

  return null;
}

function bestOneHand(landmarks, { phrases = true } = {}) {
  const features = getFeatures(landmarks);
  let best = { sign: null, score: 0 };
  let runnerUp = 0;

  for (const [sign, scorer] of Object.entries(SCORERS)) {
    if (sign === "Point") continue;
    if (!phrases && !LETTERS.has(sign)) continue;

    const score = scorer(features);
    const minScore = PHRASE_IDS.has(sign) ? PHRASE_MIN_SCORE : MIN_SCORE;
    if (score < minScore) continue;

    if (score > best.score) {
      runnerUp = best.score;
      best = { sign, score };
    } else if (score > runnerUp) {
      runnerUp = score;
    }
  }

  if (!best.sign) return null;
  if (best.score - runnerUp < MARGIN) return null;
  return {
    sign: best.sign,
    label: LABELS[best.sign] ?? best.sign,
    confidence: best.score,
  };
}

export function classifyHand(landmarks, options) {
  if (!landmarks || landmarks.length < 21) return null;
  return bestOneHand(landmarks, options);
}

function classifyTwoHand(handsLandmarks) {
  if (!handsLandmarks || handsLandmarks.length < 2) return null;
  const [a, b] = handsLandmarks;
  const fa = getFeatures(a);
  const fb = getFeatures(b);
  const sharedScale = (fa.scale + fb.scale) / 2;

  const d = (ai, bi) => dist(a[ai], b[bi]) / sharedScale;
  const wristsDist = d(WRIST, WRIST);
  const indexDist = d(INDEX_TIP, INDEX_TIP);
  const thumbDist = d(THUMB_TIP, THUMB_TIP);
  const wristHeightGap = Math.abs(a[WRIST].y - b[WRIST].y) / sharedScale;

  const bothOpen = openPalm(fa) > 0.86 && openPalm(fb) > 0.86;
  const bothFist = closedFist(fa) > 0.82 && closedFist(fb) > 0.82;
  const oneFistOneOpen = (closedFist(fa) > 0.82 && openPalm(fb) > 0.82) || (closedFist(fb) > 0.82 && openPalm(fa) > 0.82);

  const bothL =
    SCORERS.L(fa) > 0.78 &&
    SCORERS.L(fb) > 0.78 &&
    thumbDist < 0.75 &&
    indexDist < 1.35 &&
    wristsDist > 0.75;
  if (bothL) return { sign: "I Love You", label: LABELS["I Love You"], confidence: 0.92 };

  if (bothFist && indexDist < 0.6) {
    return { sign: "More", label: LABELS.More, confidence: 0.88 };
  }

  if (oneFistOneOpen && wristsDist < 2.4) {
    return { sign: "Help", label: LABELS.Help, confidence: 0.88 };
  }

  if (bothOpen && wristHeightGap > 0.45 && wristsDist < 2.8) {
    return { sign: "Unsure", label: LABELS.Unsure, confidence: 0.86 };
  }

  if (bothOpen && wristsDist > 0.8 && wristsDist < 2.6) {
    return { sign: "Please Help Me", label: LABELS["Please Help Me"], confidence: 0.86 };
  }

  return null;
}

export function classifyFrame(handsLandmarks, context = {}) {
  if (!handsLandmarks || handsLandmarks.length === 0) {
    rememberMotion([], null);
    return null;
  }

  const contextual = classifyContextualPhrase(handsLandmarks, context);
  if (contextual) {
    rememberMotion(handsLandmarks, contextual.sign, context);
    return contextual;
  }

  if (handsLandmarks.length >= 2) {
    const two = classifyTwoHand(handsLandmarks);
    if (two) {
      rememberMotion(handsLandmarks, two.sign, context);
      return two;
    }
  }

  const staticPrediction = classifyHand(handsLandmarks[0]);
  rememberMotion(handsLandmarks, staticPrediction?.sign ?? null, context);
  const motionPrediction = classifyMotion();
  return motionPrediction ?? staticPrediction;
}

export function resetClassifierState() {
  motionHistory = [];
  lastFrameAt = 0;
}
