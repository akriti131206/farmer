import { governmentSchemeRecords } from "../data/governmentSchemes.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchGovernmentSchemes() {
  await delay(180);
  return {
    data: governmentSchemeRecords.map((scheme) => ({
      ...scheme,
      eligibility: [...scheme.eligibility],
      benefits: [...scheme.benefits],
      requiredDocuments: [...scheme.requiredDocuments],
      applicationSteps: [...scheme.applicationSteps],
      state: [...scheme.state],
      applicableCrops: [...scheme.applicableCrops],
    })),
    isDemo: true,
    sourceLabel: "Local demo catalog; no scheme details are verified",
  };
}

export function isOfficialGovernmentUrl(value) {
  if (!value) return false;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const officialDomain = hostname === "gov.in"
      || hostname.endsWith(".gov.in")
      || hostname === "nic.in"
      || hostname.endsWith(".nic.in");
    return url.protocol === "https:" && officialDomain;
  } catch {
    return false;
  }
}

export function matchesFarmerProfile(scheme, profile) {
  if (scheme.verificationStatus !== "verified" || !profile) return false;

  const stateMatches = !scheme.state?.length
    || scheme.state.some((state) => state.toLowerCase() === profile.state?.toLowerCase());
  const cropMatches = !scheme.applicableCrops?.length
    || scheme.applicableCrops.some((crop) => crop.toLowerCase() === profile.crop?.toLowerCase());

  return stateMatches && cropMatches;
}

export function filterGovernmentSchemes(schemes, filters, profile) {
  const query = filters.query.trim().toLowerCase();

  return schemes.filter((scheme) => {
    const searchable = [
      scheme.schemeName,
      scheme.description,
      scheme.category,
      ...scheme.eligibility,
      ...scheme.benefits,
    ].join(" ").toLowerCase();
    if (query && !searchable.includes(query)) return false;

    if (filters.category && scheme.category !== filters.category) return false;
    if (filters.state && !scheme.state?.some((state) => state.toLowerCase() === filters.state.toLowerCase())) return false;
    if (filters.crop && !scheme.applicableCrops?.some((crop) => crop.toLowerCase() === filters.crop.toLowerCase())) return false;
    if (filters.profileMatch && !matchesFarmerProfile(scheme, profile)) return false;

    return true;
  });
}
