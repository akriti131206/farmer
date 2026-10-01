import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  FiDroplet, FiTrendingUp, FiDollarSign, FiUsers, FiCamera,
  FiMessageSquare, FiPackage, FiActivity, FiCheckCircle, FiAlertCircle, FiSun,
  FiBell, FiCalendar, FiShield, FiArrowRight, FiCloudRain, FiCloud, FiMapPin,
} from "react-icons/fi";
import { GiWaterDrop, GiPlantRoots } from "react-icons/gi";
import GlassCard from "../components/common/GlassCard";
import StatTile from "../components/common/StatTile";
import PageHeading from "../components/common/PageHeading";
import { SkeletonGrid } from "../components/common/Skeleton";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import FarmModulesOverview from "../components/dashboard/FarmModulesOverview";
import { useAuth } from "../context/AuthContext";
import { currentWeather, weeklyForecast } from "../data/weather";
import { monthlyExpenses, cropHealthSplit } from "../data/analytics";
import { governmentSchemeRecords } from "../data/governmentSchemes";
import { diagnosisHistory } from "../data/diseases";
import "./Dashboard.css";

const quickActions = [
  { to: "/crop-calendar", label: "Crop Calendar", icon: FiCalendar },
  { to: "/weather-intelligence", label: "Weather Intelligence", icon: FiCloud },
  { to: "/farm-calculator", label: "Farm Calculator", icon: FiDollarSign },
  { to: "/disease-detection", label: "Disease Detection", icon: FiCamera },
  { to: "/smart-irrigation", label: "Smart Irrigation", icon: FiDroplet },
  { to: "/yield-prediction", label: "Yield Prediction", icon: FiTrendingUp },
  { to: "/ai-assistant", label: "AI Assistant", icon: FiMessageSquare },
  { to: "/government-schemes", label: "Government Schemes", icon: FiShield },
  { to: "/nearby-services", label: "Nearby Services", icon: FiMapPin },
];

const activity = [
  { icon: FiCheckCircle, bg: "#2e7d32", text: "Irrigation completed for Plot 1", time: "2 hours ago" },
  { icon: FiAlertCircle, bg: "#f5b942", text: "Disease risk flagged in Plot 3 (Tomato)", time: "5 hours ago" },
  { icon: FiDollarSign, bg: "#4fb0d8", text: "Payment of ₹4,340 received from Marketplace", time: "Yesterday" },
  { icon: FiUsers, bg: "#8d6748", text: "2 workers checked in for harvesting", time: "Yesterday" },
];

const irrigationRecommendation = {
  plot: "Plot 3 (Wheat)",
  nextWindow: "Tomorrow, 6:30 AM",
  delayReason: "Chance of rain 40% in next 48 hours",
  waterSaved: "1,800 L",
  method: "Drip + mulch",
};

const upcomingTasks = [
  { title: "Inspect tomato leaves in Plot 5", due: "Today, 4:00 PM", priority: "High" },
  { title: "Apply nitrogen dose to rice plot", due: "Tomorrow, 8:00 AM", priority: "Medium" },
  { title: "Harvest wheat from Plot 1", due: "Thu, 9:00 AM", priority: "Medium" },
];

const importantAlerts = [
  { title: "Disease risk alert", detail: "Early blight signs noticed on tomato leaves in Plot 5.", type: "warning" },
  { title: "Water stress", detail: "Soil moisture in Plot 2 is 18% below target for maize.", type: "info" },
  { title: "Government scheme information", detail: "Verify scheme details and application windows with an official government source.", type: "info" },
];

