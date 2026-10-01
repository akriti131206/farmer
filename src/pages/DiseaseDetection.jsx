import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUploadCloud, FiImage, FiX, FiActivity, FiInfo, FiTool, FiShield,
  FiFeather, FiDroplet, FiTarget,
} from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { diagnosisHistory as historyData } from "../data/diseases";
import { detectDisease } from "../services/mockApi";
import { useUI } from "../context/UIContext";
import "./DiseaseDetection.css";

const severityBadge = { High: "badge-danger", Medium: "badge-warning", Low: "badge-success" };

export default function DiseaseDetection() {
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const { pushToast } = useUI();

  function handleFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
  }

  async function runAnalysis() {
    setAnalyzing(true);
    const { data } = await detectDisease(preview);
    setResult(data);
    setAnalyzing(false);
    pushToast("Diagnosis complete", "success");
  }

  const confidence = result?.confidence ?? 0;
  const circumference = 2 * Math.PI * 40;
  const dash = (confidence / 100) * circumference;

  return (
    <div>
      <PageHeading
        eyebrow="Module 01"
        title="AI Crop Disease Detection"
        subtitle="Upload a photo of an affected leaf or plant to get an instant AI diagnosis and treatment plan."
      />

      <div className="row g-4">
        <div className="col-lg-5">
          <GlassCard className="p-4">
            <div className="dash-card-title mb-3">Upload a Photo</div>

            {!preview ? (
              <div
                className={`upload-zone ${dragging ? "dragging" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
              >
                <div className="upload-icon"><FiUploadCloud /></div>
                <h6 style={{ fontWeight: 700 }}>Drag & drop your image here</h6>
                <p className="text-muted-soft" style={{ fontSize: "0.85rem" }}>or click to browse — JPG, PNG up to 10MB</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div>
                <div className="preview-image-box mb-3">
                  <img src={preview} alt="Crop preview" />
                  <button
                    className="btn-agri btn-agri-icon btn-agri-sm"
                    style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)", color: "#fff" }}
                    onClick={() => { setPreview(null); setResult(null); }}
                  >
                    <FiX />
                  </button>
                </div>
                <Button variant="primary" className="w-100 justify-content-center" onClick={runAnalysis} disabled={analyzing}>
                  <FiActivity /> {analyzing ? "Analyzing…" : "Run AI Diagnosis"}
                </Button>
              </div>
            )}
          </GlassCard>
        </div>

        <div className="col-lg-7">
          <GlassCard className="p-4" style={{ minHeight: 320 }}>
            <AnimatePresence mode="wait">
              {analyzing && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    style={{ width: 56, height: 56, borderRadius: "50%", border: "4px solid var(--color-mist)", borderTopColor: "var(--color-primary)", marginBottom: 18 }}
                  />
                  <h6 style={{ fontWeight: 700 }}>Analyzing leaf pattern…</h6>
                  <p className="text-muted-soft">Comparing against 40,000+ known crop conditions</p>
                </motion.div>
              )}

              {!analyzing && !result && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <EmptyState
                    icon={<FiImage />}
                    title="No diagnosis yet"
                    subtitle="Upload a crop photo and run the AI diagnosis to see disease name, cause, treatment, and prevention tips here."
                  />
                </motion.div>
              )}

              {!analyzing && result && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                    <div>
                      <span className={`badge-agri ${severityBadge[result.severity]}`}>{result.severity} Severity</span>
                      <h4 style={{ fontWeight: 800, margin: "8px 0 2px" }}>{result.name}</h4>
                      <div className="text-muted-soft" style={{ fontSize: "0.86rem" }}>{result.crop}</div>
                    </div>
                    <div className="confidence-ring">
                      <svg width="96" height="96">
                        <circle cx="48" cy="48" r="40" stroke="var(--color-mist)" strokeWidth="8" fill="none" />
                        <motion.circle
                          cx="48" cy="48" r="40" stroke="var(--color-primary)" strokeWidth="8" fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference}
                          animate={{ strokeDashoffset: circumference - dash }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="ring-label">{confidence}%</div>
                    </div>
                  </div>

                  <p style={{ color: "var(--text-secondary)" }}>{result.description}</p>

                  <div className="mt-2">
                    <div className="result-detail-row">
                      <div className="rd-icon" style={{ background: "#e26d5a" }}><FiInfo /></div>
                      <div><div className="rd-label">Cause</div><div className="rd-value">{result.cause}</div></div>
                    </div>
                    <div className="result-detail-row">
                      <div className="rd-icon" style={{ background: "#2e7d32" }}><FiTool /></div>
                      <div><div className="rd-label">Treatment</div><div className="rd-value">{result.treatment}</div></div>
                    </div>
                    <div className="result-detail-row">
                      <div className="rd-icon" style={{ background: "#4fb0d8" }}><FiFeather /></div>
                      <div><div className="rd-label">Organic Remedy</div><div className="rd-value">{result.organicRemedy}</div></div>
                    </div>
                    <div className="result-detail-row">
                      <div className="rd-icon" style={{ background: "#8d6748" }}><FiShield /></div>
                      <div><div className="rd-label">Prevention</div><div className="rd-value">{result.prevention}</div></div>
                    </div>
                    <div className="result-detail-row">
                      <div className="rd-icon" style={{ background: "#f5b942" }}><FiDroplet /></div>
                      <div><div className="rd-label">Suggested Fertilizer</div><div className="rd-value">{result.fertilizer}</div></div>
                    </div>
                    <div className="result-detail-row">
                      <div className="rd-icon" style={{ background: "#d32f2f" }}><FiTarget /></div>
                      <div><div className="rd-label">Suggested Pesticide</div><div className="rd-value">{result.pesticide}</div></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="p-4 mt-4">
        <div className="dash-card-title mb-3">Diagnosis History</div>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", fontSize: "0.76rem", textTransform: "uppercase" }}>
                <th>Date</th><th>Crop</th><th>Disease</th><th>Confidence</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((h) => (
                <tr key={h.id}>
                  <td>{h.date}</td>
                  <td>{h.crop}</td>
                  <td>{h.disease}</td>
                  <td>{h.confidence}%</td>
                  <td><span className="badge-agri badge-info">{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
