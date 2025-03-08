import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Retrieve data from localStorage (if any)
  const storedToken = localStorage.getItem("authToken");
  const storedExpiry = localStorage.getItem("tokenExpiry");
  const storedUser = localStorage.getItem("user");
  const storedCardData = localStorage.getItem("cardData");

  const [token, setToken] = useState(storedToken || null);
  const [expiry, setExpiry] = useState(storedExpiry || null);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [cardData, setCardData] = useState(storedCardData || null);
  const [loading, setLoading] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(!storedToken); // Local mode if no token is found
  const [selectedTab, setSelectedTab] = useState("All");  // Add selectedTab state

  const toggleTab = (tab) => {
    setSelectedTab(tab);
  };

  const login = (authToken, expiresIn, user) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("tokenExpiry", Date.now() + expiresIn);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(authToken);
    setExpiry(Date.now() + expiresIn);
    setUser(user);
    setIsLocalMode(false); // Switch to logged-in mode

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
      localStorage.setItem("cardData", JSON.stringify(organizedData));
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
    // Do not remove 'cards' to preserve them
    setToken(null);
    setExpiry(null);
    setUser(null);
    setCardData(null);
    setIsLocalMode(true); // Switch to local mode
  };

  // Update a specific card content
  const updateCardContent = (path, id, newContent) => {
    if (!newContent?.content?.data) {
      console.log("No content data provided, exiting...");
      return;
    }

    let cardContent = JSON.parse(localStorage.getItem("cardData")) || {};

    let updated = false;

    Object.keys(cardContent).forEach((key) => {
      const cardIndex = cardContent[key].findIndex((card) => card.cardId === id);

      if (cardIndex !== -1) {
        cardContent[key][cardIndex] = newContent;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem("cardData", JSON.stringify(cardContent));
      setCardData(JSON.stringify(cardContent));
    } else {
      console.log(`Card with id ${id} not found in any category`);
    }
  };

  // Delete card
  const deleteCardContent = (type, id) => {

    let cardContent = JSON.parse(localStorage.getItem("cardData")) || {};

    if (cardContent[type]) {
      cardContent[type] = cardContent[type].filter(card => card.cardId !== id);
      localStorage.setItem("cardData", JSON.stringify(cardContent));
      setCardData(JSON.stringify(cardContent));
    } else {
      console.log(`Type ${type} not found in card content`);
      return;
    }
  };



  // Create a new card
  const createNewCard = (type) => {
    let cardContent = JSON.parse(localStorage.getItem("cardData")) || {};

    if (!cardContent[type]) {
      cardContent[type] = [];
    }

    let contentData;
    if (type === "jsonify") {
      contentData = JSON.stringify({ message: "New JSON content" }, null, 2);
    } else if (type === "blank-space") {
      contentData = "New content here";
    } else {
      contentData = "";
    }

    const isStarred = (selectedTab == "All") ? false : true;
    const newCard = {
      cardId: `${Date.now()}`,
      type,
      title: "New Card",
      content: {
        data: contentData,
      },
      isStarred,
      metadata: {
        updatedAt: new Date().toISOString(),
      },
    };

    cardContent[type].push(newCard);
    localStorage.setItem("cardData", JSON.stringify(cardContent));
    setCardData(JSON.stringify(cardContent));

    return newCard;
  };

  // Handle token expiration or logout based on expiry
  useEffect(() => {
    if (!token || (expiry && Date.now() > expiry)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("user");
      setToken(null);
      setExpiry(null);
      setUser(null);
      setIsLocalMode(true); // Switch to local mode
    }
  }, [token, expiry]);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        cardData,
        updateCardContent,
        deleteCardContent,
        createNewCard,
        isLocalMode,
        selectedTab,
        toggleTab,
      }}
    >
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
