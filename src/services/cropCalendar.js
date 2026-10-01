const COMPLETION_PREFIX = "agrisense-crop-calendar-completed";
const DAY_MS = 24 * 60 * 60 * 1000;

export function parseCalendarDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString || "")) return null;
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateString) return null;
  return date;
}

export function formatCalendarDate(date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

function daysBetween(first, second) {
  return Math.floor((second.getTime() - first.getTime()) / DAY_MS);
}

export function buildCropCalendar(crop, sowingDate, lifecycle, today = new Date()) {
  const sowDate = parseCalendarDate(sowingDate);
  if (!sowDate || !lifecycle) return null;

  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const daysAfterSowing = daysBetween(sowDate, todayUtc);
  let stageStartDay = 0;

  const stages = lifecycle.stages.map((stage) => {
    const startDay = stageStartDay;
    const endDay = startDay + stage.durationDays - 1;
    stageStartDay += stage.durationDays;
    const startDate = addDays(sowDate, startDay);
    const endDate = addDays(sowDate, endDay);
    const current = daysAfterSowing >= startDay && daysAfterSowing <= endDay;

    return {
      ...stage,
      startDay,
      endDay,
      startDate,
      endDate,
      current,
      complete: daysAfterSowing > endDay,
      activities: stage.activities.map((item) => ({
        ...item,
        id: `${stage.id}:${item.id}`,
        stageId: stage.id,
        date: addDays(startDate, Math.min(item.offsetDays, stage.durationDays - 1)),
      })),
    };
  });

  const harvestWindow = lifecycle.harvestWindowDays.map((day) => addDays(sowDate, day));

  return {
    crop,
    sowDate,
    daysAfterSowing,
    stages,
    currentStage: stages.find((item) => item.current) || null,
    harvestWindow,
    harvestPassed: daysAfterSowing > lifecycle.harvestWindowDays[1],
    beforeSowing: daysAfterSowing < 0,
    lifecycleComplete: daysAfterSowing > stageStartDay - 1,
    recommendationBasis: lifecycle.recommendationBasis,
  };
}

function getCompletionKey(user, crop, sowingDate) {
  const identity = user?.email || user?.id;
  if (!identity) throw new Error("Sign in before saving calendar activity.");
  return `${COMPLETION_PREFIX}:${encodeURIComponent(String(identity).toLowerCase())}:${encodeURIComponent(crop)}:${sowingDate}`;
}

export function getCompletedCalendarActivities(user, crop, sowingDate) {
  if (!user || !crop || !sowingDate) return [];
  const raw = window.localStorage.getItem(getCompletionKey(user, crop, sowingDate));
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
      throw new Error("Saved activity list has an invalid format.");
    }
    return value;
  } catch (error) {
    throw new Error("Saved crop calendar activity could not be read.", { cause: error });
  }
}

export function saveCompletedCalendarActivities(user, crop, sowingDate, completedIds) {
  window.localStorage.setItem(
    getCompletionKey(user, crop, sowingDate),
    JSON.stringify([...new Set(completedIds)])
  );
}
