import { useState } from "react";
import PageHeading from "../components/common/PageHeading";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import LabourListing from "../components/labour/LabourListing";
import LabourProfile from "../components/labour/LabourProfile";
import BookingFlow from "../components/labour/BookingFlow";
import BudgetPlanner from "../components/labour/BudgetPlanner";
import AIRecommendation from "../components/labour/AIRecommendation";
import Attendance from "../components/labour/Attendance";
import PaymentDashboard from "../components/labour/PaymentDashboard";
import "./LabourManagement.css";

const tabs = [
  { key: "listing", label: "Find Workers" },
  { key: "booking", label: "Booking" },
  { key: "budget", label: "Budget Planner" },
  { key: "ai", label: "AI Recommendation" },
  { key: "attendance", label: "Attendance" },
  { key: "payments", label: "Payments" },
];

export default function LabourManagement() {
  const [tab, setTab] = useState("listing");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingWorker, setBookingWorker] = useState(null);

  function goToProfile(worker) {
    setSelectedWorker(worker);
  }

  function goToBooking(worker) {
    setBookingWorker(worker);
    setTab("booking");
  }

  return (
    <div>
      <PageHeading
        eyebrow="Module 09"
        title="Labour Management"
        subtitle="Select the activity you need done and let AI match you with nearby available workers, ranked by distance, skill fit, and rating."
      />
      <FarmProfileSummary title="Nearby services context" compact />

      <div className="tab-strip">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => { setTab(t.key); setSelectedWorker(null); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "listing" && (
        selectedWorker ? (
          <LabourProfile worker={selectedWorker} onBook={goToBooking} onBack={() => setSelectedWorker(null)} />
        ) : (
          <LabourListing onSelect={goToProfile} onBook={goToBooking} />
        )
      )}
      {tab === "booking" && <BookingFlow preselected={bookingWorker} />}
      {tab === "budget" && <BudgetPlanner />}
      {tab === "ai" && <AIRecommendation />}
      {tab === "attendance" && <Attendance />}
      {tab === "payments" && <PaymentDashboard />}
    </div>
  );
}
