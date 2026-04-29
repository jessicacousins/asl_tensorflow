import { useCallback, useEffect, useState } from "react";

/**
 * Tiny wrapper around the browser's Web Speech API. Lets the user hear
 * the script the camera has translated, which is the whole point of
 * giving someone who doesn't sign a way to "listen" to the conversation.
 */
export function useSpeech() {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!supported) return undefined;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported]);

  const speak = useCallback(
    (text) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const englishVoice =
        voices.find((v) => v.lang?.startsWith("en") && v.default) ||
        voices.find((v) => v.lang?.startsWith("en")) ||
        voices[0];
      if (englishVoice) utterance.voice = englishVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [supported, voices],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { supported, speak, stop, speaking };
}
