import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight, FiCamera, FiDroplet, FiMessageSquare, FiTrendingUp,
  FiShoppingBag, FiUsers, FiSun, FiMoon, FiStar,
} from "react-icons/fi";
import { GiPlantRoots, GiWaterDrop, GiWheat } from "react-icons/gi";
import GlassCard from "../components/common/GlassCard";
import StatTile from "../components/common/StatTile";
import { useTheme } from "../context/ThemeContext";
import { marketProducts } from "../data/marketplace";
import "./Landing.css";

const features = [
  { icon: FiCamera, color: "#2e7d32", title: "AI Disease Detection", desc: "Snap a photo of any crop leaf and get an instant diagnosis with treatment steps." },
  { icon: GiWaterDrop, color: "#4fb0d8", title: "Smart Irrigation", desc: "Get a precise watering schedule tailored to your crop, soil, and local rainfall." },
  { icon: FiMessageSquare, color: "#f5b942", title: "AI Farm Assistant", desc: "Ask anything — from pest control to mandi prices — and get answers in seconds." },
  { icon: FiTrendingUp, color: "#8d6748", title: "Yield Prediction", desc: "Forecast harvest size, revenue, and risk before you even plant the season." },
  { icon: FiShoppingBag, color: "#e26d5a", title: "Direct Marketplace", desc: "Sell produce directly to buyers nearby, without middlemen cutting your margin." },
  { icon: FiUsers, color: "#2e7d32", title: "Labour Management", desc: "Find, book, and pay verified farm workers — all tracked in one dashboard." },
];

const steps = [
  { title: "Tell us about your farm", desc: "Add your crops, soil type, and location so recommendations fit your fields exactly." },
  { title: "Let AI analyze your data", desc: "Our models cross-check weather, soil, and crop science to generate guidance." },
  { title: "Act on clear recommendations", desc: "Follow step-by-step advice on watering, treatment, and timing — no guesswork." },
  { title: "Track results over time", desc: "Watch yield, expenses, and crop health trend upward season after season." },
];

