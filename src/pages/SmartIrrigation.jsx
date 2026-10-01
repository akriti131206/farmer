import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { FiDroplet, FiCalendar, FiCloudRain, FiZap } from "react-icons/fi";
import { GiWaterDrop as GiWater, GiWheat as GiSprinkler } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import { cropList, soilTypes, irrigationMethods, waterData } from "../data/crops";

export default function SmartIrrigation() {
  const [crop, setCrop] = useState("Wheat");
  const [soil, setSoil] = useState("Loamy");
  const [area, setArea] = useState(2);
  const [location, setLocation] = useState("Patna, Bihar");
  const [result, setResult] = useState(null);

  function calculate(e) {
    e.preventDefault();
    const base = waterData[crop];
    const soilFactor = soil === "Sandy" ? 1.2 : soil === "Clay" ? 0.85 : 1;
    const dailyWater = Math.round(base.litersPerAcrePerDay * area * soilFactor);
    const weekly = Array.from({ length: 7 }).map((_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      liters: i % base.frequencyDays === 0 ? dailyWater : Math.round(dailyWater * 0.15),
    }));
    setResult({
      dailyWater,
      weekly,
      method: irrigationMethods[crop],
      frequencyDays: base.frequencyDays,
      rainAdjust: "Reduce by 20% — rain expected Thursday",
      tips: [
        "Irrigate early morning or late evening to reduce evaporation loss.",
        "Mulch around root zone to retain soil moisture longer.",
        "Check soil moisture at 4-inch depth before each cycle.",
      ],
    });
  }

  return (
    <div>
      <PageHeading
        eyebrow="Module 02"
        title="Smart Irrigation Advisor"
        subtitle="Get a precise watering plan based on your crop, soil, area, and local rainfall patterns."
      />

      <div className="row g-4">
        <div className="col-lg-4">
          <GlassCard className="p-4">
            <div className="dash-card-title mb-3">Farm Details</div>
            <form onSubmit={calculate}>
              <div className="field-group">
                <label className="field-label">Crop</label>
                <select className="field-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
                  {cropList.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Soil Type</label>
                <select className="field-select" value={soil} onChange={(e) => setSoil(e.target.value)}>
                  {soilTypes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Area (acres)</label>
                <input type="number" min="0.1" step="0.1" className="field-input" value={area} onChange={(e) => setArea(+e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Location</label>
                <input className="field-input" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <Button type="submit" className="w-100 justify-content-center"><FiDroplet /> Generate Irrigation Plan</Button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <GlassCard className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 320 }}>
                <div className="empty-state">
                  <div className="empty-icon"><GiWater /></div>
                  <h5 style={{ fontWeight: 700 }}>No plan generated yet</h5>
                  <p>Fill in your farm details to get a tailored irrigation schedule.</p>
                </div>
              </GlassCard>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="row g-3 mb-3">
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiDroplet /></div>
                      <div className="stat-value">{result.dailyWater.toLocaleString("en-IN")}L</div>
                      <div className="stat-label">Daily Water Need</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><GiSprinkler /></div>
                      <div className="stat-value" style={{ fontSize: "1.1rem" }}>{result.method}</div>
                      <div className="stat-label">Irrigation Method</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "linear-gradient(135deg,#f5b942,#e2a13d)", color: "#fff" }}><FiCalendar /></div>
                      <div className="stat-value">{result.frequencyDays}d</div>
                      <div className="stat-label">Cycle Frequency</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "linear-gradient(135deg,#8d6748,#c9a679)", color: "#fff" }}><FiCloudRain /></div>
                      <div className="stat-value" style={{ fontSize: "0.95rem" }}>Adjusted</div>
                      <div className="stat-label">{result.rainAdjust}</div>
                    </GlassCard>
                  </div>
                </div>

                <GlassCard className="p-4 mb-3">
                  <div className="dash-card-title mb-3">Weekly Water Schedule</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={result.weekly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                      <Bar dataKey="liters" fill="#4fb0d8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="dash-card-title mb-3"><FiZap style={{ marginRight: 6 }} />Water Saving Tips</div>
                  {result.tips.map((t, i) => (
                    <div key={i} className="d-flex gap-2 mb-2" style={{ fontSize: "0.88rem" }}>
                      <span style={{ color: "var(--color-primary)" }}>•</span> {t}
                    </div>
                  ))}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
