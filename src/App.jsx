import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SideNav from "./components/SideNav";
import "./App.css";
import EditorRouter from "./components/EditorRouter";
import sampleData from "./data/sampleData";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./misc/PrivateRoute";

const App = () => {
  const location = useLocation();

  // Paths where the SideNav should appear
  const pathsWithUIContainer = ["/jsonify", "/blank-space", "/diff-editor"];
  const showUIContainer = pathsWithUIContainer.includes(location.pathname);

  return (
    <div className={showUIContainer ? "ui-container" : ""}>
      {showUIContainer && <SideNav />}
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<RedirectIfLoggedIn component={<LoginPage />} />} />
        <Route path="/signup" element={<RedirectIfLoggedIn component={<SignUpPage />} />} />

        <Route element={<PrivateRoute />}>
          <Route path="/jsonify" element={<EditorRouter cardData={sampleData} />} />
          <Route path="/blank-space" element={<EditorRouter cardData={sampleData} />} />
          <Route path="/diff-editor" element={<EditorRouter cardData={sampleData} />} />
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
