import { FiCalendar, FiCheckCircle, FiCircle } from "react-icons/fi";
import { formatCalendarDate } from "../../services/cropCalendar";
import GlassCard from "../common/GlassCard";

const statusLabels = {
  completed: "Completed",
  overdue: "Overdue",
  today: "Today",
  upcoming: "Upcoming",
};

export default function CropActivityList({ title, items, completedIds, onToggle, emptyText, savingId }) {
  return (
    <GlassCard className="p-4 h-100" hoverable={false}>
      <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
        <h2 className="dash-card-title mb-0">{title}</h2>
        <span className="badge-agri badge-info">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-muted-soft mb-0" style={{ fontSize: "0.86rem" }}>{emptyText}</p>
      ) : (
        <div className="crop-activity-list">
          {items.map((item) => {
            const complete = completedIds.includes(item.id);
            const status = complete ? "completed" : item.status;
            return (
              <div className={`crop-activity-row ${complete ? "is-complete" : ""}`} key={item.id}>
                <button
                  type="button"
                  className="crop-activity-toggle"
                  onClick={() => onToggle(item.id)}
                  disabled={savingId === item.id}
                  aria-label={`${complete ? "Mark incomplete" : "Mark complete"}: ${item.title}`}
                  aria-pressed={complete}
                >
                  {complete ? <FiCheckCircle /> : <FiCircle />}
                </button>
                <div className="crop-activity-main">
                  <div className="crop-activity-title">{item.title}</div>
                  <div className="crop-activity-meta">
                    <FiCalendar size={12} /> {formatCalendarDate(item.date)} · {item.stageName} · {item.category}
                  </div>
                </div>
                <span className={`crop-activity-status ${status}`}>{statusLabels[status]}</span>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
