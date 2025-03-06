import React from "react";
import { NavLink } from "react-router-dom";
import { FaCode, FaSyncAlt, FaColumns } from "react-icons/fa";
import "../css/HelpDashboard.css";
import TopNavBar from "../components/TopNavBar";

const helpTopics = [
  { path: "/help/jsonify", title: "JSONify Help", description: "Format and manipulate JSON data efficiently.", icon: <FaCode /> },
  { path: "/help/encode-decode", title: "Encode/Decode Help", description: "Master encoding and decoding techniques.", icon: <FaSyncAlt /> },
  { path: "/help/diff-editor", title: "Diff Editor Help", description: "Compare and merge text seamlessly.", icon: <FaColumns /> },
];

const HelpDashboard = () => {
  return (
    <div className="help-dashboard">
      <TopNavBar title="Help Center" />
      <div className="help-list">
        {helpTopics.map((topic) => (
          <NavLink key={topic.path} to={topic.path} className="help-item">
            <div className="help-icon">{topic.icon}</div>
            <div className="help-content">
              <h2>{topic.title}</h2>
              <p>{topic.description}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default HelpDashboard;
