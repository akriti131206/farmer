import { Link } from "react-router-dom";
import {
  FiArrowRight, FiCalendar, FiCloud, FiDollarSign, FiMapPin, FiShield,
} from "react-icons/fi";
import GlassCard from "../common/GlassCard";
import { governmentSchemeRecords } from "../../data/governmentSchemes";
import { nearbyServiceRecords } from "../../data/nearbyServices";
import useFarmWorkspace from "../../hooks/useFarmWorkspace";
import "./FarmModulesOverview.css";

const modules = [
  { path: "/crop-calendar", title: "Smart Crop Calendar", icon: FiCalendar },
  { path: "/weather-intelligence", title: "Weather Intelligence", icon: FiCloud },
  { path: "/farm-calculator", title: "Farm Calculator", icon: FiDollarSign },
  { path: "/government-schemes", title: "Government Schemes", icon: FiShield },
  { path: "/nearby-services", title: "Nearby Services", icon: FiMapPin },
];

function getModuleSummary(path, workspace) {
  switch (path) {
    case "/crop-calendar":
      return workspace.calendar
        ? `${workspace.crop} · ${workspace.cropStage || "Lifecycle complete"} stage`
        : "Add crop and sowing date in My Farm";
    case "/weather-intelligence":
      return workspace.farmLocation
        ? `${workspace.farmLocation} · sample weather, crop-aware guidance`
        : "Add a farm location to set weather context";
    case "/farm-calculator":
      return workspace.landArea
        ? `${workspace.crop || "Crop not set"} · ${workspace.landArea} ${workspace.landAreaUnit}`
        : "Use saved crop and land area from My Farm";
    case "/government-schemes":
      return `${governmentSchemeRecords.length} demo records · not verified`;
    case "/nearby-services":
      return nearbyServiceRecords.length
        ? `${nearbyServiceRecords.length} provider records available`
        : "Provider directory not connected";
    default:
      return "";
  }
}

export default function FarmModulesOverview() {
  const workspace = useFarmWorkspace();

  return (
    <section className="farm-modules-overview mb-4" aria-labelledby="farm-modules-heading">
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-3">
        <div>
          <div className="eyebrow">Your farm workspace</div>
          <h2 id="farm-modules-heading" className="dash-card-title mb-1">Connected farmer tools</h2>
          <p className="text-muted-soft mb-0" style={{ fontSize: "0.82rem" }}>
            Your saved My Farm profile is shared across these modules.
          </p>
        </div>
        <Link to="/profile" className="farm-workspace-edit">Edit My Farm</Link>
      </div>
      <div className="row g-3">
        {modules.map(({ path, title, icon: Icon }) => (
          <div className="col-12 col-sm-6 col-xl" key={path}>
            <GlassCard className="farm-module-card p-3 h-100" hoverable={false}>
              <div className="farm-module-card-heading">
                <span className="farm-module-icon"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
              </div>
              <p>{getModuleSummary(path, workspace)}</p>
              <Link to={path} aria-label={`Open ${title}`}>
                Open module <FiArrowRight aria-hidden="true" />
              </Link>
            </GlassCard>
          </div>
        ))}
      </div>
    </section>
  );
}
