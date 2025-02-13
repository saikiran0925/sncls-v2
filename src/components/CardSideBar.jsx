import "../css/CardSideBar.css";
import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Empty, Button, Input } from "antd";
import { FaStar, FaRegStar } from "react-icons/fa";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { timeAgo, generateISO8601 } from "../utilities/utils";
import AuthContext from "../services/contexts/AuthContext";

const CardSideBar = ({ cardsData, onCardSelect, onCreateCard, selectedCardContent, onStarToggle, setSelectedCardContent }) => {
  const { toggleTab } = useContext(AuthContext);
  const [activeCardId, setActiveCardId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("All");
  const location = useLocation();
  const path = location.pathname.slice(1);
  const [localCards, setLocalCards] = useState([]);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    setLocalCards(cardsData);
  }, [cardsData]);

  useEffect(() => {
    if (cardsData.length > 0) {
      const card = cardsData.find(card => card.cardId === selectedCardContent?.cardId);
      setActiveCardId(card ? card.cardId : null);
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
    let cardData = cardDataString ? JSON.parse(cardDataString) : {};
    cardData[selectedCardContent?.type] = updatedCards;
    localStorage.setItem("cardData", JSON.stringify(cardData));
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    toggleTab(tab);

    if (tab === "Starred") {
      const starredCard = localCards.find(card => card.isStarred);
      if (starredCard) {
        setActiveCardId(starredCard.cardId);
        onCardSelect(starredCard);
      } else {
        onCardSelect(null);
      }
    } else {
      setActiveCardId(localCards[0]?.cardId);
      onCardSelect(localCards[0]);
    }
  };

  const handleTitleEdit = (card) => {
    setEditingCardId(card.cardId);
    setEditedTitle(card.title);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleSave = (card) => {
    const updatedAt = generateISO8601();
    const updatedCard = {
      ...card, title: editedTitle, metadata: {
        ...card.metadata,
        updatedAt,
      },
    };
    setLocalCards((prevCards) =>
      prevCards.map((c) => (c.cardId === card.cardId ? updatedCard : c))
    );
    updateLocalStorage([...localCards]);
    setEditingCardId(null);
  };

  const handleTitleCancel = () => {
    setEditingCardId(null);
  };
  const displayedCards = selectedTab === "Starred" ? localCards.filter(card => card.isStarred) : localCards;

  return (
    <div className="sidebar-container">
      <div className="inbox-header">
        <h2>SNCLS</h2>
        <div className="tabs">
          <button className={`tab ${selectedTab === "All" ? "active" : ""}`} onClick={() => handleTabChange("All")}>All</button>
          <button className={`tab ${selectedTab === "Starred" ? "active" : ""}`} onClick={() => handleTabChange("Starred")}>Starred</button>
        </div>
      </div>
      {/* <input className="search-bar" type="text" placeholder="Search" /> */}
      <div style={{ width: "100%", padding: "10px", textAlign: "center" }}>
        <Button type="primary" onClick={onCreateCard} style={{ width: "100%" }}>
          Create Card
        </Button>
      </div>
      <div className="card-list">
        {displayedCards.length > 0 ? (
          displayedCards.map((card) => (
            <div
              key={card.cardId}
              className={`card ${activeCardId === card.cardId ? "active-card" : ""}`}
              onClick={() => {
                setActiveCardId(card.cardId);
                onCardSelect(card);
              }}
            >
              <div className="card-header">
                <div className="card-title-container">
                  {editingCardId === card.cardId ? (
                    <div className="title-edit-container">
                      <Input
                        value={editedTitle}
                        onChange={handleTitleChange}
                        autoFocus
                        className="title-input"
                        maxLength={20}
                      />
                      <div className="edit-actions">
                        <Button icon={<CheckOutlined />} type="text" onClick={() => handleTitleSave(card)} />
                        <Button icon={<CloseOutlined />} type="text" onClick={handleTitleCancel} />
                      </div>
                    </div>
                  ) : (
                    <div className="card-title-wrapper">
                      <h4 className="card-title">{card.title}</h4>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="edit-icon"
                        onClick={() => handleTitleEdit(card)}
                      />
                    </div>
                  )}
                </div>
                <span className="star-icon" onClick={(e) => { e.stopPropagation(); toggleStar(card); }}>
                  {card.isStarred ? <FaStar color="gold" /> : <FaRegStar />}
                </span>
              </div>
              {path !== "diff-editor" && <p className="card-content">{card.content.data}</p>}
              <div className="card-footer">
                <span className="card-timestamp">{card?.metadata?.updatedAt ? timeAgo(card.metadata.updatedAt) : ""}</span>
                <span className="card-id">ID: {card.cardId}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <Empty description="No cards available" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSideBar;
