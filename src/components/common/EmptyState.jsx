export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h5 style={{ fontWeight: 700, marginBottom: 6 }}>{title}</h5>
      {subtitle && <p style={{ maxWidth: 420, margin: "0 auto" }}>{subtitle}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
