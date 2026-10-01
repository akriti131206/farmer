const activity = (id, title, offsetDays, category) => ({ id, title, offsetDays, category });

const stage = (id, name, durationDays, irrigationGuidance, fertilizerReminder, monitoringRecommendation, activities) => ({
  id,
  name,
  durationDays,
  irrigationGuidance,
  fertilizerReminder,
  monitoringRecommendation,
  activities,
});

const stageActivities = {
  establishment: [
    activity("stand-check", "Check emergence and plant stand", 5, "Monitoring"),
    activity("first-irrigation", "Review first irrigation timing", 8, "Irrigation"),
  ],
  vegetative: [
    activity("weed-scout", "Scout for weeds and early pest signs", 7, "Monitoring"),
    activity("nutrient-review", "Review crop nutrition plan", 14, "Fertilizer"),
  ],
  flowering: [
    activity("flower-scout", "Inspect flowering and crop stress", 5, "Monitoring"),
    activity("moisture-check", "Check soil moisture before irrigation", 10, "Irrigation"),
  ],
  grain: [
    activity("grain-check", "Monitor grain or fruit development", 7, "Monitoring"),
    activity("late-nutrition", "Review late-season nutrient needs", 14, "Fertilizer"),
  ],
  maturity: [
    activity("maturity-check", "Check crop maturity and field condition", 5, "Monitoring"),
    activity("harvest-plan", "Prepare harvest and storage plan", 10, "Harvest"),
  ],
  transplant: [
    activity("transplant-check", "Check transplant establishment", 5, "Monitoring"),
    activity("settling-water", "Review water needs after transplanting", 8, "Irrigation"),
  ],
  tillering: [
    activity("tiller-count", "Inspect tillering and plant density", 7, "Monitoring"),
    activity("top-dress-review", "Review planned top-dressing", 14, "Fertilizer"),
  ],
  boll: [
    activity("boll-scout", "Scout flowers, bolls, and pest pressure", 7, "Monitoring"),
    activity("boll-moisture", "Review moisture needs during boll development", 14, "Irrigation"),
  ],
  tuber: [
    activity("tuber-check", "Inspect tuber development and soil condition", 7, "Monitoring"),
    activity("hilling-check", "Review earthing-up and nutrient schedule", 14, "Field activity"),
  ],
  pod: [
    activity("pod-check", "Inspect pod development and crop health", 7, "Monitoring"),
    activity("pod-moisture", "Review moisture needs during pod filling", 14, "Irrigation"),
  ],
  bulb: [
    activity("bulb-check", "Monitor bulb formation and field uniformity", 7, "Monitoring"),
    activity("bulb-water", "Review irrigation as bulbs develop", 14, "Irrigation"),
  ],
  cane: [
    activity("cane-check", "Inspect cane growth and field condition", 14, "Monitoring"),
    activity("cane-nutrient", "Review split nutrient schedule", 30, "Fertilizer"),
  ],
};

const commonStages = {
  establishment: (durationDays, irrigation, fertilizer, monitoring) =>
    stage("establishment", "Establishment", durationDays, irrigation, fertilizer, monitoring, stageActivities.establishment),
  vegetative: (durationDays, irrigation, fertilizer, monitoring) =>
    stage("vegetative", "Vegetative growth", durationDays, irrigation, fertilizer, monitoring, stageActivities.vegetative),
  tillering: (durationDays, irrigation, fertilizer, monitoring) =>
    stage("tillering", "Tillering", durationDays, irrigation, fertilizer, monitoring, stageActivities.tillering),
  pod: (durationDays, irrigation, fertilizer, monitoring, activities = stageActivities.pod) =>
    stage("pod-development", "Pod development and filling", durationDays, irrigation, fertilizer, monitoring, activities),
  flowering: (durationDays, irrigation, fertilizer, monitoring) =>
    stage("flowering", "Flowering", durationDays, irrigation, fertilizer, monitoring, stageActivities.flowering),
  grain: (durationDays, irrigation, fertilizer, monitoring) =>
    stage("grain", "Grain / fruit development", durationDays, irrigation, fertilizer, monitoring, stageActivities.grain),
  maturity: (durationDays, irrigation, fertilizer, monitoring) =>
    stage("maturity", "Maturity and harvest preparation", durationDays, irrigation, fertilizer, monitoring, stageActivities.maturity),
};

