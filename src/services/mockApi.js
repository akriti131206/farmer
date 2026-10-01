/**
 * Mock API layer.
 *
 * Every function here mimics an axios call: it returns a Promise that
 * resolves after a short delay with a `{ data }` shaped payload, exactly
 * like `axios.get(...)` would. When a real backend is ready, swap the
 * body of each function for an actual axios call — callers won't change.
 */
import {
  diseaseDatabase,
  diagnosisHistory,
} from "../data/diseases";
import { marketProducts } from "../data/marketplace";
import { labourList, attendanceRecords, paymentHistory } from "../data/labour";
import { notificationsList } from "../data/analytics";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function detectDisease(_imageFile) {
  await delay(1600);
  const result = diseaseDatabase[Math.floor(Math.random() * diseaseDatabase.length)];
  return { data: result };
}

export async function fetchDiagnosisHistory() {
  await delay(500);
  return { data: diagnosisHistory };
}

export async function fetchMarketProducts() {
  await delay(500);
  return { data: marketProducts };
}

export async function fetchLabourList() {
  await delay(500);
  return { data: labourList };
}

export async function fetchAttendance() {
  await delay(400);
  return { data: attendanceRecords };
}

export async function fetchPaymentHistory() {
  await delay(400);
  return { data: paymentHistory };
}

export async function fetchNotifications() {
  await delay(400);
  return { data: notificationsList };
}

const topicResponses = {
  irrigation: [
    "Based on your soil moisture readings, I'd recommend irrigating within the next 24 hours before the forecasted dry spell.",
    "Your crop's current growth stage needs consistent moisture — water every 5-7 days, early morning is best to reduce evaporation loss.",
  ],
  fertilizer: [
    "For most vegetable crops, a balanced NPK 19:19:19 at sowing followed by a nitrogen top-dress 3 weeks in works well.",
    "Split your fertilizer into 2-3 smaller doses instead of one large application — it improves uptake and cuts runoff waste by up to 15%.",
  ],
  price: [
    "Given the current mandi price trend, holding your stock for 5-7 more days could fetch a better price — I'll alert you if prices dip.",
    "Nearby mandi prices are currently stable. Check the Marketplace module for live listings from buyers in your area.",
  ],
  disease: [
    "The pest pressure in your region is currently low. A preventive neem spray should be sufficient this week.",
    "That sounds like it could be early blight or powdery mildew — try the Disease Detection module with a leaf photo for a precise diagnosis.",
  ],
  weather: [
    "Expect partly cloudy skies with a 40% chance of rain in the next 48 hours — a good window to delay irrigation and save water.",
    "Temperatures are trending slightly above normal this week; keep an eye on heat stress for tender seedlings.",
  ],
  default: [
    "Your last diagnosis scan showed early blight risk. I've added a treatment reminder to your Farm Diary.",
    "I can help with crop care, irrigation timing, fertilizer dosage, pest control, weather, or market prices — ask me anything about your farm.",
  ],
};

function pickTopic(message) {
  const m = message.toLowerCase();
  if (/(water|irrigat|moist)/.test(m)) return "irrigation";
  if (/(fertiliz|npk|urea|dap|nutrient)/.test(m)) return "fertilizer";
  if (/(price|mandi|sell|market|rate)/.test(m)) return "price";
  if (/(disease|pest|bug|insect|blight|mildew|fungus|spray)/.test(m)) return "disease";
  if (/(rain|weather|temperature|forecast|climate)/.test(m)) return "weather";
  return "default";
}

export async function sendChatMessage(message) {
  await delay(1100);
  const topic = pickTopic(message || "");
  const options = topicResponses[topic];
  return { data: { reply: options[Math.floor(Math.random() * options.length)] } };
}
