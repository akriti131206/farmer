const demoSchemeNames = [
  ["s1", "PM-KISAN Samman Nidhi", "Income Support"],
  ["s2", "Pradhan Mantri Fasal Bima Yojana", "Insurance"],
  ["s3", "Soil Health Card Scheme", "Advisory"],
  ["s4", "Kisan Credit Card", "Credit"],
  ["s5", "Micro Irrigation Fund", "Irrigation"],
  ["s6", "National Agriculture Market (e-NAM)", "Market Access"],
];

export const governmentSchemeRecords = demoSchemeNames.map(([id, schemeName, category]) => ({
  id,
  schemeName,
  description: "DEMO DATA — scheme details have not been verified against a current official source.",
  eligibility: [],
  benefits: [],
  requiredDocuments: [],
  applicationSteps: [],
  officialApplicationUrl: null,
  deadline: null,
  state: [],
  applicableCrops: [],
  lastUpdated: null,
  category,
  verificationStatus: "demo-unverified",
}));
