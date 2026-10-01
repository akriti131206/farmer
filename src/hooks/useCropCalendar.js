import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useFarmWorkspace from "./useFarmWorkspace";
import {
  getCompletedCalendarActivities,
  saveCompletedCalendarActivities,
} from "../services/cropCalendar";

export default function useCropCalendar() {
  const { user } = useAuth();
  const { profile, crop, sowingDate, calendar } = useFarmWorkspace();
  const [completedActivities, setCompletedActivities] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!user || !crop || !sowingDate) {
      setCompletedActivities([]);
      setLoadError("");
      return;
    }

    try {
      setCompletedActivities(getCompletedCalendarActivities(user, crop, sowingDate));
      setLoadError("");
    } catch (error) {
      setCompletedActivities([]);
      setLoadError(error.message);
    }
  }, [user, crop, sowingDate]);

  function toggleActivity(activityId) {
    const next = completedActivities.includes(activityId)
      ? completedActivities.filter((id) => id !== activityId)
      : [...completedActivities, activityId];

    try {
      saveCompletedCalendarActivities(user, crop, sowingDate, next);
      setCompletedActivities(next);
      setLoadError("");
    } catch (error) {
      setLoadError(error.message);
      throw error;
    }
  }

  return { profile, calendar, completedActivities, toggleActivity, loadError };
}
