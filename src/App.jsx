import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SideNav from "./components/SideNav";
import "./App.css";
import EditorRouter from "./services/EditorRouter";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { AuthProvider, useAuth } from "./services/contexts/AuthContext";
import PrivateRoute from "./services/PrivateRoute";
import TimeForgeApp from "./pages/TimeForgeApp";
import SharedEditor from "./pages/SharedEditor";
import EncodeDecodeZone from "./pages/EncodeDecodeZone";
import { HelmetProvider } from "react-helmet-async";
import SharedLinksList from "./pages/SharedLinksList";
import HelpPageWrapper from "./pages/HelpPageWrapper";
import HelpDashboard from "./pages/HelpDashboard";
import JSLab from "./pages/JSLab";


const App = () => {

  const location = useLocation();

  const pathsWithUIContainer = [
    "/jsonify",
    "/blank-space",
    "/diff-editor",
    "/time-forge",
    "/encode-decode-zone",
    "/shared-list",
  ];

  const showUIContainer = pathsWithUIContainer.some(path => location.pathname.startsWith(path))
    || location.pathname.startsWith("/shared") || location.pathname.startsWith("/help");

  return (
    <div className={showUIContainer ? "ui-container" : ""}>
      {showUIContainer && <SideNav />}
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<RedirectIfLoggedIn component={<LoginPage />} />} />
        <Route path="/signup" element={<RedirectIfLoggedIn component={<SignUpPage />} />} />
        <Route path="/shared-list/" element={<SharedLinksList />} />
        <Route path="/shared/:shareId" element={<SharedEditor />} />

        <Route element={<PrivateRoute />}>
          <Route path="/jsonify" element={<EditorRouter />} />
          <Route path="/blank-space" element={<EditorRouter />} />
          <Route path="/diff-editor" element={<EditorRouter />} />
          <Route path="/time-forge" element={<TimeForgeApp />} />
          <Route path="/encode-decode-zone" element={<EncodeDecodeZone />} />
          <Route path="/help/:topic" element={<HelpPageWrapper />} />
          <Route path="/help" element={<HelpDashboard />} />
          <Route path="/js-lab" element={<JSLab />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  );
};

const RedirectIfLoggedIn = ({ component }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" />;
  }

  return component;
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
