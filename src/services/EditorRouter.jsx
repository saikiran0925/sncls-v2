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
      // Only set the first card as selected if no card is currently selected
      if (!selectedCardContent || !cards.some(card => card.cardId === selectedCardContent.cardId)) {
        setSelectedCardContent(cards[0]);
      }
    } else {
      setSelectedCardContent(null);
    }
  }, [path]); // Only run when `path` changes

  const handleCreateCard = () => {
    const newCard = createNewCard(path, "New content for the new card.");
    setCardsForSelectedPath((prev) => [...prev, newCard]);
    setSelectedCardContent(newCard); // Set the newly created card as the selected card
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

    // Find the index of the card to be deleted
    const cardIndex = cardsForSelectedPath.findIndex(
      (card) => card.cardId === selectedCardContent.cardId
    );

    // Filter out the deleted card
    const updatedCards = cardsForSelectedPath.filter(
      (card) => card.cardId !== selectedCardContent.cardId
    );

    setCardsForSelectedPath(updatedCards);

    // Select the previous card (if available), otherwise select the next card
    let newSelectedCard = null;
    if (updatedCards.length > 0) {
      if (cardIndex > 0) {
        // Select the previous card
        newSelectedCard = updatedCards[cardIndex - 1];
      } else {
        // If the deleted card was the first card, select the next card
        newSelectedCard = updatedCards[0];
      }
    }

    setSelectedCardContent(newSelectedCard);

    // Update central card data in context
    const jsonObject = JSON.parse(cardData || "{}");
    jsonObject[path] = updatedCards;
    localStorage.setItem("cardData", JSON.stringify(jsonObject));
  };


  const handleStarToggle = (updatedCard) => {
    setCardsForSelectedPath((prevCards) =>
      prevCards.map((card) =>
        card.cardId === updatedCard.cardId ? updatedCard : card
      )
    );

    // Update the global storage
    const jsonObject = JSON.parse(cardData || "{}");
    jsonObject[path] = cardsForSelectedPath;
    localStorage.setItem("cardData", JSON.stringify(jsonObject));
  };


  return (
    <div style={{ display: "flex", flex: 1 }}>
      <CardSideBar
        cardsData={cardsForSelectedPath}
        onCardSelect={(card) => setSelectedCardContent(card)}
        onCreateCard={handleCreateCard}
        isLocalMode={isLocalMode}
        selectedCardContent={selectedCardContent} // Pass selectedCardContent here
        onStarToggle={handleStarToggle}  // <-- Pass function here
      />

      <EditorComponent
        selectedCardContent={selectedCardContent}
        onContentChange={handleContentChange}
        onDeleteCard={handleDeleteCard}
        setSelectedCardContent={setSelectedCardContent} // Pass setSelectedCardContent here
      />
    </div>
  );
};

export default EditorRouter;
