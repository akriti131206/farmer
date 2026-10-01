import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiMapPin, FiZap, FiNavigation } from "react-icons/fi";
import GlassCard from "../common/GlassCard";
import EmptyState from "../common/EmptyState";
import { labourList, ACTIVITIES } from "../../data/labour";

export default function LabourListing({ onSelect, onBook }) {
  const [activity, setActivity] = useState("All");
  const [village, setVillage] = useState("All");
  const [maxWage, setMaxWage] = useState(700);
  const [maxDistance, setMaxDistance] = useState(10);

  const villages = ["All", ...new Set(labourList.map((l) => l.village))];

  const filtered = useMemo(() => {
    const list = labourList.filter(
      (l) =>
        (activity === "All" || l.activities.includes(activity)) &&
        (village === "All" || l.village === village) &&
        l.dailyWage <= maxWage &&
        l.distanceKm <= maxDistance
    );
    return [...list].sort((a, b) => {
      if (a.availability === b.availability) return a.distanceKm - b.distanceKm;
      return a.availability === "Available" ? -1 : 1;
    });
  }, [activity, village, maxWage, maxDistance]);

  return (
    <div>
      <GlassCard className="p-4 mb-4" hoverable={false}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <FiZap color="var(--color-primary)" />
          <div className="dash-card-title mb-0">What do you need done?</div>
        </div>
        <div className="d-flex gap-2 flex-wrap mb-4">
          {["All", ...ACTIVITIES].map((a) => (
            <button key={a} className={`chip ${activity === a ? "active" : ""}`} onClick={() => setActivity(a)}>
              {a}
            </button>
          ))}
        </div>

        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <label className="field-label mb-1">Village</label>
            <select className="field-select" value={village} onChange={(e) => setVillage(e.target.value)}>
              {villages.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="field-label mb-1">Max Distance: {maxDistance} km</label>
            <input type="range" min="1" max="10" step="1" className="form-range" value={maxDistance} onChange={(e) => setMaxDistance(+e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="field-label mb-1">Max Daily Wage: ₹{maxWage}</label>
            <input type="range" min="300" max="700" step="10" className="form-range" value={maxWage} onChange={(e) => setMaxWage(+e.target.value)} />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <div className="badge-agri badge-info w-100 justify-content-center">
              <FiNavigation size={11} style={{ marginRight: 4 }} /> {filtered.length} nearby workers
            </div>
          </div>
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <GlassCard className="p-4"><EmptyState icon={<FiZap />} title="No matching workers nearby" subtitle="Try a different activity, a wider distance range, or a higher wage limit." /></GlassCard>
        ) : (
          <motion.div className="row g-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {filtered.map((l, i) => (
              <div className="col-6 col-md-4 col-lg-3" key={l.id}>
                <GlassCard className="labour-card h-100" delay={i * 0.03}>
                  {i < 2 && l.availability === "Available" && (
                    <span className="badge-agri badge-success" style={{ marginBottom: 8, display: "inline-block" }}>
                      <FiZap size={10} /> AI Top Match
                    </span>
                  )}
                  <div className="labour-avatar">{l.name[0]}</div>
                  <div style={{ fontWeight: 700 }}>{l.name}</div>
                  <div className="text-muted-soft" style={{ fontSize: "0.78rem", marginBottom: 6 }}>
                    <FiMapPin size={11} /> {l.village} · {l.distanceKm} km
                  </div>
                  <div style={{ fontSize: "0.8rem", marginBottom: 8 }}>
                    <FiStar size={12} color="var(--color-sun)" fill="var(--color-sun)" /> {l.rating} · {l.experience}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    {l.skills.map((s) => <span className="labour-skill-chip" key={s}>{s}</span>)}
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--color-primary)", marginBottom: 4 }}>₹{l.dailyWage}/day</div>
                  <span className={`badge-agri ${l.availability === "Available" ? "badge-success" : "badge-warning"}`} style={{ marginBottom: 10, display: "inline-block" }}>
                    {l.availability}
                  </span>
                  <div className="d-flex gap-2">
                    <button className="btn-agri btn-agri-outline btn-agri-sm flex-fill" onClick={() => onSelect(l)}>Profile</button>
                    <button className="btn-agri btn-agri-primary btn-agri-sm flex-fill" onClick={() => onBook(l)}>Book</button>
                  </div>
                </GlassCard>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
