export const ACTIVITIES = [
  "Ploughing", "Sowing", "Harvesting", "Irrigation", "Spraying", "Weeding", "Other",
];

export const labourList = [
  {
    id: "l1", name: "Suresh Mahato", rating: 4.8, skills: ["Harvesting", "Sowing", "Ploughing"],
    activities: ["Harvesting", "Sowing", "Ploughing"],
    experience: "8 years", dailyWage: 500, hourlyWage: 65, availability: "Available",
    village: "Bakhtiyarpur", distanceKm: 2.4, phone: "+91 98230 11122",
  },
  {
    id: "l2", name: "Geeta Kumari", rating: 4.6, skills: ["Weeding", "Transplanting"],
    activities: ["Weeding", "Sowing"],
    experience: "5 years", dailyWage: 420, hourlyWage: 55, availability: "Available",
    village: "Fatuha", distanceKm: 5.1, phone: "+91 97011 22334",
  },
  {
    id: "l3", name: "Ram Bahadur", rating: 4.9, skills: ["Spraying", "Harvesting", "Machinery Ops"],
    activities: ["Spraying", "Harvesting", "Other"],
    experience: "12 years", dailyWage: 620, hourlyWage: 80, availability: "Busy till Jul 14",
    village: "Danapur", distanceKm: 8.7, phone: "+91 90123 44556",
  },
  {
    id: "l4", name: "Kavita Devi", rating: 4.5, skills: ["Sowing", "Weeding"],
    activities: ["Sowing", "Weeding"],
    experience: "4 years", dailyWage: 400, hourlyWage: 50, availability: "Available",
    village: "Masaurhi", distanceKm: 3.6, phone: "+91 96540 77889",
  },
  {
    id: "l5", name: "Anil Yadav", rating: 4.7, skills: ["Ploughing", "Irrigation Setup"],
    activities: ["Ploughing", "Irrigation"],
    experience: "10 years", dailyWage: 550, hourlyWage: 70, availability: "Available",
    village: "Bihta", distanceKm: 1.2, phone: "+91 95672 33001",
  },
  {
    id: "l6", name: "Rekha Singh", rating: 4.4, skills: ["Harvesting", "Sorting"],
    activities: ["Harvesting", "Other"],
    experience: "6 years", dailyWage: 450, hourlyWage: 58, availability: "Available",
    village: "Naubatpur", distanceKm: 6.3, phone: "+91 93456 66778",
  },
  {
    id: "l7", name: "Mohan Prasad", rating: 4.3, skills: ["Irrigation Setup", "Ploughing"],
    activities: ["Irrigation", "Ploughing"],
    experience: "7 years", dailyWage: 480, hourlyWage: 60, availability: "Available",
    village: "Phulwari Sharif", distanceKm: 4.4, phone: "+91 92345 55667",
  },
  {
    id: "l8", name: "Sita Kumari", rating: 4.6, skills: ["Spraying", "Weeding"],
    activities: ["Spraying", "Weeding"],
    experience: "6 years", dailyWage: 430, hourlyWage: 56, availability: "Busy till Jul 16",
    village: "Bakhtiyarpur", distanceKm: 2.9, phone: "+91 91234 88990",
  },
];

export const attendanceRecords = [
  { id: "a1", worker: "Suresh Mahato", checkIn: "06:45 AM", checkOut: "04:30 PM", hours: 9.5, overtime: 1.5, status: "Present" },
  { id: "a2", worker: "Geeta Kumari", checkIn: "07:00 AM", checkOut: "03:00 PM", hours: 8, overtime: 0, status: "Present" },
  { id: "a3", worker: "Ram Bahadur", checkIn: "-", checkOut: "-", hours: 0, overtime: 0, status: "Absent" },
  { id: "a4", worker: "Kavita Devi", checkIn: "06:50 AM", checkOut: "01:30 PM", hours: 6.5, overtime: 0, status: "Half Day" },
  { id: "a5", worker: "Anil Yadav", checkIn: "06:30 AM", checkOut: "05:00 PM", hours: 10.5, overtime: 2.5, status: "Present" },
];

export const paymentSummary = {
  pending: 18400,
  paid: 96200,
  upcoming: 12600,
};

export const paymentHistory = [
  { id: "pay1", worker: "Suresh Mahato", date: "2026-07-05", amount: 3500, status: "Paid" },
  { id: "pay2", worker: "Anil Yadav", date: "2026-07-05", amount: 3850, status: "Paid" },
  { id: "pay3", worker: "Geeta Kumari", date: "2026-07-04", amount: 2940, status: "Paid" },
  { id: "pay4", worker: "Ram Bahadur", date: "2026-07-08", amount: 4340, status: "Pending" },
  { id: "pay5", worker: "Kavita Devi", date: "2026-07-08", amount: 2400, status: "Pending" },
];
