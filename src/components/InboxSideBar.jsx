import React from "react";
import "./InboxSidebar.css";

const Card = ({ name, title, content, timestamp }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{name}</h3>
        <span className="card-timestamp">{timestamp}</span>
      </div>
      <h4 className="card-subtitle">{title}</h4>
      <p className="card-content">{content}</p>
    </div>
  );
};

const InboxSidebar = ({ cardsData }) => {
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
          <Card
            key={index}
            name={card.name}
            title={card.title}
            content={card.content}
            timestamp={card.timestamp}
          />
        ))}
      </div>
    </div>
  );
};

export default InboxSidebar;
