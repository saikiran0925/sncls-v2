import React, { useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../services/contexts/AuthContext";
import CardSideBar from "../components/CardSideBar";
import EditorComponent from "../components/EditorComponent";
import "../App.css";
import { Helmet } from "react-helmet-async";

const EditorRouter = () => {
  const { cardData, createNewCard, updateCardContent, deleteCardContent, isLocalMode, selectedTab } = useContext(AuthContext);
  const [selectedCardContent, setSelectedCardContent] = useState(null);
  const [cardsForSelectedPath, setCardsForSelectedPath] = useState([]);

  const location = useLocation();
  const path = location.pathname.slice(1);

  const pageMetadata = {
    jsonify: {
      title: "JSON Editor, Viewer, Formatter, Validator| SNCLS",
      description: "Format, validate, and beautify your JSON data easily.",
    },
    "blank-space": {
      title: "Blank Space - Freeform Editor | SNCLS",
      description: "A minimalistic space for quick notes, drafts, and ideas.",
    },
    "diff-editor": {
      title: "Diff Editor - Compare Text & Code | SNCLS",
      description: "Compare and analyze differences between two pieces of text or code.",
    },
  };

  const currentMetadata = pageMetadata[path] || {
    title: "Editor | SNCLS",
    description: "A powerful editing tool for various formats.",
  };


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
    let prevData = null;
    if(path === 'diff-editor'){
      const cardDataString = localStorage.getItem("cardData");
      let cardDataObject = cardDataString ? JSON.parse(cardDataString) : {};
      prevData = cardDataObject[path]
    }
    const newCard = createNewCard(path);
    setCardsForSelectedPath((prev) => [...(prevData ? prevData : prev), newCard]);
    setSelectedCardContent(newCard); // Set the newly created card as the selected card
  };

  const handleContentChange = useCallback((updatedCard) => {
    if (!updatedCard) return;

    // Update the specific card in the local state
    setCardsForSelectedPath((prevCards) =>
      prevCards.map((card) => (card.cardId === updatedCard.cardId ? updatedCard : card))
    );

    setSelectedCardContent(updatedCard);

    // Update the content in the central card data (context)
    updateCardContent(path, updatedCard.cardId, updatedCard);
  }, []);

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

    deleteCardContent(selectedCardContent?.type, selectedCardContent.cardId);

    setCardsForSelectedPath(updatedCards);

    // Select the previous card (if available), otherwise select the next card
    let newSelectedCard = null;

    if (updatedCards.length > 0) {
      if (selectedTab === "Starred") {
        // Find the previous starred card before the deleted one
        const previousStarredCards = updatedCards.slice(0, cardIndex).reverse();
        newSelectedCard = previousStarredCards.find(card => card.isStarred) || null;

        // If no previous starred card is found, fall back to the first available starred card
        if (!newSelectedCard) {
          newSelectedCard = updatedCards.find(card => card.isStarred) || null;
        }
      } else {
        if (cardIndex > 0) {
          newSelectedCard = updatedCards[cardIndex - 1];
        } else {
          newSelectedCard = updatedCards[0];
        }
      }
    }

    setSelectedCardContent(newSelectedCard);

    // Update central card data in context
    // const jsonObject = JSON.parse(cardData || "{}");
    // jsonObject[path] = updatedCards;
    // localStorage.setItem("cardData", JSON.stringify(jsonObject));
  };

  const handleStarToggle = (updatedCard) => {
    // Update the specific card in the local state
    let updatedCards = [];
    setCardsForSelectedPath((prevCards) =>{
      updatedCards = prevCards.map((card) =>
        card.cardId === updatedCard.cardId ? updatedCard : card
      )
      return updatedCards;
    });

    setSelectedCardContent((prev) => {
      if(prev.cardId === updatedCard.cardId){
        prev.isStarred = updatedCard.isStarred;
      }
      return prev;  
    });

    // Update the global storage
    const jsonObject = JSON.parse(cardData || "{}");
    jsonObject[path] = updatedCards;
    localStorage.setItem("cardData", JSON.stringify(jsonObject));

    // If the card is being unstarred and the selected tab is "Starred", update the selected card
    if (!updatedCard.isStarred && selectedTab === "Starred") {
      const cardIndex = cardsForSelectedPath.findIndex(
        (card) => card.cardId === updatedCard.cardId
      );
      const previousStarredCards = cardsForSelectedPath.slice(0, cardIndex).reverse();
      if (previousStarredCards.length > 0) {
        const newSelectedCard = previousStarredCards.find(card => card.isStarred) || null;
        setSelectedCardContent(newSelectedCard);
      } else {
        setSelectedCardContent(null);
      }
    }
  };

  return (

    <>

      <Helmet>
        <title>{currentMetadata.title}</title>
        <meta name="description" content={currentMetadata.description} />
        <meta property="og:title" content={currentMetadata.title} />
        <meta property="og:description" content={currentMetadata.description} />
        <meta property="og:url" content={`https://sncls.com/${path}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={currentMetadata.title} />
        <meta name="twitter:description" content={currentMetadata.description} />
      </Helmet>

      <div style={{ display: "flex", flex: 1 }}>
        <CardSideBar
          cardsData={cardsForSelectedPath}
          onCardSelect={(card) => setSelectedCardContent(card)}
          onCreateCard={handleCreateCard}
          isLocalMode={isLocalMode}
          selectedCardContent={selectedCardContent}
          onStarToggle={handleStarToggle}
        />

        <EditorComponent
          selectedCardContent={selectedCardContent}
          onContentChange={handleContentChange}
          onDeleteCard={handleDeleteCard}
          setSelectedCardContent={setSelectedCardContent}
        />
      </div>

    </>
  );
};

export default EditorRouter;
