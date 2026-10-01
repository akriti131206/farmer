import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMapPin, FiStar, FiShoppingBag, FiUser } from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import EmptyState from "../components/common/EmptyState";
import { marketCategories, marketProducts } from "../data/marketplace";
import "./Marketplace.css";

export default function Marketplace() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return marketProducts.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div>
      <PageHeading
        eyebrow="Module 05"
        title="Marketplace"
        subtitle="Buy and sell produce, seeds, fertilizers, and equipment directly with verified farmers and buyers nearby."
      />

      <GlassCard className="p-3 mb-4" hoverable={false}>
        <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch align-items-md-center">
          <div style={{ position: "relative", flex: 1 }}>
            <FiSearch style={{ position: "absolute", left: 14, top: 12, color: "var(--text-muted)" }} />
            <input
              className="field-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search products, sellers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {marketCategories.map((c) => (
              <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <GlassCard className="p-4"><EmptyState icon={<FiShoppingBag />} title="No products found" subtitle="Try a different search term or category." /></GlassCard>
        ) : (
          <motion.div className="row g-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {filtered.map((p, i) => (
              <div className="col-6 col-lg-3" key={p.id}>
                <GlassCard className="product-card" delay={i * 0.04}>
                  <div className="product-img" style={{ background: p.color }}>
                    <FiShoppingBag />
                    <span className={`badge-agri avail-badge ${p.availability === "In Stock" ? "badge-success" : "badge-warning"}`}>
                      {p.availability}
                    </span>
                  </div>
                  <div className="product-body">
                    <div style={{ fontWeight: 700, fontSize: "0.94rem", marginBottom: 6 }}>{p.name}</div>
                    <div className="product-meta"><FiMapPin size={12} /> {p.location}</div>
                    <div className="product-meta"><FiUser size={12} /> {p.seller}</div>
                    <div className="product-meta"><FiStar size={12} color="var(--color-sun)" fill="var(--color-sun)" /> {p.rating} rating</div>
                    <div className="mt-auto pt-2 d-flex justify-content-between align-items-end">
                      <div>
                        <div className="product-price">₹{p.price.toLocaleString("en-IN")}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>per {p.unit} · {p.quantity}</div>
                      </div>
                      <button className="btn-agri btn-agri-primary btn-agri-sm">View</button>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
