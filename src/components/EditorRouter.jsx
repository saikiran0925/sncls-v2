import React, { useState } from "react";
import InboxSidebar from "./InboxSideBar";
import EditorComponent from "./Editor";
import "../App.css";

const EditorRouter = ({ cardData }) => {
  const [selectedCardContent, setSelectedCardContent] = useState("");

  // Ensure the fallback is provided if blankSpace is missing
  const cardsData = cardData?.blankSpace || [];

  return (
    <div style={{ display: "flex" }}>
      <InboxSidebar
        cardsData={cardsData}
        onCardSelect={(card) => setSelectedCardContent(card.content)}
      />
      <EditorComponent selectedCardContent={selectedCardContent} />
    </div>
  );
};

export default EditorRouter;