const riceStages = [
  stage("establishment", "Establishment / transplant recovery", 20, "Maintain water according to the local establishment method; avoid assuming one water depth fits every field.", "Check the locally recommended basal nutrient plan and transplant recovery before any application.", "Check seedling establishment, gaps, and early weed pressure.", stageActivities.transplant),
  stage("tillering", "Tillering", 35, "Monitor field moisture and local water availability; use locally verified irrigation guidance.", "Review split nitrogen timing against local soil-test and extension recommendations.", "Observe tiller density, weeds, and signs of pests or nutrient stress.", stageActivities.tillering),
  stage("flowering", "Panicle initiation and flowering", 35, "Avoid moisture stress during sensitive reproductive development; confirm timing with local guidance.", "Do not apply nutrients without checking crop stage, soil test, and local recommendations.", "Inspect flowering, panicle development, and pest or disease symptoms.", stageActivities.flowering),
  stage("grain-fill", "Grain filling and maturity", 40, "Track soil and field moisture; plan water management around maturity and local practice.", "Review any remaining nutrient actions with a local agricultural advisor.", "Monitor grain filling, lodging, and maturity before scheduling harvest.", stageActivities.grain),
  stage("harvest", "Harvest readiness", 15, "Avoid unnecessary irrigation as the crop approaches harvest; follow local harvest guidance.", "No routine fertilizer reminder; review only if supported by local verified advice.", "Check grain maturity, weather, and safe drying and storage readiness.", stageActivities.maturity),
];

