import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FiPieChart, FiTrendingUp, FiTarget, FiDollarSign } from "react-icons/fi";
import { GiWheat } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import { cropList, costBaseline, yieldBaseline } from "../data/crops";

const sliceColors = ["#2e7d32", "#66bb6a", "#f5b942", "#4fb0d8", "#8d6748", "#e26d5a"];

export default function CostEstimator() {
  const [crop, setCrop] = useState("Wheat");
  const [area, setArea] = useState(2);
  const [result, setResult] = useState(null);

  function estimate(e) {
    e.preventDefault();
    const base = costBaseline[crop];
    const yieldInfo = yieldBaseline[crop];
    const items = Object.entries(base).map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Math.round(val * area),
    }));
    const totalCost = items.reduce((s, i) => s + i.value, 0);
    const expectedRevenue = Math.round(yieldInfo.yieldPerAcre * area * yieldInfo.pricePerQuintal);
    const profit = expectedRevenue - totalCost;
    const roi = ((profit / totalCost) * 100).toFixed(1);
    const breakEvenQtl = Math.round(totalCost / yieldInfo.pricePerQuintal);
    setResult({ items, totalCost, expectedRevenue, profit, roi, breakEvenQtl });
  }

  return (
    <div>
      <PageHeading eyebrow="Module 08" title="Farming Cost Estimator" subtitle="See a complete cost breakdown, ROI, and break-even point before you invest in the season." />
      <div className="row g-4">
        <div className="col-lg-4">
          <GlassCard className="p-4">
            <div className="dash-card-title mb-3">Season Setup</div>
            <form onSubmit={estimate}>
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
              <Button type="submit" className="w-100 justify-content-center"><FiPieChart /> Estimate Cost</Button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <GlassCard className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 320 }}>
                <div className="empty-state">
                  <div className="empty-icon"><GiWheat /></div>
                  <h5 style={{ fontWeight: 700 }}>No estimate yet</h5>
                  <p>Choose your crop and area to see a full cost and profitability breakdown.</p>
                </div>
              </GlassCard>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="row g-3 mb-3">
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "linear-gradient(135deg,#f5b942,#e2a13d)", color: "#fff" }}><FiDollarSign /></div>
                      <div className="stat-value">₹{(result.totalCost / 1000).toFixed(1)}K</div>
                      <div className="stat-label">Total Cost</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><FiTrendingUp /></div>
                      <div className="stat-value">₹{(result.profit / 1000).toFixed(1)}K</div>
                      <div className="stat-label">Est. Profit</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiPieChart /></div>
                      <div className="stat-value">{result.roi}%</div>
                      <div className="stat-label">ROI</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "linear-gradient(135deg,#8d6748,#c9a679)", color: "#fff" }}><FiTarget /></div>
                      <div className="stat-value">{result.breakEvenQtl} qtl</div>
                      <div className="stat-label">Break-even Yield</div>
                    </GlassCard>
                  </div>
                </div>

                <GlassCard className="p-4">
                  <div className="dash-card-title mb-3">Expense Breakdown</div>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={result.items} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2}>
                            {result.items.map((_, i) => <Cell key={i} fill={sliceColors[i % sliceColors.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="col-md-6">
                      {result.items.map((item, i) => (
                        <div key={item.name} className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.86rem" }}>
                            <span style={{ width: 9, height: 9, borderRadius: "50%", background: sliceColors[i % sliceColors.length], display: "inline-block" }} />
                            {item.name}
                          </span>
                          <b style={{ fontSize: "0.86rem" }}>₹{item.value.toLocaleString("en-IN")}</b>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
