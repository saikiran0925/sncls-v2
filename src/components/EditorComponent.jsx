import React from "react";
import AppBlankSpaceComponent from "./AppBlankSpaceComponent";
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

  // Handle Prettify button click
  const handlePrettify = () => {
    try {
      const parsedJson = JSON.parse(selectedCardContent); // Parse the JSON string to object
      const prettifiedJson = JSON.stringify(parsedJson, null, 2); // Prettify with indentation
      onContentChange(prettifiedJson); // Pass the updated prettified content to parent
    } catch (error) {
      alert("Invalid JSON format. Please check the content.");
    }
  };

  // Handle Stringify button click
  const handleStringify = (content) => {
    try {
      // If the content is already a string, it should not be stringified again
      if (typeof content === "string") {
        const parsedContent = JSON.parse(content);
        const stringifiedContent = JSON.stringify(parsedContent); // Stringify without spaces
        onContentChange(stringifiedContent); // Pass the stringified content to parent
      } else {
        const stringifiedContent = JSON.stringify(content); // Stringify the object
        onContentChange(stringifiedContent); // Pass the stringified content to parent
      }
    } catch (error) {
      alert("Error during stringification.");
      return content; // Return original content if error occurs
    }
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
                  handleStringify(selectedCardContent); // Call handleStringify when Stringify button is clicked
                } else if (button === "Prettify") {
                  handlePrettify(); // Call handlePrettify when Prettify button is clicked
                }
              }}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
      <div className="editor-component">
        <AppBlankSpaceComponent
          selectedCardContent={selectedCardContent}
          language={language}
          onEditorStateChange={(state) =>
            console.log("Editor State Updated: ", state)
          }
        />
      </div>
    </div>
  );
};

export default EditorComponent;
