import type { ReactNode } from "react";
import { useAppSelector } from "../redux/hooks";
import { Navigate } from "react-router";

interface GuestRouteProps {
  children: ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { role, access_token } = useAppSelector((state) => state.auth);

  if (access_token  && role) {
    // Redirect based on role
    switch (role) {
      case "ADMIN":
        return <Navigate to="/dashboard/admin" replace />;
      case "AGENT":
        return <Navigate to="/dashboard/agent" replace />;
      case "MANAGER":
        return <Navigate to="/dashboard/manager" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If not logged in, render guest routes
  return <>{children}</>;
}
