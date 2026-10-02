import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { GiWheat, GiFertilizerBag, GiFarmTractor, GiChemicalDrop } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import { inventoryData } from "../data/analytics";
import { useAuth } from "../context/AuthContext";
import { getInventoryItems } from "../services/inventoryService";

const categories = [
  { key: "seeds", label: "Seeds", icon: GiWheat, color: "#2e7d32" },
  { key: "fertilizers", label: "Fertilizers", icon: GiFertilizerBag, color: "#8d6748" },
  { key: "machinery", label: "Machinery", icon: GiFarmTractor, color: "#4fb0d8" },
  { key: "pesticides", label: "Pesticides", icon: GiChemicalDrop, color: "#e26d5a" },
];

function toCategoryMap(items) {
  return categories.reduce((acc, category) => {
    acc[category.key] = Array.isArray(items) ? items.filter((item) => item.category === category.key) : [];
    return acc;
  }, {});
}

export default function Inventory() {
  const { user, loading: authLoading } = useAuth();
  const [inventory, setInventory] = useState(inventoryData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return undefined;

    if (!user) {
      setInventory(inventoryData);
      setLoading(false);
      setError("");
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError("");

    getInventoryItems(user.id)
      .then((items) => {
        if (!active) return;
        setInventory(toCategoryMap(items));
      })
      .catch(() => {
        if (!active) return;
        setInventory({ seeds: [], fertilizers: [], machinery: [], pesticides: [] });
        setError("Could not load your inventory right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user, user?.id]);

  const lowStockItems = useMemo(
    () => Object.values(inventory).flat().filter((item) => Number(item.stock) < Number(item.threshold)),
    [inventory]
  );

  return (
    <div>
      <PageHeading eyebrow="Insights" title="Inventory" subtitle="Track seed, fertilizer, machinery, and pesticide stock levels across your farm." />

      {error && (
        <GlassCard className="p-3 mb-4" hoverable={false} style={{ borderColor: "rgba(211,47,47,0.3)" }}>
          <div className="d-flex align-items-center gap-2" style={{ color: "#c62828", fontWeight: 700, fontSize: "0.9rem" }}>
            <FiAlertTriangle /> {error}
          </div>
        </GlassCard>
      )}

      {!loading && lowStockItems.length > 0 && (
        <GlassCard className="p-3 mb-4" hoverable={false} style={{ borderColor: "rgba(211,47,47,0.3)" }}>
          <div className="d-flex align-items-center gap-2" style={{ color: "#c62828", fontWeight: 700, fontSize: "0.9rem" }}>
            <FiAlertTriangle /> {lowStockItems.length} item(s) below recommended stock threshold
          </div>
        </GlassCard>
      )}

      {loading ? (
        <GlassCard className="p-4 mb-4" hoverable={false}>
          <div className="text-center text-muted">Loading inventory…</div>
        </GlassCard>
      ) : (
        <div className="row g-4">
          {categories.map((cat) => {
            const categoryItems = inventory[cat.key] || [];
            return (
              <div className="col-lg-6" key={cat.key}>
                <GlassCard className="p-4 h-100">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="feature-icon-box" style={{ background: cat.color, margin: 0, width: 40, height: 40, fontSize: "1.1rem" }}>
                      <cat.icon />
                    </div>
                    <div className="dash-card-title mb-0">{cat.label}</div>
                  </div>

                  {categoryItems.length === 0 ? (
                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>No items in this category yet.</div>
                  ) : (
                    categoryItems.map((item) => {
                      const pct = Math.min(100, Math.round((Number(item.stock) / (Number(item.threshold) * 2)) * 100));
                      const low = Number(item.stock) < Number(item.threshold);
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
                    })
                  )}
                </GlassCard>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
