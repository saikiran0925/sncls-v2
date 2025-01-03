import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const storedToken = localStorage.getItem("authToken");
  const storedExpiry = localStorage.getItem("tokenExpiry");
  const storedUser = localStorage.getItem("user");
  const storedCardData = localStorage.getItem("cards");

  const [token, setToken] = useState(storedToken || null);
  const [expiry, setExpiry] = useState(storedExpiry || null);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [cardData, setCardData] = useState(storedCardData || null);
  const [loading, setLoading] = useState(false);

  const login = (authToken, expiresIn, user) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("tokenExpiry", Date.now() + expiresIn);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(authToken);
    setExpiry(Date.now() + expiresIn);
    setUser(user);

    fetchData(authToken);
  };

  const fetchData = async (authToken) => {
    if (!authToken) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/dynamic/card', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      console.log("===========");
      console.log("CARDS DATA: ", response);
      console.log("===========");
      setCardData(response.data);
      localStorage.setItem("cards", response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
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
