import { useEffect, useState } from "react";
import { FiPlus, FiCalendar, FiDollarSign, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import { diaryEntries } from "../data/analytics";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import {
  createMyDiaryEntry,
  deleteMyDiaryEntry,
  getMyDiaryEntries,
  updateMyDiaryEntry,
} from "../services/farmDiaryService";

export default function FarmDiary() {
  const [entries, setEntries] = useState(diaryEntries);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [expense, setExpense] = useState("");
  const [tag, setTag] = useState("Irrigation");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { pushToast } = useUI();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return undefined;
    if (!user) {
      setLoading(false);
      setEntries(diaryEntries);
      return undefined;
    }

    let active = true;
    setLoading(true);
    getMyDiaryEntries()
      .then((savedEntries) => {
        if (active) setEntries([...savedEntries, ...diaryEntries]);
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message || "Could not load your diary entries.");
          setEntries(diaryEntries);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  function resetForm() {
    setTitle("");
    setNote("");
    setExpense("");
    setTag("Irrigation");
    setEditingId(null);
    setShowForm(false);
  }

  async function saveEntry(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const expenseAmount = expense.trim() === "" ? 0 : Number(expense);
    if (!Number.isFinite(expenseAmount) || expenseAmount < 0) {
      const message = "Enter an expense of zero or more.";
      setLoadError(message);
      pushToast(message, "error");
      return;
    }

    setSaving(true);
    setLoadError("");
    try {
      if (editingId) {
        const updatedEntry = await updateMyDiaryEntry(editingId, {
          title,
          note,
          expense: expenseAmount,
          tag,
        });
        setEntries((current) => current.map((entry) => (
          entry.id === editingId ? updatedEntry : entry
        )));
        pushToast("Diary entry updated");
      } else {
        const createdEntry = await createMyDiaryEntry({
          date: new Date().toISOString().slice(0, 10),
          title,
          note,
          expense: expenseAmount,
          tag,
        });
        setEntries((current) => [createdEntry, ...current]);
        pushToast("Diary entry added");
      }
      resetForm();
    } catch (error) {
      setLoadError(error.message || "Could not save your diary entry.");
      pushToast(error.message || "Could not save your diary entry.", "error");
    } finally {
      setSaving(false);
    }
  }

  function editEntry(entry) {
    setEditingId(entry.id);
    setTitle(entry.title);
    setNote(entry.note);
    setExpense(String(entry.expense ?? 0));
    setTag(entry.tag);
    setShowForm(true);
  }

  async function deleteEntry(entryId) {
    setDeletingId(entryId);
    setLoadError("");
    try {
      await deleteMyDiaryEntry(entryId);
      setEntries((current) => current.filter((entry) => entry.id !== entryId));
      if (editingId === entryId) resetForm();
      pushToast("Diary entry deleted");
    } catch (error) {
      setLoadError(error.message || "Could not delete your diary entry.");
      pushToast(error.message || "Could not delete your diary entry.", "error");
    } finally {
      setDeletingId(null);
    }
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

      {loadError && <div className="alert alert-warning" role="alert">{loadError}</div>}
      {loading && <p className="text-muted-soft" role="status">Loading diary entries...</p>}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <GlassCard className="p-4 mb-4" hoverable={false}>
              <form onSubmit={saveEntry}>
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
                  <div className="col-md-4">
                    <label className="field-label" htmlFor="diary-expense">Expense</label>
                    <input
                      id="diary-expense"
                      className="field-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={expense}
                      onChange={(e) => setExpense(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Entry" : "Save Entry"}</Button>
                  <Button type="button" variant="ghost" onClick={resetForm} disabled={saving}><FiX /> Cancel</Button>
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
              {e.persisted && (
                <div className="d-flex gap-2 mt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => editEntry(e)} disabled={saving || deletingId === e.id}>
                    <FiEdit2 /> Edit
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => deleteEntry(e.id)} disabled={deletingId === e.id}>
                    <FiTrash2 /> {deletingId === e.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              )}
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
