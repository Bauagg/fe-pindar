import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import { ADMIN_LOGIN_PATH } from "../config";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-red-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
