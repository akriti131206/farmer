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
import { getMyCrop, getCalendarActivities } from "../services/cropCalendarService";
import { getMyDiaryEntries } from "../services/farmDiaryService";
import { getInventoryItems } from "../services/inventoryService";
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

const importantAlerts = [
  { title: "Disease risk alert", detail: "Early blight signs noticed on tomato leaves in Plot 5.", type: "warning" },
  { title: "Water stress", detail: "Soil moisture in Plot 2 is 18% below target for maize.", type: "info" },
  { title: "Government scheme information", detail: "Verify scheme details and application windows with an official government source.", type: "info" },
];

const schemeSuggestions = governmentSchemeRecords.slice(0, 3);

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function getUpcomingFarmTasks() {
  const crop = await getMyCrop();
  if (!crop?.id) return [];

  const activities = await getCalendarActivities(crop.id);
  const today = getLocalDateKey(new Date());

  return activities
    .filter((activity) => activity.completed === false && activity.activity_date >= today)
    .sort((a, b) => a.activity_date.localeCompare(b.activity_date))
    .slice(0, 5);
}

function formatActivityDate(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString || "");
  if (!match) return dateString || "";

  const [, year, month, day] = match;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" })
    .format(new Date(Number(year), Number(month) - 1, Number(day)));
}

