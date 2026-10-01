import { useState } from "react";
import { FiCloudRain, FiAlertTriangle, FiDollarSign, FiUsers, FiAward, FiArchive, FiCheck } from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import EmptyState from "../components/common/EmptyState";
import { notificationsList } from "../data/analytics";

const iconMap = { weather: FiCloudRain, alert: FiAlertTriangle, payment: FiDollarSign, labour: FiUsers, scheme: FiAward, inventory: FiArchive };
const colorMap = { weather: "#4fb0d8", alert: "#d32f2f", payment: "#2e7d32", labour: "#8d6748", scheme: "#f5b942", inventory: "#e26d5a" };

export default function Notifications() {
  const [items, setItems] = useState(notificationsList);

  function markRead(id) {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }
  function markAllRead() {
    setItems((list) => list.map((n) => ({ ...n, unread: false })));
  }

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <div>
      <PageHeading
        eyebrow="Account"
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}.`}
        action={unreadCount > 0 && (
          <button className="btn-agri btn-agri-outline btn-agri-sm" onClick={markAllRead}>
            <FiCheck /> Mark all as read
          </button>
        )}
      />

      {items.length === 0 ? (
        <GlassCard className="p-4"><EmptyState icon={<FiCheck />} title="You're all caught up" subtitle="No notifications right now." /></GlassCard>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((n, i) => {
            const Icon = iconMap[n.type] || FiAlertTriangle;
            return (
              <GlassCard key={n.id} className="p-3" delay={i * 0.03} style={{ borderColor: n.unread ? "rgba(46,125,50,0.3)" : undefined }}>
                <div className="d-flex gap-3 align-items-start">
                  <div className="activity-dot" style={{ background: colorMap[n.type] }}>
                    <Icon />
                  </div>
                  <div className="flex-fill">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{n.title}</div>
                      {n.unread && <span className="badge-agri badge-success">New</span>}
                    </div>
                    <p className="text-muted-soft mb-1" style={{ fontSize: "0.86rem" }}>{n.body}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-dim" style={{ fontSize: "0.76rem" }}>{n.time}</span>
                      {n.unread && (
                        <button className="btn-agri btn-agri-ghost btn-agri-sm" onClick={() => markRead(n.id)}>Mark read</button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
