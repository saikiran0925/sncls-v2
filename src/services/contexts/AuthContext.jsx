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
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const organizeDataByType = (data) => {
        return data.reduce((acc, card) => {
          const { type } = card;

          if (!acc[type]) {
            acc[type] = [];
          }

          acc[type].push(card);
          return acc;
        }, {});
      };

      const formattedData = response.data.map((card) => ({
        ...card,
        content: {
          ...card.content,
          data: card.content.data,
        },
      }));

      const organizedData = organizeDataByType(formattedData);

      setCardData(JSON.stringify(organizedData));
      localStorage.setItem("cards", JSON.stringify(organizedData));
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
    localStorage.removeItem("cards");
    setToken(null);
    setExpiry(null);
    setUser(null)
    setCardData(null);
  };


  const updateCardContent = (type, id, newContent) => {
    if (!newContent?.content?.data) {
      console.log("No content data provided, exiting...");
      return;
    }
    const cardContentString = cardData;
    let cardContent;
    try {
      cardContent = JSON.parse(cardContentString);
    } catch (error) {
      console.error("Failed to parse cardContent JSON:", error);
      return;
    }

    if (cardContent[type]) {
      const cardIndex = cardContent[type].findIndex(card => card.id === id);

      if (cardIndex !== -1) {

        cardContent[type][cardIndex] = newContent;

        setCardData(JSON.stringify(cardContent));
        localStorage.setItem("cards", JSON.stringify(cardContent));

      } else {
        console.log(`Card with id ${id} not found in type ${type}`);
        return;
      }
    } else {
      console.log(`Type ${type} not found in card content`);
      return;
    }
  };

  // TODO: handle token expiration logic
  useEffect(() => {
    if (!token || (expiry && Date.now() > expiry)) {
      logout();
    }
  }, [token, expiry]);

  return (
    <AuthContext.Provider value={{ token, login, logout, cardData, updateCardContent }}>
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
