import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const PrivateRoute = () => {
  const { token } = useAuth();

  return <Outlet />;
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;

