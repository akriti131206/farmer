import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle, FiCalendar, FiCloudRain, FiDroplet, FiMapPin,
  FiWind, FiSun, FiThermometer, FiArrowRight,
} from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import FarmModulesNav from "../components/common/FarmModulesNav";
import { buildWeatherAdvisories } from "../data/weatherAdvisories";
import { fetchWeatherForLocation } from "../services/weatherService";
import useFarmWorkspace from "../hooks/useFarmWorkspace";
import "./WeatherIntelligence.css";

const conditionIcons = {
  sun: FiSun,
  cloud: FiCloudRain,
  rain: FiCloudRain,
};

const severityClass = {
  Information: "information",
  Caution: "caution",
  Important: "important",
};

export default function WeatherIntelligence() {
  const { farmLocation, crop, cropStage } = useFarmWorkspace();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchWeatherForLocation(farmLocation)
      .then((result) => {
        if (active) setWeather(result);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Weather data could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [farmLocation]);

  const cropContext = {
    crop,
    stage: cropStage,
  };
  const advisories = weather ? buildWeatherAdvisories(weather, cropContext) : [];

  const TodayIcon = weather ? (conditionIcons[weather.current.icon] || FiSun) : FiSun;

  return (
    <div>
      <PageHeading
        eyebrow="Weather & Crop Intelligence"
        title="Weather for Farm Decisions"
        subtitle="Review weather conditions separately from crop-stage-aware planning guidance."
        action={<Link to="/crop-calendar" className="btn-agri btn-agri-outline btn-agri-sm"><FiCalendar /> Crop Calendar</Link>}
      />

      <FarmProfileSummary title="Farm and crop context" compact />
      <FarmModulesNav />

      {loading && <div className="weather-state" role="status">Loading weather data…</div>}
      {error && <div className="alert alert-warning" role="alert">{error}</div>}

      {weather && (
        <>
          <div className="weather-demo-notice mb-4" role="note">
            <FiAlertTriangle />
            <span>
              <strong>Sample data — not live and not location-specific.</strong> Values reuse the
              {` ${weather.sourceLabel}`} for {weather.dataLocation}. Your saved farm location is {farmLocation || "not set"}.
              Verify current conditions with a trusted local forecast before making field decisions.
            </span>
          </div>

          <section aria-labelledby="weather-data-heading">
            <div className="weather-section-heading">
              <div>
                <div className="eyebrow">Weather data</div>
                <h2 id="weather-data-heading">Current conditions & forecast</h2>
              </div>
              <div className="weather-location"><FiMapPin /> Sample reference: {weather.dataLocation}</div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-lg-5">
                <div className="weather-current-card h-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="weather-current-label">Current conditions · sample</div>
                      <div className="weather-current-temp">{weather.current.tempC}°C</div>
                      <div className="weather-current-condition">{weather.current.condition}</div>
                    </div>
                    <TodayIcon className="weather-current-icon" aria-hidden="true" />
                  </div>
                  <div className="weather-current-metrics">
                    <div><FiDroplet /><span>Humidity</span><b>{weather.current.humidity}%</b></div>
                    <div><FiCloudRain /><span>Rain probability</span><b>{weather.current.rainChance}%</b></div>
                    <div><FiWind /><span>Wind</span><b>{weather.current.windKmh} km/h</b></div>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <GlassCard className="p-4 h-100" hoverable={false}>
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <div>
                      <h3 className="dash-card-title mb-1">Today’s forecast · sample</h3>
                      <div className="text-muted-soft" style={{ fontSize: "0.8rem" }}>{weather.today.condition}</div>
                    </div>
                    <FiThermometer color="var(--color-primary)" size={22} />
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="weather-forecast-stat">Temperature</div>
                      <div className="weather-forecast-value">{weather.current.tempC}°C</div>
                    </div>
                    <div className="col-6">
                      <div className="weather-forecast-stat">Condition</div>
                      <div className="weather-forecast-value">{weather.today.condition}</div>
                    </div>
                    <div className="col-6">
                      <div className="weather-forecast-stat">Rain probability</div>
                      <div className="weather-forecast-value">{weather.today.rainProbability}%</div>
                    </div>
                    <div className="col-6">
                      <div className="weather-forecast-stat">Humidity / wind</div>
                      <div className="weather-forecast-value">{weather.current.humidity}% · {weather.current.windKmh} km/h</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            <GlassCard className="p-4 mb-4" hoverable={false}>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <h3 className="dash-card-title mb-1">7-day forecast · sample</h3>
                  <p className="text-muted-soft mb-0" style={{ fontSize: "0.78rem" }}>Values and weekday labels come from the existing static demo fixture.</p>
                </div>
                <FiCalendar color="var(--color-primary)" size={20} />
              </div>
              <div className="weather-forecast-grid">
                {weather.forecast.slice(0, 7).map((day) => {
                  const ForecastIcon = conditionIcons[day.condition] || FiSun;
                  return (
                    <div className="weather-forecast-day" key={day.day}>
                      <div className="weather-forecast-day-label">{day.day}</div>
                      <ForecastIcon className="weather-forecast-day-icon" aria-hidden="true" />
                      <div className="weather-forecast-temperatures">{day.tempHigh}° <span>{day.tempLow}°</span></div>
                      <div className="weather-forecast-rain"><FiCloudRain /> {day.rain}%</div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </section>

          <section aria-labelledby="agricultural-advisory-heading">
            <div className="weather-section-heading">
              <div>
                <div className="eyebrow">Agricultural advisory</div>
                <h2 id="agricultural-advisory-heading">Weather-aware crop guidance</h2>
              </div>
              <div className="weather-crop-stage">
                {cropContext.crop
                  ? `${cropContext.crop} · ${cropContext.stage || "stage unavailable"}`
                  : "Crop and stage not available"}
              </div>
            </div>
            <div className="weather-advisory-cards">
              {advisories.map((advisory) => (
                <GlassCard className={`p-4 weather-advisory-card ${severityClass[advisory.severity]}`} key={advisory.id} hoverable={false}>
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <span className={`weather-severity ${severityClass[advisory.severity]}`}>{advisory.severity}</span>
                    <span className="weather-advisory-category">{advisory.category}</span>
                  </div>
                  <h3>{advisory.title}</h3>
                  <p>{advisory.message}</p>
                </GlassCard>
              ))}
            </div>
            <div className="weather-guidance-note mt-3">
              These cards are rule-based planning prompts derived from sample values and the saved crop stage. They are not
              forecasts, diagnoses, or guaranteed outcomes. Check a current local weather source and verified regional agricultural guidance.
              <Link to="/crop-calendar" className="weather-calendar-link"> Review crop timeline <FiArrowRight /></Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
