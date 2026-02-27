import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAppSelector } from "../redux/hooks";

type UserRole = "ADMIN" | "AGENT" | "MANAGER";

interface ProtectedRouteProps {
  role?: UserRole;
  children: ReactNode;
}

export default function ProtectedRoute({
  role: requiredRole,
  children,
}: ProtectedRouteProps) {
  const { access_token: accessToken, role } = useAppSelector(
  // const { accessToken, role } = useAppSelector(
    (state) => state.auth
  );

  //  Not logged in
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
