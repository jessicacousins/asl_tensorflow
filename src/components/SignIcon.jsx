import "./SignIcon.css";

const LETTERS = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));

const MODE_ICONS = {
  translate: "translate",
  practice: "practice",
  learn: "learn",
  brand: "brand",
  camera: "camera",
  speak: "speak",
  backspace: "backspace",
  check: "check",
  sun: "sun",
  moon: "moon",
};

export default function SignIcon({ sign, type, size = "md", className = "" }) {
  const iconType = type ?? iconTypeForSign(sign);
  const label = sign ?? iconType;

  return (
    <span className={`sign-icon sign-icon-${size} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img" focusable="false">
        <title>{label}</title>
        <IconGlyph type={iconType} label={label} />
      </svg>
    </span>
  );
}

function iconTypeForSign(sign = "") {
  if (LETTERS.has(sign)) return "letter";
  const key = sign.toLowerCase().replaceAll(" ", "-");
  if (key.includes("water") || key.includes("drink")) return "water";
  if (key.includes("food") || key.includes("home")) return "mouth";
  if (key.includes("help") || key.includes("more")) return "two-hand";
  if (key.includes("love")) return "love";
  if (key.includes("yes") || key.includes("no")) return "reply";
  if (key.includes("me") || key.includes("you") || key.includes("need")) return "body";
  if (key.includes("bathroom")) return "location";
  if (key.includes("please") || key.includes("thank")) return "open-hand";
  if (key.includes("hello") || key.includes("unsure")) return "open-hand";
  return "sign";
}

function IconGlyph({ type, label }) {
  if (MODE_ICONS[type]) return <UtilityGlyph type={type} />;
  if (type === "letter") {
    return (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <text className="icon-letter" x="32" y="40" textAnchor="middle">
          {label}
        </text>
        <path className="icon-sweep" d="M18 47c8 5 20 5 28 0" />
      </>
    );
  }

  const glyphs = {
    "open-hand": (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line icon-pulse" d="M22 41V23m7 18V17m7 24V18m7 23V23" />
        <path className="icon-line" d="M18 37c4 10 23 14 31 2 2-3 1-8-3-10" />
      </>
    ),
    "two-hand": (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line icon-float-left" d="M18 38c4-8 10-11 17-8v14c-7 3-13 1-17-6Z" />
        <path className="icon-line icon-float-right" d="M46 38c-4-8-10-11-17-8v14c7 3 13 1 17-6Z" />
      </>
    ),
    mouth: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M21 25c7-6 15-6 22 0" />
        <path className="icon-line" d="M20 34c8 7 16 7 24 0" />
        <circle className="icon-dot icon-pulse" cx="46" cy="31" r="4" />
      </>
    ),
    water: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line icon-wave" d="M18 40c5-5 9 5 14 0s9 5 14 0" />
        <path className="icon-line" d="M25 22h14m-12 0 4 13m4-13-4 13m10-13-7 13" />
      </>
    ),
    body: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <circle className="icon-line" cx="32" cy="18" r="5" />
        <path className="icon-line" d="M32 24v19m-13-9h26m-18 9h10" />
        <path className="icon-sweep icon-pulse" d="M21 48c6 4 16 4 22 0" />
      </>
    ),
    location: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M22 30 32 19l10 11v15H22V30Z" />
        <path className="icon-line icon-pulse" d="M29 45V34h6v11" />
      </>
    ),
    love: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-fill icon-pulse" d="M32 47 20 35c-7-8 4-19 12-9 8-10 19 1 12 9L32 47Z" />
      </>
    ),
    reply: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M18 32h21" />
        <path className="icon-line icon-swing" d="m31 22 10 10-10 10" />
      </>
    ),
    sign: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M21 41c5 5 17 6 22-1 4-6 1-15-7-17" />
        <path className="icon-line icon-pulse" d="M25 37V22m7 18V18m7 18V22" />
      </>
    ),
  };

  return glyphs[type] ?? glyphs.sign;
}

function UtilityGlyph({ type }) {
  const glyphs = {
    brand: (
      <>
        <defs>
          <linearGradient id="jcLogoGradient" x1="10" y1="10" x2="54" y2="54">
            <stop offset="0%" stopColor="var(--accent-alt)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <rect className="jc-logo-bg" x="8" y="8" width="48" height="48" rx="14" />
        <circle className="jc-logo-ring" cx="32" cy="32" r="18" />
        <text className="jc-logo-text" x="32" y="40" textAnchor="middle">
          JC
        </text>
      </>
    ),
    translate: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M17 24h22v16H27l-7 6v-6h-3V24Z" />
        <path className="icon-line icon-wave" d="M42 29h5m-5 7h8" />
      </>
    ),
    practice: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <circle className="icon-line" cx="32" cy="32" r="14" />
        <circle className="icon-dot icon-pulse" cx="32" cy="32" r="4" />
      </>
    ),
    learn: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M20 20h17c4 0 7 3 7 7v17H27c-4 0-7-3-7-7V20Z" />
        <path className="icon-line icon-pulse" d="M27 29h10m-10 7h8" />
      </>
    ),
    camera: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M18 25h9l3-4h8l3 4h5v18H18V25Z" />
        <circle className="icon-line icon-pulse" cx="32" cy="34" r="7" />
      </>
    ),
    speak: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M19 36h7l9 8V20l-9 8h-7v8Z" />
        <path className="icon-line icon-wave" d="M41 27c3 3 3 7 0 10m5-15c6 6 6 14 0 20" />
      </>
    ),
    backspace: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line" d="M18 32 28 22h19v20H28L18 32Z" />
        <path className="icon-line icon-swing" d="m34 27 7 10m0-10-7 10" />
      </>
    ),
    check: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-line icon-pulse" d="m20 33 8 8 17-19" />
      </>
    ),
    sun: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <circle className="icon-line icon-pulse" cx="32" cy="32" r="8" />
        <path className="icon-line" d="M32 13v6m0 26v6m19-19h-6m-26 0h-6m32-13-4 4M23 41l-4 4m26 0-4-4M23 23l-4-4" />
      </>
    ),
    moon: (
      <>
        <circle className="icon-bg" cx="32" cy="32" r="26" />
        <path className="icon-fill icon-pulse" d="M42 42c-13 2-23-8-20-20 4 7 12 12 21 10-1 4-1 7-1 10Z" />
      </>
    ),
  };

  return glyphs[type];
}
