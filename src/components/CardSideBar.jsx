import "../css/CardSideBar.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Empty, Button } from "antd";
import { FaStar, FaRegStar } from "react-icons/fa";
import { timeAgo } from "../utilities/utils";

const CardSideBar = ({ cardsData, onCardSelect, onCreateCard, selectedCardContent, onStarToggle }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const location = useLocation();
  const path = location.pathname.slice(1);
  const [localCards, setLocalCards] = useState([]);

  useEffect(() => {
    setLocalCards(cardsData);
  }, [cardsData]);

  useEffect(() => {
    if (cardsData.length > 0) {
      const index = cardsData.findIndex(card => card.cardId === selectedCardContent?.cardId);
      setActiveCardIndex(index >= 0 ? index : 0);
    }
  }, [cardsData, selectedCardContent]);

  useEffect(() => {
    updateLocalStorage(localCards);
  }, [localCards]);

  const toggleStar = (card) => {
    const updatedCard = { ...card, isStarred: !card.isStarred };
    onStarToggle(updatedCard);
  };

  const updateLocalStorage = (updatedCards) => {
    const cardDataString = localStorage.getItem("cardData");
    if (!cardDataString) return;
    let cardData = JSON.parse(cardDataString);
    cardData[selectedCardContent?.type] = updatedCards;
    localStorage.setItem("cardData", JSON.stringify(cardData));
  };

  return (
    <div className="sidebar-container">
      <div className="inbox-header">
        <h2>SNCLS</h2>
        <div className="tabs">
          <button className="tab active">All</button>
          <button className="tab">Starred</button>
        </div>
      </div>
      <input className="search-bar" type="text" placeholder="Search" />
      {/* Create Button */}
      <div style={{ padding: "10px", textAlign: "center" }}>
        <Button type="primary" onClick={onCreateCard}>
          Create Card
        </Button>
      </div>
      <div className="card-list">
        {cardsData && cardsData.length > 0 ? (
          cardsData.map((card, index) => (
            <div
              key={index}
              className={`card ${activeCardIndex === index ? "active-card" : ""}`}
              onClick={() => {
                setActiveCardIndex(index);
                onCardSelect(card);
              }}
            >
              <div className="card-header">
                <h3 className="card-title">{card.cardId}</h3>
                <span className="card-timestamp">
                  {card?.metadata?.updatedAt ? timeAgo(card.metadata.updatedAt) : ""}
                </span>
                <span className="star-icon" onClick={() => toggleStar(card)}>
                  {card.isStarred ? <FaStar color="gold" /> : <FaRegStar />}
                </span>
              </div>
              <h4 className="card-subtitle">{card.title}</h4>
              {path !== "diff-editor" && <p className="card-content">{card.content.data}</p>}
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Empty description="No cards available" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSideBar;
