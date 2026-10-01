import { FiCheck, FiCircle } from "react-icons/fi";
import { formatCalendarDate } from "../../services/cropCalendar";
import GlassCard from "../common/GlassCard";

export default function CropStageTimeline({ stages, currentStage, daysAfterSowing }) {
  return (
    <div className="crop-timeline" aria-label="Crop growth stages">
      {stages.map((stage, index) => {
        const selected = currentStage?.id === stage.id;
        const state = stage.complete ? "complete" : selected ? "current" : "future";

        return (
          <div className={`crop-timeline-item ${state}`} key={stage.id}>
            <div className="crop-timeline-marker" aria-hidden="true">
              {stage.complete ? <FiCheck /> : <FiCircle />}
            </div>
            <GlassCard className="p-3 crop-stage-card" hoverable={false}>
              <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h3 className="crop-stage-title">{stage.name}</h3>
                    {selected && <span className="badge-agri badge-success">Current stage</span>}
                    {stage.complete && <span className="badge-agri badge-info">Stage complete</span>}
                  </div>
                  <div className="text-dim crop-stage-date">
                    {formatCalendarDate(stage.startDate)} – {formatCalendarDate(stage.endDate)}
                    {" · "}{stage.durationDays} days
                  </div>
                </div>
                <span className="text-dim crop-stage-day">
                  {selected ? `Day ${daysAfterSowing + 1}` : `Days ${stage.startDay + 1}–${stage.endDay + 1}`}
                </span>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-md-4">
                  <div className="crop-stage-label">Recommended activities</div>
                  <ul className="crop-stage-list">
                    {stage.activities.map((item) => <li key={item.id}>{item.title}</li>)}
                  </ul>
                </div>
                <div className="col-md-4">
                  <div className="crop-stage-label">Irrigation guidance</div>
                  <p className="crop-stage-copy">{stage.irrigationGuidance}</p>
                </div>
                <div className="col-md-4">
                  <div className="crop-stage-label">Fertilizer / field reminder</div>
                  <p className="crop-stage-copy">{stage.fertilizerReminder}</p>
                </div>
                <div className="col-12">
                  <div className="crop-stage-label">Monitoring recommendation</div>
                  <p className="crop-stage-copy mb-0">{stage.monitoringRecommendation}</p>
                </div>
              </div>
            </GlassCard>
            {index < stages.length - 1 && <span className="crop-timeline-line" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}
