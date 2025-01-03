import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

function AppEditorComponent({ selectedCardContent, language, onEditorStateChange }) {
  const editorRef = useRef(null);
  const cardContentRef = useRef("");

  console.log("selectedCardContent: ", selectedCardContent);
  const height = `${window.innerHeight - 120}px`;
  const width = `${window.innerWidth - 432}px`;

  useEffect(() => {
    cardContentRef.current = selectedCardContent?.content?.data;
    if (editorRef.current) {
      editorRef.current.setValue(selectedCardContent.content.data || "");
    }
  }, [selectedCardContent]);

  function handleEditorMount(editor) {
    editorRef.current = editor;
    editor.setValue(cardContentRef.current);
    editor.onDidChangeModelContent(() => {
      const editorContent = editor.getValue();
      const editorState = {
        editorContent,
      };
      onEditorStateChange(editorState);
    });
  }

  /*  path is an identifier for the model. When you specify a path prop, the Editor component checks if it has a model by that path or not. 
   *  If yes, the existing model will be shown, otherwise, a new one will be created */

  return (
    <Editor
      height={height}
      width={width}
      onMount={handleEditorMount}
      path={language}
      defaultLanguage={language}
      options={{
        wordWrap: "on",
      }}
    />
  );
}

export default AppEditorComponent;
