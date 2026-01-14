import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = Cookies.get("token");

  const isProtectedRoute = location.pathname.includes("dashboard");

  if (isProtectedRoute && !token) {
    return <Navigate to="/login" replace />;
  }

  if (!isProtectedRoute && token) {
    return <Navigate to="/dashboard/news" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
