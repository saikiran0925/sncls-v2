import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SideNav from "./components/SideNav";
import "./App.css";
import EditorRouter from "./services/EditorRouter";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./services/contexts/AuthContext";
import TimeForgeApp from "./pages/TimeForgeApp";
import EncodeDecodeZone from "./pages/EncodeDecodeZone";
import { HelmetProvider } from "react-helmet-async";
import HelpPageWrapper from "./pages/HelpPageWrapper";
import HelpDashboard from "./pages/HelpDashboard";

const App = () => {
  const location = useLocation();

  const pathsWithUIContainer = [
    "/jsonify",
    "/blank-space",
    "/diff-editor",
    "/time-forge",
    "/encode-decode-zone",
    "/markdown",
  ];

  const showUIContainer =
    pathsWithUIContainer.some((path) => location.pathname.startsWith(path)) ||
    location.pathname.startsWith("/help");

  return (
    <div className={showUIContainer ? "ui-container" : ""}>
      {showUIContainer && <SideNav />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jsonify" element={<EditorRouter />} />
        <Route path="/blank-space" element={<EditorRouter />} />
        <Route path="/diff-editor" element={<EditorRouter />} />
        <Route path="/markdown" element={<EditorRouter />} />
        <Route key={location.pathname} path="/time-forge" element={<TimeForgeApp />} />
        <Route key={location.pathname} path="/encode-decode-zone" element={<EncodeDecodeZone />} />
        <Route path="/help/:topic" element={<HelpPageWrapper />} />
        <Route key={location.pathname} path="/help" element={<HelpDashboard />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <HelmetProvider>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </HelmetProvider>
);

export default AppWrapper;
