import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage, FiDollarSign, FiPercent, FiGrid } from "react-icons/fi";
import { GiWheat } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import { cropList, seedData } from "../data/crops";

export default function SeedCalculator() {
  const [crop, setCrop] = useState("Wheat");
  const [area, setArea] = useState(2);
  const [unit, setUnit] = useState("acre");
  const [result, setResult] = useState(null);

  function calculate(e) {
    e.preventDefault();
    const d = seedData[crop];
    const acreEquivalent = unit === "acre" ? area : area * 0.4047;
    const seedQty = +(d.seedRatePerAcre * acreEquivalent).toFixed(1);
    const cost = Math.round(seedQty * d.costPerKg);
    const plantCount = Math.round(acreEquivalent * 43560 * 0.6);
    setResult({ seedQty, cost, germination: d.germination, plantCount, variety: d.variety, unitLabel: d.unit });
  }

  return (
    <div>
      <PageHeading eyebrow="Module 06" title="Seed Requirement Calculator" subtitle="Estimate exactly how much seed you need — and what it will cost — before sowing." />
      <div className="row g-4">
        <div className="col-lg-4">
          <GlassCard className="p-4">
            <div className="dash-card-title mb-3">Field Details</div>
            <form onSubmit={calculate}>
              <div className="field-group">
                <label className="field-label">Crop</label>
                <select className="field-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
                  {cropList.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Area</label>
                <input type="number" min="0.1" step="0.1" className="field-input" value={area} onChange={(e) => setArea(+e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Unit</label>
                <select className="field-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                </select>
              </div>
              <Button type="submit" className="w-100 justify-content-center"><GiWheat /> Calculate Seed Needs</Button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <GlassCard className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 280 }}>
                <div className="empty-state">
                  <div className="empty-icon"><GiWheat /></div>
                  <h5 style={{ fontWeight: 700 }}>No estimate yet</h5>
                  <p>Enter your crop and field area to see seed quantity and cost.</p>
                </div>
              </GlassCard>
            ) : (
              <motion.div className="row g-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="col-6">
                  <GlassCard className="stat-tile" hoverable={false}>
                    <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><FiPackage /></div>
                    <div className="stat-value">{result.seedQty} {result.unitLabel}</div>
                    <div className="stat-label">Seed Quantity</div>
                  </GlassCard>
                </div>
                <div className="col-6">
                  <GlassCard className="stat-tile" hoverable={false}>
                    <div className="stat-icon" style={{ background: "linear-gradient(135deg,#f5b942,#e2a13d)", color: "#fff" }}><FiDollarSign /></div>
                    <div className="stat-value">₹{result.cost.toLocaleString("en-IN")}</div>
                    <div className="stat-label">Seed Cost</div>
                  </GlassCard>
                </div>
                <div className="col-6">
                  <GlassCard className="stat-tile" hoverable={false}>
                    <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiPercent /></div>
                    <div className="stat-value">{result.germination}%</div>
                    <div className="stat-label">Germination Rate</div>
                  </GlassCard>
                </div>
                <div className="col-6">
                  <GlassCard className="stat-tile" hoverable={false}>
                    <div className="stat-icon" style={{ background: "linear-gradient(135deg,#8d6748,#c9a679)", color: "#fff" }}><FiGrid /></div>
                    <div className="stat-value">{result.plantCount.toLocaleString("en-IN")}</div>
                    <div className="stat-label">Estimated Plant Count</div>
                  </GlassCard>
                </div>
                <div className="col-12">
                  <GlassCard className="p-4" hoverable={false}>
                    <div className="dash-card-title mb-1">Recommended Variety</div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-primary)" }}>{result.variety}</div>
                    <p className="text-muted-soft mt-2 mb-0" style={{ fontSize: "0.85rem" }}>
                      Chosen for reliable germination and regional disease resistance in your area.
                    </p>
                  </GlassCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
