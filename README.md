# AgriSense AI — Frontend

A premium, fully responsive AgriTech SaaS frontend built with React, Vite, and Bootstrap 5.
This is a **frontend-only** build — every feature runs on realistic mock data so the UI
can be explored end-to-end before a backend is connected.

## Tech Stack

- React 19 + Vite
- React Router DOM
- Bootstrap 5 (utilities + grid) with a custom glassmorphism design system on top
- Framer Motion (page transitions, hover effects, animated numbers)
- Recharts (dashboards & analytics)
- React Icons

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Logging In

Auth is fully mocked — enter **any** email/password on the Login page (or Register)
and you'll be signed in instantly; your session persists in `localStorage`.

## Project Structure

```
src/
  assets/         static assets
  components/
    common/       Button, GlassCard, StatTile, Skeleton, ToastStack, EmptyState, PageHeading
    layout/       Sidebar, Navbar
    labour/       Labour Management sub-views (listing, profile, booking, budget, AI rec, attendance, payments)
  layouts/        DashboardLayout (sidebar+navbar shell), AuthLayout (split branding panel)
  pages/          One file per route (Dashboard, DiseaseDetection, SmartIrrigation, EquipmentRental,
                  SmartResourceEstimator, ...)
  pages/auth/     Login, Register
  context/        ThemeContext (dark/light), UIContext (sidebar/toasts), AuthContext (mock auth)
                  FarmProfileContext (farm profile shared with farmer-facing modules)
  hooks/          useVoice.js — Web Speech API wrapper (speech-to-text + text-to-speech)
  data/           Mock JSON-like datasets (crops, diseases, labour, equipment, resources, marketplace,
                  analytics, weather, nav)
  services/       mockApi.js — axios-shaped async functions, ready to swap for real endpoints
  routes/         ProtectedRoute wrapper
  styles/         theme.css (design tokens), components.css (shared component classes)
```

Farmer and farm details are managed from **My Profile & Farm**. The reusable
`useFarmProfile` hook reads and saves the profile through `src/services/farmProfile.js`;
the current frontend-only implementation stores one profile per signed-in email in
browser local storage. Calculator, dashboard weather, government schemes, farm diary,
labour, and equipment views consume the shared profile context. Replace the service
storage functions with backend calls when a persistent server is available.

The crop calendar, weather intelligence, farm calculator, government schemes, and nearby
services also share derived farmer context through `src/hooks/useFarmWorkspace.js` and
`src/services/farmerWorkspace.js`. Their common module navigation is in
`src/components/common/FarmModulesNav.jsx`; Dashboard summarizes each module and links
to its page without asking farmers to re-enter profile fields.

## Smart Agriculture Modules

- **AI Labour Management** (`/labour-management`) — pick a farming activity (ploughing, sowing,
  harvesting, irrigation, spraying, weeding), and the listing ranks nearby available workers by
  distance, availability, and rating, with an "AI Top Match" badge on the best-fit candidates.
  Includes profile view, booking flow with confirmation modal, budget planner, AI staffing
  recommendation, attendance tracking, and a payment dashboard.
- **Smart Resource Estimation** (`/resource-estimator`) — enter land area + crop to get an
  AI-optimized estimate of seed quantity, water needs, fertilizer (urea/DAP/MOP), and pesticide
  requirements, plus a cost breakdown and waste-reduction recommendations. The dedicated Seed,
  Water, and Cost calculators remain available for more granular single-resource planning.
- **Equipment Rental Management** (`/equipment-rental`) — browse nearby tractors, harvesters,
  seed drills, sprayers, and more by type and distance, see provider details and rates, and rent
  through a booking modal with cost estimate and confirmation.
- **Smart Crop Calendar** (`/crop-calendar`) — builds an approximate, sowing-date-based crop
  lifecycle timeline from the saved farm profile, with stage guidance, activity reminders, and
  locally persisted completion checkmarks. Stage windows and recommendations are illustrative;
  verify agronomic decisions with trusted regional guidance. Add crop templates in
  `src/data/cropCalendar.js` using the existing lifecycle and stage structure.
- **Weather & Crop Intelligence** (`/weather-intelligence`) — keeps sample weather values
  separate from modular, crop-stage-aware advisory rules. Current weather remains the existing
  static demo fixture and is explicitly labeled as neither live nor farm-location-specific.
  Replace `src/services/weatherService.js` with a provider adapter to connect a real weather API;
  refine advisory rules in `src/data/weatherAdvisories.js` using verified regional agronomic data.
- **Farm Calculator** (`/farm-calculator`) — calculates investment from farmer-entered expense
  categories and estimates revenue/profit from manually entered yield and selling price. No market,
  yield, or expense values are assumed; formulas are available in `src/services/farmCalculator.js`.
- **Government Schemes** (`/government-schemes`) — searches and filters a separate scheme catalog,
  with detailed records and an explicit demo/unverified state. The current local records intentionally
  omit unverified eligibility, benefits, deadlines, applicability, documents, and official URLs.
  Replace `src/services/governmentSchemes.js` with an adapter for a maintained official government
  source, then populate and date verified records in `src/data/governmentSchemes.js` or the API response.
- **Nearby Services** (`/nearby-services`) — searches a modular agricultural service directory around
  the saved village/district/state, with category and reliable-distance filters plus map search.
  No provider API is currently configured, so the directory is intentionally empty rather than showing
  invented businesses or contacts. Connect a verified provider in `src/services/nearbyServices.js` and
  return records using the category IDs in `src/data/nearbyServices.js`; device location is not requested.
- **AI Farm Assistant — voice-enabled** (`/ai-assistant`) — chat by typing or speaking. Voice
  input uses the browser's SpeechRecognition API and replies can be read aloud via
  SpeechSynthesis, with a language switcher (English, Hindi, Bengali, Marathi, Tamil, Telugu).
  Falls back gracefully to text-only chat in browsers without Web Speech API support (voice
  works best in Chrome/Edge; a banner explains the fallback elsewhere).

## Design System

- **Primary color:** `#2E7D32` (green), with light green, earth brown, and sky blue accents
- **Typography:** Plus Jakarta Sans (headings) + Poppins (body)
- **Signature motif:** "Field Glass" — glassmorphism panels tinted like morning mist,
  a sunrise gradient mesh, and a subtle leaf-vein texture used sparingly as background detail
- Full dark mode support via a `data-theme` attribute on `<html>`, toggled from the navbar
  or Settings page and persisted in `localStorage`

## Connecting a Real Backend

All data access goes through `src/services/mockApi.js`. Each exported function currently
returns a `Promise` that resolves with `{ data }` after a short simulated delay — the same
shape an `axios.get(...)` call would return. To connect a real backend, replace the body of
each function with an actual Axios call; no changes are needed in the pages/components that
call them.

## Notes

- All "Download PDF" / "Apply Now" / "Book" actions are UI-only and show a toast notification
  to simulate the action — no backend calls are made.
- Chart and stat data lives in `src/data/*.js` and can be edited directly to demo different
  scenarios.
