import React, { createContext, useState, useEffect, useContext } from "react";

// Create the Context
const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // Get token from localStorage (if it exists)
  const storedToken = localStorage.getItem("authToken");
  const storedExpiry = localStorage.getItem("tokenExpiry");

  // State to manage authentication
  const [token, setToken] = useState(storedToken || null);
  const [expiry, setExpiry] = useState(storedExpiry || null);

  // Handle user login
  const login = (authToken, expiresIn) => {
    localStorage.setItem("authToken", authToken); // Save token to localStorage
    localStorage.setItem("tokenExpiry", Date.now() + expiresIn); // Save expiry time
    setToken(authToken); // Update token state
    setExpiry(Date.now() + expiresIn); // Update expiry state
  };

  // Handle user logout
  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    localStorage.removeItem("tokenExpiry"); // Remove expiry time from localStorage
    setToken(null); // Clear token state
    setExpiry(null); // Clear expiry state
  };

  // Optionally, handle token expiration logic, for example:
  useEffect(() => {
    if (!token || (expiry && Date.now() > expiry)) {
      logout(); // Token expired or removed
    }
  }, [token, expiry]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create and export useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
