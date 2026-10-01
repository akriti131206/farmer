import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { FiTrendingUp, FiDollarSign, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { GiWheat } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import { cropList, soilTypes, yieldBaseline } from "../data/crops";
import { yieldTrend } from "../data/analytics";

export default function YieldPrediction() {
  const [crop, setCrop] = useState("Wheat");
  const [area, setArea] = useState(3);
  const [rainfall, setRainfall] = useState(650);
  const [temperature, setTemperature] = useState(28);
  const [soil, setSoil] = useState("Loamy");
  const [result, setResult] = useState(null);

  function predict(e) {
    e.preventDefault();
    const base = yieldBaseline[crop];
    const rainFactor = rainfall < 400 ? 0.82 : rainfall > 900 ? 0.9 : 1.05;
    const tempFactor = temperature > 35 ? 0.85 : temperature < 15 ? 0.88 : 1.03;
    const soilFactor = soil === "Loamy" || soil === "Alluvial" ? 1.08 : soil === "Sandy" ? 0.9 : 1;
    const yieldQtl = Math.round(base.yieldPerAcre * area * rainFactor * tempFactor * soilFactor);
    const revenue = Math.round(yieldQtl * base.pricePerQuintal);
    const cost = Math.round(revenue * 0.42);
    const profit = revenue - cost;
    const risk = Math.min(95, Math.max(8, Math.round(base.riskBase * (2 - rainFactor) * (2 - tempFactor) * 0.9)));

    setResult({
      yieldQtl, revenue, profit, risk,
      riskLevel: risk > 55 ? "High" : risk > 30 ? "Medium" : "Low",
    });
  }

  const riskColor = result ? (result.risk > 55 ? "#d32f2f" : result.risk > 30 ? "#f5b942" : "#2e7d32") : "#2e7d32";

  return (
    <div>
      <PageHeading
        eyebrow="Module 04"
        title="Crop Yield Prediction"
        subtitle="Forecast harvest volume, revenue, profit, and risk before the season begins."
      />

      <div className="row g-4">
        <div className="col-lg-4">
          <GlassCard className="p-4">
            <div className="dash-card-title mb-3">Season Inputs</div>
            <form onSubmit={predict}>
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
                <label className="field-label">Expected Rainfall (mm)</label>
                <input type="number" className="field-input" value={rainfall} onChange={(e) => setRainfall(+e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Avg. Temperature (°C)</label>
                <input type="number" className="field-input" value={temperature} onChange={(e) => setTemperature(+e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Soil Type</label>
                <select className="field-select" value={soil} onChange={(e) => setSoil(e.target.value)}>
                  {soilTypes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Button type="submit" className="w-100 justify-content-center"><FiTrendingUp /> Predict Yield</Button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <GlassCard className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 320 }}>
                <div className="empty-state">
                  <div className="empty-icon"><GiWheat /></div>
                  <h5 style={{ fontWeight: 700 }}>No forecast yet</h5>
                  <p>Enter your season inputs to generate a yield and profit forecast.</p>
                </div>
              </GlassCard>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="row g-3 mb-3">
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><GiWheat /></div>
                      <div className="stat-value">{result.yieldQtl}</div>
                      <div className="stat-label">Quintals Yield</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "linear-gradient(135deg,#f5b942,#e2a13d)", color: "#fff" }}><FiDollarSign /></div>
                      <div className="stat-value">₹{(result.revenue / 1000).toFixed(1)}K</div>
                      <div className="stat-label">Est. Revenue</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiCheckCircle /></div>
                      <div className="stat-value">₹{(result.profit / 1000).toFixed(1)}K</div>
                      <div className="stat-label">Est. Profit</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: riskColor, color: "#fff" }}><FiAlertTriangle /></div>
                      <div className="stat-value">{result.risk}%</div>
                      <div className="stat-label">Risk Score ({result.riskLevel})</div>
                    </GlassCard>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-7">
                    <GlassCard className="p-4 h-100">
                      <div className="dash-card-title mb-3">Yield Trend — Recent Seasons</div>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={yieldTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                          <XAxis dataKey="season" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                          <Line type="monotone" dataKey="yield" stroke="#2e7d32" strokeWidth={2.5} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </GlassCard>
                  </div>
                  <div className="col-md-5">
                    <GlassCard className="p-4 h-100">
                      <div className="dash-card-title mb-3">Risk Meter</div>
                      <div className="progress-track" style={{ height: 12, marginBottom: 10 }}>
                        <motion.div
                          className="progress-fill"
                          style={{ background: riskColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.risk}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <p className="text-muted-soft" style={{ fontSize: "0.85rem" }}>
                        {result.riskLevel === "High"
                          ? "Weather conditions increase crop stress risk — consider stress-tolerant variety or adjusted sowing date."
                          : result.riskLevel === "Medium"
                          ? "Moderate risk — monitor rainfall and pest pressure closely through the season."
                          : "Conditions favor a stable, low-risk season — maintain your current plan."}
                      </p>
                      <hr className="divider-soft" />
                      <div className="dash-card-title mb-2" style={{ fontSize: "0.85rem" }}>Recommendation</div>
                      <p className="text-muted-soft" style={{ fontSize: "0.85rem", marginBottom: 0 }}>
                        Apply balanced NPK at sowing and split nitrogen doses to protect against{" "}
                        {temperature > 35 ? "heat stress" : rainfall < 400 ? "drought stress" : "yield variability"}.
                      </p>
                    </GlassCard>
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
