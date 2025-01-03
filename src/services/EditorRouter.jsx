import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../services/contexts/AuthContext";
import CardSideBar from "../components/CardSideBar";
import EditorComponent from "../components/EditorComponent";
import "../App.css";

const EditorRouter = () => {
  const { cardData } = useContext(AuthContext);

  const [selectedCardContent, setSelectedCardContent] = useState("");

  const jsonObject = JSON.parse(cardData);

  const location = useLocation();
  const path = location.pathname.slice(1);

  const cardsForSelectedPath = jsonObject[path] || [];

  useEffect(() => {
    if (cardsForSelectedPath.length > 0) {
      const initialCard = cardsForSelectedPath[0];
      setSelectedCardContent(initialCard || "");
    } else {
      setSelectedCardContent("");
    }
  }, [cardData, location]);

  return (
    <div style={{ display: "flex" }}>
      <CardSideBar
        cardsData={cardsForSelectedPath}
        onCardSelect={(card) => setSelectedCardContent(card)}
      />

      <EditorComponent
        selectedCardContent={selectedCardContent}
        onContentChange={(newContent) => setSelectedCardContent(newContent)}
      />
    </div>
  );
};

export default EditorRouter;
