import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiSun, FiAlertCircle } from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import FarmModulesNav from "../components/common/FarmModulesNav";
import CropStageTimeline from "../components/calendar/CropStageTimeline";
import CropActivityList from "../components/calendar/CropActivityList";
import useCropCalendar from "../hooks/useCropCalendar";
import { formatCalendarDate } from "../services/cropCalendar";
import { useUI } from "../context/UIContext";
import "../components/calendar/CropCalendar.css";

const DAY_MS = 24 * 60 * 60 * 1000;

function getActivityStatus(date, today) {
  const activityDay = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  if (activityDay < todayDay) return "overdue";
  if (activityDay === todayDay) return "today";
  return "upcoming";
}

function getDaysUntil(date, today) {
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((date.getTime() - todayUtc) / DAY_MS);
}

export default function CropCalendar() {
  const {
    profile,
    profileLoading,
    calendar,
    completedActivities,
    toggleActivity,
    loading,
    savingActivityId,
    loadError,
  } = useCropCalendar();
  const { pushToast } = useUI();
  const today = new Date();

  const activities = calendar
    ? calendar.stages.flatMap((stage) => stage.activities.map((item) => ({
      ...item,
      stageName: stage.name,
      status: getActivityStatus(item.date, today),
    }))).sort((a, b) => a.date - b.date)
    : [];

  const pendingActivities = activities.filter((item) => !completedActivities.includes(item.id));
  const completedItems = activities.filter((item) => completedActivities.includes(item.id));
  const todayAndUpcoming = pendingActivities;
  const upcomingReminder = todayAndUpcoming[0] || null;
  const reminderDays = upcomingReminder ? getDaysUntil(upcomingReminder.date, today) : null;

  async function markActivity(activityId) {
    try {
      await toggleActivity(activityId);
    } catch (error) {
      pushToast(error.message || "Could not update activity.", "error");
    }
  }

  return (
    <div>
      <PageHeading
        eyebrow="Farm Planning"
        title="Smart Crop Calendar"
        subtitle="A sowing-date-based lifecycle planner with editable activity reminders for your saved crop."
        action={<Link to="/profile" className="btn-agri btn-agri-outline btn-agri-sm">Edit farm profile</Link>}
      />

      <FarmModulesNav />

      {loadError && <div className="alert alert-warning" role="alert">{loadError}</div>}

      {profileLoading || loading ? (
        <GlassCard className="p-4" hoverable={false}>
          <p className="text-muted-soft mb-0">Loading your crop calendar...</p>
        </GlassCard>
      ) : !profile ? (
        <GlassCard className="p-4" hoverable={false}>
          <div className="d-flex align-items-start gap-3">
            <FiCalendar size={24} color="var(--color-primary)" />
            <div>
              <h2 className="dash-card-title">Add your crop and sowing date</h2>
              <p className="text-muted-soft mb-3">The calendar uses these saved farm details to estimate growth stages and activity dates.</p>
              <Link to="/profile" className="btn-agri btn-agri-primary">Complete farm profile</Link>
            </div>
          </div>
        </GlassCard>
      ) : !calendar ? (
        <GlassCard className="p-4" hoverable={false}>
          <div className="d-flex align-items-start gap-3">
            <FiAlertCircle size={24} color="var(--color-sun)" />
            <div>
              <h2 className="dash-card-title">Crop calendar is not ready</h2>
              <p className="text-muted-soft mb-0">
                {profile.sowingDate
                  ? `No lifecycle template is available for ${profile.crop} yet.`
                  : "Add a valid sowing date to your farm profile to calculate the crop timeline."}
                {" "}Update the farm profile to continue.
              </p>
            </div>
          </div>
        </GlassCard>
      ) : (
        <>
          <FarmProfileSummary title="Calendar farm profile" compact />

          <GlassCard className="p-4 mb-3" hoverable={false}>
            <div className="row g-3 align-items-center">
              <div className="col-6 col-lg-3">
                <div className="crop-summary-stat"><FiCalendar /> Sowing date</div>
                <div className="crop-summary-value">{formatCalendarDate(calendar.sowDate)}</div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="crop-summary-stat"><FiClock /> Crop progress</div>
                <div className="crop-summary-value">
                  {calendar.beforeSowing ? `${Math.abs(calendar.daysAfterSowing)} days to sowing` : `Day ${calendar.daysAfterSowing + 1}`}
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="crop-summary-stat"><FiSun /> Current stage</div>
                <div className="crop-summary-value">
                  {calendar.beforeSowing ? "Pre-sowing" : calendar.currentStage?.name || "Lifecycle complete"}
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="crop-summary-stat"><FiCalendar /> Expected harvest period</div>
                <div className="crop-summary-value">
                  {formatCalendarDate(calendar.harvestWindow[0])} – {formatCalendarDate(calendar.harvestWindow[1])}
                </div>
              </div>
            </div>
          </GlassCard>

          {upcomingReminder && (
            <div className={`crop-calendar-notice crop-calendar-alert mb-3 ${reminderDays <= 1 ? "urgent" : ""}`} role="status">
              <div className="crop-calendar-alert-title">
                {reminderDays === 0 ? "Activity reminder for today" : reminderDays < 0 ? "Overdue activity reminder" : "Upcoming activity reminder"}
              </div>
              <div>
                {upcomingReminder.title} · {upcomingReminder.stageName} · {formatCalendarDate(upcomingReminder.date)}
              </div>
            </div>
          )}

          {calendar.beforeSowing && (
            <div className="crop-calendar-notice mb-3" role="status">
              The sowing date is in the future. The timeline shows planned stage dates; activity reminders begin on their scheduled dates.
            </div>
          )}

          {calendar.harvestPassed && (
            <div className="crop-calendar-notice crop-calendar-alert success mb-3" role="status">
              <div className="crop-calendar-alert-title">Estimated harvest window has passed</div>
              <div>Update the sowing date or crop profile if your season timeline has changed.</div>
            </div>
          )}

          <div className="crop-calendar-notice mb-4">
            <strong>Planning estimate, not agronomic advice.</strong> {calendar.recommendationBasis}
            {" "}Activity dates and stage durations are approximate. Validate fertilizer, irrigation, and crop-protection decisions with verified regional agricultural guidance.
          </div>

          <section className="mb-4">
            <h2 className="dash-card-title mb-3">Crop lifecycle timeline</h2>
            <CropStageTimeline
              stages={calendar.stages}
              currentStage={calendar.currentStage}
              daysAfterSowing={calendar.daysAfterSowing}
            />
          </section>

          <div className="row g-3">
            <div className="col-lg-7">
              <CropActivityList
                title="Overdue, today & upcoming activities"
                items={todayAndUpcoming}
                completedIds={completedActivities}
                onToggle={markActivity}
                emptyText="No pending activities are scheduled for today or the coming days."
                savingId={savingActivityId}
              />
            </div>
            <div className="col-lg-5">
              <CropActivityList
                title="Completed activities"
                items={completedItems}
                completedIds={completedActivities}
                onToggle={markActivity}
                emptyText="Activities you mark complete will appear here."
                savingId={savingActivityId}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
