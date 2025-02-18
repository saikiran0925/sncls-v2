import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/SharedLinksList.css';
import TopNavBar from '../components/TopNavBar';

const SharedLinksList = () => {
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem("sharedLinks") || "[]");
    setLinks(storedLinks);
  }, []);

  const handleOpen = (shareId) => navigate(`/shared/${shareId}`);

  const handleRemove = (shareId) => {
    const updatedLinks = links.filter((id) => id !== shareId);
    setLinks(updatedLinks);
    localStorage.setItem("sharedLinks", JSON.stringify(updatedLinks));
  };

  const handleAddNewLink = () => {
    const newLink = prompt("Enter shared ID:");
    if (newLink) {
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      localStorage.setItem("sharedLinks", JSON.stringify(updatedLinks));
    }
  };

  return (
    <>
      <TopNavBar title="TimeForge" />
      <div className="sll-app-container">
        <h2 className="sll-app-header">Shared Links</h2>
        <button className="sll-submit-button" onClick={handleAddNewLink}>
          ➕ Add Link
        </button>
        <div className="sll-card-container">
          {links.length > 0 ? (
            links.map((shareId) => (
              <div className="sll-card-box" key={shareId}>
                <h3 className="sll-card-title">{shareId}</h3>
                <div className="sll-card-actions">
                  <button className="sll-submit-button" onClick={() => handleOpen(shareId)}>
                    Open
                  </button>
                  <button className="sll-clear-button" onClick={() => handleRemove(shareId)}>
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="sll-no-history">No shared links available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SharedLinksList;
