import { currentWeather, weeklyForecast } from "../data/weather.js";

export async function fetchWeatherForLocation(requestedLocation) {
  return {
    current: { ...currentWeather },
    today: {
      condition: currentWeather.condition,
      rainProbability: currentWeather.rainChance,
    },
    forecast: weeklyForecast.map((day) => ({ ...day })),
    requestedLocation: requestedLocation || "",
    dataLocation: currentWeather.location,
    isSample: true,
    sourceLabel: "Existing static demo fixture",
  };
}
