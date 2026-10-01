import { useEffect } from "react";
import { FiExternalLink, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { isOfficialGovernmentUrl } from "../../services/governmentSchemes";
import "./GovernmentSchemes.css";

function DetailList({ title, items, emptyText }) {
  return (
    <section className="scheme-detail-section">
      <h3>{title}</h3>
      {items?.length ? (
        <ul>{items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}</ul>
      ) : (
        <p className="scheme-detail-empty">{emptyText}</p>
      )}
    </section>
  );
}

export default function SchemeDetailsModal({ scheme, onClose }) {
  useEffect(() => {
    if (!scheme) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scheme, onClose]);

  const officialUrl = isOfficialGovernmentUrl(scheme?.officialApplicationUrl)
    ? scheme.officialApplicationUrl
    : null;

  return (
    <AnimatePresence>
      {scheme && (
        <motion.div
          className="scheme-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            className="scheme-modal glass-card-strong"
            role="dialog"
            aria-modal="true"
            aria-labelledby="scheme-modal-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="scheme-modal-header">
              <div>
                <span className={`badge-agri ${scheme.verificationStatus === "verified" ? "badge-success" : "badge-warning"}`}>
                  {scheme.verificationStatus === "verified" ? "Verified record" : "DEMO DATA · UNVERIFIED"}
                </span>
                <h2 id="scheme-modal-title">{scheme.schemeName}</h2>
                <div className="text-muted-soft">{scheme.category || "Category not provided"}</div>
              </div>
              <button type="button" className="btn-agri btn-agri-icon btn-agri-sm" onClick={onClose} aria-label="Close scheme details">
                <FiX />
              </button>
            </div>

            <div className="scheme-modal-body">
              <section className="scheme-detail-section">
                <h3>Description</h3>
                <p>{scheme.description || "No verified description available."}</p>
              </section>
              <DetailList title="Eligibility" items={scheme.eligibility} emptyText="No verified eligibility information available." />
              <DetailList title="Benefits" items={scheme.benefits} emptyText="No verified benefit information available." />
              <DetailList title="Required documents" items={scheme.requiredDocuments} emptyText="No verified document list available." />
              <DetailList title="Application process" items={scheme.applicationSteps} emptyText="No verified application steps available." />

              <div className="scheme-detail-grid">
                <div>
                  <h3>State applicability</h3>
                  <p>{scheme.state?.length ? scheme.state.join(", ") : "Not specified / not verified"}</p>
                </div>
                <div>
                  <h3>Applicable crops</h3>
                  <p>{scheme.applicableCrops?.length ? scheme.applicableCrops.join(", ") : "Not specified / not verified"}</p>
                </div>
                <div>
                  <h3>Deadline</h3>
                  <p>{scheme.deadline || "No fixed/verified deadline available"}</p>
                </div>
                <div>
                  <h3>Last updated</h3>
                  <p>{scheme.lastUpdated || "Not provided (DEMO DATA; not verified)"}</p>
                </div>
              </div>

              <div className="scheme-detail-section">
                <h3>Official application link</h3>
                {officialUrl ? (
                  <a href={officialUrl} target="_blank" rel="noopener noreferrer">
                    Open official government application <FiExternalLink />
                  </a>
                ) : (
                  <p className="scheme-detail-empty">No verified official government application link available.</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
