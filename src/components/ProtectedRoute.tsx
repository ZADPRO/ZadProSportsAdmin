// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

type ProtectedRouteProps = {
  allowedRoles: ("admin" | "owner")[];
  children: React.ReactNode;
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user } = useUser();

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;