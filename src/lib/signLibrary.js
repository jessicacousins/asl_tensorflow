// Catalogue of every sign id returned by aslClassifier.js.

const letterDescriptions = {
  A: "Closed fist with the thumb resting along the side of the index finger.",
  B: "Four fingers extended together, thumb folded across the palm.",
  C: "Fingers and thumb curved into a C shape.",
  D: "Index finger up, thumb touching the middle finger underneath.",
  E: "Fingers curled down with the thumb tucked across the front.",
  F: "Thumb and index touch in a circle; middle, ring, and pinky up.",
  G: "Index finger and thumb extended sideways; other fingers tucked.",
  H: "Index and middle fingers extended together sideways.",
  I: "Pinky extended upward; other fingers and thumb tucked.",
  J: "Start with I and draw a small J motion with the pinky.",
  K: "Index and middle fingers up and parted, thumb between them.",
  L: "Thumb and index extended at a right angle.",
  M: "Fist with the thumb tucked under three fingers.",
  N: "Fist with the thumb tucked under two fingers.",
  O: "Fingertips and thumb meet in a round O shape.",
  P: "K handshape angled downward.",
  Q: "G handshape angled downward.",
  R: "Index and middle fingers crossed.",
  S: "Closed fist with the thumb across the front.",
  T: "Fist with the thumb tucked between index and middle fingers.",
  U: "Index and middle fingers extended together upward.",
  V: "Index and middle fingers extended upward and spread apart.",
  W: "Index, middle, and ring fingers extended and spread.",
  X: "Index finger bent like a hook; other fingers tucked.",
  Y: "Thumb and pinky extended; middle three fingers tucked.",
  Z: "Point with the index finger and draw a Z motion.",
};

const LETTERS = Object.entries(letterDescriptions).map(([sign, description]) => ({
  sign,
  category: "Letter",
  emoji: sign,
  description,
  example: `Fingerspell words that include ${sign}.`,
}));

const PHRASES = [
  {
    sign: "Hello",
    category: "Phrase",
    emoji: "Hi",
    description: "Open palm facing forward with all fingers extended.",
    example: "Start a conversation.",
  },
  {
    sign: "Thank You",
    category: "Phrase",
    emoji: "TY",
    description: "Open hand shape. In real ASL it moves outward from the chin; this app recognises the handshape.",
    example: "Show appreciation.",
  },
  {
    sign: "Please",
    category: "Phrase",
    emoji: "PLS",
    description: "Open palm shape. In real ASL it moves in a circle on the chest; this app recognises the handshape.",
    example: "Make a polite request.",
  },
  {
    sign: "Home",
    category: "Phrase",
    emoji: "Home",
    description: "O handshape. In real ASL it touches near the mouth and cheek; this app recognises the handshape.",
    example: "Say you need to go home.",
  },
  {
    sign: "Yes",
    category: "Phrase",
    emoji: "Yes",
    description: "Closed fist. In real ASL the fist nods; this app recognises the fist shape.",
    example: "Answer yes.",
  },
  {
    sign: "No",
    category: "Phrase",
    emoji: "No",
    description: "Index and middle fingers extended with thumb near them, like a closing beak.",
    example: "Answer no.",
  },
  {
    sign: "Unsure",
    category: "Phrase",
    emoji: "?",
    description: "Open hand with thumb relaxed. This is an approximate everyday communication shortcut.",
    example: "Say you are unsure.",
  },
  {
    sign: "Help",
    category: "Phrase",
    emoji: "Help",
    description: "One closed fist with the other hand open underneath.",
    example: "Ask for help.",
  },
  {
    sign: "Please Help Me",
    category: "Phrase",
    emoji: "Help",
    description: "Two open hands held in frame. This app treats it as an emergency shortcut phrase.",
    example: "Ask someone nearby for help quickly.",
  },
  {
    sign: "More",
    category: "Phrase",
    emoji: "More",
    description: "Both hands curled, fingertips meeting in front of you.",
    example: "Ask for more of something.",
  },
  {
    sign: "I Love You",
    category: "Phrase",
    emoji: "ILY",
    description: "Thumb, index, and pinky extended; middle and ring tucked.",
    example: "A heartfelt one-hand phrase.",
  },
];

export const SIGN_LIBRARY = [...PHRASES, ...LETTERS];

export const SIGN_BY_KEY = SIGN_LIBRARY.reduce((acc, s) => {
  acc[s.sign] = s;
  return acc;
}, {});
