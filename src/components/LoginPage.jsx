import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd'; // Import Ant Design's notification
import AuthContext from '../contexts/AuthContext';  // Import the AuthContext
import axiosInstance from '../misc/axiosInstance';
import "./LoginPage.css";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });

      if (response.status === 200) {
        const { token, expiresIn } = response.data;

        // Call the login function from context
        login(token, expiresIn);

        // Show success notification
        notification.success({
          message: 'Login Successful!',
          description: 'You are now logged in. Redirecting to the homepage...',
          placement: 'topRight',
          duration: 3,
        });

        // Redirect to the homepage after a successful login
        setTimeout(() => {
          navigate("/");
        }, 3000);  // Delay to let the user see the notification
      } else {
        setError("Invalid credentials or server error.");
        notification.error({
          message: 'Login Failed',
          description: 'Invalid credentials or there was an error during login. Please try again.',
          placement: 'topRight',
          duration: 3,
        });
      }
    } catch (err) {
      setError("Failed to connect to the server.");
      notification.error({
        message: 'Connection Error',
        description: 'Unable to connect to the server. Please try again later.',
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging In..." : "Login"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
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
