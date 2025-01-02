import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/contexts/AuthContext";
import "../css/LandingPage.css";

const features = [
  {
    title: "JSONify",
    description: "A tool that allows you to edit and format JSON data with ease. Prettify, stringify, and more with just a click.",
    icon: "🛠️",
    route: "/jsonify",
  },
  {
    title: "Blank Space",
    description: "A simple, blank page where you can write anything, just like taking notes.",
    icon: "📝",
    route: "/blank-space",
  },
  {
    title: "Diff Editor",
    description: "Easily compare and identify differences between two sets of data or code.",
    icon: "🔍",
    route: "/diff-editor",
  },
];

const title = (
  <>
    What's inside <span className="highlight-title">SNCLS?</span>
  </>
);

const desc = (
  <>
    <span className="highlight">SNCLS</span> (pronounced as <span className="highlight">essentials</span>) is designed to
    consolidate the most commonly used tools by developers into one convenient location.
  </>
);

const FeatureCard = ({ icon, title, description, route }) => {
  return (
    <Link to={route} className="feature-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="action-btn">Explore</div>
    </Link>
  );
};

const LandingPage = () => {
  const { token } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const fullName = storedUser ? storedUser.username : null;

  return (
    <div className="landing-page">
      <div className="background-shapes"></div>
      <header className="hero-section">
        <div className="hero-content">
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
        <div className="hero-buttons">
          {token ? (
            <div className="user-greeting">
              <p>Welcome, <span className="user-name">{fullName || "User"}</span>!</p>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-login">Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-signup">Sign Up</button>
              </Link>
            </>
          )}
        </div>
        <div className="background-shapes-right"></div>
      </header>

      <section className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            route={feature.route}
          />
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
