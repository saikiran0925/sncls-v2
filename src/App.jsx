import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNav from "./components/SideNav";
import "./App.css";
import EditorRouter from "./components/EditorRouter";
import sampleData from "./data/sampleData"; // Import the data

const App = () => {
  return (
    <Router>
      <div className="ui-container">
        <SideNav />
        <Routes>
          <Route
            path="/jsonify"
            element={<EditorRouter cardData={sampleData} />}
          />
          <Route
            path="/blank-space"
            element={<EditorRouter cardData={sampleData} />}
          />
          <Route
            path="/diff-editor"
            element={<EditorRouter cardData={sampleData} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
