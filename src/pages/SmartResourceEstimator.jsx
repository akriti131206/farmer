import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  FiZap, FiDroplet, FiTarget, FiCheckCircle, FiTrendingDown, FiPieChart,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { GiWheat, GiFertilizerBag } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import { useFarmProfile } from "../context/FarmProfileContext";
import { cropList, soilTypes, seedData, waterData } from "../data/crops";
import { fertilizerRates, pesticideRates } from "../data/resources";
import "./SmartResourceEstimator.css";

const sliceColors = ["#2e7d32", "#4fb0d8", "#f5b942", "#e26d5a"];

export default function SmartResourceEstimator() {
  const { profile } = useFarmProfile();
  const [crop, setCrop] = useState(profile?.crop || "Wheat");
  const [area, setArea] = useState(profile?.landArea || 3);
  const [unit, setUnit] = useState(profile?.landAreaUnit || "acre");
  const [soil, setSoil] = useState(profile?.soilType || "Loamy");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!profile) return;
    setCrop(profile.crop);
    setArea(profile.landArea);
    setUnit(profile.landAreaUnit);
    setSoil(profile.soilType);
  }, [profile]);

  function estimate(e) {
    e.preventDefault();
    const acreEquivalent = unit === "acre" ? area : area * 2.471;
    const soilEfficiency = soil === "Sandy" ? 1.15 : soil === "Clay" ? 0.9 : 1;

    const seed = seedData[crop];
    const seedQty = +(seed.seedRatePerAcre * acreEquivalent).toFixed(1);
    const seedCost = Math.round(seedQty * seed.costPerKg);

    const water = waterData[crop];
    const dailyWater = Math.round(water.litersPerAcrePerDay * acreEquivalent * soilEfficiency);
    const seasonalWaterKL = Math.round((dailyWater * 120) / 1000);

    const fert = fertilizerRates[crop];
    const urea = +(fert.urea * acreEquivalent).toFixed(1);
    const dap = +(fert.dap * acreEquivalent).toFixed(1);
    const mop = +(fert.mop * acreEquivalent).toFixed(1);
    const fertCost = Math.round(fert.costPerAcre * acreEquivalent);

    const pest = pesticideRates[crop];
    const pestLiters = +(pest.litersPerAcre * acreEquivalent).toFixed(1);
    const pestCost = Math.round(pest.costPerAcre * acreEquivalent);

    const totalCost = seedCost + fertCost + pestCost;

    const wastageBaseline = Math.round(totalCost * 0.14);

    setResult({
      seedQty, seedCost, seedUnit: seed.unit, seedVariety: seed.variety,
      dailyWater, seasonalWaterKL, frequencyDays: water.frequencyDays,
      urea, dap, mop, fertCost,
      pestLiters, pestCost, pestRecommended: pest.recommended,
      totalCost, wastageBaseline,
      breakdown: [
        { name: "Seeds", value: seedCost },
        { name: "Fertilizer", value: fertCost },
        { name: "Pesticide", value: pestCost },
      ],
    });
  }

  return (
    <div>
      <PageHeading
        eyebrow="AI Modules"
        title="Smart Resource Estimation"
        subtitle="Enter your land area and crop to get an AI-optimized estimate of seeds, water, fertilizer, and pesticide requirements — with tips to cut waste."
      />
      <FarmProfileSummary title="Calculator inputs" compact />

      <div className="row g-4">
        <div className="col-lg-4">
          <GlassCard className="p-4">
            <div className="dash-card-title mb-3">Land & Crop Details</div>
            <form onSubmit={estimate}>
              <div className="field-group">
                <label className="field-label">Crop</label>
                <select className="field-select" value={crop} onChange={(e) => setCrop(e.target.value)}>
                  {cropList.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="row">
                <div className="col-7 field-group">
                  <label className="field-label">Land Area</label>
                  <input type="number" min="0.1" step="0.1" className="field-input" value={area} onChange={(e) => setArea(+e.target.value)} />
                </div>
                <div className="col-5 field-group">
                  <label className="field-label">Unit</label>
                  <select className="field-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="acre">Acres</option>
                    <option value="hectare">Hectares</option>
                  </select>
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Soil Type</label>
                <select className="field-select" value={soil} onChange={(e) => setSoil(e.target.value)}>
                  {soilTypes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Button type="submit" className="w-100 justify-content-center"><FiZap /> Estimate Resources</Button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <GlassCard className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 340 }}>
                <div className="empty-state">
                  <div className="empty-icon"><GiWheat /></div>
                  <h5 style={{ fontWeight: 700 }}>No estimate yet</h5>
                  <p>Enter your crop and land area to see a full seed, water, fertilizer, and pesticide plan.</p>
                </div>
              </GlassCard>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="resource-summary-band">
                  <div className="leaf-veins" />
                  <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
                    <div>
                      <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Total Estimated Input Cost</div>
                      <div className="rs-total">₹{result.totalCost.toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Potential Savings with Optimized Use</div>
                      <div style={{ fontWeight: 800, fontSize: "1.3rem" }}>₹{result.wastageBaseline.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mb-2">
                  <Link to="/seed-calculator" className="text-dim" style={{ fontSize: "0.78rem" }}>Need finer detail? Try the dedicated Seed, Water &amp; Cost calculators →</Link>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><GiWheat /></div>
                      <div className="stat-value" style={{ fontSize: "1.3rem" }}>{result.seedQty} {result.seedUnit}</div>
                      <div className="stat-label">Seeds (₹{result.seedCost.toLocaleString("en-IN")})</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiDroplet /></div>
                      <div className="stat-value" style={{ fontSize: "1.3rem" }}>{result.seasonalWaterKL} KL</div>
                      <div className="stat-label">Water (season), every {result.frequencyDays}d</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "linear-gradient(135deg,#8d6748,#c9a679)", color: "#fff" }}><GiFertilizerBag /></div>
                      <div className="stat-value" style={{ fontSize: "1.3rem" }}>{(result.urea + result.dap + result.mop).toFixed(1)} bags</div>
                      <div className="stat-label">Fertilizer (₹{result.fertCost.toLocaleString("en-IN")})</div>
                    </GlassCard>
                  </div>
                  <div className="col-6 col-md-3">
                    <GlassCard className="stat-tile" hoverable={false}>
                      <div className="stat-icon" style={{ background: "linear-gradient(135deg,#e26d5a,#c95038)", color: "#fff" }}><FiTarget /></div>
                      <div className="stat-value" style={{ fontSize: "1.3rem" }}>{result.pestLiters} L</div>
                      <div className="stat-label">Pesticide (₹{result.pestCost.toLocaleString("en-IN")})</div>
                    </GlassCard>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <GlassCard className="p-4 h-100" hoverable={false}>
                      <div className="dash-card-title mb-2"><GiFertilizerBag style={{ marginRight: 6 }} />Fertilizer Breakdown</div>
                      <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.88rem" }}><span>Urea</span><b>{result.urea} bags (50kg)</b></div>
                      <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.88rem" }}><span>DAP</span><b>{result.dap} bags (50kg)</b></div>
                      <div className="d-flex justify-content-between mb-3" style={{ fontSize: "0.88rem" }}><span>MOP</span><b>{result.mop} bags (50kg)</b></div>
                      <hr className="divider-soft" />
                      <div className="dash-card-title mb-2" style={{ fontSize: "0.85rem" }}>Recommended Pesticide</div>
                      <p className="text-muted-soft mb-0" style={{ fontSize: "0.85rem" }}>{result.pestRecommended} — apply per label rate across {result.pestLiters}L solution.</p>
                    </GlassCard>
                  </div>
                  <div className="col-md-6">
                    <GlassCard className="p-4 h-100" hoverable={false}>
                      <div className="dash-card-title mb-2"><FiPieChart style={{ marginRight: 6 }} />Cost Split</div>
                      <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                          <Pie data={result.breakdown} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                            {result.breakdown.map((_, i) => <Cell key={i} fill={sliceColors[i % sliceColors.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </GlassCard>
                  </div>
                  <div className="col-12">
                    <GlassCard className="p-4" hoverable={false}>
                      <div className="dash-card-title mb-2"><FiTrendingDown style={{ marginRight: 6 }} />Optimization Recommendations</div>
                      <div className="optim-tip-row"><FiCheckCircle /> Split fertilizer into 2–3 doses instead of one application to improve uptake and cut runoff loss by up to 15%.</div>
                      <div className="optim-tip-row"><FiCheckCircle /> Use drip or sprinkler irrigation where possible — can reduce total water use by 25–30% versus flood irrigation.</div>
                      <div className="optim-tip-row"><FiCheckCircle /> Buy certified seed from the recommended variety ({result.seedVariety}) to improve germination and reduce re-sowing costs.</div>
                      <div className="optim-tip-row"><FiCheckCircle /> Spray pesticide during early morning or evening to reduce evaporation loss and improve effectiveness.</div>
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
