import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const storedToken = localStorage.getItem("authToken");
  const storedExpiry = localStorage.getItem("tokenExpiry");
  const storedUser = localStorage.getItem("user");

  const [token, setToken] = useState(storedToken || null);
  const [expiry, setExpiry] = useState(storedExpiry || null);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  const login = (authToken, expiresIn, user) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("tokenExpiry", Date.now() + expiresIn);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(authToken);
    setExpiry(Date.now() + expiresIn);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
    setToken(null);
    setExpiry(null);
    setUser(null)
  };

  // TODO: handle token expiration logic
  useEffect(() => {
    if (!token || (expiry && Date.now() > expiry)) {
      logout();
    }
  }, [token, expiry]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
