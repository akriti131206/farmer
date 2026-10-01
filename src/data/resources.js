// Per-acre reference rates used by the Smart Resource Estimation module.
// Fertilizer figures are simplified NPK-equivalent bag counts (50kg bags);
// pesticide figures are liters of ready-to-spray solution per acre.
export const fertilizerRates = {
  Wheat: { urea: 2.2, dap: 1.0, mop: 0.6, costPerAcre: 3200 },
  Rice: { urea: 2.6, dap: 1.2, mop: 0.8, costPerAcre: 4200 },
  Maize: { urea: 2.4, dap: 1.1, mop: 0.7, costPerAcre: 3600 },
  Sugarcane: { urea: 4.0, dap: 2.0, mop: 1.6, costPerAcre: 6200 },
  Cotton: { urea: 2.8, dap: 1.4, mop: 1.0, costPerAcre: 4800 },
  Potato: { urea: 3.0, dap: 1.6, mop: 1.8, costPerAcre: 5200 },
  Tomato: { urea: 3.2, dap: 1.8, mop: 1.6, costPerAcre: 5800 },
  Soybean: { urea: 1.4, dap: 1.2, mop: 0.6, costPerAcre: 2800 },
  Mustard: { urea: 1.6, dap: 0.8, mop: 0.4, costPerAcre: 2200 },
  Chickpea: { urea: 1.2, dap: 1.0, mop: 0.4, costPerAcre: 2000 },
  Onion: { urea: 2.6, dap: 1.4, mop: 1.4, costPerAcre: 4600 },
  Groundnut: { urea: 1.4, dap: 1.2, mop: 0.8, costPerAcre: 2600 },
};

export const pesticideRates = {
  Wheat: { litersPerAcre: 1.2, costPerAcre: 900, recommended: "Propiconazole 25% EC" },
  Rice: { litersPerAcre: 1.8, costPerAcre: 1400, recommended: "Chlorpyrifos 20% EC" },
  Maize: { litersPerAcre: 1.4, costPerAcre: 1100, recommended: "Cypermethrin 10% EC" },
  Sugarcane: { litersPerAcre: 2.0, costPerAcre: 1800, recommended: "Chlorantraniliprole 18.5% SC" },
  Cotton: { litersPerAcre: 2.6, costPerAcre: 3600, recommended: "Imidacloprid 17.8% SL" },
  Potato: { litersPerAcre: 2.2, costPerAcre: 2200, recommended: "Mancozeb 75% WP" },
  Tomato: { litersPerAcre: 2.4, costPerAcre: 2800, recommended: "Chlorothalonil 75% WP" },
  Soybean: { litersPerAcre: 1.3, costPerAcre: 1200, recommended: "Quinalphos 25% EC" },
  Mustard: { litersPerAcre: 0.9, costPerAcre: 700, recommended: "Dimethoate 30% EC" },
  Chickpea: { litersPerAcre: 0.8, costPerAcre: 650, recommended: "Indoxacarb 14.5% SC" },
  Onion: { litersPerAcre: 2.0, costPerAcre: 2000, recommended: "Hexaconazole 5% SC" },
  Groundnut: { litersPerAcre: 1.1, costPerAcre: 950, recommended: "Chlorpyrifos 20% EC" },
};
