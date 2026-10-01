import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GiPlantRoots, GiWheat, GiWaterDrop, GiFarmTractor } from "react-icons/gi";
import "./AuthLayout.css";

const floatingIcons = [
  { Icon: GiWheat, top: "12%", left: "14%", delay: 0 },
  { Icon: GiWaterDrop, top: "68%", left: "20%", delay: 0.4 },
  { Icon: GiFarmTractor, top: "24%", left: "78%", delay: 0.8 },
  { Icon: GiPlantRoots, top: "76%", left: "72%", delay: 1.2 },
];

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-brand-panel">
        <div className="auth-brand-gradient" />
        <div className="leaf-veins" />
        {floatingIcons.map(({ Icon, top, left, delay }, i) => (
          <motion.div
            key={i}
            className="auth-float-icon"
            style={{ top, left }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
          >
            <Icon />
          </motion.div>
        ))}
        <div className="auth-brand-content">
          <Link to="/" className="auth-logo">
            <span className="logo-mark"><GiPlantRoots /></span>
            <span>Agri<b>Sense</b> AI</span>
          </Link>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Farming decisions,<br />backed by AI clarity.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Diagnose crop disease, plan irrigation, and forecast yield —
            all from one calm, connected dashboard.
          </motion.p>
        </div>
      </div>

      <div className="auth-form-panel">
        <Outlet />
      </div>
    </div>
  );
}
