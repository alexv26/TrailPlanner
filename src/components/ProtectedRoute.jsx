import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({
  children,
  redirectTo = "/account-management/login",
  requiredRole,
}) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/error" replace state={{ errorNum: 403 }} />;
  }

  return children;
}
