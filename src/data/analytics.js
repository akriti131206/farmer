export const monthlyExpenses = [
  { month: "Feb", expense: 24000, revenue: 32000 },
  { month: "Mar", expense: 28500, revenue: 41000 },
  { month: "Apr", expense: 31200, revenue: 38500 },
  { month: "May", expense: 26800, revenue: 47200 },
  { month: "Jun", expense: 33400, revenue: 52100 },
  { month: "Jul", expense: 29900, revenue: 49800 },
];

export const cropHealthSplit = [
  { name: "Healthy", value: 68, color: "#2e7d32" },
  { name: "Under Watch", value: 20, color: "#f5b942" },
  { name: "At Risk", value: 12, color: "#d32f2f" },
];

export const waterUsageTrend = [
  { week: "W1", usage: 4200 },
  { week: "W2", usage: 3900 },
  { week: "W3", usage: 4600 },
  { week: "W4", usage: 4100 },
  { week: "W5", usage: 3700 },
  { week: "W6", usage: 4400 },
];

export const labourCostTrend = [
  { month: "Feb", cost: 8200 },
  { month: "Mar", cost: 9600 },
  { month: "Apr", cost: 11200 },
  { month: "May", cost: 9800 },
  { month: "Jun", cost: 12400 },
  { month: "Jul", cost: 10600 },
];

export const yieldTrend = [
  { season: "Rabi '24", yield: 82 },
  { season: "Kharif '24", yield: 91 },
  { season: "Rabi '25", yield: 88 },
  { season: "Kharif '25", yield: 96 },
  { season: "Rabi '26", yield: 102 },
];

export const notificationsList = [
  { id: "n1", title: "Rain expected in 48 hours", body: "Delay irrigation for Plot 3 (Wheat) to save water.", time: "10 min ago", type: "weather", unread: true },
  { id: "n2", title: "Disease risk detected", body: "Tomato plot shows early blight symptoms in AI scan.", time: "1 hr ago", type: "alert", unread: true },
  { id: "n3", title: "Payment received", body: "₹4,340 credited from Marketplace sale of Basmati Rice.", time: "3 hrs ago", type: "payment", unread: true },
  { id: "n4", title: "Labour attendance updated", body: "Ram Bahadur marked absent today.", time: "5 hrs ago", type: "labour", unread: false },
  { id: "n5", title: "Government scheme information", body: "Verify scheme details and application windows with an official government source.", time: "Yesterday", type: "scheme", unread: false },
  { id: "n6", title: "Inventory low stock", body: "DAP Fertilizer stock below 20% threshold.", time: "2 days ago", type: "inventory", unread: false },
];

export const inventoryData = {
  seeds: [
    { id: "inv1", name: "Wheat HD-3226", stock: 320, unit: "kg", threshold: 100 },
    { id: "inv2", name: "Rice Basmati 1509", stock: 40, unit: "kg", threshold: 60 },
  ],
  fertilizers: [
    { id: "inv3", name: "NPK 19:19:19", stock: 12, unit: "bags", threshold: 15 },
    { id: "inv4", name: "DAP", stock: 6, unit: "bags", threshold: 20 },
  ],
  machinery: [
    { id: "inv5", name: "Power Tiller", stock: 1, unit: "unit", threshold: 1 },
    { id: "inv6", name: "Sprayer Pump", stock: 3, unit: "units", threshold: 2 },
  ],
  pesticides: [
    { id: "inv7", name: "Mancozeb 75% WP", stock: 8, unit: "kg", threshold: 10 },
    { id: "inv8", name: "Chlorpyrifos 20% EC", stock: 15, unit: "liters", threshold: 8 },
  ],
};

export const diaryEntries = [
  { id: "dy1", date: "2026-07-10", title: "Applied fungicide to Plot 2", note: "Sprayed Mancozeb after AI flagged early blight risk. Weather clear, good coverage.", expense: 900, tag: "Treatment" },
  { id: "dy2", date: "2026-07-08", title: "Wheat sowing completed", note: "Finished sowing Plot 4 (3.2 acres) with HD-3226 seed variety.", expense: 1280, tag: "Sowing" },
  { id: "dy3", date: "2026-07-05", title: "Irrigation - Plot 1", note: "Drip irrigation run for 4 hours, soil moisture back to optimal range.", expense: 300, tag: "Irrigation" },
  { id: "dy4", date: "2026-07-01", title: "Sold rice stock via Marketplace", note: "40 quintals sold at ₹2,150/quintal to a Nalanda buyer.", expense: 0, tag: "Sale" },
];

export const reportTemplates = [
  { id: "r1", name: "Monthly Farm Summary", desc: "Expenses, revenue, yield and labour overview for the month.", icon: "file-bar" },
  { id: "r2", name: "Crop Health Report", desc: "AI diagnosis history and treatment outcomes.", icon: "leaf" },
  { id: "r3", name: "Water Usage Report", desc: "Irrigation logs and water-saving performance.", icon: "droplet" },
  { id: "r4", name: "Labour & Payroll Report", desc: "Attendance, wages, and payment history.", icon: "users" },
  { id: "r5", name: "Financial Statement", desc: "Full profit & loss and ROI breakdown.", icon: "wallet" },
];
