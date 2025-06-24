import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Render a loader or null while checking auth status
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      // replace state passes the last location so that after successful login it redirects back to the original path
      <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
