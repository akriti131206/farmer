import { supabase } from "../lib/supabase";

const LEGACY_PROFILE_PREFIX = "agrisense-farm-profile";
const ACTIVITY_COLUMNS = "id, crop_id, activity_key, activity_name, activity_category, stage_id, stage_name, activity_date, completed, completed_at";

async function getAuthenticatedUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Sign in before accessing crop data.");
  return user;
}

function getLegacyFarmProfile(user) {
  const identity = user.email || user.id;
  if (!identity) return null;

  const key = `${LEGACY_PROFILE_PREFIX}:${encodeURIComponent(String(identity).toLowerCase())}`;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error("Your saved crop profile could not be read.", { cause: error });
  }
}

async function getMyFarm(user) {
  const { data: farm, error } = await supabase
    .from("farms")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return farm;
}

async function getOwnedCrop(cropId) {
  await getAuthenticatedUser();
  const { data: crop, error } = await supabase
    .from("crops")
    .select("id, farm_id")
    .eq("id", cropId)
    .maybeSingle();

  if (error) throw error;
  if (!crop) throw new Error("The selected crop is unavailable for this account.");
  return crop;
}

function mapCrop(row) {
  return {
    id: row.id,
    crop: row.crop_name,
    sowingDate: row.sowing_date,
  };
}

export async function getMyCrop() {
  const user = await getAuthenticatedUser();
  const farm = await getMyFarm(user);

  if (farm) {
    const { data: crop, error } = await supabase
      .from("crops")
      .select("id, crop_name, sowing_date, updated_at, created_at")
      .eq("farm_id", farm.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (crop) return mapCrop(crop);
  }

  const legacyProfile = getLegacyFarmProfile(user);
  if (legacyProfile?.crop && legacyProfile?.sowingDate) {
    return {
      crop: legacyProfile.crop,
      sowingDate: legacyProfile.sowingDate,
      _fromLegacy: true,
    };
  }

  return null;
}

export async function saveMyCrop(cropName, sowingDate) {
  const user = await getAuthenticatedUser();
  const farm = await getMyFarm(user);
  if (!farm) {
    throw new Error("Save your farm details before saving a crop.");
  }

  const { data: existingCrop, error: cropLookupError } = await supabase
    .from("crops")
    .select("id, crop_name, sowing_date")
    .eq("farm_id", farm.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cropLookupError) throw cropLookupError;

  const values = {
    crop_name: cropName,
    sowing_date: sowingDate,
    updated_at: new Date().toISOString(),
  };
  const query = existingCrop
    ? supabase.from("crops").update(values).eq("id", existingCrop.id)
    : supabase.from("crops").insert({ ...values, farm_id: farm.id });
  const { data: crop, error } = await query
    .select("id, crop_name, sowing_date")
    .single();

  if (error) throw error;

  if (
    existingCrop
    && (existingCrop.crop_name !== cropName || existingCrop.sowing_date !== sowingDate)
  ) {
    const { error: completionResetError } = await supabase
      .from("crop_calendar")
      .update({ completed: false })
      .eq("crop_id", existingCrop.id);

    if (completionResetError) throw completionResetError;
  }

  return mapCrop(crop);
}

export async function upsertCalendarActivities(cropId, calendar) {
  await getOwnedCrop(cropId);

  const { data: existing, error: existingError } = await supabase
    .from("crop_calendar")
    .select("activity_key, completed, completed_at")
    .eq("crop_id", cropId);

  if (existingError) throw existingError;

  const existingByKey = new Map(existing.map((row) => [row.activity_key, row]));
  const activities = calendar.stages.flatMap((stage) =>
    stage.activities.map((activity) => {
      const previous = existingByKey.get(activity.id);
      return {
        crop_id: cropId,
        activity_key: activity.id,
        activity_name: activity.title,
        activity_category: activity.category,
        stage_id: stage.id,
        stage_name: stage.name,
        activity_date: activity.date.toISOString().slice(0, 10),
        completed: previous?.completed ?? false,
        completed_at: previous?.completed_at ?? null,
      };
    })
  );

  if (activities.length === 0) return { existing, activities: [] };

  const { data, error } = await supabase
    .from("crop_calendar")
    .upsert(activities, { onConflict: "crop_id,activity_key" })
    .select(ACTIVITY_COLUMNS);

  if (error) throw error;
  return { existing, activities: data };
}

export async function getCalendarActivities(cropId) {
  await getOwnedCrop(cropId);
  const { data, error } = await supabase
    .from("crop_calendar")
    .select(ACTIVITY_COLUMNS)
    .eq("crop_id", cropId)
    .order("activity_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateActivityCompletion(cropId, activityKey, completed) {
  await getOwnedCrop(cropId);
  const { data, error } = await supabase
    .from("crop_calendar")
    .update({ completed })
    .eq("crop_id", cropId)
    .eq("activity_key", activityKey)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("The calendar activity could not be found.");
}

export async function migrateLegacyCompletion(cropId, completedKeys) {
  if (completedKeys.length === 0) return;
  await getOwnedCrop(cropId);
  const { error } = await supabase
    .from("crop_calendar")
    .update({ completed: true })
    .eq("crop_id", cropId)
    .in("activity_key", completedKeys);

  if (error) throw error;
}
