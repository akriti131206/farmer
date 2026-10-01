import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAward, FiSearch, FiShield, FiX } from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import EmptyState from "../components/common/EmptyState";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import FarmModulesNav from "../components/common/FarmModulesNav";
import SchemeDetailsModal from "../components/schemes/SchemeDetailsModal";
import { fetchGovernmentSchemes, filterGovernmentSchemes } from "../services/governmentSchemes";
import useFarmWorkspace from "../hooks/useFarmWorkspace";
import "../components/schemes/GovernmentSchemes.css";

const initialFilters = {
  query: "",
  state: "",
  crop: "",
  category: "",
  profileMatch: false,
};

function getUniqueValues(schemes, field) {
  return [...new Set(schemes.flatMap((scheme) => scheme[field] || []))].sort((a, b) => a.localeCompare(b));
}

export default function GovernmentSchemes() {
  const { profile, crop } = useFarmWorkspace();
  const [schemes, setSchemes] = useState([]);
  const [sourceLabel, setSourceLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    let active = true;
    fetchGovernmentSchemes()
      .then((result) => {
        if (!active) return;
        setSchemes(result.data);
        setSourceLabel(result.sourceLabel);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "Government scheme data could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const filtered = useMemo(
    () => filterGovernmentSchemes(schemes, filters, profile),
    [schemes, filters, profile]
  );

  const categories = useMemo(
    () => [...new Set(schemes.map((scheme) => scheme.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [schemes]
  );
  const states = useMemo(() => getUniqueValues(schemes, "state"), [schemes]);
  const crops = useMemo(() => getUniqueValues(schemes, "applicableCrops"), [schemes]);
  const updateFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  const clearFilters = () => setFilters(initialFilters);
  const closeDetails = useCallback(() => setSelectedScheme(null), []);

  const hasFilters = Boolean(filters.query || filters.state || filters.crop || filters.category || filters.profileMatch);

  return (
    <div>
      <PageHeading
        eyebrow="Resources"
        title="Government Schemes"
        subtitle="Search scheme records and check which details are verified before relying on them."
      />
      <FarmProfileSummary title="Your farm details for scheme discovery" compact />
      <FarmModulesNav />

      <div className="schemes-demo-banner mb-3" role="note">
        <strong>DEMO DATA — NOT VERIFIED.</strong> {sourceLabel || "Scheme names and categories are local sample records."}.
        {" "}Eligibility, benefits, documents, application steps, deadlines, state/crop applicability, update dates,
        and official links are intentionally not supplied. Do not use these records to determine eligibility or apply.
      </div>

      <GlassCard className="p-3 mb-4" hoverable={false}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-4">
            <label className="schemes-filter-label" htmlFor="scheme-search">Search schemes</label>
            <div style={{ position: "relative" }}>
              <FiSearch style={{ position: "absolute", left: 14, top: 12, color: "var(--text-muted)" }} />
              <input
                id="scheme-search"
                className="field-input"
                style={{ paddingLeft: 40 }}
                placeholder="Search by scheme name, category, or description"
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <label className="schemes-filter-label" htmlFor="scheme-state">State</label>
            <select id="scheme-state" className="field-select" value={filters.state} onChange={(event) => updateFilter("state", event.target.value)}>
              <option value="">All / not specified</option>
              {profile?.state && !states.includes(profile.state) && <option value={profile.state}>{profile.state} (your profile)</option>}
              {states.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>

          <div className="col-6 col-lg-2">
            <label className="schemes-filter-label" htmlFor="scheme-crop">Crop</label>
            <select id="scheme-crop" className="field-select" value={filters.crop} onChange={(event) => updateFilter("crop", event.target.value)}>
              <option value="">All / not specified</option>
              {profile?.crop && !crops.includes(profile.crop) && <option value={profile.crop}>{profile.crop} (your profile)</option>}
              {crops.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
            </select>
          </div>

          <div className="col-6 col-lg-2">
            <label className="schemes-filter-label" htmlFor="scheme-category">Category</label>
            <select id="scheme-category" className="field-select" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div className="col-6 col-lg-2">
            <label className="schemes-filter-label" htmlFor="scheme-profile-match">Farmer profile</label>
            <select
              id="scheme-profile-match"
              className="field-select"
              value={filters.profileMatch ? "verified" : ""}
              onChange={(event) => updateFilter("profileMatch", event.target.value === "verified")}
            >
              <option value="">All records</option>
              <option value="verified">Verified profile matches</option>
            </select>
          </div>

          {hasFilters && (
            <div className="col-12 d-flex justify-content-end">
              <button type="button" className="btn-agri btn-agri-ghost btn-agri-sm" onClick={clearFilters}>
                <FiX /> Clear filters
              </button>
            </div>
          )}
          {Boolean(profile?.state || crop) && (
            <div className="col-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn-agri btn-agri-outline btn-agri-sm"
                onClick={() => setFilters((current) => ({
                  ...current,
                  state: profile?.state || "",
                  crop: crop || "",
                }))}
              >
                Use My Farm filters
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <FiShield color="var(--color-primary)" />
          <span className="text-muted-soft" style={{ fontSize: "0.82rem" }}>
            {loading ? "Loading scheme records…" : `${filtered.length} demo record${filtered.length === 1 ? "" : "s"}`}
          </span>
        </div>
        <span className="text-dim" style={{ fontSize: "0.72rem" }}>Profile filters match verified metadata only</span>
      </div>

      {loadError && <div className="alert alert-warning" role="alert">{loadError}</div>}

      {loading ? (
        <GlassCard className="p-4"><EmptyState icon={<FiAward />} title="Loading scheme records" subtitle="Please wait while the scheme catalog is loaded." /></GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-4">
          <EmptyState
            icon={<FiAward />}
            title={filters.profileMatch ? "No verified profile matches" : "No scheme records found"}
            subtitle={filters.profileMatch
              ? "The current demo catalog contains no verified eligibility, state, or crop applicability data. This does not mean you are ineligible for any real scheme."
              : "Try a different search or clear filters. No results does not indicate real-world scheme eligibility."}
            action={hasFilters ? <button type="button" className="btn-agri btn-agri-outline btn-agri-sm" onClick={clearFilters}>Clear filters</button> : undefined}
          />
        </GlassCard>
      ) : (
        <div className="row g-4">
          {filtered.map((scheme, index) => (
            <div className="col-md-6 col-xl-4" key={scheme.id}>
              <GlassCard className="p-4 h-100 d-flex flex-column" delay={index * 0.04}>
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <span className="badge-agri badge-info">{scheme.category || "Category not provided"}</span>
                  <span className={`schemes-card-status ${scheme.verificationStatus === "verified" ? "verified" : "demo"}`}>
                    {scheme.verificationStatus === "verified" ? "VERIFIED" : "DEMO · UNVERIFIED"}
                  </span>
                </div>
                <h2 style={{ fontSize: "1.02rem", fontWeight: 800, marginBottom: 9 }}>{scheme.schemeName}</h2>
                <p className="scheme-card-description">{scheme.description || "No verified description available."}</p>
                <div className="scheme-card-meta mb-3">
                  <div>Eligibility: {scheme.eligibility?.length ? "Details available; see record" : "Not verified"}</div>
                  <div>Deadline: {scheme.deadline || "No fixed/verified deadline available"}</div>
                  <div>Last updated: {scheme.lastUpdated || "Not provided (DEMO DATA)"}</div>
                </div>
                <button
                  type="button"
                  className="btn-agri btn-agri-outline btn-agri-sm w-100 justify-content-center mt-auto"
                  onClick={() => setSelectedScheme(scheme)}
                >
                  View scheme details
                </button>
              </GlassCard>
            </div>
          ))}
        </div>
      )}

      <SchemeDetailsModal scheme={selectedScheme} onClose={closeDetails} />
    </div>
  );
}
