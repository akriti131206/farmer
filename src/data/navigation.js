import {
  FiGrid, FiCamera, FiDroplet, FiMessageSquare, FiTrendingUp,
  FiShoppingBag, FiPackage, FiUsers, FiBarChart2, FiArchive,
  FiFileText, FiBookOpen, FiClipboard, FiUser, FiSettings, FiAward, FiZap, FiCalendar, FiCloud, FiDollarSign,
  FiMapPin,
} from "react-icons/fi";
import { GiWheat, GiWaterDrop, GiFarmTractor } from "react-icons/gi";

export const navSections = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: FiGrid }],
  },
  {
    label: "AI Modules",
    items: [
      { to: "/disease-detection", label: "Disease Detection", icon: FiCamera },
      { to: "/smart-irrigation", label: "Smart Irrigation", icon: FiDroplet },
      { to: "/ai-assistant", label: "AI Farm Assistant", icon: FiMessageSquare },
      { to: "/yield-prediction", label: "Yield Prediction", icon: FiTrendingUp },
      { to: "/resource-estimator", label: "Resource Estimator", icon: FiZap },
      { to: "/weather-intelligence", label: "Weather Intelligence", icon: FiCloud },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/marketplace", label: "Marketplace", icon: FiShoppingBag },
      { to: "/labour-management", label: "Labour Management", icon: FiUsers },
      { to: "/equipment-rental", label: "Equipment Rental", icon: GiFarmTractor },
      { to: "/nearby-services", label: "Nearby Services", icon: FiMapPin },
      { to: "/seed-calculator", label: "Seed Calculator", icon: GiWheat },
      { to: "/water-calculator", label: "Water Calculator", icon: GiWaterDrop },
      { to: "/cost-estimator", label: "Cost Estimator", icon: FiPackage },
      { to: "/farm-calculator", label: "Farm Calculator", icon: FiDollarSign },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/farm-analytics", label: "Farm Analytics", icon: FiBarChart2 },
      { to: "/inventory", label: "Inventory", icon: FiArchive },
      { to: "/reports", label: "Reports", icon: FiFileText },
    ],
  },
  {
    label: "Resources",
    items: [
      { to: "/crop-calendar", label: "Crop Calendar", icon: FiCalendar },
      { to: "/government-schemes", label: "Govt. Schemes", icon: FiAward },
      { to: "/farm-diary", label: "Farm Diary", icon: FiBookOpen },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/notifications", label: "Notifications", icon: FiClipboard },
      { to: "/profile", label: "Profile", icon: FiUser },
      { to: "/settings", label: "Settings", icon: FiSettings },
    ],
  },
];