function buildMonthlyExpenseSummary(entries, today = new Date()) {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      key,
      month: new Intl.DateTimeFormat(undefined, { month: "short", year: "2-digit" }).format(date),
      expense: 0,
    };
  });
  const monthsByKey = new Map(months.map((month) => [month.key, month]));
  let total = 0;
  let entryCount = 0;

  entries.forEach((entry) => {
    const month = monthsByKey.get(String(entry.date || "").slice(0, 7));
    const expense = Number(entry.expense);
    if (!month || !Number.isFinite(expense)) return;

    month.expense += expense;
    total += expense;
    entryCount += 1;
  });

  return { months, total, entryCount };
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;
  const [loading, setLoading] = useState(true);
  const [taskState, setTaskState] = useState({ items: [], loading: true, error: "" });
  const [expenseState, setExpenseState] = useState({
    months: [],
    total: 0,
    entryCount: 0,
    loading: true,
    error: "",
  });
  const [inventoryState, setInventoryState] = useState({
    itemCount: 0,
    lowStockCount: 0,
    loading: true,
    error: "",
  });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (authLoading) return undefined;

    if (!userId) {
      setTaskState({ items: [], loading: false, error: "Sign in to load farm tasks." });
      setExpenseState({ months: [], total: 0, entryCount: 0, loading: false, error: "Sign in to load expenses." });
      setInventoryState({ itemCount: 0, lowStockCount: 0, loading: false, error: "Sign in to load inventory." });
      return undefined;
    }

    let active = true;
    setTaskState((current) => ({ ...current, loading: true, error: "" }));
    setExpenseState((current) => ({ ...current, loading: true, error: "" }));
    setInventoryState((current) => ({ ...current, loading: true, error: "" }));

    Promise.allSettled([
      getUpcomingFarmTasks(),
      getMyDiaryEntries(),
      getInventoryItems(userId),
    ]).then(([tasksResult, diaryResult, inventoryResult]) => {
      if (!active) return;

      if (tasksResult.status === "fulfilled") {
        setTaskState({ items: tasksResult.value, loading: false, error: "" });
      } else {
        console.error("Could not load upcoming farm tasks on the Dashboard.", tasksResult.reason);
        setTaskState({ items: [], loading: false, error: "Upcoming farm tasks could not be loaded." });
      }

      if (diaryResult.status === "fulfilled") {
        setExpenseState({
          ...buildMonthlyExpenseSummary(diaryResult.value),
          loading: false,
          error: "",
        });
      } else {
        console.error("Could not load farm diary expenses on the Dashboard.", diaryResult.reason);
        setExpenseState({
          months: [],
          total: 0,
          entryCount: 0,
          loading: false,
          error: "Farm diary expenses could not be loaded.",
        });
      }

      if (inventoryResult.status === "fulfilled") {
        const items = inventoryResult.value;
        setInventoryState({
          itemCount: items.length,
          lowStockCount: items.filter((item) => item.stock < item.threshold).length,
          loading: false,
          error: "",
        });
      } else {
        console.error("Could not load inventory summary on the Dashboard.", inventoryResult.reason);
        setInventoryState({
          itemCount: 0,
          lowStockCount: 0,
          loading: false,
          error: "Inventory summary could not be loaded.",
        });
      }
    });

    return () => {
      active = false;
    };
  }, [authLoading, userId]);

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

      <div className="row g-3 mt-1">
        <div className="col-12">
          <GlassCard className="p-3" hoverable={false}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <div className="dash-card-title mb-1">Inventory Summary</div>
                {inventoryState.error ? (
                  <div className="text-muted-soft" role="alert">{inventoryState.error}</div>
                ) : inventoryState.loading ? (
                  <div className="text-muted-soft" role="status">Loading inventory summary…</div>
                ) : inventoryState.itemCount === 0 ? (
                  <div className="text-muted-soft">No inventory items yet.</div>
                ) : null}
              </div>
              <div className="d-flex align-items-center gap-4">
                <div>
                  <div className="text-dim" style={{ fontSize: "0.72rem" }}>Items</div>
                  <strong>{inventoryState.loading || inventoryState.error ? "—" : inventoryState.itemCount}</strong>
                </div>
                <div>
                  <div className="text-dim" style={{ fontSize: "0.72rem" }}>Low stock</div>
                  <strong>{inventoryState.loading || inventoryState.error ? "—" : inventoryState.lowStockCount}</strong>
                </div>
                <Link to="/inventory" className="text-dim dashboard-link">
                  View inventory <FiArrowRight />
                </Link>
              </div>
            </div>
          </GlassCard>
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
              <span className="badge-agri badge-info">
                {taskState.loading
                  ? "Loading…"
                  : taskState.error
                    ? "Unavailable"
                    : `${taskState.items.length} ${taskState.items.length === 1 ? "task" : "tasks"}`}
              </span>
            </div>
            <div className="task-list">
              {taskState.loading ? (
                <div className="text-muted-soft" role="status">Loading upcoming farm tasks…</div>
              ) : taskState.error ? (
                <div className="text-muted-soft" role="alert">{taskState.error}</div>
              ) : taskState.items.length === 0 ? (
                <div className="text-muted-soft">No upcoming farm tasks</div>
              ) : taskState.items.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-icon">
                    <FiCalendar />
                  </div>
                  <div className="task-main">
                    <div className="task-title">{task.activity_name}</div>
                    <div className="task-meta">
                      {formatActivityDate(task.activity_date)}
                      {task.stage_name ? ` · ${task.stage_name}` : ""}
                    </div>
                  </div>
                  {task.activity_category && (
                    <span className="badge-agri badge-info">{task.activity_category}</span>
                  )}
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
                <div className="dash-card-title">Farm Diary Expenses</div>
                <div className="dash-card-sub">
                  Last 6 months · {expenseState.loading || expenseState.error
                    ? "Total unavailable"
                    : `₹${expenseState.total.toLocaleString("en-IN")} recorded`}
                </div>
              </div>
              <span className="badge-agri badge-warning">Expenses</span>
            </div>
            {expenseState.loading ? (
              <div className="d-flex align-items-center justify-content-center text-muted-soft" style={{ height: 260 }} role="status">
                Loading farm diary expenses…
              </div>
            ) : expenseState.error ? (
              <div className="d-flex align-items-center justify-content-center text-muted-soft" style={{ height: 260 }} role="alert">
                {expenseState.error}
              </div>
            ) : expenseState.entryCount === 0 ? (
              <div className="d-flex align-items-center justify-content-center text-muted-soft" style={{ height: 260 }}>
                No diary expenses recorded in the last 6 months.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={expenseState.months}>
                  <defs>
                    <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f5b942" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#f5b942" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Expenses"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }}
                  />
                  <Area type="monotone" dataKey="expense" stroke="#f5b942" strokeWidth={2.5} fill="url(#exp)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