export const cropLifecycleData = {
  Wheat: {
    approximateSeasonDays: 150,
    harvestWindowDays: [135, 155],
    recommendationBasis: "Illustrative planning guidance; confirm stage timing and all field actions with local agricultural extension advice.",
    stages: [
      commonStages.establishment(20, "Check seedbed moisture and local rainfall before irrigating.", "Use only a locally recommended basal plan informed by soil testing.", "Check emergence, stand gaps, and early weeds."),
      commonStages.tillering(35, "Review moisture around active tillering; adjust to soil and weather.", "Review locally recommended split nitrogen timing and dose.", "Scout weeds and early pest or disease symptoms."),
      commonStages.flowering(30, "Avoid moisture stress around flowering; validate timing for local conditions.", "Avoid unverified nutrient applications during sensitive stages.", "Observe flowering, heat stress, and disease development."),
      commonStages.grain(35, "Check soil moisture during grain filling and reduce irrigation as maturity approaches.", "Review whether any planned nutrient application remains appropriate.", "Inspect grain filling, lodging, and signs of rust or other disease."),
      commonStages.maturity(30, "Avoid excess water near harvest; follow local harvest timing advice.", "No routine fertilizer reminder; seek local advice if crop condition is unusual.", "Check maturity, harvest weather, and grain storage readiness."),
    ],
  },
  Rice: { approximateSeasonDays: 145, harvestWindowDays: [125, 155], recommendationBasis: "Illustrative planning guidance; rice systems and water practices vary widely by region and production method.", stages: riceStages },
  Maize: {
    approximateSeasonDays: 120,
    harvestWindowDays: [100, 135],
    recommendationBasis: "Illustrative planning guidance; confirm hybrid, season, and local extension recommendations.",
    stages: [
      commonStages.establishment(15, "Check seedbed moisture and rainfall before watering.", "Follow a locally verified basal nutrient plan.", "Check emergence, spacing, and early weed pressure."),
      commonStages.vegetative(35, "Monitor moisture during rapid vegetative growth, considering soil and rainfall.", "Review locally recommended split nutrient timing.", "Inspect leaf condition, weeds, and crop uniformity."),
      commonStages.flowering(25, "Avoid moisture stress around tasseling and silking; confirm locally.", "Avoid unverified nutrient applications at flowering.", "Monitor tasseling, silking, heat stress, and pests."),
      commonStages.grain(25, "Review moisture needs during kernel fill and as maturity approaches.", "Check crop condition before any late nutrient action.", "Inspect kernel fill, stalk health, and maturity."),
      commonStages.maturity(20, "Reduce unnecessary irrigation near harvest based on local practice.", "No routine fertilizer reminder; follow verified local advice.", "Check grain maturity, harvest conditions, and storage."),
    ],
  },
  Sugarcane: {
    approximateSeasonDays: 330,
    harvestWindowDays: [300, 365],
    recommendationBasis: "Illustrative stage windows; sugarcane crop duration depends strongly on planting method, region, and harvest cycle.",
    stages: [
      commonStages.establishment(45, "Monitor establishment moisture and drainage; use local irrigation guidance.", "Use soil-test-based basal recommendations from local extension.", "Check sett sprouting, gaps, and early weeds."),
      stage("tillering", "Tillering", 75, "Review soil moisture and drainage regularly against local practice.", "Check locally verified split nutrient and earthing-up schedule.", "Inspect tiller development, weeds, and early pest symptoms.", stageActivities.tillering),
      commonStages.vegetative(100, "Adjust irrigation to rainfall, soil, and crop development.", "Review planned nutrient splits using local recommendations.", "Monitor cane growth, lodging risk, and pest or disease signs."),
      stage("cane-development", "Cane development and ripening", 80, "Monitor moisture and avoid waterlogging; confirm late-season practice locally.", "Avoid late applications unless recommended by local extension.", "Check cane development, maturity indicators, and harvest logistics.", stageActivities.cane),
      commonStages.maturity(30, "Follow local water-management guidance approaching harvest.", "No routine fertilizer reminder; confirm any exception locally.", "Confirm harvest readiness and transport or milling arrangements."),
    ],
  },
  Cotton: {
    approximateSeasonDays: 170,
    harvestWindowDays: [150, 190],
    recommendationBasis: "Illustrative planning guidance; cotton varieties, rainfall patterns, and picking schedules vary by region.",
    stages: [
      commonStages.establishment(25, "Check seedbed moisture and drainage during establishment.", "Use locally verified basal nutrient recommendations.", "Check emergence, plant stand, and early pest presence."),
      commonStages.vegetative(40, "Monitor soil moisture during canopy development.", "Review local nutrient schedule and avoid unverified doses.", "Scout weeds, sucking pests, and plant growth."),
      commonStages.flowering(45, "Monitor moisture during flowering and boll set, accounting for rainfall.", "Review nutrient needs against soil tests and local advice.", "Inspect flowers, squares, and pest pressure regularly."),
      stage("boll", "Boll development", 40, "Review moisture through boll development and local irrigation guidance.", "Do not apply late nutrients without verified local advice.", "Scout bolls, disease symptoms, and maturity progression.", stageActivities.boll),
      commonStages.maturity(20, "Avoid unnecessary irrigation near picking where locally appropriate.", "No routine fertilizer reminder; confirm exceptions with extension advice.", "Assess boll opening, picking conditions, and safe storage.", stageActivities.maturity),
    ],
  },
  Potato: {
    approximateSeasonDays: 105,
    harvestWindowDays: [90, 120],
    recommendationBasis: "Illustrative planning guidance; variety, seed source, and local temperature affect potato timing.",
    stages: [
      commonStages.establishment(20, "Maintain suitable soil moisture while avoiding waterlogging.", "Use local soil-test recommendations for basal nutrition.", "Check emergence, missing hills, and early disease signs."),
      commonStages.vegetative(25, "Monitor moisture as canopy develops and follow local irrigation guidance.", "Review locally recommended earthing-up and nutrient schedule.", "Scout weeds, foliage health, and crop uniformity."),
      stage("tuber-initiation", "Tuber initiation and bulking", 35, "Avoid moisture stress during tuber development; validate frequency locally.", "Do not add nutrients without checking local recommendations and crop stage.", "Inspect tuber development, foliage, and late blight risk.", stageActivities.tuber),
      commonStages.grain(15, "Maintain locally appropriate moisture as tubers size.", "Review any remaining planned application with an advisor.", "Monitor tuber size and crop maturity."),
      commonStages.maturity(10, "Follow local guidance on irrigation before lifting.", "No routine fertilizer reminder near harvest.", "Check skin set, harvest conditions, and storage readiness."),
    ],
  },
  Tomato: {
    approximateSeasonDays: 115,
    harvestWindowDays: [85, 140],
    recommendationBasis: "Illustrative planning guidance; open-field and protected cultivation schedules differ.",
    stages: [
      commonStages.establishment(20, "Keep root zone appropriately moist after planting; avoid waterlogging.", "Follow locally verified basal and transplant recommendations.", "Check transplant recovery, gaps, and early disease symptoms."),
      commonStages.vegetative(25, "Use consistent, locally appropriate moisture management.", "Review crop nutrition using soil or water testing and local advice.", "Inspect foliage, stem growth, weeds, and pests."),
      commonStages.flowering(25, "Avoid abrupt moisture stress around flowering and fruit set.", "Avoid unverified nutrient or spray applications.", "Monitor flowers, fruit set, and disease or pest signs."),
      commonStages.grain(30, "Adjust irrigation to fruit development, weather, and local guidance.", "Review nutrient schedule with a verified local source.", "Inspect fruit development, cracking, and pest pressure."),
      commonStages.maturity(15, "Avoid excess irrigation near picking when locally appropriate.", "No routine fertilizer reminder; verify any late action.", "Check fruit maturity, harvest frequency, and safe handling."),
    ],
  },
  Soybean: {
    approximateSeasonDays: 110,
    harvestWindowDays: [95, 125],
    recommendationBasis: "Illustrative planning guidance; sowing window, variety, and rainfall affect soybean development.",
    stages: [
      commonStages.establishment(20, "Check seedbed moisture and ensure drainage after rainfall.", "Follow locally verified inoculation and basal nutrient guidance.", "Check emergence, stand, and early weeds."),
      commonStages.vegetative(30, "Monitor soil moisture and rainfall through canopy development.", "Review soil-test-based nutrient needs with local extension.", "Scout weeds, nodulation, and pest symptoms."),
      commonStages.flowering(25, "Avoid moisture stress during flowering and pod set when possible.", "Do not apply unverified nutrients during reproductive development.", "Inspect flowering, pod set, and pest or disease pressure."),
      commonStages.pod(20, "Monitor moisture during pod fill and follow local advice.", "Review whether any planned application is locally recommended.", "Check pod formation, leaf health, and maturity.", stageActivities.pod),
      commonStages.maturity(15, "Avoid excess irrigation as crop dries toward harvest.", "No routine fertilizer reminder near harvest.", "Check maturity, harvest weather, and storage readiness."),
    ],
  },
  Mustard: {
    approximateSeasonDays: 125,
    harvestWindowDays: [110, 140],
    recommendationBasis: "Illustrative planning guidance; mustard timing varies with variety and regional season.",
    stages: [
      commonStages.establishment(20, "Check soil moisture at sowing and after emergence.", "Use locally verified basal nutrient recommendations.", "Check emergence and early weed pressure."),
      commonStages.vegetative(35, "Review moisture needs against rainfall and soil conditions.", "Check local guidance for planned nutrient split.", "Monitor rosette growth, weeds, and pest symptoms."),
      commonStages.flowering(30, "Avoid moisture stress around flowering where feasible.", "Do not make unverified nutrient applications at flowering.", "Inspect flowering and monitor aphids or disease signs."),
      commonStages.pod(25, "Review moisture during pod development and maturity.", "Confirm any late nutrient action with local extension.", "Check pod formation and maturity progression."),
      commonStages.maturity(15, "Avoid unnecessary irrigation near harvest.", "No routine fertilizer reminder near harvest.", "Check pod maturity and harvest timing to reduce losses."),
    ],
  },
  Chickpea: {
    approximateSeasonDays: 120,
    harvestWindowDays: [105, 135],
    recommendationBasis: "Illustrative planning guidance; chickpea often relies on rainfall and local variety-specific timing.",
    stages: [
      commonStages.establishment(20, "Check establishment moisture and ensure good drainage.", "Follow locally verified seed treatment and basal nutrient guidance.", "Check plant stand and early weeds."),
      commonStages.vegetative(35, "Monitor rainfall and soil moisture; avoid unnecessary watering.", "Review nutrient needs with local soil-test recommendations.", "Scout weeds, canopy development, and disease signs."),
      commonStages.flowering(25, "Avoid moisture stress during flowering where locally relevant.", "Avoid unverified nutrient applications during flowering.", "Monitor flowers and pod set; scout for pests."),
      commonStages.pod(25, "Check moisture during pod fill and follow local guidance.", "Review planned actions with local extension.", "Inspect pods and disease symptoms.", stageActivities.pod),
      commonStages.maturity(15, "Avoid excess water as the crop matures.", "No routine fertilizer reminder near harvest.", "Check maturity and harvest weather."),
    ],
  },
  Onion: {
    approximateSeasonDays: 140,
    harvestWindowDays: [120, 160],
    recommendationBasis: "Illustrative planning guidance; transplanting/direct seeding, variety, and storage goals affect timing.",
    stages: [
      commonStages.establishment(25, "Keep establishment moisture suitable and avoid waterlogging.", "Use locally verified basal nutrient recommendations.", "Check transplant establishment and plant gaps."),
      commonStages.vegetative(40, "Monitor moisture and adjust to soil, weather, and local advice.", "Review split nutrient timing with a verified local source.", "Inspect leaf growth, weeds, and disease symptoms."),
      stage("bulb-initiation", "Bulb initiation and development", 40, "Maintain locally appropriate moisture during bulb development.", "Avoid unverified late nitrogen or other nutrient applications.", "Monitor bulb formation, leaf health, and field uniformity.", stageActivities.bulb),
      commonStages.grain(20, "Review irrigation as bulbs approach maturity.", "Check local recommendations before any final nutrient action.", "Observe bulb size and maturity progression."),
      commonStages.maturity(15, "Follow local guidance for irrigation withdrawal before harvest.", "No routine fertilizer reminder near harvest.", "Check neck fall, curing weather, and storage readiness."),
    ],
  },
  Groundnut: {
    approximateSeasonDays: 125,
    harvestWindowDays: [110, 140],
    recommendationBasis: "Illustrative planning guidance; groundnut timing depends on variety, rainfall, and local harvest indicators.",
    stages: [
      commonStages.establishment(20, "Check seedbed moisture and drainage during emergence.", "Use locally verified basal and micronutrient advice.", "Check emergence and plant stand."),
      commonStages.vegetative(30, "Monitor soil moisture and canopy development.", "Review soil-test recommendations and locally advised nutrient timing.", "Scout weeds, leaf condition, and pests."),
      commonStages.flowering(25, "Avoid moisture stress around flowering and pegging where feasible.", "Do not apply unverified nutrients during flowering.", "Monitor flowering, pegging, and crop health."),
      commonStages.pod(30, "Review moisture during pod development with local guidance.", "Check any planned nutrient action with an extension source.", "Inspect pod development and disease or pest signs.", stageActivities.pod),
      commonStages.maturity(20, "Avoid excess water as the crop approaches digging.", "No routine fertilizer reminder near harvest.", "Check maturity and field conditions before harvest."),
    ],
  },
};

export function getCropLifecycle(crop) {
  return cropLifecycleData[crop] || null;
}
