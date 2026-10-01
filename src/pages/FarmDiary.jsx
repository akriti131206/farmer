import { useState } from "react";
import { FiPlus, FiCalendar, FiDollarSign, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import { diaryEntries } from "../data/analytics";
import { useUI } from "../context/UIContext";

export default function FarmDiary() {
  const [entries, setEntries] = useState(diaryEntries);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tag, setTag] = useState("Irrigation");
  const { pushToast } = useUI();

  function addEntry(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setEntries([{ id: "dy" + Date.now(), date: new Date().toISOString().slice(0, 10), title, note, expense: 0, tag }, ...entries]);
    setTitle(""); setNote("");
    setShowForm(false);
    pushToast("Diary entry added");
  }

  return (
    <div>
      <PageHeading
        eyebrow="Resources"
        title="Farm Diary"
        subtitle="Log daily activities, notes, and expenses to keep a running record of your farm."
        action={<Button onClick={() => setShowForm((s) => !s)}><FiPlus /> New Entry</Button>}
      />
      <div className="d-flex justify-content-end mb-3">
        <Link to="/crop-calendar" className="btn-agri btn-agri-outline btn-agri-sm">
          <FiCalendar /> Open Crop Calendar
        </Link>
      </div>
      <FarmProfileSummary title="Crop calendar context" compact />

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <GlassCard className="p-4 mb-4" hoverable={false}>
              <form onSubmit={addEntry}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="field-label">Title</label>
                    <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Applied fertilizer to Plot 1" required />
                  </div>
                  <div className="col-md-4">
                    <label className="field-label">Tag</label>
                    <select className="field-select" value={tag} onChange={(e) => setTag(e.target.value)}>
                      <option>Irrigation</option><option>Sowing</option><option>Treatment</option><option>Sale</option><option>General</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="field-label">Notes</label>
                    <textarea className="field-textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Details about the activity…" />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <Button type="submit">Save Entry</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}><FiX /> Cancel</Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="row g-4">
        {entries.map((e, i) => (
          <div className="col-md-6" key={e.id}>
            <GlassCard className="p-4 h-100" delay={i * 0.05}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge-agri badge-info">{e.tag}</span>
                <span className="text-dim" style={{ fontSize: "0.78rem" }}><FiCalendar size={12} /> {e.date}</span>
              </div>
              <h6 style={{ fontWeight: 700, marginBottom: 6 }}>{e.title}</h6>
              <p className="text-muted-soft" style={{ fontSize: "0.86rem" }}>{e.note}</p>
              {e.expense > 0 && (
                <div style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "0.9rem" }}>
                  <FiDollarSign size={13} /> ₹{e.expense.toLocaleString("en-IN")} spent
                </div>
              )}
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}
