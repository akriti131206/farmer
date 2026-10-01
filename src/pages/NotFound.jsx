import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { GiPlantRoots as GiPlantSeedling } from "react-icons/gi";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-hero)", padding: 24 }}>
      <div className="leaf-veins" style={{ position: "fixed" }} />
      <motion.div
        className="glass-card-strong text-center p-5"
        style={{ maxWidth: 460 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ fontSize: "3.4rem", color: "var(--color-primary)", marginBottom: 10 }}
        >
          <GiPlantSeedling />
        </motion.div>
        <h1 style={{ fontSize: "2.6rem", fontWeight: 800, marginBottom: 6 }}>404</h1>
        <h5 style={{ fontWeight: 700, marginBottom: 10 }}>This field hasn't been planted yet</h5>
        <p className="text-muted-soft" style={{ marginBottom: 26 }}>
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/dashboard" className="btn-agri btn-agri-primary">
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
