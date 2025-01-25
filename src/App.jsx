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

const App = () => {
  const location = useLocation();

  // Paths where the SideNav should appear
  const pathsWithUIContainer = ["/jsonify", "/blank-space", "/diff-editor", "/time-forge"];
  const showUIContainer = pathsWithUIContainer.includes(location.pathname);

  return (
    <div className={showUIContainer ? "ui-container" : ""}>
      {showUIContainer && <SideNav />}
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<RedirectIfLoggedIn component={<LoginPage />} />} />
        <Route path="/signup" element={<RedirectIfLoggedIn component={<SignUpPage />} />} />

        <Route element={<PrivateRoute />}>
          <Route path="/jsonify" element={<EditorRouter />} />
          <Route path="/blank-space" element={<EditorRouter />} />
          <Route path="/diff-editor" element={<EditorRouter />} />
          <Route path="/time-forge" element={<TimeForgeApp />} />
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
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);

export default AppWrapper;
