import { cropList, irrigationMethods, soilTypes } from "../data/crops.js";

const STORAGE_PREFIX = "agrisense-farm-profile";
const irrigationTypes = [...new Set(Object.values(irrigationMethods)), "Other"];
const languageCodes = ["en", "hi", "bn", "mr", "ta", "te"];

export const farmProfileFields = [
  ["farmerName", "Farmer name"],
  ["state", "State"],
  ["district", "District"],
  ["village", "Village / location"],
  ["crop", "Crop"],
  ["landArea", "Land area"],
  ["landAreaUnit", "Land area unit"],
  ["sowingDate", "Sowing date"],
  ["irrigationType", "Irrigation type"],
  ["soilType", "Soil type"],
  ["preferredLanguage", "Preferred language"],
];

export function validateFarmProfile(profile) {
  const errors = {};

  for (const [field, label] of farmProfileFields) {
    const value = profile[field];
    if (value === undefined || value === null || String(value).trim() === "") {
      errors[field] = `${label} is required.`;
    }
  }

  if (String(profile.farmerName || "").trim().length > 100) {
    errors.farmerName = "Farmer name must be 100 characters or fewer.";
  }

  for (const field of ["state", "district", "village"]) {
    if (String(profile[field] || "").trim().length > 100) {
      errors[field] = "This field must be 100 characters or fewer.";
    }
  }

  if (profile.crop && !cropList.includes(profile.crop)) {
    errors.crop = "Choose a crop from the list.";
  }

  const landArea = Number(profile.landArea);
  if (profile.landArea !== "" && (!Number.isFinite(landArea) || landArea <= 0)) {
    errors.landArea = "Enter a land area greater than zero.";
  }

  if (profile.landAreaUnit && !["acre", "hectare"].includes(profile.landAreaUnit)) {
    errors.landAreaUnit = "Choose acres or hectares.";
  }

  if (profile.sowingDate) {
    const sowingDate = new Date(`${profile.sowingDate}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(profile.sowingDate)
      || Number.isNaN(sowingDate.getTime())
      || sowingDate.toISOString().slice(0, 10) !== profile.sowingDate
    ) {
      errors.sowingDate = "Enter a valid sowing date.";
    }
  }

  if (profile.irrigationType && !irrigationTypes.includes(profile.irrigationType)) {
    errors.irrigationType = "Choose an irrigation type from the list.";
  }

  if (profile.soilType && !soilTypes.includes(profile.soilType)) {
    errors.soilType = "Choose a soil type from the list.";
  }

  if (profile.preferredLanguage && !languageCodes.includes(profile.preferredLanguage)) {
    errors.preferredLanguage = "Choose a preferred language from the list.";
  }

  return errors;
}

function getStorageKey(user) {
  const identity = user?.email || user?.id;
  if (!identity) {
    throw new Error("Sign in before accessing your farm profile.");
  }
  return `${STORAGE_PREFIX}:${encodeURIComponent(String(identity).toLowerCase())}`;
}

export function getFarmProfile(user) {
  if (!user) return null;

  const raw = window.localStorage.getItem(getStorageKey(user));
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error("Your saved farm profile could not be read.", { cause: error });
  }
}

export function saveFarmProfile(user, profile) {
  const errors = validateFarmProfile(profile);
  if (Object.keys(errors).length > 0) {
    throw new Error("Correct the farm profile fields before saving.");
  }

  const savedProfile = {
    ...profile,
    farmerName: profile.farmerName.trim(),
    state: profile.state.trim(),
    district: profile.district.trim(),
    village: profile.village.trim(),
    landArea: Number(profile.landArea),
  };

  window.localStorage.setItem(getStorageKey(user), JSON.stringify(savedProfile));
  return savedProfile;
}
