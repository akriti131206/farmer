import { useEffect, useMemo, useState } from "react";
import { FiClock, FiExternalLink, FiMapPin, FiPhone, FiSearch, FiTool } from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import EmptyState from "../components/common/EmptyState";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import FarmModulesNav from "../components/common/FarmModulesNav";
import { nearbyServiceCategories } from "../data/nearbyServices";
import { buildMapSearchUrl, fetchNearbyServices, filterNearbyServices, hasReliableDistance } from "../services/nearbyServices";
import useFarmWorkspace from "../hooks/useFarmWorkspace";
import "./NearbyServices.css";

const initialFilters = { query: "", category: "", maximumDistance: "" };
const distanceOptions = [
  ["", "Any distance"],
  ["5", "Within 5 km"],
  ["10", "Within 10 km"],
  ["25", "Within 25 km"],
  ["50", "Within 50 km"],
];

function getMapUrl(service, farmLocation) {
  const destination = service.address || service.name;
  const query = [destination, farmLocation].filter(Boolean).join(", ");
  return buildMapSearchUrl(query);
}

export default function NearbyServices() {
  const { farmLocation } = useFarmWorkspace();
  const [services, setServices] = useState([]);
  const [sourceLabel, setSourceLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    let active = true;
    fetchNearbyServices(farmLocation)
      .then((result) => {
        if (!active) return;
        setServices(result.data);
        setSourceLabel(result.sourceLabel);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "Nearby services could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [farmLocation]);

  const filteredServices = useMemo(
    () => filterNearbyServices(services, filters),
    [services, filters]
  );
  const locationMapUrl = buildMapSearchUrl(farmLocation);
  const hasFilters = Boolean(filters.query || filters.category || filters.maximumDistance);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  return (
    <div>
      <PageHeading
        eyebrow="Resources"
        title="Nearby Services"
        subtitle="Find agricultural services around the location saved in your farm profile."
        action={locationMapUrl ? (
          <a className="btn-agri btn-agri-outline btn-agri-sm" href={locationMapUrl} target="_blank" rel="noopener noreferrer">
            <FiMapPin /> View farm area on map <FiExternalLink />
          </a>
        ) : undefined}
      />

      <FarmProfileSummary title="Search location from My Farm" compact />
      <FarmModulesNav />

      <div className="nearby-services-notice mb-3" role="note">
        <strong>Provider directory not connected.</strong> {sourceLabel || "No nearby provider records are available yet."}
        {" "}No businesses, distances, contacts, or opening hours are fabricated. Map search uses only your saved village, district, and state; precise device location is not requested.
      </div>

      <GlassCard className="p-3 mb-4" hoverable={false}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-6">
            <label className="nearby-filter-label" htmlFor="service-search">Search services</label>
            <div className="nearby-search">
              <FiSearch aria-hidden="true" />
              <input
                id="service-search"
                className="field-input"
                placeholder="Search by service, address, or provider details"
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-7 col-lg-4">
            <label className="nearby-filter-label" htmlFor="service-category">Service category</label>
            <select
              id="service-category"
              className="field-select"
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option value="">All service categories</option>
              {nearbyServiceCategories.map((category) => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-5 col-lg-2">
            <label className="nearby-filter-label" htmlFor="service-distance">Maximum distance</label>
            <select
              id="service-distance"
              className="field-select"
              value={filters.maximumDistance}
              onChange={(event) => updateFilter("maximumDistance", event.target.value)}
            >
              {distanceOptions.map(([value, label]) => <option key={value || "any"} value={value}>{label}</option>)}
            </select>
          </div>
          {hasFilters && (
            <div className="col-12 d-flex justify-content-end">
              <button type="button" className="btn-agri btn-agri-ghost btn-agri-sm" onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <FiMapPin color="var(--color-primary)" />
          <span className="text-muted-soft" style={{ fontSize: "0.82rem" }}>
            {loading ? "Loading service directory…" : `${filteredServices.length} service${filteredServices.length === 1 ? "" : "s"} found`}
          </span>
        </div>
        <span className="text-dim" style={{ fontSize: "0.72rem" }}>Distances shown only when supplied by a connected source</span>
      </div>

      {loadError && <div className="alert alert-warning" role="alert">{loadError}</div>}

      {loading ? (
        <GlassCard className="p-4"><EmptyState icon={<FiTool />} title="Loading nearby services" subtitle="Please wait while the directory is loaded." /></GlassCard>
      ) : filteredServices.length === 0 ? (
        <GlassCard className="p-4">
          <EmptyState
            icon={<FiTool />}
            title={hasFilters ? "No matching services" : "No provider directory available"}
            subtitle={hasFilters
              ? "The connected directory returned no records matching these filters. Try changing or clearing your filters."
              : "Connect a verified service-provider directory to show nearby businesses. You can still open a map search for your saved farm location above."}
            action={hasFilters ? <button type="button" className="btn-agri btn-agri-outline btn-agri-sm" onClick={clearFilters}>Clear filters</button> : undefined}
          />
        </GlassCard>
      ) : (
        <div className="row g-3">
          {filteredServices.map((service) => {
            const category = nearbyServiceCategories.find((item) => item.id === service.categoryId);
            const mapUrl = getMapUrl(service, farmLocation);
            return (
              <div className="col-12 col-md-6 col-xl-4" key={service.id}>
                <GlassCard className="nearby-service-card p-4 h-100 d-flex flex-column" hoverable={false}>
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <span className="badge-agri badge-info">{category?.label || service.category || "Other service"}</span>
                    {hasReliableDistance(service) && <span className="nearby-distance">{service.distanceKm} km</span>}
                  </div>
                  <h2>{service.name}</h2>
                  {service.address && <p className="nearby-service-detail"><FiMapPin /> {service.address}</p>}
                  {!hasReliableDistance(service) && <p className="nearby-service-detail text-dim">Distance not available</p>}
                  {service.contact && <p className="nearby-service-detail"><FiPhone /> {service.contact}</p>}
                  {service.openingHours && <p className="nearby-service-detail"><FiClock /> {service.openingHours}</p>}
                  {mapUrl && (
                    <a className="btn-agri btn-agri-outline btn-agri-sm justify-content-center mt-auto" href={mapUrl} target="_blank" rel="noopener noreferrer">
                      <FiMapPin /> View on Map <FiExternalLink />
                    </a>
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
