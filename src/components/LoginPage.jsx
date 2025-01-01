import React from "react";
import { Link } from 'react-router-dom';
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="gradient-background">
        <div className="shaped-overlay"></div>
      </div>
      <div className="content-container">
        <div className="typography-container">
          <h1 className="main-heading">Seamless Collaboration</h1>
          <p className="sub-heading">Empowering teams to achieve more together.</p>
        </div>
        <div className="login-card">
          <h2 className="card-heading">Welcome Back!</h2>
          <form>
            <input type="email" placeholder="Email" className="form-input" />
            <input type="password" placeholder="Password" className="form-input" />
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="signup-link">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p className="login-home-link">
            <Link to="/">Go Home</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
