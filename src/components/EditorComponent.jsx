import React from "react";
import AppEditorComponent from "./AppEditorComponent";
import AppDiffEditorComponent from "./AppDiffEditorComponent";
import { useLocation } from "react-router-dom";
import "./EditorComponent.css";

const EditorComponent = ({ selectedCardContent, onContentChange }) => {
  const routeToConfig = {
    jsonify: {
      title: "JSONify",
      language: "json",
      buttons: ["Prettify", "Stringify"],
    },
    "blank-space": {
      title: "Blank Space",
      language: "",
      buttons: ["Prettify", "Clear"],
    },
    "diff-editor": {
      title: "Diff Editor",
      language: "",
      buttons: ["Compare", "Merge"],
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
      const parsedJson = JSON.parse(selectedCardContent);
      const prettifiedJson = JSON.stringify(parsedJson, null, 2);
      onContentChange(prettifiedJson);
    } catch (error) {
      alert("Invalid JSON format. Please check the content.");
    }
  };

  const handleStringify = (content) => {
    try {
      if (typeof content === "string") {
        const parsedContent = JSON.parse(content);
        const stringifiedContent = JSON.stringify(parsedContent);
        onContentChange(stringifiedContent);
      } else {
        const stringifiedContent = JSON.stringify(content);
        onContentChange(stringifiedContent);
      }
    } catch (error) {
      alert("Error during stringification.");
      return content;
    }
  };

  const renderEditor = () => {

    if (path === "diff-editor") {
      console.log("Content: ", selectedCardContent);
      console.log("left: ", selectedCardContent.left);
      const left = selectedCardContent?.left || "";
      const right = selectedCardContent?.right || "";
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
        onEditorStateChange={(state) => console.log("Editor State Updated: ", state)}
      />
    );
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>{title}</h2>
        <div className="tabs">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="tab"
              onClick={() => {
                if (button === "Stringify") {
                  handleStringify(selectedCardContent);
                } else if (button === "Prettify") {
                  handlePrettify();
                }
              }}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
      <div className="editor-component">{renderEditor()}</div>
    </div>
  );
};

export default EditorComponent;
