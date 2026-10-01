import { FiAlertTriangle } from "react-icons/fi";
import { GiWheat, GiFertilizerBag, GiFarmTractor, GiChemicalDrop } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import { inventoryData } from "../data/analytics";

const categories = [
  { key: "seeds", label: "Seeds", icon: GiWheat, color: "#2e7d32" },
  { key: "fertilizers", label: "Fertilizers", icon: GiFertilizerBag, color: "#8d6748" },
  { key: "machinery", label: "Machinery", icon: GiFarmTractor, color: "#4fb0d8" },
  { key: "pesticides", label: "Pesticides", icon: GiChemicalDrop, color: "#e26d5a" },
];

export default function Inventory() {
  const lowStockItems = Object.values(inventoryData).flat().filter((i) => i.stock < i.threshold);

  return (
    <div>
      <PageHeading eyebrow="Insights" title="Inventory" subtitle="Track seed, fertilizer, machinery, and pesticide stock levels across your farm." />

      {lowStockItems.length > 0 && (
        <GlassCard className="p-3 mb-4" hoverable={false} style={{ borderColor: "rgba(211,47,47,0.3)" }}>
          <div className="d-flex align-items-center gap-2" style={{ color: "#c62828", fontWeight: 700, fontSize: "0.9rem" }}>
            <FiAlertTriangle /> {lowStockItems.length} item(s) below recommended stock threshold
          </div>
        </GlassCard>
      )}

      <div className="row g-4">
        {categories.map((cat) => (
          <div className="col-lg-6" key={cat.key}>
            <GlassCard className="p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="feature-icon-box" style={{ background: cat.color, margin: 0, width: 40, height: 40, fontSize: "1.1rem" }}>
                  <cat.icon />
                </div>
                <div className="dash-card-title mb-0">{cat.label}</div>
              </div>
              {inventoryData[cat.key].map((item) => {
                const pct = Math.min(100, Math.round((item.stock / (item.threshold * 2)) * 100));
                const low = item.stock < item.threshold;
                return (
                  <div key={item.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.86rem" }}>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      <span>
                        {item.stock} {item.unit}
                        {low && <span className="badge-agri badge-danger ms-2">Low Stock</span>}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: low ? "#d32f2f" : "var(--gradient-primary)" }} />
                    </div>
                  </div>
                );
              })}
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}
