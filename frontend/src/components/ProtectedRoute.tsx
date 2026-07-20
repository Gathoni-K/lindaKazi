import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: UserRole;
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signup" replace />;
  }
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}