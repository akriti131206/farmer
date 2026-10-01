import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";

export default function Login() {
  const { login, loading } = useAuth();
  const { pushToast } = useUI();
  const navigate = useNavigate();
  const [email, setEmail] = useState("farmer@agrisense.ai");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email || "farmer@agrisense.ai");
    pushToast("Welcome back! Logged in successfully.");
    navigate("/dashboard");
  }

  return (
    <motion.div
      className="auth-form-box"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Welcome back</h3>
      <p className="sub">Log in to check on your fields today.</p>

      <form onSubmit={handleSubmit}>
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label className="field-label">Password</label>
            <Link to="#" className="field-label" style={{ color: "var(--color-primary)" }}>
              Forgot?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <FiLock style={{ position: "absolute", left: 14, top: 14, color: "var(--text-muted)" }} />
            <input
              type="password"
              className="field-input"
              style={{ paddingLeft: 40 }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-agri btn-agri-primary w-100 justify-content-center" disabled={loading}>
          {loading ? "Logging in…" : "Log in"} <FiArrowRight />
        </button>
      </form>

      <div className="auth-divider">or continue with</div>
      <div className="social-btn-row">
        <button className="social-btn" onClick={handleSubmit} type="button">
          <FcGoogle size={18} /> Google
        </button>
        <button className="social-btn" onClick={handleSubmit} type="button">
          📱 Phone OTP
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: 26, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
        New to AgriSense AI?{" "}
        <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
