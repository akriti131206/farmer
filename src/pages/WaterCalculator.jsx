import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDroplet, FiCalendar, FiSun } from "react-icons/fi";
import { GiWaterDrop } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import { cropList, soilTypes, waterData } from "../data/crops";

const weatherOptions = ["Normal", "Hot & Dry", "Humid", "Rainy Season"];

export default function WaterCalculator() {
  const [crop, setCrop] = useState("Wheat");
  const [area, setArea] = useState(2);
  const [soil, setSoil] = useState("Loamy");
  const [weather, setWeather] = useState("Normal");
  const [result, setResult] = useState(null);
  const [fillPct, setFillPct] = useState(0);

  function calculate(e) {
    e.preventDefault();
    const d = waterData[crop];
    const soilFactor = soil === "Sandy" ? 1.2 : soil === "Clay" ? 0.85 : 1;
    const weatherFactor = weather === "Hot & Dry" ? 1.25 : weather === "Rainy Season" ? 0.6 : weather === "Humid" ? 0.9 : 1;
    const daily = Math.round(d.litersPerAcrePerDay * area * soilFactor * weatherFactor);
    const total = Math.round(daily * 120); // ~ full season
    const seasonal = Math.round(total / 1000);
    setResult({ daily, frequency: d.frequencyDays, seasonal, total });
    setFillPct(0);
    setTimeout(() => setFillPct(Math.min(100, Math.round((daily / 60000) * 100))), 100);
  }

  return (
    <div>
      <PageHeading eyebrow="Module 07" title="Water Requirement Calculator" subtitle="Know exactly how much water your field needs, adjusted for soil and weather." />
      <div className="row g-4">
        <div className="col-lg-4">
          <GlassCard className="p-4">
            <div className="dash-card-title mb-3">Field Conditions</div>
            <form onSubmit={calculate}>
              <div className="field-group">
                <label className="field-label">Crop</label>
                <select className="field-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
                  {cropList.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Area (acres)</label>
                <input type="number" min="0.1" step="0.1" className="field-input" value={area} onChange={(e) => setArea(+e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Soil Type</label>
                <select className="field-select" value={soil} onChange={(e) => setSoil(e.target.value)}>
                  {soilTypes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Weather Pattern</label>
                <select className="field-select" value={weather} onChange={(e) => setWeather(e.target.value)}>
                  {weatherOptions.map((w) => <option key={w}>{w}</option>)}
                </select>
              </div>
              <Button type="submit" className="w-100 justify-content-center"><GiWaterDrop /> Calculate Water Need</Button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <GlassCard className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 320 }}>
                <div className="empty-state">
                  <div className="empty-icon"><GiWaterDrop /></div>
                  <h5 style={{ fontWeight: 700 }}>No calculation yet</h5>
                  <p>Enter field conditions to see your water requirement breakdown.</p>
                </div>
              </GlassCard>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="row g-3">
                  <div className="col-md-5">
                    <GlassCard className="p-4 h-100 d-flex flex-column align-items-center justify-content-center" hoverable={false}>
                      <div style={{ position: "relative", width: 130, height: 170 }}>
                        <svg width="130" height="170" viewBox="0 0 130 170">
                          <path d="M65 5 C95 55 120 85 120 115 A55 55 0 1 1 10 115 C10 85 35 55 65 5 Z" fill="var(--color-mist)" stroke="var(--color-sky)" strokeWidth="2" />
                          <clipPath id="dropClip">
                            <path d="M65 5 C95 55 120 85 120 115 A55 55 0 1 1 10 115 C10 85 35 55 65 5 Z" />
                          </clipPath>
                          <motion.rect
                            x="0" width="130" fill="#4fb0d8" clipPath="url(#dropClip)"
                            initial={{ y: 170, height: 0 }}
                            animate={{ y: 170 - (170 * fillPct) / 100, height: (170 * fillPct) / 100 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                          {fillPct}%
                        </div>
                      </div>
                      <div className="text-muted-soft mt-2" style={{ fontSize: "0.82rem" }}>Relative daily intensity</div>
                    </GlassCard>
                  </div>
                  <div className="col-md-7">
                    <div className="row g-3 h-100">
                      <div className="col-6">
                        <GlassCard className="stat-tile" hoverable={false}>
                          <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiDroplet /></div>
                          <div className="stat-value">{result.daily.toLocaleString("en-IN")}L</div>
                          <div className="stat-label">Daily Need</div>
                        </GlassCard>
                      </div>
                      <div className="col-6">
                        <GlassCard className="stat-tile" hoverable={false}>
                          <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><FiCalendar /></div>
                          <div className="stat-value">{result.frequency}d</div>
                          <div className="stat-label">Irrigation Frequency</div>
                        </GlassCard>
                      </div>
                      <div className="col-12">
                        <GlassCard className="stat-tile" hoverable={false}>
                          <div className="stat-icon" style={{ background: "linear-gradient(135deg,#f5b942,#e2a13d)", color: "#fff" }}><FiSun /></div>
                          <div className="stat-value">{result.seasonal.toLocaleString("en-IN")} KL</div>
                          <div className="stat-label">Seasonal Water Requirement (~120 days)</div>
                        </GlassCard>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
