import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import GlassCard from "./GlassCard";

function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const formatted = Number.isInteger(value) ? Math.round(display).toLocaleString("en-IN") : display.toFixed(1);

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatTile({ icon, iconBg, label, value, prefix, suffix, trend, delay = 0 }) {
  return (
    <GlassCard className="stat-tile" delay={delay}>
      <div className="stat-icon" style={{ background: iconBg || "var(--gradient-primary)", color: "#fff" }}>
        {icon}
      </div>
      <div className="stat-value">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="stat-label">{label}</div>
      {trend && (
        <motion.div
          className={`badge-agri ${trend.startsWith("-") ? "badge-danger" : "badge-success"}`}
          style={{ marginTop: 10 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {trend}
        </motion.div>
      )}
    </GlassCard>
  );
}
