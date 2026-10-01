import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMic, FiGlobe, FiVolume2, FiVolumeX, FiSquare } from "react-icons/fi";
import { GiPlantRoots } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import { sendChatMessage } from "../services/mockApi";
import { useVoice, VOICE_LANGUAGES } from "../hooks/useVoice";
import { useUI } from "../context/UIContext";
import "./AiAssistant.css";

const suggestedQuestions = [
  "When should I irrigate my wheat crop?",
  "What's the best fertilizer for tomatoes?",
  "Current mandi price for rice?",
  "How do I treat powdery mildew?",
  "Will it rain this week?",
];

const initialMessages = [
  {
    id: "m0",
    role: "ai",
    text: "Namaste! I'm your AI Farm Assistant. Ask me about crop care, irrigation, pest control, or mandi prices — by typing or speaking, in your preferred language.",
  },
];

export default function AiAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [langCode, setLangCode] = useState("en-IN");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const scrollRef = useRef(null);
  const { pushToast } = useUI();
  const { listening, speaking, supported, startListening, stopListening, speak, stopSpeaking } = useVoice(langCode);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function send(text) {
    const value = text ?? input;
    if (!value.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: value }]);
    setInput("");
    setTyping(true);
    const { data } = await sendChatMessage(value);
    setTyping(false);
    setMessages((m) => [...m, { id: Date.now() + 1, role: "ai", text: data.reply }]);
    if (autoSpeak) speak(data.reply);
  }

  function handleMicClick() {
    if (listening) {
      stopListening();
      return;
    }
    startListening(
      (transcript) => send(transcript),
      (errorMsg) => pushToast(errorMsg, "warning")
    );
  }

  const currentLang = VOICE_LANGUAGES.find((l) => l.code === langCode);

  return (
    <div>
      <PageHeading
        eyebrow="Module 03"
        title="AI Farm Assistant"
        subtitle="Your always-on voice advisor for crop care, irrigation timing, weather, and market questions — ask in your own language."
        action={
          <div className="d-flex gap-2 position-relative">
            <button
              className={`btn-agri btn-agri-sm ${autoSpeak ? "btn-agri-primary" : "btn-agri-outline"}`}
              onClick={() => setAutoSpeak((s) => !s)}
              title="Toggle spoken replies"
            >
              {autoSpeak ? <FiVolume2 /> : <FiVolumeX />} Voice replies
            </button>
            <button className="btn-agri btn-agri-outline btn-agri-sm" onClick={() => setLangMenuOpen((o) => !o)}>
              <FiGlobe /> {currentLang.label}
            </button>
            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  className="dropdown-panel"
                  style={{ top: "calc(100% + 8px)" }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {VOICE_LANGUAGES.map((l) => (
                    <button key={l.code} onClick={() => { setLangCode(l.code); setLangMenuOpen(false); }}>
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />

      {!supported && (
        <GlassCard className="p-3 mb-3" hoverable={false} style={{ borderColor: "rgba(245,185,66,0.4)" }}>
          <span style={{ fontSize: "0.86rem", color: "#a86b0a", fontWeight: 600 }}>
            Voice input/output isn't supported in this browser — text chat still works fully. Try Chrome or Edge for voice.
          </span>
        </GlassCard>
      )}

      <GlassCard className="p-3 p-md-4" hoverable={false}>
        <div className="chat-shell">
          <div className="chat-scroll" ref={scrollRef}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                className={`chat-bubble-row ${m.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="chat-avatar" style={{ background: m.role === "ai" ? "var(--gradient-primary)" : "var(--color-earth)" }}>
                  {m.role === "ai" ? <GiPlantRoots /> : "You"}
                </div>
                <div className={`chat-bubble ${m.role}`}>
                  {m.text}
                  {m.role === "ai" && supported && (
                    <button
                      className="btn-agri btn-agri-icon btn-agri-sm"
                      style={{ width: 24, height: 24, marginLeft: 8, verticalAlign: "middle", background: "transparent", border: "none" }}
                      onClick={() => speak(m.text)}
                      title="Play voice reply"
                    >
                      <FiVolume2 size={13} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {typing && (
              <motion.div className="chat-bubble-row ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="chat-avatar" style={{ background: "var(--gradient-primary)" }}><GiPlantRoots /></div>
                <div className="chat-bubble ai">
                  <div className="typing-dots"><span /><span /><span /></div>
                </div>
              </motion.div>
            )}
          </div>

          {messages.length < 3 && (
            <div className="chat-suggestions">
              {suggestedQuestions.map((q) => (
                <button key={q} className="chip" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          {speaking && (
            <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.8rem", color: "var(--color-primary)" }}>
              <FiVolume2 /> Speaking…
              <button className="btn-agri btn-agri-ghost btn-agri-sm" onClick={stopSpeaking}><FiSquare size={11} /> Stop</button>
            </div>
          )}

          <div className="chat-input-bar">
            <button
              className="topnav-icon-btn"
              style={listening ? { background: "var(--gradient-primary)", color: "#fff", borderColor: "transparent" } : undefined}
              title={listening ? "Listening… tap to stop" : "Ask by voice"}
              onClick={handleMicClick}
            >
              {listening ? (
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ display: "flex" }}>
                  <FiMic size={16} />
                </motion.span>
              ) : (
                <FiMic size={16} />
              )}
            </button>
            <input
              placeholder={listening ? "Listening…" : "Ask about crops, pests, weather, prices…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="btn-agri btn-agri-primary btn-agri-icon" onClick={() => send()} aria-label="Send">
              <FiSend size={16} />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
