import GlassCard from "../common/GlassCard";
import { attendanceRecords } from "../../data/labour";

const statusBadge = { Present: "badge-success", Absent: "badge-danger", "Half Day": "badge-warning" };

export default function Attendance() {
  return (
    <GlassCard className="p-4" hoverable={false}>
      <div className="dash-card-title mb-3">Today's Attendance</div>
      <div className="table-responsive">
        <table className="table align-middle mb-0" style={{ fontSize: "0.88rem" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", fontSize: "0.76rem", textTransform: "uppercase" }}>
              <th>Worker</th><th>Check-in</th><th>Check-out</th><th>Hours</th><th>Overtime</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.worker}</td>
                <td>{a.checkIn}</td>
                <td>{a.checkOut}</td>
                <td>{a.hours}h</td>
                <td>{a.overtime}h</td>
                <td><span className={`badge-agri ${statusBadge[a.status]}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
