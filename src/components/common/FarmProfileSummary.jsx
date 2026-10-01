import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import GlassCard from "./GlassCard";
import { useFarmProfile } from "../../context/FarmProfileContext";

const languageLabels = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
};

export default function FarmProfileSummary({ title = "My Farm", compact = false }) {
  const { profile, loading, loadError } = useFarmProfile();

  if (loading) return null;

  if (!profile) {
    return (
      <GlassCard className="p-3 mb-4" hoverable={false}>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
          <div>
            <div className="dash-card-title mb-1">{title}</div>
            <div className="text-muted-soft" style={{ fontSize: "0.84rem" }}>
              {loadError || "Add your farm details to personalize recommendations and estimates."}
            </div>
          </div>
          <Link to="/profile" className="btn-agri btn-agri-outline btn-agri-sm">
            Set up farm profile
          </Link>
        </div>
      </GlassCard>
    );
  }

  const location = [profile.village, profile.district, profile.state].filter(Boolean).join(", ");
  const details = [
    ["Crop", profile.crop],
    ["Land", `${profile.landArea} ${profile.landAreaUnit}${Number(profile.landArea) === 1 ? "" : "s"}`],
    ["Sowing date", profile.sowingDate],
    ["Irrigation", profile.irrigationType],
    ["Soil", profile.soilType],
    ["Language", languageLabels[profile.preferredLanguage] || profile.preferredLanguage],
  ];

  return (
    <GlassCard className={`p-${compact ? "3" : "4"} mb-4`} hoverable={false}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 mb-3">
        <div>
          <div className="dash-card-title mb-1">{title}</div>
          <div className="text-muted-soft" style={{ fontSize: "0.86rem" }}>
            <FiMapPin size={13} /> {location}
          </div>
        </div>
        <Link to="/profile" className="text-dim" style={{ fontSize: "0.82rem" }}>
          Edit profile
        </Link>
      </div>
      <div className="row g-2">
        {details.map(([label, value]) => (
          <div className={compact ? "col-6 col-md-4" : "col-6 col-md-4 col-xl-2"} key={label}>
            <div className="text-dim" style={{ fontSize: "0.7rem" }}>{label}</div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{value}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
