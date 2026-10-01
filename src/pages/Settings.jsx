import { useState } from "react";
import { FiMoon, FiSun, FiGlobe, FiBell, FiLock } from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import { useTheme } from "../context/ThemeContext";
import { useUI } from "../context/UIContext";

function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: "relative", display: "inline-block", width: 46, height: 26, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span
        style={{
          position: "absolute", inset: 0, borderRadius: 999,
          background: checked ? "var(--color-primary)" : "var(--border-glass)",
          transition: "background 0.2s",
        }}
      />
      <span
        style={{
          position: "absolute", top: 3, left: checked ? 23 : 3,
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </label>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { pushToast } = useUI();
  const [prefs, setPrefs] = useState({
    weatherAlerts: true,
    diseaseAlerts: true,
    marketUpdates: false,
    labourReminders: true,
  });
  const [lang, setLang] = useState("English");

  function update(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    pushToast("Preference updated", "info");
  }

  return (
    <div>
      <PageHeading eyebrow="Account" title="Settings" subtitle="Manage appearance, language, and notification preferences." />

      <div className="row g-4">
        <div className="col-lg-6">
          <GlassCard className="p-4 mb-4" hoverable={false}>
            <div className="dash-card-title mb-3">Appearance</div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {theme === "dark" ? <FiMoon /> : <FiSun />} Dark Mode
              </span>
              <Toggle checked={theme === "dark"} onChange={toggleTheme} />
            </div>
          </GlassCard>

          <GlassCard className="p-4" hoverable={false}>
            <div className="dash-card-title mb-3"><FiGlobe style={{ marginRight: 6 }} />Language</div>
            <select className="field-select" value={lang} onChange={(e) => { setLang(e.target.value); pushToast(`Language set to ${e.target.value}`, "info"); }}>
              <option>English</option>
              <option>हिन्दी (Hindi)</option>
              <option>বাংলা (Bengali)</option>
              <option>मराठी (Marathi)</option>
            </select>
          </GlassCard>
        </div>

        <div className="col-lg-6">
          <GlassCard className="p-4 mb-4" hoverable={false}>
            <div className="dash-card-title mb-3"><FiBell style={{ marginRight: 6 }} />Notification Preferences</div>
            {[
              ["weatherAlerts", "Weather Alerts"],
              ["diseaseAlerts", "Disease Risk Alerts"],
              ["marketUpdates", "Marketplace Updates"],
              ["labourReminders", "Labour & Payment Reminders"],
            ].map(([key, label]) => (
              <div key={key} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: "1px solid var(--border-glass)" }}>
                <span>{label}</span>
                <Toggle checked={prefs[key]} onChange={() => update(key)} />
              </div>
            ))}
          </GlassCard>

          <GlassCard className="p-4" hoverable={false}>
            <div className="dash-card-title mb-3"><FiLock style={{ marginRight: 6 }} />Account Security</div>
            <button className="btn-agri btn-agri-outline w-100 justify-content-center mb-2" onClick={() => pushToast("Password reset link sent (mock)", "info")}>
              Change Password
            </button>
            <button className="btn-agri btn-agri-ghost w-100 justify-content-center" onClick={() => pushToast("Two-factor setup coming soon", "info")}>
              Enable Two-Factor Authentication
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
