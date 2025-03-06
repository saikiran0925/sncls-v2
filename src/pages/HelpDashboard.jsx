import React from "react";
import { NavLink } from "react-router-dom";
import "../css/HelpDashboard.css";
import TopNavBar from "../components/TopNavBar";

const helpTopics = [
  { path: "/help/jsonify", title: "JSONify Help", description: "Learn how to format and manipulate JSON data." },
  { path: "/help/encode-decode", title: "Encode/Decode Help", description: "Guide on encoding and decoding text efficiently." },
  { path: "/help/diff-editor", title: "Diff Editor Help", description: "Instructions on comparing and merging text." },
];

const HelpDashboard = () => {
  return (
    <div className="help-dashboard">
      <TopNavBar title="Help Center" />
      <div className="help-list">
        {helpTopics.map((topic) => (
          <NavLink key={topic.path} to={topic.path} className="help-item">
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default HelpDashboard;

