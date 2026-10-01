import { useState, useRef, useCallback, useEffect } from "react";

// Maps our short language labels to BCP-47 codes understood by the
// browser's SpeechRecognition / SpeechSynthesis APIs.
export const VOICE_LANGUAGES = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "हिंदी (Hindi)" },
  { code: "bn-IN", label: "বাংলা (Bengali)" },
  { code: "mr-IN", label: "मराठी (Marathi)" },
  { code: "ta-IN", label: "தமிழ் (Tamil)" },
  { code: "te-IN", label: "తెలుగు (Telugu)" },
];

export function useVoice(langCode) {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis) {
      setSupported(false);
    }
  }, []);

  const startListening = useCallback(
    (onResult, onError) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        onError?.("Voice input isn't supported in this browser. Try Chrome or Edge.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = langCode;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = (e) => {
        setListening(false);
        onError?.(e.error === "not-allowed" ? "Microphone access was blocked." : "Couldn't hear that — please try again.");
      };
      recognition.onresult = (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript;
        if (transcript) onResult(transcript);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        onError?.("Voice input could not start.");
      }
    },
    [langCode]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const speak = useCallback(
    (text) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.98;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [langCode]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { listening, speaking, supported, startListening, stopListening, speak, stopSpeaking };
}