const testimonials = [
  { name: "Ramesh Kumar", role: "Wheat & Rice Farmer, Nalanda", quote: "The disease detection caught early blight on my tomatoes before I could even see it myself. Saved half my crop." },
  { name: "Sunita Devi", role: "Vegetable Grower, Patna", quote: "Smart Irrigation cut my water bill by a third. The schedule just fits how I already work." },
  { name: "Vikram Singh", role: "Cotton Farmer, Rohtas", quote: "I sold my wheat directly through the Marketplace at a better price than the local trader offered." },
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      {/* Navbar */}
      <div className="landing-navbar">
        <div className="brand">
          <span className="logo-mark"><GiPlantRoots /></span>
          Agri<span style={{ color: "var(--color-primary)" }}>Sense</span> AI
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#testimonials">Stories</a>
        </nav>
        <div className="nav-actions">
          <button className="topnav-icon-btn" onClick={toggleTheme} title="Toggle dark mode">
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <Link to="/login" className="btn-agri btn-agri-outline btn-agri-sm">Log in</Link>
          <Link to="/register" className="btn-agri btn-agri-primary btn-agri-sm">
            Get Started <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="hero-section">
        <div className="leaf-veins" />
        <div className="hero-grid">
          <div>
            <motion.div className="hero-eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <GiPlantRoots /> AI built for real fields
            </motion.div>
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Grow more, guess less — with <span className="text-gradient">AI on your side</span>.
            </motion.h1>
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AgriSense AI diagnoses crop disease, plans irrigation, predicts yield,
              and connects you to buyers — all from one dashboard built for
              everyday farm decisions.
            </motion.p>
            <motion.div
              className="hero-cta-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/register" className="btn-agri btn-agri-primary">
                Start Free Today <FiArrowRight />
              </Link>
              <a href="#how-it-works" className="btn-agri btn-agri-ghost">See how it works</a>
            </motion.div>
            <motion.div
              className="hero-mini-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="mini-stat"><b>42,000+</b><span>Farmers supported</span></div>
              <div className="mini-stat"><b>1.8M</b><span>Crops diagnosed</span></div>
              <div className="mini-stat"><b>96%</b><span>Diagnosis accuracy</span></div>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="hero-orbit-ring"
              style={{ width: "88%", height: "88%" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="hero-orbit-ring"
              style={{ width: "100%", height: "100%" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <div className="hero-visual-core">
              <GiPlantRoots />
            </div>
            <motion.div
              className="hero-float-card glass-card-strong"
              style={{ top: "6%", left: "0%" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FiCamera color="var(--color-primary)" /> Disease detected: Healthy ✓
            </motion.div>
            <motion.div
              className="hero-float-card glass-card-strong"
              style={{ bottom: "10%", right: "-4%" }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
            >
              <GiWaterDrop color="var(--color-sky)" /> Water saved: 32% this month
            </motion.div>
            <motion.div
              className="hero-float-card glass-card-strong"
              style={{ top: "48%", left: "-8%" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, delay: 1 }}
            >
              <GiWheat color="var(--color-sun)" /> Yield forecast: +14%
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section className="stats-band">
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <StatTile icon={<FiUsers />} label="Farmers Supported" value={42000} suffix="+" delay={0} />
          </div>
          <div className="col-6 col-md-3">
            <StatTile icon={<FiCamera />} iconBg="var(--gradient-sky)" label="Crops Diagnosed" value={1800000} delay={0.08} />
          </div>
          <div className="col-6 col-md-3">
            <StatTile icon={<FiTrendingUp />} iconBg="linear-gradient(135deg,#f5b942,#e2a13d)" label="AI Predictions Made" value={960000} delay={0.16} />
          </div>
          <div className="col-6 col-md-3">
            <StatTile icon={<GiWaterDrop />} iconBg="var(--gradient-sky)" label="Liters of Water Saved" value={12500000} delay={0.24} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-wrap" id="features">
        <div className="section-head">
          <div className="section-eyebrow">What you get</div>
          <h2 className="section-title">One dashboard, every farm decision covered</h2>
          <p className="section-sub">
            From the moment you spot a spot on a leaf to the day you sell your harvest,
            AgriSense AI stays with you.
          </p>
        </div>
        <div className="row g-4">
          {features.map((f, i) => (
            <div className="col-md-6 col-lg-4" key={f.title}>
              <GlassCard className="p-4 h-100" delay={i * 0.06}>
                <div className="feature-icon-box" style={{ background: f.color }}>
                  <f.icon />
                </div>
                <h5 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h5>
                <p className="text-muted-soft" style={{ margin: 0 }}>{f.desc}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section-wrap" id="how-it-works" style={{ paddingTop: 0 }}>
        <div className="row g-5 align-items-center">
          <div className="col-lg-5">
            <div className="section-eyebrow">The process</div>
            <h2 className="section-title">From open field to informed decision</h2>
            <p className="section-sub">
              Four simple steps take you from raw farm data to a clear next action —
              no agronomy degree required.
            </p>
          </div>
          <div className="col-lg-7">
            {steps.map((s, i) => (
              <motion.div
                className="howitworks-step"
                key={s.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="step-line" />
                <div className="step-num">{i + 1}</div>
                <div>
                  <h5>{s.title}</h5>
                  <p>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-wrap" id="testimonials">
        <div className="section-head">
          <div className="section-eyebrow">Trusted in the field</div>
          <h2 className="section-title">Farmers, not just numbers</h2>
        </div>
        <div className="row g-4">
          {testimonials.map((t, i) => (
            <div className="col-md-4" key={t.name}>
              <GlassCard className="testimonial-card h-100" delay={i * 0.08}>
                <div className="quote-mark">&ldquo;</div>
                <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", color: "var(--color-sun)" }}>
                    {Array.from({ length: 5 }).map((_, s) => <FiStar key={s} fill="currentColor" size={13} />)}
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="section-wrap" id="marketplace">
        <div className="page-heading section-head">
          <div>
            <div className="section-eyebrow">Buy &amp; sell</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Fresh off the Marketplace</h2>
          </div>
          <Link to="/marketplace" className="btn-agri btn-agri-outline">Browse all <FiArrowRight /></Link>
        </div>
        <div className="row g-4">
          {marketProducts.slice(0, 4).map((p, i) => (
            <div className="col-6 col-lg-3" key={p.id}>
              <GlassCard className="mkt-preview-card h-100" delay={i * 0.06}>
                <div className="mkt-preview-img" style={{ background: p.color }}>
                  <FiShoppingBag />
                </div>
                <div className="mkt-preview-body">
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: 8 }}>{p.location}</div>
                  <div style={{ fontWeight: 800, color: "var(--color-primary)" }}>
                    ₹{p.price.toLocaleString("en-IN")} <span style={{ fontWeight: 500, fontSize: "0.72rem", color: "var(--text-muted)" }}>/{p.unit}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <div className="cta-band">
        <div className="leaf-veins" />
        <h2>Ready to see your farm's next season, today?</h2>
        <p>Join thousands of farmers already planning smarter with AgriSense AI. Free to start, no credit card needed.</p>
        <Link to="/register" className="btn-agri" style={{ background: "#fff", color: "var(--color-primary-dark)" }}>
          Create your free account <FiArrowRight />
        </Link>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              <span className="logo-mark"><GiPlantRoots /></span>
              Agri<span style={{ color: "var(--color-primary)" }}>Sense</span> AI
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", maxWidth: "32ch" }}>
              AI-powered farming intelligence for every field, every season.
            </p>
          </div>
          <div>
            <h6>Product</h6>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/disease-detection">Disease Detection</Link>
            <Link to="/smart-irrigation">Smart Irrigation</Link>
            <Link to="/marketplace">Marketplace</Link>
          </div>
          <div>
            <h6>Company</h6>
            <a href="#features">About</a>
            <a href="#testimonials">Stories</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h6>Resources</h6>
            <Link to="/government-schemes">Govt. Schemes</Link>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AgriSense AI. All rights reserved.</span>
          <span>Made for farmers, grown with AI.</span>
        </div>
      </footer>
    </div>
  );
}
