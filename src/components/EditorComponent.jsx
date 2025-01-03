import React, { useContext, useState } from "react";
import AppEditorComponent from "./AppEditorComponent";
import AppDiffEditorComponent from "./AppDiffEditorComponent";
import { useLocation } from "react-router-dom";
import { MdFormatAlignLeft, MdCode, MdClearAll, MdFormatAlignJustify } from "react-icons/md";
import { LuClipboardCopy } from "react-icons/lu";
import { AiOutlineSave } from "react-icons/ai";
import "../css/EditorComponent.css";
import { Tooltip } from "antd";
import { showNotification } from "../utilities/utils";
import axiosInstance from "../services/axiosInstance";
import AuthContext from "../services/contexts/AuthContext";

const EditorComponent = ({ selectedCardContent, onContentChange }) => {

  const [currentEditorValue, setCurrentEditorValue] = useState(null);
  const { updateCardContent } = useContext(AuthContext);

  const routeToConfig = {
    jsonify: {
      title: "JSONify",
      language: "json",
      buttons: [
        { name: "Prettify", icon: <MdFormatAlignLeft /> },
        { name: "Stringify", icon: <MdFormatAlignJustify /> },
        {
          name: "Copy", icon: <LuClipboardCopy />
        },
        {
          name: "Save", icon: <AiOutlineSave />
        },
      ],
    },
    "blank-space": {
      title: "Blank Space",
      language: "",
      buttons: [
        {
          name: "Copy", icon: <LuClipboardCopy />
        },
        {
          name: "Save", icon: <AiOutlineSave />
        },
      ],
    },
    "diff-editor": {
      title: "Diff Editor",
      language: "",
      buttons: [
        { name: "Compare", icon: <MdCode /> },
        { name: "Merge", icon: <MdCode /> },
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

  const handlePrettify = () => {
    try {
      const editorValue = (currentEditorValue) ? (currentEditorValue) : selectedCardContent?.content?.data;
      const parsedJson = JSON.parse(editorValue);

      const prettifiedJson = JSON.stringify(parsedJson, null, 2);

      const updatedContent = {
        ...selectedCardContent,
        content: {
          ...selectedCardContent.content,
          data: prettifiedJson,
        },
      };

      onContentChange(updatedContent);
    } catch (error) {
      showNotification("error", "Invalid JSON", "Please check the content for valid JSON format.");
    }
  };

  const handleStringify = () => {
    const content = (currentEditorValue) ? (currentEditorValue) : selectedCardContent?.content?.data;

    try {
      if (typeof content === "string") {
        const parsedContent = JSON.parse(content);
        const stringifiedContent = JSON.stringify(parsedContent);

        const updatedContent = {
          ...selectedCardContent,
          content: {
            ...selectedCardContent.content,
            data: stringifiedContent,
          },
        };

        onContentChange(updatedContent);
      } else {
        const stringifiedContent = JSON.stringify(content);
        onContentChange(stringifiedContent);
      }
    } catch (error) {
      showNotification("error", "Error during stringification")
      return content;
    }
  };

  const handleCopyToClipboard = () => {
    try {
      const contentToCopy = selectedCardContent?.content?.data || "";
      navigator.clipboard.writeText(contentToCopy).then(() => {
        showNotification("success", "Copied to Clipboard", "The content has been successfully copied.");
      });
    } catch (error) {
      showNotification("error", "Copy Failed", "Failed to copy content. Please try again.");
    }
  };

  const handleSave = async () => {

    const content = (currentEditorValue) ? (currentEditorValue) : selectedCardContent?.content?.data;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      showNotification("error", "Auth token not found");
      return;
    }
    const updatedContent = {
      ...selectedCardContent,
      content: {
        ...selectedCardContent.content,
        data: content,
      },
    };

    const id = updatedContent.id;
    try {
      const response = await axiosInstance.put(
        `/api/dynamic/card/${id}`,
        updatedContent,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      if (response.status === 200) {
        console.log('Content successfully updated:', response.data);
        showNotification("success", "Saved success");
        updateCardContent(selectedCardContent?.type, id, updatedContent);
      }
    } catch (error) {
      showNotification("error", "Error updating content")
      console.error('Error updating content:', error);
    }
  };

  const renderEditor = () => {
    if (path === "diff-editor") {
      console.log("Content: ", selectedCardContent);
      console.log("left: ", selectedCardContent);
      const left = selectedCardContent?.content?.data?.left || "";
      const right = selectedCardContent?.content?.data?.right || "";
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
                    case "Stringify":
                      handleStringify();
                      break;
                    case "Prettify":
                      handlePrettify();
                      break;
                    case "Copy":
                      handleCopyToClipboard();
                      break;
                    case "Save":
                      handleSave();
                      break;
                    case "Clear":
                      onContentChange("");
                      break;
                    default:
                      console.log(`No handler for button: ${button.name}`);
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