const schemeSuggestions = governmentSchemeRecords.slice(0, 3);

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeading eyebrow="Overview" title={`Welcome back, ${user?.name || "Farmer"}`} subtitle="Here's what's happening across your farm today." />
        <SkeletonGrid count={4} height={130} />
        <div style={{ height: 20 }} />
        <SkeletonGrid count={2} height={280} />
      </div>
    );
  }

  return (
    <div>
      <PageHeading
        eyebrow="Overview"
        title={`Welcome back, ${user?.name || "Farmer"}`}
        subtitle="Here's what's happening across your farm today."
        action={
          <Link to="/reports" className="btn-agri btn-agri-outline btn-agri-sm">
            <FiPackage /> Generate Report
          </Link>
        }
      />
      <FarmProfileSummary title="Weather & crop context" compact />
      <FarmModulesOverview />

      {/* KPI row */}
      <div className="row g-3 mb-2">
        <div className="col-6 col-lg-3">
          <StatTile icon={<GiPlantRoots />} label="Farm Health Score" value={87} suffix="%" trend="+4% this week" delay={0} />
        </div>
        <div className="col-6 col-lg-3">
          <StatTile icon={<GiWaterDrop />} iconBg="var(--gradient-sky)" label="Water Used (Week)" value={4100} suffix="L" trend="-8% vs last week" delay={0.06} />
        </div>
        <div className="col-6 col-lg-3">
          <StatTile icon={<FiDollarSign />} iconBg="linear-gradient(135deg,#f5b942,#e2a13d)" label="Revenue (Month)" value={49800} prefix="₹" trend="+12.5%" delay={0.12} />
        </div>
        <div className="col-6 col-lg-3">
          <StatTile icon={<FiUsers />} iconBg="linear-gradient(135deg,#8d6748,#c9a679)" label="Workers Active Today" value={4} trend="2 booked tomorrow" delay={0.18} />
        </div>
      </div>

      <div className="row g-3 mt-1 mb-1">
        <div className="col-lg-5">
          <GlassCard className="p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="dash-card-title">Crop Health Summary</div>
                <div className="dash-card-sub">Across all active plots</div>
              </div>
              <span className="badge-agri badge-success">87% Healthy</span>
            </div>

            <div className="health-summary">
              <div className="health-score-ring">
                <span>87%</span>
              </div>
              <div className="health-summary-list">
                {cropHealthSplit.map((item) => (
                  <div key={item.name} className="health-row">
                    <span className="legend-dot" style={{ background: item.color }} />
                    <span>{item.name}</span>
                    <b>{item.value}%</b>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-lg-4">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Irrigation Recommendation</div>
            <div className="recommendation-highlight">
              <div className="pill-badge"><FiDroplet /> {irrigationRecommendation.method}</div>
              <div className="recommendation-title">Delay irrigation for {irrigationRecommendation.plot}</div>
              <p>{irrigationRecommendation.delayReason}</p>
            </div>
            <div className="mini-metrics">
              <div>
                <span>Next window</span>
                <strong>{irrigationRecommendation.nextWindow}</strong>
              </div>
              <div>
                <span>Water saved</span>
                <strong>{irrigationRecommendation.waterSaved}</strong>
              </div>
            </div>
            <Link to="/smart-irrigation" className="text-dim dashboard-link">
              View irrigation plan <FiArrowRight />
            </Link>
          </GlassCard>
        </div>

        <div className="col-lg-3">
          <div className="weather-hero h-100">
            <div className="leaf-veins" />
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div style={{ fontSize: "0.82rem", opacity: 0.9 }}>Demo weather · {currentWeather.location}</div>
                <div className="weather-temp">{currentWeather.tempC}°C</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>{currentWeather.condition}</div>
              </div>
              <FiSun size={38} />
            </div>
            <div className="rain-alert-box">
              <FiCloudRain /> Rain alert: {currentWeather.rainChance}% chance in 48h
            </div>
            <div className="d-flex justify-content-between mt-4">
              {weeklyForecast.slice(0, 5).map((d) => (
                <div key={d.day} className="text-center" style={{ fontSize: "0.72rem" }}>
                  <div style={{ opacity: 0.85 }}>{d.day}</div>
                  <div style={{ fontWeight: 700, margin: "4px 0" }}>{d.tempHigh}°</div>
                  <div style={{ opacity: 0.7 }}>{d.rain}%</div>
                </div>
              ))}
            </div>
            <Link to="/weather-intelligence" className="text-dim dashboard-link mt-3 d-inline-flex">
              Weather & crop guidance <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-7">
          <GlassCard className="p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="dash-card-title">Upcoming Farm Tasks</div>
              <span className="badge-agri badge-info">3 items</span>
            </div>
            <div className="task-list">
              {upcomingTasks.map((task) => (
                <div key={task.title} className="task-item">
                  <div className="task-icon">
                    <FiCalendar />
                  </div>
                  <div className="task-main">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">{task.due}</div>
                  </div>
                  <span className={`task-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="col-lg-5">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Recent AI Analyses</div>
            <div className="analysis-list">
              {diagnosisHistory.slice(0, 3).map((d) => (
                <div key={d.id} className="analysis-item">
                  <div>
                    <div className="analysis-crop">{d.crop}</div>
                    <div className="analysis-disease">{d.disease}</div>
                  </div>
                  <div className="analysis-meta">
                    <span>{d.confidence}%</span>
                    <em>{d.status}</em>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-4">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Important Alerts</div>
            <div className="alert-stack">
              {importantAlerts.map((alert) => (
                <div key={alert.title} className={`alert-item ${alert.type}`}>
                  <div className="alert-icon">
                    {alert.type === "warning" ? <FiAlertCircle /> : alert.type === "success" ? <FiCheckCircle /> : <FiBell />}
                  </div>
                  <div>
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-detail">{alert.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="col-lg-4">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Quick Actions</div>
            <div className="row g-2">
              {quickActions.map((qa) => (
                <div className="col-6" key={qa.to}>
                  <Link to={qa.to} className="quick-action-btn">
                    <qa.icon className="qa-icon" />
                    {qa.label}
                  </Link>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="col-lg-4">
          <div className="ai-suggestion-card h-100">
            <div className="leaf-veins" />
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiActivity size={20} />
              <b style={{ fontSize: "0.9rem" }}>AI Suggestion</b>
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.6, marginBottom: 18 }}>
              Rain is expected in Patna within 48 hours. Hold off irrigating Plot 3 (Wheat) and protect the crop from unnecessary water stress.
            </p>
            <Link to="/smart-irrigation" className="btn-agri btn-agri-sm" style={{ background: "#fff", color: "var(--color-primary-dark)" }}>
              Review Irrigation Plan
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-8">
          <GlassCard className="p-4 h-100">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <div className="dash-card-title">Revenue vs Expenses</div>
                <div className="dash-card-sub">Last 6 months</div>
              </div>
              <div className="d-flex gap-2">
                <span className="badge-agri badge-success">Revenue</span>
                <span className="badge-agri badge-warning">Expenses</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyExpenses}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2e7d32" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2e7d32" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5b942" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f5b942" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                <Area type="monotone" dataKey="revenue" stroke="#2e7d32" strokeWidth={2.5} fill="url(#rev)" />
                <Area type="monotone" dataKey="expense" stroke="#f5b942" strokeWidth={2.5} fill="url(#exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        <div className="col-lg-4">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title">Crop Health</div>
            <div className="dash-card-sub mb-2">Across all active plots</div>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={cropHealthSplit} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {cropHealthSplit.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="d-flex flex-column gap-2 mt-2">
              {cropHealthSplit.map((c) => (
                <div key={c.name} className="d-flex justify-content-between align-items-center">
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: c.color, display: "inline-block" }} />
                    {c.name}
                  </span>
                  <b style={{ fontSize: "0.85rem" }}>{c.value}%</b>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-lg-7">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-2">Recent Activity</div>
            {activity.map((a, i) => (
              <div className="activity-row" key={i}>
                <div className="activity-dot" style={{ background: a.bg }}>
                  <a.icon />
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{a.text}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{a.time}</div>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="col-lg-5">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Marketplace Updates</div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                <Bar dataKey="revenue" fill="#2e7d32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12">
          <GlassCard className="p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="dash-card-title">Government Scheme Records · DEMO DATA</div>
              <Link to="/government-schemes" className="text-dim dashboard-link">
                View all <FiArrowRight />
              </Link>
            </div>
            <div className="row g-3">
              {schemeSuggestions.map((scheme) => (
                <div key={scheme.id} className="col-md-4">
                  <div className="scheme-card">
                    <span className="badge-agri badge-warning">DEMO · UNVERIFIED</span>
                    <div className="scheme-name">{scheme.schemeName}</div>
                    <p>Scheme details are not verified. Check the official government source before relying on this record.</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
