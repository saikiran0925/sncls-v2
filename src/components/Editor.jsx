import React, { useState } from "react";
import AppBlankSpaceComponent from "./AppBlankSpaceComponent";
import "./EditorComponent.css";

const EditorComponent = ({ selectedCardContent }) => {
  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Blank Space</h2>
        <div className="tabs">
          <button className="tab active">Prettify</button>
          <button className="tab">Stringify</button>
        </div>
      </div>
      <div className="editor-component">
        {/* Pass the selected content to AppBlankSpaceComponent */}
        <AppBlankSpaceComponent
          selectedCardContent={selectedCardContent}
          onEditorStateChange={(state) => console.log("Editor State Updated: ", state)}
        />
      </div>
    </div>
  );
};

export default EditorComponent;
