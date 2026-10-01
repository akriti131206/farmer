import { FiStar, FiMapPin, FiPhone, FiCalendar, FiAward } from "react-icons/fi";
import GlassCard from "../common/GlassCard";
import Button from "../common/Button";

const days = Array.from({ length: 30 }, (_, i) => i + 1);
const busyDays = [3, 4, 11, 18, 19, 25];

export default function LabourProfile({ worker, onBook, onBack }) {
  if (!worker) return null;
  return (
    <div>
      <button className="btn-agri btn-agri-ghost btn-agri-sm mb-3" onClick={onBack}>← Back to listing</button>
      <div className="row g-4">
        <div className="col-lg-4">
          <GlassCard className="p-4 text-center" hoverable={false}>
            <div className="labour-avatar" style={{ width: 96, height: 96, fontSize: "2rem" }}>{worker.name[0]}</div>
            <h4 style={{ fontWeight: 800, marginBottom: 4 }}>{worker.name}</h4>
            <div className="text-muted-soft mb-2"><FiMapPin size={13} /> {worker.village} · {worker.distanceKm} km away</div>
            <div style={{ fontSize: "0.95rem", marginBottom: 12 }}>
              <FiStar color="var(--color-sun)" fill="var(--color-sun)" /> {worker.rating} · {worker.experience} experience
            </div>
            <div className="mb-3">
              {worker.skills.map((s) => <span className="labour-skill-chip" key={s}>{s}</span>)}
            </div>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <div style={{ fontWeight: 800 }}>₹{worker.dailyWage}</div>
                <div className="text-dim" style={{ fontSize: "0.72rem" }}>Daily Wage</div>
              </div>
              <div className="col-6">
                <div style={{ fontWeight: 800 }}>₹{worker.hourlyWage}</div>
                <div className="text-dim" style={{ fontSize: "0.72rem" }}>Hourly Wage</div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline" className="flex-fill justify-content-center"><FiPhone /> Contact</Button>
              <Button className="flex-fill justify-content-center" onClick={() => onBook(worker)}>Book Now</Button>
            </div>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          <GlassCard className="p-4 mb-3" hoverable={false}>
            <div className="dash-card-title mb-2"><FiAward style={{ marginRight: 6 }} />Experience & Ratings</div>
            <p className="text-muted-soft" style={{ fontSize: "0.9rem" }}>
              {worker.name} has {worker.experience} of hands-on experience across {worker.skills.join(", ").toLowerCase()},
              maintaining a {worker.rating}-star rating from farm owners in {worker.village} and nearby villages.
            </p>
          </GlassCard>

          <GlassCard className="p-4" hoverable={false}>
            <div className="dash-card-title mb-3"><FiCalendar style={{ marginRight: 6 }} />Availability Calendar — July</div>
            <div className="d-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
              {days.map((d) => (
                <div
                  key={d}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 700,
                    background: busyDays.includes(d) ? "rgba(211,47,47,0.12)" : "var(--color-mist)",
                    color: busyDays.includes(d) ? "#c62828" : "var(--color-primary-dark)",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="d-flex gap-3 mt-3" style={{ fontSize: "0.78rem" }}>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--color-mist)", borderRadius: 3, marginRight: 6 }} />Available</span>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "rgba(211,47,47,0.2)", borderRadius: 3, marginRight: 6 }} />Booked</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
