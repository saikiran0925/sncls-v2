import "../css/CardSideBar.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { timeAgo } from "../utilities/utils";

const CardSideBar = ({ cardsData, onCardSelect }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const location = useLocation();
  const path = location.pathname.slice(1);

  useEffect(() => {
    if (cardsData.length > 0) {
      setActiveCardIndex(0);
      onCardSelect(cardsData[0]);
    }
  }, [location]);

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
      <div className="card-list">
        {cardsData.map((card, index) => (
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
            </div>
            <h4 className="card-subtitle">{card.title}</h4>
            {path !== "diff-editor" && <p className="card-content">{card.content.data}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSideBar;
