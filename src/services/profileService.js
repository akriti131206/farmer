import { supabase } from "../lib/supabase";

const STORAGE_PREFIX = "agrisense-farm-profile";

/**
 * Get the current authenticated user's profile from Supabase.
 * Falls back to legacy localStorage if no Supabase data exists.
 * Returns profile data or null if no data is found.
 */
export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Sign in before accessing your profile.");
  }

  // Try to get profile from Supabase
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, preferred_language, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found (not an error, just no data yet)
    console.error("Error fetching profile from Supabase:", error);
  }

  if (profile) {
    return mapProfileFromSupabase(profile, user);
  }

  // No Supabase profile; try legacy localStorage
  const legacyProfile = getLegacyProfile(user);
  if (legacyProfile) {
    return { ...legacyProfile, _fromLegacy: true };
  }

  return null;
}

/**
 * Get the current authenticated user's farm from Supabase.
 * Falls back to legacy localStorage if no Supabase data exists.
 * Returns farm data or null if no data is found.
 */
export async function getMyFarm() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Sign in before accessing your farm.");
  }

  // Try to get farm from Supabase
  const { data: farm, error } = await supabase
    .from("farms")
    .select("id, farm_name, state, district, village, land_area, land_area_unit, soil_type, irrigation_type, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching farm from Supabase:", error);
  }

  if (farm) {
    return mapFarmFromSupabase(farm);
  }

  // No Supabase farm; try legacy localStorage
  const legacyProfile = getLegacyProfile(user);
  if (legacyProfile) {
    return { ...legacyProfile, _fromLegacy: true };
  }

  return null;
}

/**
 * Update the current authenticated user's profile in Supabase.
 */
export async function updateMyProfile(profileData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Sign in before updating your profile.");
  }

  const { farmerName = "", phone = "", preferredLanguage = "" } = profileData;

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      full_name: farmerName.trim(),
      phone: phone.trim(),
      preferred_language: preferredLanguage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Could not update profile.");
  }

  return mapProfileFromSupabase(profile, user);
}

/**
 * Create a new farm for the current authenticated user in Supabase.
 * Returns the created farm data.
 */
export async function createMyFarm(farmData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Sign in before creating a farm.");
  }

  const farmToCreate = mapFarmToSupabase(farmData);

  const { data: farm, error } = await supabase
    .from("farms")
    .insert({
      ...farmToCreate,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Could not create farm.");
  }

  return mapFarmFromSupabase(farm);
}

/**
 * Update the current authenticated user's farm in Supabase.
 * If no farm exists, creates one instead.
 * Returns the updated/created farm data.
 */
export async function updateMyFarm(farmData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Sign in before updating your farm.");
  }

  // Check if user has a farm
  const { data: existingFarm } = await supabase
    .from("farms")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const farmToSave = mapFarmToSupabase(farmData);

  if (existingFarm) {
    // Update existing farm
    const { data: farm, error } = await supabase
      .from("farms")
      .update({
        ...farmToSave,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingFarm.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Could not update farm.");
    }

    return mapFarmFromSupabase(farm);
  }

  // Create new farm
  return createMyFarm(farmData);
}

/**
 * Save the current authenticated user's profile and farm data to Supabase.
 * This is the primary save operation used by the Profile page.
 * Returns both profile and farm data.
 */
export async function saveMyProfileAndFarm(profileData, farmData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Sign in before saving your profile and farm.");
  }

  // Prepare profile update
  const { farmerName = "", phone = "", preferredLanguage = "" } = profileData;
  const profileUpdate = {
    full_name: farmerName.trim(),
    phone: phone.trim(),
    preferred_language: preferredLanguage,
    updated_at: new Date().toISOString(),
  };

  // Update profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id)
    .select()
    .single();

  if (profileError) {
    throw new Error(profileError.message || "Could not update profile.");
  }

  // Prepare and save farm
  const mappedFarm = mapFarmToSupabase(farmData);

  // Check if user has a farm
  const { data: existingFarm } = await supabase
    .from("farms")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let farm;
  if (existingFarm) {
    // Update existing farm
    const { data: updatedFarm, error: farmError } = await supabase
      .from("farms")
      .update({
        ...mappedFarm,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingFarm.id)
      .select()
      .single();

    if (farmError) {
      throw new Error(farmError.message || "Could not update farm.");
    }
    farm = updatedFarm;
  } else {
    // Create new farm
    const { data: newFarm, error: farmError } = await supabase
      .from("farms")
      .insert({
        ...mappedFarm,
        user_id: user.id,
      })
      .select()
      .single();

    if (farmError) {
      throw new Error(farmError.message || "Could not create farm.");
    }
    farm = newFarm;
  }

  return {
    profile: mapProfileFromSupabase(profile, user),
    farm: mapFarmFromSupabase(farm),
  };
}

/**
 * Get legacy localStorage profile data (for backward compatibility during migration).
 * Returns null if no legacy data exists.
 */
function getLegacyProfile(user) {
  if (!user) return null;

  const identity = user.email || user.id;
  if (!identity) return null;

  const key = `${STORAGE_PREFIX}:${encodeURIComponent(String(identity).toLowerCase())}`;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Could not parse legacy farm profile:", error);
    return null;
  }
}

/**
 * Map Supabase profile data to frontend format.
 */
function mapProfileFromSupabase(profile, authUser) {
  return {
    id: profile.id,
    farmerName: profile.full_name || "",
    email: profile.email || authUser?.email || "",
    phone: profile.phone || "",
    preferredLanguage: profile.preferred_language || "",
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

/**
 * Map Supabase farm data to frontend format.
 */
function mapFarmFromSupabase(farm) {
  return {
    id: farm.id,
    farmName: farm.farm_name || "",
    state: farm.state || "",
    district: farm.district || "",
    village: farm.village || "",
    landArea: farm.land_area ? String(farm.land_area) : "",
    landAreaUnit: farm.land_area_unit || "acre",
    soilType: farm.soil_type || "",
    irrigationType: farm.irrigation_type || "",
    createdAt: farm.created_at,
    updatedAt: farm.updated_at,
  };
}

/**
 * Map frontend farm data to Supabase format for saving.
 * Note: crop and sowingDate are not persisted to the farm table; cropCalendarService
 * stores them in the crops table.
 */
function mapFarmToSupabase(farmData) {
  return {
    farm_name: farmData.farmName ? farmData.farmName.trim() : "",
    state: farmData.state ? farmData.state.trim() : "",
    district: farmData.district ? farmData.district.trim() : "",
    village: farmData.village ? farmData.village.trim() : "",
    land_area: farmData.landArea ? Number(farmData.landArea) : null,
    land_area_unit: farmData.landAreaUnit || "acre",
    soil_type: farmData.soilType || "",
    irrigation_type: farmData.irrigationType || "",
  };
}
