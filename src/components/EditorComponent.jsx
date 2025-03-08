import React, { useContext, useState, useEffect, useRef } from "react";
import AppEditorComponent from "./AppEditorComponent";
import AppDiffEditorComponent from "./AppDiffEditorComponent";
import { useLocation } from "react-router-dom";
import { MdFormatAlignLeft, MdCode, MdFormatAlignJustify, MdDeleteOutline } from "react-icons/md";
import { IoMdShare } from "react-icons/io";
import { TbBandage, TbBandageFilled } from "react-icons/tb";
import { LuClipboardCopy } from "react-icons/lu";
import { AiOutlineSave } from "react-icons/ai";
import "../css/EditorComponent.css";
import { Tooltip, Empty } from "antd";
import { showNotification, showNotificationWithDescription, generateISO8601 } from "../utilities/utils";
import axiosInstance from "../services/axiosInstance";
import AuthContext from "../services/contexts/AuthContext";

const EditorComponent = ({ selectedCardContent, onContentChange, onDeleteCard, setSelectedCardContent }) => {
  const [currentEditorValue, setCurrentEditorValue] = useState(null);
  const currentEditorRef = useRef(null);
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
        // { name: "Map to JSON", icon: <MdCode /> },
        { name: "Copy", icon: <LuClipboardCopy /> },
        { name: "Save", icon: <AiOutlineSave /> },
        { name: "Share", icon: <IoMdShare /> },
        { name: "Close Tab", icon: <MdDeleteOutline /> },
      ],
    },
    "blank-space": {
      title: "Blank Space",
      language: "",
      buttons: [
        { name: "Copy", icon: <LuClipboardCopy /> },
        { name: "Save", icon: <AiOutlineSave /> },
        { name: "Share", icon: <IoMdShare /> },
        { name: "Close Tab", icon: <MdDeleteOutline /> },
      ],
    },
    "diff-editor": {
      title: "Diff Editor",
      language: "",
      buttons: [
        { name: "Share", icon: <IoMdShare /> },
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
    let updatedCard;

    if (selectedCardContent?.cardId && cardData[selectedCardContent?.type]) {
      updatedCard = cardData[selectedCardContent.type].find(
        (card) => card.cardId === selectedCardContent.cardId
      );
      if (updatedCard && updatedCard?.content && updatedCard?.content?.data) {
        setSelectedCardContent(updatedCard);
      }
    }

    return updatedCard;
  };

  const handleShare = async () => {
    if (!selectedCardContent || !selectedCardContent.content?.data) {
      showNotification("error", "No content to share", "Please select content before sharing.");
      return;
    }

    try {
      const response = await axiosInstance.post("/share", {
        data: selectedCardContent.content.data,
        path,
      });

      if (response.data?.shareId) {
        const shareId = response.data.shareId;
        const shareUrl = `https://sncls.com/shared/${shareId}`;

        const storedLinks = JSON.parse(localStorage.getItem("sharedLinks")) || [];
        if (!storedLinks.includes(shareId)) {
          storedLinks.push(shareId);
          localStorage.setItem("sharedLinks", JSON.stringify(storedLinks));
        }

        await navigator.clipboard.writeText(shareUrl);
        showNotificationWithDescription("success", "Share Link Copied", "This link will expire in 24 hours from now.");
      } else {
        showNotificationWithDescription("error", "Share Failed", "An error occurred while sharing.");
      }
    } catch (error) {
      console.error("Share Error:", error);
      showNotification("error", "Share Failed", "Could not share content.");
    }
  };
  const handleSave = async () => {
    let updatedCard = fetchUpdatedCardContent();

    if (!selectedCardContent) {
      showNotification("error", "No card selected", "Cannot save an unselected card.");
      return;
    }

    const content = path === "diff-editor" ? currentEditorRef.current : currentEditorValue || selectedCardContent?.content?.data;
    const updatedAt = generateISO8601();

    const updatedContent = {
      ...updatedCard,
      metadata: {
        ...updatedCard.metadata,
        updatedAt,
      },
      content: {
        ...updatedCard.content,
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

        if (cardData[updatedCard?.type]) {
          const cardIndex = cardData[updatedCard?.type].findIndex(
            (card) => card.cardId === updatedCard?.cardId
          );

          if (cardIndex !== -1) {
            cardData[updatedCard?.type][cardIndex] = updatedContent; // Update existing card
          } else {
            cardData[updatedCard?.type].push(updatedContent); // Add new card
          }
        } else {
          cardData[updatedCard?.type] = [updatedContent]; // Create a new type category
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

  const convertMapToJson = () => {
    try {
      const editorValue = currentEditorValue || selectedCardContent?.content?.data;

      let jsonString = editorValue.replace(/([\w\.:-]+)=([^,{}]+)(,|})/g, '"$1":"$2"$3');

      jsonString = jsonString.replace(/'/g, '"');

      const jsonObject = JSON.parse(jsonString);

      const prettyJson = JSON.stringify(jsonObject, null, 2);

      onContentChange({
        ...selectedCardContent,
        content: { ...selectedCardContent.content, data: prettyJson },
      });
    } catch (error) {
      console.error("Error converting Map to JSON:", error);
      showNotification("error", "Invalid Java Map format");
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
      const { originalEditorContent = "", modifiedEditorContent = "" } = selectedCardContent?.content?.data || {};
      return (
        <AppDiffEditorComponent
          editorState={{ originalEditorContent, modifiedEditorContent }}
          onEditorStateChange={(state) => {
            console.log("Diff Editor State Updated: ", state);
            // setCurrentEditorValue(state.editorContent);
            currentEditorRef.current = state;
          }}
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
                    case "Share":
                      handleShare();
                      break;
                    case "Map to JSON":
                      convertMapToJson();
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
