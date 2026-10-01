import { getCropLifecycle } from "../data/cropCalendar.js";
import { buildCropCalendar } from "./cropCalendar.js";

export function getFarmLocation(profile) {
  return profile
    ? [profile.village, profile.district, profile.state].filter(Boolean).join(", ")
    : "";
}

export function buildFarmerWorkspace(profile, today = new Date()) {
  const crop = profile?.crop || "";
  const sowingDate = profile?.sowingDate || "";
  const lifecycle = crop ? getCropLifecycle(crop) : null;

  const calendar = crop && sowingDate ? buildCropCalendar(crop, sowingDate, lifecycle, today) : null;

  return {
    profile,
    farmLocation: getFarmLocation(profile),
    crop,
    landArea: profile?.landArea ?? null,
    landAreaUnit: profile?.landAreaUnit || "",
    sowingDate,
    calendar,
    cropStage: calendar?.currentStage?.name || "",
  };
}
