import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DiseaseDetection = lazy(() => import("./pages/DiseaseDetection"));
const SmartIrrigation = lazy(() => import("./pages/SmartIrrigation"));
const AiAssistant = lazy(() => import("./pages/AiAssistant"));
const YieldPrediction = lazy(() => import("./pages/YieldPrediction"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const SeedCalculator = lazy(() => import("./pages/SeedCalculator"));
const WaterCalculator = lazy(() => import("./pages/WaterCalculator"));
const CostEstimator = lazy(() => import("./pages/CostEstimator"));
const FarmCalculator = lazy(() => import("./pages/FarmCalculator"));
const LabourManagement = lazy(() => import("./pages/LabourManagement"));
const EquipmentRental = lazy(() => import("./pages/EquipmentRental"));
const SmartResourceEstimator = lazy(() => import("./pages/SmartResourceEstimator"));
const FarmAnalytics = lazy(() => import("./pages/FarmAnalytics"));
const Inventory = lazy(() => import("./pages/Inventory"));
const GovernmentSchemes = lazy(() => import("./pages/GovernmentSchemes"));
const NearbyServices = lazy(() => import("./pages/NearbyServices"));
const FarmDiary = lazy(() => import("./pages/FarmDiary"));
const CropCalendar = lazy(() => import("./pages/CropCalendar"));
const WeatherIntelligence = lazy(() => import("./pages/WeatherIntelligence"));
const Reports = lazy(() => import("./pages/Reports"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 48, height: 48, borderRadius: "50%",
          border: "4px solid var(--color-mist)", borderTopColor: "var(--color-primary)",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/smart-irrigation" element={<SmartIrrigation />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/seed-calculator" element={<SeedCalculator />} />
          <Route path="/water-calculator" element={<WaterCalculator />} />
          <Route path="/cost-estimator" element={<CostEstimator />} />
          <Route path="/farm-calculator" element={<FarmCalculator />} />
          <Route path="/labour-management" element={<LabourManagement />} />
          <Route path="/equipment-rental" element={<EquipmentRental />} />
          <Route path="/resource-estimator" element={<SmartResourceEstimator />} />
          <Route path="/farm-analytics" element={<FarmAnalytics />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/government-schemes" element={<GovernmentSchemes />} />
          <Route path="/nearby-services" element={<NearbyServices />} />
          <Route path="/farm-diary" element={<FarmDiary />} />
          <Route path="/crop-calendar" element={<CropCalendar />} />
          <Route path="/weather-intelligence" element={<WeatherIntelligence />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
