import React from "react";
import "./SignUpPage.css";
import { Link } from 'react-router-dom';


const SignUpPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-gradient-background"></div>
      <div className="shaped-overlay"></div>
      <div className="content-container">
        <div className="typography-container">
          <h1 className="main-heading">Join Us Today!</h1>
          <p className="sub-heading">
            Be a part of our amazing platform. Experience the best tools and community support.
          </p>
        </div>
        <div className="signup-card">
          <h2 className="card-heading">Create Your Account</h2>
          <form>
            <input type="text" placeholder="Full Name" className="form-input" />
            <input type="email" placeholder="Email" className="form-input" />
            <input type="password" placeholder="Password" className="form-input" />
            <button type="submit" className="signup-button">Sign Up</button>
          </form>
          <p className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
          <p className="home-link"><Link to="/">Go Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

