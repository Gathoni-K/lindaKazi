import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";

export function useRoleCTA() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (role: UserRole) => {
    if (user && user.role === role) {
      navigate(role === "worker" ? "/dashboard" : "/client-dashboard");
    } else {
      navigate("/login", { state: { role } });
    }
  };
}