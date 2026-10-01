export const cropList = [
  "Wheat", "Rice", "Maize", "Sugarcane", "Cotton", "Potato",
  "Tomato", "Soybean", "Mustard", "Chickpea", "Onion", "Groundnut",
];

export const soilTypes = ["Loamy", "Clay", "Sandy", "Silty", "Black Cotton", "Alluvial"];

export const irrigationMethods = {
  Wheat: "Sprinkler Irrigation",
  Rice: "Flood / Basin Irrigation",
  Maize: "Drip Irrigation",
  Sugarcane: "Furrow Irrigation",
  Cotton: "Drip Irrigation",
  Potato: "Sprinkler Irrigation",
  Tomato: "Drip Irrigation",
  Soybean: "Sprinkler Irrigation",
  Mustard: "Furrow Irrigation",
  Chickpea: "Furrow Irrigation",
  Onion: "Drip Irrigation",
  Groundnut: "Sprinkler Irrigation",
};

export const yieldBaseline = {
  Wheat: { yieldPerAcre: 18, pricePerQuintal: 2275, riskBase: 22 },
  Rice: { yieldPerAcre: 22, pricePerQuintal: 2040, riskBase: 30 },
  Maize: { yieldPerAcre: 25, pricePerQuintal: 1962, riskBase: 25 },
  Sugarcane: { yieldPerAcre: 320, pricePerQuintal: 340, riskBase: 18 },
  Cotton: { yieldPerAcre: 8, pricePerQuintal: 6620, riskBase: 38 },
  Potato: { yieldPerAcre: 90, pricePerQuintal: 1150, riskBase: 27 },
  Tomato: { yieldPerAcre: 110, pricePerQuintal: 980, riskBase: 42 },
  Soybean: { yieldPerAcre: 10, pricePerQuintal: 4300, riskBase: 33 },
  Mustard: { yieldPerAcre: 9, pricePerQuintal: 5450, riskBase: 20 },
  Chickpea: { yieldPerAcre: 8, pricePerQuintal: 5335, riskBase: 24 },
  Onion: { yieldPerAcre: 130, pricePerQuintal: 1400, riskBase: 45 },
  Groundnut: { yieldPerAcre: 12, pricePerQuintal: 5850, riskBase: 30 },
};

export const seedData = {
  Wheat: { seedRatePerAcre: 40, unit: "kg", costPerKg: 32, germination: 92, variety: "HD-3226 (Pusa Gehu)" },
  Rice: { seedRatePerAcre: 8, unit: "kg", costPerKg: 65, germination: 88, variety: "Pusa Basmati 1509" },
  Maize: { seedRatePerAcre: 8, unit: "kg", costPerKg: 210, germination: 90, variety: "Pioneer P3396" },
  Sugarcane: { seedRatePerAcre: 4000, unit: "kg", costPerKg: 3.2, germination: 80, variety: "Co-0238" },
  Cotton: { seedRatePerAcre: 1.5, unit: "kg", costPerKg: 850, germination: 85, variety: "Bt Cotton RCH-2" },
  Potato: { seedRatePerAcre: 800, unit: "kg", costPerKg: 22, germination: 94, variety: "Kufri Jyoti" },
  Tomato: { seedRatePerAcre: 0.1, unit: "kg", costPerKg: 12500, germination: 89, variety: "Arka Rakshak" },
  Soybean: { seedRatePerAcre: 30, unit: "kg", costPerKg: 78, germination: 87, variety: "JS-335" },
  Mustard: { seedRatePerAcre: 2, unit: "kg", costPerKg: 145, germination: 91, variety: "Pusa Bold" },
  Chickpea: { seedRatePerAcre: 32, unit: "kg", costPerKg: 88, germination: 90, variety: "Pusa-372" },
  Onion: { seedRatePerAcre: 3.5, unit: "kg", costPerKg: 2600, germination: 82, variety: "Nashik Red N-53" },
  Groundnut: { seedRatePerAcre: 45, unit: "kg", costPerKg: 98, germination: 86, variety: "TAG-24" },
};

export const waterData = {
  Wheat: { litersPerAcrePerDay: 18000, frequencyDays: 12 },
  Rice: { litersPerAcrePerDay: 42000, frequencyDays: 3 },
  Maize: { litersPerAcrePerDay: 20000, frequencyDays: 7 },
  Sugarcane: { litersPerAcrePerDay: 35000, frequencyDays: 6 },
  Cotton: { litersPerAcrePerDay: 15000, frequencyDays: 9 },
  Potato: { litersPerAcrePerDay: 16000, frequencyDays: 6 },
  Tomato: { litersPerAcrePerDay: 14000, frequencyDays: 4 },
  Soybean: { litersPerAcrePerDay: 12000, frequencyDays: 10 },
  Mustard: { litersPerAcrePerDay: 9000, frequencyDays: 14 },
  Chickpea: { litersPerAcrePerDay: 8000, frequencyDays: 15 },
  Onion: { litersPerAcrePerDay: 13000, frequencyDays: 5 },
  Groundnut: { litersPerAcrePerDay: 11000, frequencyDays: 8 },
};

export const costBaseline = {
  Wheat: { seed: 1280, fertilizer: 3200, labour: 4500, machinery: 3800, water: 1200, pesticide: 900 },
  Rice: { seed: 520, fertilizer: 4200, labour: 6800, machinery: 3200, water: 2600, pesticide: 1400 },
  Maize: { seed: 1680, fertilizer: 3600, labour: 4200, machinery: 3600, water: 1500, pesticide: 1100 },
  Sugarcane: { seed: 12800, fertilizer: 6200, labour: 9800, machinery: 5200, water: 3200, pesticide: 1800 },
  Cotton: { seed: 1275, fertilizer: 4800, labour: 8200, machinery: 3400, water: 1300, pesticide: 3600 },
  Potato: { seed: 17600, fertilizer: 5200, labour: 7200, machinery: 4200, water: 1600, pesticide: 2200 },
  Tomato: { seed: 1250, fertilizer: 5800, labour: 9600, machinery: 3800, water: 1400, pesticide: 2800 },
  Soybean: { seed: 2340, fertilizer: 2800, labour: 3600, machinery: 3200, water: 900, pesticide: 1200 },
  Mustard: { seed: 290, fertilizer: 2200, labour: 3100, machinery: 2800, water: 700, pesticide: 700 },
  Chickpea: { seed: 2816, fertilizer: 2000, labour: 3000, machinery: 2700, water: 600, pesticide: 650 },
  Onion: { seed: 9100, fertilizer: 4600, labour: 8800, machinery: 3200, water: 1400, pesticide: 2000 },
  Groundnut: { seed: 4410, fertilizer: 2600, labour: 3800, machinery: 3000, water: 900, pesticide: 950 },
};
