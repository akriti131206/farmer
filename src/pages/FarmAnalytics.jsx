import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import { monthlyExpenses, cropHealthSplit, waterUsageTrend, labourCostTrend, yieldTrend } from "../data/analytics";

export default function FarmAnalytics() {
  return (
    <div>
      <PageHeading eyebrow="Insights" title="Farm Analytics" subtitle="A complete performance view across crop health, water, expenses, profit, yield, and labour." />

      <div className="row g-3">
        <div className="col-lg-6">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Crop Health Distribution</div>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={cropHealthSplit} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {cropHealthSplit.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
        <div className="col-lg-6">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Water Usage Trend</div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={waterUsageTrend}>
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4fb0d8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#4fb0d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                <Area type="monotone" dataKey="usage" stroke="#4fb0d8" strokeWidth={2.5} fill="url(#waterGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
        <div className="col-lg-6">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Expenses vs Profit</div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                <Bar dataKey="expense" fill="#f5b942" radius={[6, 6, 0, 0]} />
                <Bar dataKey="revenue" fill="#2e7d32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
        <div className="col-lg-6">
          <GlassCard className="p-4 h-100">
            <div className="dash-card-title mb-3">Yield Across Seasons</div>
            <ResponsiveContainer width="100%" height={230}>
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
        <div className="col-12">
          <GlassCard className="p-4">
            <div className="dash-card-title mb-3">Labour Cost Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={labourCostTrend}>
                <defs>
                  <linearGradient id="labourGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8d6748" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8d6748" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-glass)", fontSize: 13 }} />
                <Area type="monotone" dataKey="cost" stroke="#8d6748" strokeWidth={2.5} fill="url(#labourGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
