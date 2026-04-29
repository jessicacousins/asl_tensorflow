import {
  WRIST,
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

// All math here works on MediaPipe HandLandmarker landmarks: arrays of
// 21 objects with normalized {x, y, z} in the [0,1] range. Because the values
// are normalized we can use the same thresholds across any camera resolution.

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Hand "scale" — distance from the wrist to the middle-finger MCP. Used to
// turn raw distances into ratios that don't depend on how close the hand is
// to the camera.
const handScale = (lm) => dist(lm[WRIST], lm[MIDDLE_MCP]) || 1e-6;

// A finger is "extended" when the angle at its PIP joint is close to 180°.
// The cosine of that angle is the dot product of the vectors PIP->MCP and
// PIP->TIP, divided by their magnitudes. cos ≈ -1 means straight, cos ≈ 1
// means fully bent. This works regardless of hand orientation.
function angleCos(lm, mcp, pip, tip) {
  const ax = lm[mcp].x - lm[pip].x;
  const ay = lm[mcp].y - lm[pip].y;
  const bx = lm[tip].x - lm[pip].x;
  const by = lm[tip].y - lm[pip].y;
  const mag = Math.hypot(ax, ay) * Math.hypot(bx, by);
  if (mag < 1e-9) return 1;
  return (ax * bx + ay * by) / mag;
}

const isExtended = (lm, mcp, pip, tip) => angleCos(lm, mcp, pip, tip) < -0.55;

// The thumb bends sideways rather than curling, so we need slightly looser
// criteria and we measure the angle at the IP joint.
function thumbExtended(lm) {
  const c = angleCos(lm, THUMB_MCP, THUMB_IP, THUMB_TIP);
  return c < -0.4;
}

// Snapshot of which fingers are currently up.
function fingersState(lm) {
  return {
    thumb: thumbExtended(lm),
    index: isExtended(lm, INDEX_MCP, INDEX_PIP, INDEX_TIP),
    middle: isExtended(lm, MIDDLE_MCP, MIDDLE_PIP, MIDDLE_TIP),
    ring: isExtended(lm, RING_MCP, RING_PIP, RING_TIP),
    pinky: isExtended(lm, PINKY_MCP, PINKY_PIP, PINKY_TIP),
  };
}

const countUp = (f) =>
  Number(f.thumb) +
  Number(f.index) +
  Number(f.middle) +
  Number(f.ring) +
  Number(f.pinky);

/**
 * Classify a single hand into an ASL letter or common phrase.
 * Returns { sign, label, confidence } or null when no confident match.
 *
 * Recognises the static handshapes of the ASL alphabet (A B C D E F I L O R U V W Y),
 * the digits 1-5, and the popular "I Love You" combined sign. Letters that
 * require motion (J, Z) or that look identical to other letters from a single
 * frame (M, N, S, T, X) are intentionally omitted to avoid false positives.
 */
export function classifyHand(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  const lm = landmarks;
  const f = fingersState(lm);
  const scale = handScale(lm);
  const up = countUp(f);

  // Convenience normalised distances
  const d = (a, b) => dist(lm[a], lm[b]) / scale;
  const thumbIndex = d(THUMB_TIP, INDEX_TIP);
  const thumbMiddle = d(THUMB_TIP, MIDDLE_TIP);
  const indexMiddleSpread = d(INDEX_TIP, MIDDLE_TIP);
  const middleRingSpread = d(MIDDLE_TIP, RING_TIP);

  // ───── COMBINED / PHRASE SIGNS (most specific first) ────────────────────

  // I Love You — thumb + index + pinky out, middle + ring tucked
  if (f.thumb && f.index && !f.middle && !f.ring && f.pinky) {
    return { sign: "I Love You", label: "I Love You ❤️", confidence: 0.92 };
  }

  // ───── FIVE FINGERS UP ──────────────────────────────────────────────────

  if (up === 5) {
    // Hello / open wave when fingers are spread; a tight palm reads as B/5
    if (indexMiddleSpread > 0.45) {
      return { sign: "Hello", label: "Hello / 5", confidence: 0.9 };
    }
    return { sign: "5", label: "5 / Open Hand", confidence: 0.85 };
  }

  // ───── FOUR FINGERS UP ──────────────────────────────────────────────────

  // B — four fingers up together, thumb folded across the palm
  if (!f.thumb && f.index && f.middle && f.ring && f.pinky) {
    return { sign: "B", label: "B / 4", confidence: 0.9 };
  }

  // F — index curls down to touch the thumb, the other three fingers stay up
  if (f.thumb && !f.index && f.middle && f.ring && f.pinky && thumbIndex < 0.55) {
    return { sign: "F", label: "F", confidence: 0.85 };
  }

  // ───── THREE FINGERS UP ─────────────────────────────────────────────────

  // W — index, middle, ring up; thumb and pinky tucked
  if (!f.thumb && f.index && f.middle && f.ring && !f.pinky) {
    return { sign: "W", label: "W / 3", confidence: 0.88 };
  }

  // 3 (alternative) — thumb, index, middle up
  if (f.thumb && f.index && f.middle && !f.ring && !f.pinky) {
    if (thumbIndex > 0.6) {
      return { sign: "3", label: "3", confidence: 0.78 };
    }
  }

  // ───── TWO FINGERS UP ───────────────────────────────────────────────────

  // V vs U — both have index + middle up, thumb folded. V is spread, U is together.
  if (!f.thumb && f.index && f.middle && !f.ring && !f.pinky) {
    if (indexMiddleSpread > 0.45) {
      return { sign: "V", label: "V / 2 / Peace", confidence: 0.88 };
    }
    return { sign: "U", label: "U", confidence: 0.82 };
  }

  // L — thumb + index extended at right angle, others curled
  if (f.thumb && f.index && !f.middle && !f.ring && !f.pinky) {
    if (thumbIndex > 0.9) {
      return { sign: "L", label: "L", confidence: 0.88 };
    }
  }

  // Y — thumb + pinky out (the "hang loose" / call-me handshape)
  if (f.thumb && !f.index && !f.middle && !f.ring && f.pinky) {
    return { sign: "Y", label: "Y", confidence: 0.88 };
  }

  // R — index and middle crossed (very close together, both extended)
  if (!f.thumb && f.index && f.middle && !f.ring && !f.pinky && indexMiddleSpread < 0.12) {
    return { sign: "R", label: "R", confidence: 0.7 };
  }

  // ───── ONE FINGER UP ────────────────────────────────────────────────────

  // D — index up, thumb meets middle finger, others curled
  if (!f.thumb && f.index && !f.middle && !f.ring && !f.pinky) {
    if (thumbMiddle < 0.6) {
      return { sign: "D", label: "D", confidence: 0.82 };
    }
    return { sign: "1", label: "1 / Point", confidence: 0.82 };
  }

  // I — only the pinky is extended
  if (!f.thumb && !f.index && !f.middle && !f.ring && f.pinky) {
    return { sign: "I", label: "I", confidence: 0.88 };
  }

  // ───── NO FINGERS / FIST FAMILY ─────────────────────────────────────────

  if (up === 0 || (up === 1 && f.thumb)) {
    // O — fingers curled into a circle, thumb tip meets index tip
    if (thumbIndex < 0.45 && thumbMiddle < 0.7) {
      return { sign: "O", label: "O", confidence: 0.8 };
    }
    // A — closed fist, thumb resting against the side of the index
    if (f.thumb) {
      return { sign: "A", label: "A / Yes", confidence: 0.78 };
    }
    // E — fully closed fist, thumb tucked across
    return { sign: "E", label: "E / Fist", confidence: 0.72 };
  }

  // ───── C SHAPE — partial curl ───────────────────────────────────────────

  // The C handshape isn't fully open or fully closed: fingers are curved with
  // the thumb mirroring them on the other side of an open arc. Our extension
  // test reports them as "not extended" because the angle is bent ~90°, but
  // the fingertips remain far from the palm.
  const indexCurl = d(INDEX_TIP, INDEX_MCP);
  const middleCurl = d(MIDDLE_TIP, MIDDLE_MCP);
  if (
    f.thumb &&
    !f.index &&
    !f.middle &&
    indexCurl > 0.6 &&
    middleCurl > 0.6 &&
    thumbIndex > 0.6 &&
    thumbIndex < 1.4
  ) {
    return { sign: "C", label: "C", confidence: 0.7 };
  }

  return null;
}

// Exposed for debug overlays / Practice mode hints.
export { fingersState, countUp };
