import React, { useState } from "react";
import "./InboxSidebar.css";

const InboxSidebar = ({ cardsData, onCardSelect }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  if (!Array.isArray(cardsData)) {
    console.error("cardsData is not an array:", cardsData);
    return <div>Error: Invalid data provided</div>;
  }

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
              onCardSelect(card); // Notify parent of the selected card
            }}
          >
            <div className="card-header">
              <h3 className="card-title">{card.name}</h3>
              <span className="card-timestamp">{card.timestamp}</span>
            </div>
            <h4 className="card-subtitle">{card.title}</h4>
            <p className="card-content">{card.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InboxSidebar;
