import { useState } from "react";
import { FiDollarSign, FiUsers, FiTrendingDown } from "react-icons/fi";
import GlassCard from "../common/GlassCard";
import Button from "../common/Button";

export default function BudgetPlanner() {
  const [budget, setBudget] = useState(10000);
  const [result, setResult] = useState(null);

  function plan(e) {
    e.preventDefault();
    const avgHourly = 63;
    const hoursPerWorker = 8;
    const recommendedWorkers = Math.max(1, Math.floor(budget / (avgHourly * hoursPerWorker)));
    const totalCost = recommendedWorkers * avgHourly * hoursPerWorker;
    const savings = budget - totalCost;
    setResult({ recommendedWorkers, totalCost, savings });
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <GlassCard className="p-4" hoverable={false}>
          <div className="dash-card-title mb-3">Set Your Budget</div>
          <form onSubmit={plan}>
            <div className="field-group">
              <label className="field-label">Available Budget (₹)</label>
              <input type="number" className="field-input" value={budget} onChange={(e) => setBudget(+e.target.value)} />
            </div>
            <Button type="submit" className="w-100 justify-content-center"><FiDollarSign /> Plan My Budget</Button>
          </form>
        </GlassCard>
      </div>
      <div className="col-lg-8">
        {!result ? (
          <GlassCard className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 200 }}>
            <p className="text-muted-soft mb-0">Enter a budget to see the recommended worker plan.</p>
          </GlassCard>
        ) : (
          <div className="row g-3">
            <div className="col-6 col-md-4">
              <GlassCard className="stat-tile" hoverable={false}>
                <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><FiUsers /></div>
                <div className="stat-value">{result.recommendedWorkers}</div>
                <div className="stat-label">Recommended Workers</div>
              </GlassCard>
            </div>
            <div className="col-6 col-md-4">
              <GlassCard className="stat-tile" hoverable={false}>
                <div className="stat-icon" style={{ background: "linear-gradient(135deg,#f5b942,#e2a13d)", color: "#fff" }}><FiDollarSign /></div>
                <div className="stat-value">₹{result.totalCost.toLocaleString("en-IN")}</div>
                <div className="stat-label">Total Cost</div>
              </GlassCard>
            </div>
            <div className="col-12 col-md-4">
              <GlassCard className="stat-tile" hoverable={false}>
                <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiTrendingDown /></div>
                <div className="stat-value">₹{result.savings.toLocaleString("en-IN")}</div>
                <div className="stat-label">Savings vs Budget</div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
