const advisoryRules = [
  {
    id: "heavy-rain",
    severity: "Important",
    matches: ({ forecast }) => forecast.some((day) => day.rain >= 70),
    create: ({ crop, stage, forecast }) => {
      const rainDay = forecast.find((day) => day.rain >= 70);
      return {
        title: "High rain probability in the forecast",
        message: `${rainDay.day} shows a ${rainDay.rain}% rain probability in this sample forecast. For ${crop} during ${stage}, consider postponing irrigation, avoid spraying immediately before expected rainfall, and check field drainage. Confirm with a local forecast before acting.`,
        category: "Rain",
      };
    },
  },
  {
    id: "high-temperature",
    severity: "Caution",
    matches: ({ current, forecast }) => current.tempC >= 35 || forecast.some((day) => day.tempHigh >= 35),
    create: ({ crop, stage, current, forecast }) => {
      const forecastPeak = Math.max(...forecast.map((day) => day.tempHigh));
      const peak = Math.max(current.tempC, forecastPeak);
      return {
        title: "Heat conditions to monitor",
        message: `The sample data reaches ${peak}°C. During ${stage} for ${crop}, check for signs of heat stress and monitor soil moisture. Use locally verified crop guidance; this is not a heat-stress diagnosis.`,
        category: "Temperature",
      };
    },
  },
  {
    id: "high-humidity",
    severity: "Caution",
    matches: ({ current }) => current.humidity >= 80,
    create: ({ crop, stage, current }) => ({
      title: "Higher humidity: monitor crop health",
      message: `Sample relative humidity is ${current.humidity}%. For ${crop} during ${stage}, inspect regularly for disease symptoms and follow local integrated pest-management advice. Humidity alone does not confirm disease.`,
      category: "Humidity",
    }),
  },
  {
    id: "strong-wind",
    severity: "Important",
    matches: ({ current }) => current.windKmh >= 40,
    create: ({ current }) => ({
      title: "Strong wind caution",
      message: `Sample wind speed is ${current.windKmh} km/h. Consider postponing spraying and secure equipment or materials. Check local conditions and product labels before field operations.`,
      category: "Wind",
    }),
  },
  {
    id: "breezy-conditions",
    severity: "Caution",
    matches: ({ current }) => current.windKmh >= 25 && current.windKmh < 40,
    create: ({ current }) => ({
      title: "Wind may affect field activities",
      message: `Sample wind speed is ${current.windKmh} km/h. Use caution with spraying and other wind-sensitive work; follow product-label limits and verify conditions at the field.`,
      category: "Wind",
    }),
  },
];

const severityOrder = { Important: 0, Caution: 1, Information: 2 };

export function buildWeatherAdvisories(weather, cropContext) {
  const context = {
    ...weather,
    crop: cropContext?.crop || "your crop",
    stage: cropContext?.stage || "the current growth period",
  };

  const advisories = advisoryRules
    .filter((rule) => rule.matches(context))
    .map((rule) => ({
      id: rule.id,
      severity: rule.severity,
      ...rule.create(context),
    }));

  advisories.push({
    id: "planning-guidance",
    severity: "Information",
    title: cropContext?.crop ? `${cropContext.crop} stage context` : "Add crop details for tailored context",
    message: cropContext?.crop
      ? `The saved profile and sowing date place ${cropContext.crop} in ${cropContext.stage || "a period outside the configured lifecycle"}. Weather prompts are general planning guidance and should be checked against verified regional crop recommendations.`
      : "Add a supported crop and sowing date to your farm profile to connect weather prompts with a crop growth stage.",
    category: "Crop context",
  });

  return advisories.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

export const weatherAdvisoryRuleIds = advisoryRules.map((rule) => rule.id);
