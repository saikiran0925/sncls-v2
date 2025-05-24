import React from "react";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  console.log("PrivateRoute re-rendered");
  return <Outlet />;
};

export default PrivateRoute;

