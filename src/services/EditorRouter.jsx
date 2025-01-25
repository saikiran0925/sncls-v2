import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../services/contexts/AuthContext";
import CardSideBar from "../components/CardSideBar";
import EditorComponent from "../components/EditorComponent";
import "../App.css";

const EditorRouter = () => {
  const { cardData, createNewCard, updateCardContent, isLocalMode } = useContext(AuthContext);
  const [selectedCardContent, setSelectedCardContent] = useState(null);
  const [cardsForSelectedPath, setCardsForSelectedPath] = useState([]);

  const location = useLocation();
  const path = location.pathname.slice(1);

  useEffect(() => {
    let jsonObject = {};
    try {
      jsonObject = cardData ? JSON.parse(cardData) : {};
    } catch (error) {
      console.error("Invalid cardData JSON:", error);
      jsonObject = {};
    }

    const cards = jsonObject[path] || [];
    setCardsForSelectedPath(cards);

    if (cards.length > 0) {
      setSelectedCardContent(cards[0]); // Default to the first card
    } else {
      setSelectedCardContent(null); // Clear selection if no cards exist
    }
  }, [cardData, path]);

  const handleCreateCard = () => {
    const newCard = createNewCard(path, "New content for the new card.");
    setCardsForSelectedPath((prev) => [...prev, newCard]);
    setSelectedCardContent(newCard);
  };

  const handleContentChange = (updatedCard) => {
    if (!updatedCard) return;

    // Update the specific card in the local state
    setCardsForSelectedPath((prevCards) =>
      prevCards.map((card) => (card.cardId === updatedCard.cardId ? updatedCard : card))
    );

    setSelectedCardContent(updatedCard);

    // Update the content in the central card data (context)
    updateCardContent(path, updatedCard.cardId, updatedCard);
  };

  const handleDeleteCard = () => {
    if (!selectedCardContent) return;

    const updatedCards = cardsForSelectedPath.filter(
      (card) => card.id !== selectedCardContent.id
    );

    setCardsForSelectedPath(updatedCards);

    // Select the next card, or clear selection if none remain
    setSelectedCardContent(updatedCards.length > 0 ? updatedCards[0] : null);

    // Update central card data in context
    const jsonObject = JSON.parse(cardData || "{}");
    jsonObject[path] = updatedCards;
    localStorage.setItem("cardData", JSON.stringify(jsonObject));
  };

  return (
    <div style={{ display: "flex", flex: 1 }}>
      <CardSideBar
        cardsData={cardsForSelectedPath}
        onCardSelect={(card) => setSelectedCardContent(card)}
        onCreateCard={handleCreateCard}
        isLocalMode={isLocalMode}
      />

      <EditorComponent
        selectedCardContent={selectedCardContent}
        onContentChange={handleContentChange}
        onDeleteCard={handleDeleteCard} // Pass delete handler to EditorComponent
      />
    </div>
  );
};

export default EditorRouter;
