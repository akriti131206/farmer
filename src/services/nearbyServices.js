import { nearbyServiceRecords } from "../data/nearbyServices.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchNearbyServices(location) {
  await delay(180);
  return {
    data: nearbyServiceRecords.map((service) => ({ ...service })),
    isDemo: true,
    sourceLabel: "No real provider API is configured; the demo directory contains no businesses.",
    location,
  };
}

export function buildMapSearchUrl(query) {
  const search = String(query || "").trim();
  if (!search) return null;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(search)}`;
}

export function hasReliableDistance(service) {
  return Number.isFinite(service.distanceKm) && service.distanceKm >= 0;
}

export function filterNearbyServices(services, filters) {
  const query = filters.query.trim().toLowerCase();
  const maximumDistance = filters.maximumDistance ? Number(filters.maximumDistance) : null;

  return services
    .filter((service) => {
      if (filters.category && service.categoryId !== filters.category) return false;

      if (query) {
        const searchable = [
          service.name,
          service.category,
          service.address,
          service.contact,
          service.openingHours,
        ].filter(Boolean).join(" ").toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      if (maximumDistance !== null) {
        if (!hasReliableDistance(service) || service.distanceKm > maximumDistance) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const distanceA = hasReliableDistance(a) ? a.distanceKm : Number.POSITIVE_INFINITY;
      const distanceB = hasReliableDistance(b) ? b.distanceKm : Number.POSITIVE_INFINITY;
      return distanceA - distanceB;
    });
}
