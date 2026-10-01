import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiUsers, FiCheckCircle, FiX } from "react-icons/fi";
import GlassCard from "../common/GlassCard";
import Button from "../common/Button";
import { labourList } from "../../data/labour";
import { useUI } from "../../context/UIContext";

export default function BookingFlow({ preselected }) {
  const { pushToast } = useUI();
  const [workerId, setWorkerId] = useState(preselected?.id || labourList[0].id);
  const [date, setDate] = useState("2026-07-14");
  const [hours, setHours] = useState(8);
  const [workers, setWorkers] = useState(2);
  const [showConfirm, setShowConfirm] = useState(false);

  const worker = labourList.find((l) => l.id === workerId) || labourList[0];
  const estimatedCost = worker.hourlyWage * hours * workers;

  function book(e) {
    e.preventDefault();
    setShowConfirm(true);
  }

  function confirm() {
    setShowConfirm(false);
    pushToast(`Booking confirmed for ${workers} worker(s) on ${date}`);
  }

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <GlassCard className="p-4" hoverable={false}>
          <div className="dash-card-title mb-3">Book Labour</div>
          <form onSubmit={book}>
            <div className="field-group">
              <label className="field-label">Worker</label>
              <select className="field-select" value={workerId} onChange={(e) => setWorkerId(e.target.value)}>
                {labourList.map((l) => <option key={l.id} value={l.id}>{l.name} — ₹{l.hourlyWage}/hr</option>)}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label"><FiCalendar style={{ marginRight: 6 }} />Date</label>
              <input type="date" className="field-input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="row">
              <div className="col-6 field-group">
                <label className="field-label"><FiClock style={{ marginRight: 6 }} />Hours</label>
                <input type="number" min="1" max="14" className="field-input" value={hours} onChange={(e) => setHours(+e.target.value)} />
              </div>
              <div className="col-6 field-group">
                <label className="field-label"><FiUsers style={{ marginRight: 6 }} />Workers</label>
                <input type="number" min="1" max="20" className="field-input" value={workers} onChange={(e) => setWorkers(+e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-100 justify-content-center">Review & Book</Button>
          </form>
        </GlassCard>
      </div>

      <div className="col-lg-6">
        <GlassCard className="p-4 h-100" hoverable={false}>
          <div className="dash-card-title mb-3">Estimated Cost</div>
          <div style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-primary)" }}>
            ₹{estimatedCost.toLocaleString("en-IN")}
          </div>
          <p className="text-muted-soft" style={{ fontSize: "0.85rem" }}>
            {workers} worker(s) × {hours} hours × ₹{worker.hourlyWage}/hr
          </p>
          <hr className="divider-soft" />
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.88rem" }}>
            <span>Worker</span><b>{worker.name}</b>
          </div>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.88rem" }}>
            <span>Date</span><b>{date}</b>
          </div>
          <div className="d-flex justify-content-between" style={{ fontSize: "0.88rem" }}>
            <span>Rating</span><b>{worker.rating} ★</b>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(10,20,12,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card-strong p-4" style={{ maxWidth: 420, width: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontWeight: 800, margin: 0 }}>Confirm Booking</h5>
                <button className="btn-agri btn-agri-icon btn-agri-sm" onClick={() => setShowConfirm(false)}><FiX /></button>
              </div>
              <FiCheckCircle size={40} color="var(--color-primary)" style={{ marginBottom: 14 }} />
              <p>
                You're booking <b>{worker.name}</b> and {workers - 1 > 0 ? `${workers - 1} other worker(s)` : "themself"} for{" "}
                <b>{hours} hours</b> on <b>{date}</b>, estimated at <b>₹{estimatedCost.toLocaleString("en-IN")}</b>.
              </p>
              <Button className="w-100 justify-content-center" onClick={confirm}>Confirm Booking</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
