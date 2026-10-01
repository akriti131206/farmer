import { FiDownload, FiClock, FiCheckCircle, FiCalendar } from "react-icons/fi";
import GlassCard from "../common/GlassCard";
import { paymentSummary, paymentHistory } from "../../data/labour";
import { useUI } from "../../context/UIContext";

export default function PaymentDashboard() {
  const { pushToast } = useUI();
  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <GlassCard className="payment-tile" hoverable={false}>
            <FiClock size={22} color="#f5b942" style={{ marginBottom: 8 }} />
            <div className="amt">₹{paymentSummary.pending.toLocaleString("en-IN")}</div>
            <div className="text-muted-soft" style={{ fontSize: "0.82rem" }}>Pending Payments</div>
          </GlassCard>
        </div>
        <div className="col-md-4">
          <GlassCard className="payment-tile" hoverable={false}>
            <FiCheckCircle size={22} color="var(--color-primary)" style={{ marginBottom: 8 }} />
            <div className="amt">₹{paymentSummary.paid.toLocaleString("en-IN")}</div>
            <div className="text-muted-soft" style={{ fontSize: "0.82rem" }}>Paid This Month</div>
          </GlassCard>
        </div>
        <div className="col-md-4">
          <GlassCard className="payment-tile" hoverable={false}>
            <FiCalendar size={22} color="var(--color-sky)" style={{ marginBottom: 8 }} />
            <div className="amt">₹{paymentSummary.upcoming.toLocaleString("en-IN")}</div>
            <div className="text-muted-soft" style={{ fontSize: "0.82rem" }}>Upcoming Payments</div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="p-4" hoverable={false}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="dash-card-title mb-0">Payment History</div>
          <button className="btn-agri btn-agri-outline btn-agri-sm" onClick={() => pushToast("Receipt downloaded (mock)", "info")}>
            <FiDownload /> Download All
          </button>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", fontSize: "0.76rem", textTransform: "uppercase" }}>
                <th>Worker</th><th>Date</th><th>Amount</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.worker}</td>
                  <td>{p.date}</td>
                  <td>₹{p.amount.toLocaleString("en-IN")}</td>
                  <td><span className={`badge-agri ${p.status === "Paid" ? "badge-success" : "badge-warning"}`}>{p.status}</span></td>
                  <td>
                    <button className="btn-agri btn-agri-ghost btn-agri-sm" onClick={() => pushToast(`Receipt for ${p.worker} downloaded`, "info")}>
                      <FiDownload size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
