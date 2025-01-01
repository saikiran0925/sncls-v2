import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SideNav from "./components/SideNav";
import "./App.css";
import EditorRouter from "./components/EditorRouter";
import sampleData from "./data/sampleData";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";

const App = () => {
  const location = useLocation();

  const pathsWithUIContainer = ["/jsonify", "/blank-space", "/diff-editor"];
  const showUIContainer = pathsWithUIContainer.includes(location.pathname);

  return (
    <div className={showUIContainer ? "ui-container" : ""}>
      {showUIContainer && <SideNav />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/jsonify" element={<EditorRouter cardData={sampleData} />} />
        <Route path="/blank-space" element={<EditorRouter cardData={sampleData} />} />
        <Route path="/diff-editor" element={<EditorRouter cardData={sampleData} />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
