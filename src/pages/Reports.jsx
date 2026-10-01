import { useState } from "react";
import { FiFileText, FiDownload, FiEye, FiBarChart2, FiDroplet, FiUsers, FiCreditCard } from "react-icons/fi";
import { GiPlantRoots } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import { reportTemplates } from "../data/analytics";
import { useUI } from "../context/UIContext";

const iconMap = { "file-bar": FiBarChart2, leaf: GiPlantRoots, droplet: FiDroplet, users: FiUsers, wallet: FiCreditCard };

export default function Reports() {
  const [selected, setSelected] = useState(reportTemplates[0].id);
  const { pushToast } = useUI();
  const active = reportTemplates.find((r) => r.id === selected);

  return (
    <div>
      <PageHeading eyebrow="Insights" title="Reports" subtitle="Generate polished summaries of your farm's performance, ready to download or share." />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-3">
            {reportTemplates.map((r) => {
              const Icon = iconMap[r.icon] || FiFileText;
              return (
                <GlassCard
                  key={r.id}
                  className="p-3"
                  onClick={() => setSelected(r.id)}
                  style={{ cursor: "pointer", borderColor: selected === r.id ? "var(--color-primary)" : undefined }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="feature-icon-box" style={{ background: "var(--gradient-primary)", margin: 0, width: 44, height: 44 }}>
                      <Icon />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{r.name}</div>
                      <div className="text-muted-soft" style={{ fontSize: "0.78rem" }}>{r.desc}</div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div className="col-lg-7">
          <GlassCard className="p-4" hoverable={false} style={{ minHeight: 380 }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <div className="eyebrow">Preview</div>
                <h4 style={{ fontWeight: 800, margin: "4px 0" }}>{active.name}</h4>
                <p className="text-muted-soft" style={{ margin: 0 }}>{active.desc}</p>
              </div>
            </div>

            <div className="p-4 mb-4" style={{ background: "var(--color-mist)", borderRadius: "var(--radius-md)" }}>
              <div className="d-flex justify-content-between mb-3">
                <b>AgriSense AI — {active.name}</b>
                <span className="text-dim" style={{ fontSize: "0.8rem" }}>Generated: {new Date().toLocaleDateString()}</span>
              </div>
              {["Farm Overview", "Key Metrics", "Trend Summary", "Recommendations"].map((sec) => (
                <div key={sec} className="mb-2">
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 4 }}>{sec}</div>
                  <div className="skeleton" style={{ height: 10, width: "90%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 10, width: "65%" }} />
                </div>
              ))}
            </div>

            <div className="d-flex gap-2">
              <Button variant="outline" onClick={() => pushToast("Preview refreshed", "info")}><FiEye /> Preview</Button>
              <Button onClick={() => pushToast(`${active.name} downloaded (mock PDF)`, "success")}><FiDownload /> Download PDF</Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
