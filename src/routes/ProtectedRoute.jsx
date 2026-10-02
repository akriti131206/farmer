import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }} role="status">Checking your session…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
