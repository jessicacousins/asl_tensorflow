/**
 * Stability buffer — turns a noisy stream of per-frame predictions into a
 * stream of confident "committed" signs. A sign is committed only when it
 * has been the dominant prediction in the recent window AND the user has
 * either changed signs or briefly dropped their hand since the last commit.
 *
 * This avoids spamming the script with the same letter dozens of times
 * while the user is just holding their hand still.
 */
export function createStabilityBuffer({
  windowSize = 12,
  requiredMatches = 8,
  resetGapMs = 700,
} = {}) {
  /** @type {string[]} */
  const buf = [];
  let lastCommitted = null;
  let lastCommittedAt = 0;
  let lastSeen = 0; // last time we saw any sign (not null)

  function push(sign) {
    const now = performance.now();
    if (sign) lastSeen = now;
    buf.push(sign ?? "__none__");
    if (buf.length > windowSize) buf.shift();
  }

  function dominant() {
    const counts = new Map();
    for (const s of buf) counts.set(s, (counts.get(s) ?? 0) + 1);
    let best = null;
    let bestCount = 0;
    for (const [s, c] of counts) {
      if (s === "__none__") continue;
      if (c > bestCount) {
        best = s;
        bestCount = c;
      }
    }
    return { sign: best, count: bestCount };
  }

  /**
   * Push the latest prediction and return either a newly-committed sign
   * (a string) or null if nothing should be committed this frame.
   */
  function tick(sign) {
    push(sign);
    const { sign: top, count } = dominant();
    if (!top || count < requiredMatches) return null;

    const now = performance.now();
    const sinceLastCommit = now - lastCommittedAt;

    // Same sign as last commit — only re-commit after a clear gap (the user
    // either signed something else or dropped their hand) so the script
    // doesn't fill with repeats while they hold the pose.
    if (top === lastCommitted) {
      const noneFraction =
        buf.filter((s) => s === "__none__").length / buf.length;
      if (noneFraction < 0.4 && sinceLastCommit < 1500) return null;
    }

    lastCommitted = top;
    lastCommittedAt = now;
    return top;
  }

  function reset() {
    buf.length = 0;
    lastCommitted = null;
    lastCommittedAt = 0;
    lastSeen = 0;
  }

  function preview() {
    return dominant();
  }

  return { tick, reset, preview };
}
