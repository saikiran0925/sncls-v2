import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SideNav from "./components/SideNav";
import "./App.css";
import EditorRouter from "./components/EditorRouter";
import sampleData from "./data/sampleData";
import LandingPage from "./components/LandingPage";

const App = () => {
  const location = useLocation();

  const containerClass = location.pathname !== "/" ? "ui-container" : "";

  return (
    <div className={containerClass}>
      {location.pathname !== "/" && <SideNav />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
