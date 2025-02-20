import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import '../css/SharedLinksList.css';
import TopNavBar from '../components/TopNavBar';

const SharedLinksList = () => {
  const [links, setLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLink, setNewLink] = useState("");
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

  const handleAddNewLink = () => setIsModalOpen(true);

  const handleModalOk = () => {
    if (newLink.trim()) {
      const updatedLinks = [...links, newLink.trim()];
      setLinks(updatedLinks);
      localStorage.setItem("sharedLinks", JSON.stringify(updatedLinks));
    }
    setIsModalOpen(false);
    setNewLink("");
  };

  return (
    <div className="sll-app-container">
      <TopNavBar title="Shared Links" />

      {/* Add Link Button */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddNewLink}
        className="sll-add-link"
      >
        Add Link
      </Button>

      {/* Modal for Adding New Link */}
      <Modal
        title="Add New Link"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Add"
      >
        <Input
          placeholder="Enter shared ID"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
      </Modal>

      {/* Cards Display */}
      <div className="sll-card-container">
        {links.length > 0 ? (
          links.map((shareId) => (
            <div className="sll-card-box" key={shareId}>
              <h3 className="sll-card-title">{shareId}</h3>
              <div className="sll-card-actions">
                <Button
                  type="primary"
                  onClick={() => handleOpen(shareId)}
                  className="sll-button"
                >
                  Open
                </Button>
                <Button
                  type="danger"
                  onClick={() => handleRemove(shareId)}
                  className="sll-clear-button"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="sll-no-history">No shared links available</p>
        )}
      </div>
    </div>
  );
};

export default SharedLinksList;
