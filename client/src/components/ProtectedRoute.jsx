import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingPage } from "./LoadingPage";

export default function ProtectedRoute({ roles }) {
  const { user, role, loading } = useSelector((state) => state.auth);

  if (loading) <LoadingPage />;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
