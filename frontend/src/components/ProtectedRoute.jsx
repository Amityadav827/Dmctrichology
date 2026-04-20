import { Navigate, useLocation } from "react-router-dom";
import { getToken, hasPermission } from "../utils/auth";

function ProtectedRoute({ children, permission }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
