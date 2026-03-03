import React, { createContext, useState, useCallback, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedCardData = localStorage.getItem("cardData");

  const [cardData, setCardData] = useState(storedCardData || null);
  const [selectedTab, setSelectedTab] = useState("All");

  const toggleTab = (tab) => {
    setSelectedTab(tab);
  };

  // Update a specific card content
  const updateCardContent = useCallback((path, id, newContent) => {
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
  }, []);

  // Delete card
  const deleteCardContent = (type, id) => {
    let cardContent = JSON.parse(localStorage.getItem("cardData")) || {};

    if (cardContent[type]) {
      cardContent[type] = cardContent[type].filter((card) => card.cardId !== id);
      localStorage.setItem("cardData", JSON.stringify(cardContent));
      setCardData(JSON.stringify(cardContent));
    } else {
      console.log(`Type ${type} not found in card content`);
    }
  };

  const getCard = useCallback((type, id) => {
    let cardContent = JSON.parse(localStorage.getItem("cardData")) || {};
    if (cardContent[type]) {
      return cardContent[type].find((card) => card.cardId === id);
    } else {
      console.log(`Type ${type} not found in card content`);
      return;
    }
  }, []);

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

    const isStarred = selectedTab === "All" ? false : true;
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

  return (
    <AuthContext.Provider
      value={{
        cardData,
        updateCardContent,
        deleteCardContent,
        getCard,
        createNewCard,
        isLocalMode: true,
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
