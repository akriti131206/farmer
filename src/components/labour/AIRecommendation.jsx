import { FiUsers, FiClock, FiCloudRain, FiDollarSign, FiCalendar } from "react-icons/fi";
import GlassCard from "../common/GlassCard";

export default function AIRecommendation() {
  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <GlassCard className="p-4" hoverable={false}>
          <div className="dash-card-title mb-1">AI Labour Recommendation — Wheat Harvest, Plot 2</div>
          <p className="text-muted-soft mb-4" style={{ fontSize: "0.86rem" }}>
            Based on plot size (3.2 acres), crop maturity, and 7-day weather forecast.
          </p>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <GlassCard className="stat-tile" hoverable={false}>
                <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><FiUsers /></div>
                <div className="stat-value">6</div>
                <div className="stat-label">Recommended Workers</div>
              </GlassCard>
            </div>
            <div className="col-6 col-md-3">
              <GlassCard className="stat-tile" hoverable={false}>
                <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiClock /></div>
                <div className="stat-value">2 days</div>
                <div className="stat-label">Completion Time</div>
              </GlassCard>
            </div>
            <div className="col-6 col-md-3">
              <GlassCard className="stat-tile" hoverable={false}>
                <div className="stat-icon" style={{ background: "linear-gradient(135deg,#f5b942,#e2a13d)", color: "#fff" }}><FiDollarSign /></div>
                <div className="stat-value">₹5,760</div>
                <div className="stat-label">Cost Estimate</div>
              </GlassCard>
            </div>
            <div className="col-6 col-md-3">
              <GlassCard className="stat-tile" hoverable={false}>
                <div className="stat-icon" style={{ background: "linear-gradient(135deg,#8d6748,#c9a679)", color: "#fff" }}><FiCalendar /></div>
                <div className="stat-value">Jul 14</div>
                <div className="stat-label">Suggested Start</div>
              </GlassCard>
            </div>
          </div>
        </GlassCard>
      </div>
      <div className="col-lg-4">
        <GlassCard className="p-4 h-100" style={{ background: "linear-gradient(135deg,#f5b942,#e2a13d)", color: "#fff" }} hoverable={false}>
          <FiCloudRain size={26} style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Weather Warning</div>
          <p style={{ fontSize: "0.88rem", margin: 0 }}>
            Rain forecasted July 16–17. Completing harvest by July 15 avoids crop
            exposure and yield loss risk.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
