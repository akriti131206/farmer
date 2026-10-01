import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMapPin, FiStar, FiTool, FiX, FiCheckCircle, FiCalendar } from "react-icons/fi";
import { GiFarmTractor } from "react-icons/gi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import { equipmentTypes, equipmentList } from "../data/equipment";
import { useUI } from "../context/UIContext";
import "./EquipmentRental.css";

export default function EquipmentRental() {
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");
  const [sortByDistance, setSortByDistance] = useState(true);
  const [bookingItem, setBookingItem] = useState(null);
  const [days, setDays] = useState(1);
  const [date, setDate] = useState("2026-07-14");
  const [confirmed, setConfirmed] = useState(false);
  const { pushToast } = useUI();

  const filtered = useMemo(() => {
    let list = equipmentList.filter(
      (e) =>
        (type === "All" || e.type === type) &&
        (e.name.toLowerCase().includes(query.toLowerCase()) || e.provider.toLowerCase().includes(query.toLowerCase()))
    );
    if (sortByDistance) list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    return list;
  }, [type, query, sortByDistance]);

  function openBooking(item) {
    setBookingItem(item);
    setDays(1);
    setConfirmed(false);
  }

  function confirmBooking(e) {
    e.preventDefault();
    setConfirmed(true);
  }

  const estimatedCost = bookingItem ? bookingItem.ratePerDay * days : 0;

  return (
    <div>
      <PageHeading
        eyebrow="Operations"
        title="Equipment Rental"
        subtitle="Find and rent nearby tractors, harvesters, seed drills, sprayers, and other farm machinery."
      />
      <FarmProfileSummary title="Nearby services context" compact />

      <GlassCard className="p-3 mb-4" hoverable={false}>
        <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch align-items-md-center">
          <div style={{ position: "relative", flex: 1 }}>
            <FiSearch style={{ position: "absolute", left: 14, top: 12, color: "var(--text-muted)" }} />
            <input
              className="field-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search equipment or provider…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {equipmentTypes.map((t) => (
              <button key={t} className={`chip ${type === t ? "active" : ""}`} onClick={() => setType(t)}>
                {t}
              </button>
            ))}
          </div>
          <button className={`chip ${sortByDistance ? "active" : ""}`} onClick={() => setSortByDistance((s) => !s)}>
            <FiMapPin size={12} /> Nearest first
          </button>
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <GlassCard className="p-4"><EmptyState icon={<GiFarmTractor />} title="No equipment found" subtitle="Try a different search term or category." /></GlassCard>
        ) : (
          <motion.div className="row g-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {filtered.map((eq, i) => (
              <div className="col-6 col-lg-3" key={eq.id}>
                <GlassCard className="equip-card" delay={i * 0.04}>
                  <div className="equip-img" style={{ background: eq.color }}>
                    <GiFarmTractor />
                    <span
                      className={`badge-agri ${eq.availability === "Available" ? "badge-success" : "badge-warning"}`}
                      style={{ position: "absolute", top: 10, right: 10 }}
                    >
                      {eq.availability === "Available" ? "Available" : "Booked"}
                    </span>
                  </div>
                  <div className="equip-body">
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: 6 }}>{eq.name}</div>
                    <div className="equip-meta"><FiTool size={12} /> {eq.type} · {eq.hp}</div>
                    <div className="equip-meta"><FiMapPin size={12} /> {eq.village} · {eq.distanceKm} km away</div>
                    <div className="equip-meta"><FiStar size={12} color="var(--color-sun)" fill="var(--color-sun)" /> {eq.rating} · {eq.provider}</div>
                    <div className="mt-auto pt-2 d-flex justify-content-between align-items-end">
                      <div>
                        <div className="equip-rate">₹{eq.ratePerDay.toLocaleString("en-IN")}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>per day · ₹{eq.ratePerHour}/hr</div>
                      </div>
                      <button
                        className="btn-agri btn-agri-primary btn-agri-sm"
                        disabled={eq.availability !== "Available"}
                        onClick={() => openBooking(eq)}
                      >
                        Rent
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookingItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(10,20,12,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setBookingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card-strong p-4" style={{ maxWidth: 440, width: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontWeight: 800, margin: 0 }}>{confirmed ? "Rental Confirmed" : "Rent Equipment"}</h5>
                <button className="btn-agri btn-agri-icon btn-agri-sm" onClick={() => setBookingItem(null)}><FiX /></button>
              </div>

              {!confirmed ? (
                <form onSubmit={confirmBooking}>
                  <p className="text-muted-soft" style={{ fontSize: "0.88rem" }}>
                    {bookingItem.name} from <b>{bookingItem.provider}</b> ({bookingItem.village}, {bookingItem.distanceKm} km away)
                  </p>
                  <div className="field-group">
                    <label className="field-label"><FiCalendar style={{ marginRight: 6 }} />Start Date</label>
                    <input type="date" className="field-input" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Number of Days</label>
                    <input type="number" min="1" max="30" className="field-input" value={days} onChange={(e) => setDays(+e.target.value)} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3" style={{ fontSize: "0.95rem" }}>
                    <span>Estimated Cost</span>
                    <b style={{ fontSize: "1.2rem", color: "var(--color-primary)" }}>₹{estimatedCost.toLocaleString("en-IN")}</b>
                  </div>
                  <Button type="submit" className="w-100 justify-content-center">Confirm Rental</Button>
                </form>
              ) : (
                <div className="text-center py-2">
                  <FiCheckCircle size={44} color="var(--color-primary)" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: "0.9rem" }}>
                    <b>{bookingItem.name}</b> booked from <b>{date}</b> for <b>{days} day(s)</b>, total{" "}
                    <b>₹{estimatedCost.toLocaleString("en-IN")}</b>. {bookingItem.provider} will contact you to confirm pickup/delivery.
                  </p>
                  <Button
                    className="w-100 justify-content-center"
                    onClick={() => { setBookingItem(null); pushToast("Equipment rental confirmed"); }}
                  >
                    Done
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
