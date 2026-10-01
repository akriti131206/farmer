import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";

export default function Register() {
  const { register, loading } = useAuth();
  const { pushToast } = useUI();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await register(name || "New Farmer", email || "farmer@agrisense.ai");
    pushToast("Account created — welcome to AgriSense AI!");
    navigate("/dashboard");
  }

  return (
    <motion.div
      className="auth-form-box"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Create your account</h3>
      <p className="sub">Set up your farm profile in under a minute.</p>

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label">Full name</label>
          <div style={{ position: "relative" }}>
            <FiUser style={{ position: "absolute", left: 14, top: 14, color: "var(--text-muted)" }} />
            <input
              className="field-input"
              style={{ paddingLeft: 40 }}
              placeholder="Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Email address</label>
          <div style={{ position: "relative" }}>
            <FiMail style={{ position: "absolute", left: 14, top: 14, color: "var(--text-muted)" }} />
            <input
              type="email"
              className="field-input"
              style={{ paddingLeft: 40 }}
              placeholder="you@farmmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Password</label>
          <div style={{ position: "relative" }}>
            <FiLock style={{ position: "absolute", left: 14, top: 14, color: "var(--text-muted)" }} />
            <input type="password" className="field-input" style={{ paddingLeft: 40 }} placeholder="Create a password" />
          </div>
        </div>

        <button type="submit" className="btn-agri btn-agri-primary w-100 justify-content-center" disabled={loading}>
          {loading ? "Creating account…" : "Create account"} <FiArrowRight />
        </button>
      </form>

      <div className="auth-divider">or sign up with</div>
      <div className="social-btn-row">
        <button className="social-btn" onClick={handleSubmit} type="button">
          <FcGoogle size={18} /> Google
        </button>
        <button className="social-btn" onClick={handleSubmit} type="button">
          📱 Phone OTP
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: 26, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
          Log in
        </Link>
      </p>
    </motion.div>
  );
}
