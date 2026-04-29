// Catalogue of every sign the classifier can recognise, plus a friendly
// description for the Practice and Learn modes.

export const SIGN_LIBRARY = [
  // ── Phrases ───────────────────────────────────────────────────
  {
    sign: "Hello",
    category: "Phrase",
    emoji: "👋",
    description: "Open hand, fingers spread, palm facing the camera.",
    example: "Greet someone at the start of a conversation.",
  },
  {
    sign: "I Love You",
    category: "Phrase",
    emoji: "🤟",
    description:
      "Thumb, index, and pinky extended. Middle and ring fingers tucked into the palm.",
    example: "A heartfelt sign that combines I, L, and Y.",
  },

  // ── Letters (static handshapes) ───────────────────────────────
  {
    sign: "A",
    category: "Letter",
    emoji: "🅰️",
    description: "Closed fist with the thumb resting along the side of the index finger.",
    example: "Used at the start of words like APPLE.",
  },
  {
    sign: "B",
    category: "Letter",
    emoji: "🅱️",
    description: "All four fingers extended straight up, thumb folded across the palm.",
    example: "Used in words like BOY, BLUE.",
  },
  {
    sign: "C",
    category: "Letter",
    emoji: "🇨",
    description: "Fingers and thumb curved into the shape of the letter C.",
    example: "Used in words like CAT, CAR.",
  },
  {
    sign: "D",
    category: "Letter",
    emoji: "🇩",
    description: "Index finger pointing up; thumb meets the middle finger to form an O underneath.",
    example: "Used in words like DOG, DAY.",
  },
  {
    sign: "E",
    category: "Letter",
    emoji: "🇪",
    description: "Fingers curled tightly into the palm with the thumb tucked across.",
    example: "Used in words like EGG, EAT.",
  },
  {
    sign: "F",
    category: "Letter",
    emoji: "🇫",
    description: "Thumb and index touch to form a circle; middle, ring, and pinky stand up.",
    example: "Used in words like FINE, FRIEND.",
  },
  {
    sign: "I",
    category: "Letter",
    emoji: "🇮",
    description: "Pinky extended upward; the other fingers and thumb are folded down.",
    example: "Used in words like ICE.",
  },
  {
    sign: "L",
    category: "Letter",
    emoji: "🇱",
    description: "Thumb and index extended at a right angle, like a capital L.",
    example: "Used in words like LOVE, LATER.",
  },
  {
    sign: "O",
    category: "Letter",
    emoji: "🇴",
    description: "All fingertips meet the thumb, forming a round O.",
    example: "Used in words like OCEAN, OK.",
  },
  {
    sign: "R",
    category: "Letter",
    emoji: "🇷",
    description: "Index and middle fingers crossed and pointing up; others tucked.",
    example: "Used in words like RAIN, RED.",
  },
  {
    sign: "U",
    category: "Letter",
    emoji: "🇺",
    description: "Index and middle fingers extended together, others folded.",
    example: "Used in words like UNDER, UP.",
  },
  {
    sign: "V",
    category: "Letter",
    emoji: "✌️",
    description: "Index and middle fingers spread into a V (peace sign), others folded.",
    example: "Also reads as the digit 2.",
  },
  {
    sign: "W",
    category: "Letter",
    emoji: "🇼",
    description: "Index, middle, and ring fingers extended; thumb and pinky tucked.",
    example: "Also reads as the digit 3 (3-finger style).",
  },
  {
    sign: "Y",
    category: "Letter",
    emoji: "🤙",
    description: "Thumb and pinky extended (the 'hang loose' shape); middle three folded.",
    example: "Used in words like YES, YELLOW.",
  },

  // ── Numbers ───────────────────────────────────────────────────
  {
    sign: "1",
    category: "Number",
    emoji: "1️⃣",
    description: "Index finger pointed up; the rest of the hand is closed.",
    example: "Same as the letter D without the thumb-touch.",
  },
  {
    sign: "3",
    category: "Number",
    emoji: "3️⃣",
    description: "Thumb, index, and middle fingers extended; ring and pinky folded.",
    example: "ASL number 3.",
  },
  {
    sign: "5",
    category: "Number",
    emoji: "5️⃣",
    description: "All five fingers extended and held close together.",
    example: "Hold the open hand still — wave it side-to-side for Hello.",
  },
];

export const SIGN_BY_KEY = SIGN_LIBRARY.reduce((acc, s) => {
  acc[s.sign] = s;
  return acc;
}, {});
