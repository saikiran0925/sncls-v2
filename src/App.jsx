import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNav from "./components/SideNav";
import InboxSideBar from "./components/InboxSideBar";
import "./App.css"
import EditorRouter from "./components/EditorRouter";

const App = () => {
  const cardData = {
    jsonify: [
      {
        name: "John Doe",
        title: "JSON Tips",
        content: "Learn the best practices for JSON formatting...",
        timestamp: "2 days ago",
      },
      {
        name: "Jane Smith",
        title: "API Response",
        content: "Here's the JSON response for the API endpoint...",
        timestamp: "1 week ago",
      },
    ],
    blankSpace: [
      {
        name: "Michael Johnson",
        title: "Empty Thoughts",
        content: "Sometimes, less is more. Here's why blank spaces matter...",
        timestamp: "3 days ago",
      },
    ],
    diffEditor: [
      {
        name: "David Brown",
        title: "Version Control",
        content: "Learn how to compare JSON files efficiently...",
        timestamp: "1 day ago",
      },
    ],
  };

  return (
    <Router>
      <div className="ui-container">
        <SideNav />
        <Routes>
          <Route
            path="/jsonify"
            element={<EditorRouter cardData={cardData} />}
          />
          <Route
            path="/blank-space"
            element={<EditorRouter cardData={cardData} />}
          />
          <Route
            path="/diff-editor"
            element={<EditorRouter cardData={cardData} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
