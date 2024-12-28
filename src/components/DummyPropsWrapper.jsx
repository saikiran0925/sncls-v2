import React, { useRef, useState } from "react";
import AppBlankSpaceComponent from "./AppBlankSpaceComponent";

const DummyPropsWrapper = () => {
  // Initialize a ref to simulate the `editorRef` prop.
  const editorRef = useRef({ current: null });

  // Dummy initial state.
  const [editorState, setEditorState] = useState({
    editorContent: "This is the initial content.",
  });

  // Dummy function to handle state changes.
  const handleEditorStateChange = (newState) => {
    console.log("Updated Editor State: ", newState);
    setEditorState(newState);
  };

  return (
    <div style={{ padding: "20px" }}>
      <AppBlankSpaceComponent
        editorRef={editorRef}
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
      />
    </div>
  );
};

export default DummyPropsWrapper;

