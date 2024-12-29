import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CardSideBar from "./CardSideBar";
import EditorComponent from "./EditorComponent";
import "../App.css";

const EditorRouter = ({ cardData }) => {
  const [selectedCardContent, setSelectedCardContent] = useState("");

  const routeToDataKey = {
    jsonify: "jsonify",
    "blank-space": "blankSpace",
    "diff-editor": "diffEditor",
  };

  const location = useLocation();
  const path = location.pathname.slice(1);

  const dataKey = routeToDataKey[path];
  const cardsData = dataKey === "diff-editor" ? { left: "", right: "" } : cardData[dataKey] || [];
  console.log("Path:", dataKey);
  console.log("Card Data:", cardsData);

  useEffect(() => {
    if (cardsData.length > 0) {
      setSelectedCardContent(cardsData[0].content);
    } else {
      setSelectedCardContent("");
    }
  }, [cardsData]);

  // This callback will be passed to EditorComponent
  const handleContentChange = (newContent) => {
    setSelectedCardContent(newContent);  // Update the content
  };

  return (
    <div style={{ display: "flex" }}>
      <CardSideBar
        cardsData={cardsData}
        onCardSelect={(card) => setSelectedCardContent(card.content)}
        dataKey={dataKey}
      />
      <EditorComponent
        selectedCardContent={selectedCardContent}
        onContentChange={handleContentChange}  // Pass the callback here
      />
    </div>
  );
};

export default EditorRouter;
