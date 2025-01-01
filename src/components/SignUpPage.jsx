import React, { useState } from "react";
import "./SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../misc/axiosInstance';
import { notification } from 'antd';

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields (basic validation for demo)
    if (!fullName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      // Making API call using axiosInstance
      const response = await axiosInstance.post('/auth/signup', { username: fullName, email, password });

      // Checking for a successful response (status code 200)
      if (response.status === 200) {
        console.log("Sign up successful", response.data);

        // Show notification on success
        notification.success({
          message: 'Account Created Successfully!',
          description: 'Your account has been created. Redirecting to the homepage, please login from there....',
          placement: 'topRight',  // Position of the notification
          duration: 3,  // Duration for which the notification is displayed
        });

        // Redirect user to the homepage after the notification
        setTimeout(() => {
          navigate("/");
        }, 3000);  // Wait for 3 seconds before navigating to home
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <p className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
          <p className="home-link">
            <Link to="/">Go Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
