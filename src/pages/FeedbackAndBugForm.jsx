import React, { useState } from "react";
import axios from "axios";
import "../css/FeedbackAndBugForm.css";
import TopNavBar from "../components/TopNavBar";
import { showNotification } from '../utilities/utils';


const FeedbackAndBugForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("feedback"); // Default to 'feedback'
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate message field
    if (!message.trim()) {
      setError("Message is mandatory.");
      return;
    }

    // Clear previous errors and success messages
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://sncls.com/api/feedback", {
        name: name.trim(),
        email: email.trim(),
        feedback: message.trim(),
        type: type, // Include the type (feedback or bug)
      });

      if (response.data.message) {
        showNotification("info", `Thank you for your ${type === "feedback" ? "feedback" : "bug report"}!`);
        setName("");
        setEmail("");
        setMessage("");
        setType("feedback"); // Reset to default
      }
    } catch (err) {
      showNotification("error", "Error saving feedback/bug");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <TopNavBar title={"Feedback And Bug Form"} />
      <div className="fbb-container">
        <h2 className="fbb-heading">We Value Your Input!</h2>
        <form onSubmit={handleSubmit} className="fbb-form">
          <div className="fbb-formGroup">
            <label htmlFor="type" className="fbb-label">
              Type:
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="fbb-input"
            >
              <option value="feedback">Feedback</option>
              <option value="bug">Bug Report</option>
            </select>
          </div>

          <div className="fbb-formGroup">
            <label htmlFor="name" className="fbb-label">
              Name (optional):
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="fbb-input"
              placeholder="Enter your name"
            />
          </div>

          <div className="fbb-formGroup">
            <label htmlFor="email" className="fbb-label">
              Email (optional):
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="fbb-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="fbb-formGroup">
            <label htmlFor="message" className="fbb-label">
              {type === "feedback" ? "Feedback *" : "Bug Description *"}:
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="fbb-textarea"
              placeholder={
                type === "feedback"
                  ? "Enter your feedback"
                  : "Describe the bug you encountered"
              }
              required
            />
          </div>

          {error && <p className="fbb-error">{error}</p>}
          {success && <p className="fbb-success">{success}</p>}

          <button type="submit" className="fbb-button">
            Submit {type === "feedback" ? "Feedback" : "Bug Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackAndBugForm;
