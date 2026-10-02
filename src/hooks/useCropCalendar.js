import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useFarmWorkspace from "./useFarmWorkspace";
import { getLegacyCompletedCalendarActivities } from "../services/cropCalendar";
import {
  getCalendarActivities,
  migrateLegacyCompletion,
  updateActivityCompletion,
  upsertCalendarActivities,
} from "../services/cropCalendarService";

export default function useCropCalendar() {
  const { user } = useAuth();
  const { profile, crop, sowingDate, calendar, profileLoading, profileError } = useFarmWorkspace();
  const [completedActivities, setCompletedActivities] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingActivityId, setSavingActivityId] = useState(null);

  useEffect(() => {
    if (profileLoading) {
      setLoading(true);
      return undefined;
    }

    if (!user) {
      setCompletedActivities([]);
      setLoadError("");
      setLoading(false);
      return undefined;
    }

    if (profileError) {
      setCompletedActivities([]);
      setLoadError(profileError);
      setLoading(false);
      return undefined;
    }

    if (!crop || !sowingDate || !calendar) {
      setCompletedActivities([]);
      setLoadError("");
      setLoading(false);
      return undefined;
    }

    let active = true;
    async function loadCalendar() {
      setLoading(true);
      setLoadError("");
      try {
        if (!profile?.cropId) {
          throw new Error("Save your farm profile before syncing its crop calendar.");
        }

        const { existing } = await upsertCalendarActivities(profile.cropId, calendar);
        if (existing.length === 0) {
          const legacyKeys = getLegacyCompletedCalendarActivities(user, crop, sowingDate);
          const currentKeys = new Set(
            calendar.stages.flatMap((stage) => stage.activities.map((activity) => activity.id))
          );
          const matchingLegacyKeys = legacyKeys.filter((key) => currentKeys.has(key));
          await migrateLegacyCompletion(profile.cropId, matchingLegacyKeys);
        }

        const savedActivities = await getCalendarActivities(profile.cropId);
        if (active) {
          setCompletedActivities(savedActivities
            .filter((activity) => activity.completed)
            .map((activity) => activity.activity_key));
        }
      } catch (error) {
        if (active) {
          setLoadError(error.message || "Could not load your crop calendar.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCalendar();
    return () => {
      active = false;
    };
  }, [user, profile, profileLoading, profileError, crop, sowingDate, calendar]);

  async function toggleActivity(activityId) {
    const next = completedActivities.includes(activityId)
      ? completedActivities.filter((id) => id !== activityId)
      : [...completedActivities, activityId];

    if (!profile?.cropId) {
      throw new Error("Save your farm profile before updating calendar activities.");
    }

    const completed = next.includes(activityId);
    setCompletedActivities(next);
    setSavingActivityId(activityId);
    try {
      await updateActivityCompletion(profile.cropId, activityId, completed);
      setLoadError("");
    } catch (error) {
      setCompletedActivities((current) => (
        completed
          ? current.filter((id) => id !== activityId)
          : [...new Set([...current, activityId])]
      ));
      setLoadError(error.message);
      throw error;
    } finally {
      setSavingActivityId(null);
    }
  }

  return {
    profile,
    calendar,
    completedActivities,
    toggleActivity,
    loading,
    savingActivityId,
    loadError,
  };
}
