import React, { useContext, useState, useEffect } from "react";
import AppEditorComponent from "./AppEditorComponent";
import AppDiffEditorComponent from "./AppDiffEditorComponent";
import { useLocation } from "react-router-dom";
import { MdFormatAlignLeft, MdCode, MdFormatAlignJustify, MdDeleteOutline } from "react-icons/md";
import { TbBandage, TbBandageFilled } from "react-icons/tb";
import { LuClipboardCopy } from "react-icons/lu";
import { AiOutlineSave } from "react-icons/ai";
import "../css/EditorComponent.css";
import { Tooltip, Empty } from "antd";
import { showNotification, generateISO8601 } from "../utilities/utils";
import axiosInstance from "../services/axiosInstance";
import AuthContext from "../services/contexts/AuthContext";

const EditorComponent = ({ selectedCardContent, onContentChange, onDeleteCard, setSelectedCardContent }) => {
  const [currentEditorValue, setCurrentEditorValue] = useState(null);
  const { updateCardContent, isLocalMode } = useContext(AuthContext);

  const routeToConfig = {
    jsonify: {
      title: "JSONify",
      language: "json",
      buttons: [
        { name: "Prettify", icon: <MdFormatAlignLeft /> },
        { name: "Stringify", icon: <MdFormatAlignJustify /> },
        { name: "Escape", icon: <TbBandageFilled /> },
        { name: "Unescape", icon: <TbBandage /> },
        { name: "Copy", icon: <LuClipboardCopy /> },
        { name: "Save", icon: <AiOutlineSave /> },
        { name: "Close Tab", icon: <MdDeleteOutline /> },
      ],
    },
    "blank-space": {
      title: "Blank Space",
      language: "",
      buttons: [
        { name: "Copy", icon: <LuClipboardCopy /> },
        { name: "Save", icon: <AiOutlineSave /> },
        { name: "Close Tab", icon: <MdDeleteOutline /> },
      ],
    },
    "diff-editor": {
      title: "Diff Editor",
      language: "",
      buttons: [
        { name: "Save", icon: <AiOutlineSave /> },
        { name: "Close Tab", icon: <MdDeleteOutline /> },
      ],
    },
  };

  const location = useLocation();
  const path = location.pathname.slice(1);

  const { title, language, buttons } = routeToConfig[path] || {
    title: "Unknown Editor",
    language: null,
    buttons: [],
  };

  const fetchUpdatedCardContent = () => {
    const cardDataString = localStorage.getItem("cardData");
    const cardData = cardDataString ? JSON.parse(cardDataString) : {};

    if (selectedCardContent?.cardId && cardData[selectedCardContent?.type]) {
      const updatedCard = cardData[selectedCardContent.type].find(
        (card) => card.cardId === selectedCardContent.cardId
      );
      if (updatedCard) {
        setSelectedCardContent(updatedCard);
      }
    }
  };

  const handleSave = async () => {
    fetchUpdatedCardContent();

    if (!selectedCardContent) {
      showNotification("error", "No card selected", "Cannot save an unselected card.");
      return;
    }

    const content = currentEditorValue || selectedCardContent?.content?.data;
    const updatedAt = generateISO8601();

    const updatedContent = {
      ...selectedCardContent,
      metadata: {
        ...selectedCardContent.metadata,
        updatedAt,
      },
      content: {
        ...selectedCardContent.content,
        data: content,
      },
    };

    // Notify the parent component of the content change
    if (onContentChange) {
      onContentChange(updatedContent);
    }

    // Local mode: save to localStorage
    if (isLocalMode) {
      try {
        const cardDataString = localStorage.getItem("cardData");
        let cardData = cardDataString ? JSON.parse(cardDataString) : {};

        if (cardData[selectedCardContent?.type]) {
          const cardIndex = cardData[selectedCardContent?.type].findIndex(
            (card) => card.cardId === selectedCardContent?.cardId
          );

          if (cardIndex !== -1) {
            cardData[selectedCardContent?.type][cardIndex] = updatedContent; // Update existing card
          } else {
            cardData[selectedCardContent?.type].push(updatedContent); // Add new card
          }
        } else {
          cardData[selectedCardContent?.type] = [updatedContent]; // Create a new type category
        }

        localStorage.setItem("cardData", JSON.stringify(cardData));

        showNotification("success", "Saved Locally", "Changes have been saved successfully.");

        // Preserve the selected card after saving
        setSelectedCardContent(updatedContent); // <-- Use the prop
      } catch (error) {
        showNotification("error", "Save Failed", "An error occurred while saving locally.");
        console.error("Local Save Error:", error);
      }

      return;
    }

    // Server mode: save to API
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      showNotification("error", "Authorization Error", "Auth token not found. Please log in again.");
      return;
    }

    try {
      const id = updatedContent.id;
      const response = await axiosInstance.put(
        `/api/dynamic/card/${id}`,
        updatedContent,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        showNotification("success", "Saved to Server", "Changes have been saved successfully.");
        updateCardContent(selectedCardContent?.type, id, updatedContent);

        // Preserve the selected card after saving
        setSelectedCardContent(updatedContent); // <-- Use the prop
      }
    } catch (error) {
      showNotification("error", "Save Failed", "An error occurred while saving to the server.");
      console.error("Server Save Error:", error);
    }
  };

  const handleDelete = () => {
    if (!selectedCardContent) {
      showNotification("error", "No card selected", "Cannot delete an unselected card.");
      return;
    }

    // Call the onDeleteCard prop to handle deletion
    onDeleteCard();
  };

  const handlePrettify = () => {
    try {
      const editorValue = currentEditorValue || selectedCardContent?.content?.data;
      const prettifiedJson = JSON.stringify(JSON.parse(editorValue), null, 2);

      onContentChange({
        ...selectedCardContent,
        content: { ...selectedCardContent.content, data: prettifiedJson },
      });
    } catch {
      showNotification("error", "Invalid JSON format");
    }
  };

  const handleStringify = () => {
    try {
      const content = currentEditorValue || selectedCardContent?.content?.data;
      const stringifiedContent = JSON.stringify(JSON.parse(content));

      onContentChange({
        ...selectedCardContent,
        content: { ...selectedCardContent.content, data: stringifiedContent },
      });
    } catch {
      showNotification("error", "Error during stringification");
    }
  };

  const handleEscapeUnescape = (actionType) => {
    try {
      let editorValue = currentEditorValue || selectedCardContent?.content?.data;

      if (editorValue) {
        editorValue = (actionType === "Escape")
          ? editorValue.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0")
          : editorValue.replace(/\\(.)/g, "$1");
      }

      if (selectedCardContent) {
        onContentChange({
          ...selectedCardContent,
          content: { ...selectedCardContent.content, data: editorValue },
        });
      }
    } catch (error) {
      console.error("Error while escaping:", error);
      showNotification("error", "Invalid JSON format");
    }
  };

  useEffect(() => {
    fetchUpdatedCardContent();
  }, [selectedCardContent?.id, selectedCardContent?.type]);

  const renderEditor = () => {
    if (!selectedCardContent) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Empty description="No content selected for editing" />
        </div>
      );
    }

    if (path === "diff-editor") {
      const { left = "", right = "" } = selectedCardContent?.content?.data || {};
      return (
        <AppDiffEditorComponent
          editorState={{ originalEditorContent: left, modifiedEditorContent: right }}
          onEditorStateChange={(state) => console.log("Diff Editor State Updated: ", state)}
        />
      );
    }

    return (
      <AppEditorComponent
        selectedCardContent={selectedCardContent}
        language={language}
        onEditorStateChange={(state) =>
          setCurrentEditorValue(state.editorContent)
        }
      />
    );
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>{title}</h2>
        <div className="tabs">
          {buttons.map((button, index) => (
            <Tooltip key={index} placement="bottom" title={button.name}>
              <button
                className="tab"
                onClick={() => {
                  switch (button.name) {
                    case "Prettify":
                      handlePrettify();
                      break;
                    case "Stringify":
                      handleStringify();
                      break;
                    case "Copy":
                      navigator.clipboard.writeText(selectedCardContent?.content?.data || "");
                      showNotification("success", "Copied to clipboard");
                      break;
                    case "Save":
                      handleSave();
                      break;
                    case "Close Tab":
                      handleDelete();
                      break;
                    case ("Escape"):
                    case ("Unescape"):
                      handleEscapeUnescape(button.name);
                      break;
                    default:
                      break;
                  }
                }}
              >
                {button.icon}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="editor-component">{renderEditor()}</div>
    </div>
  );
};

export default EditorComponent;
