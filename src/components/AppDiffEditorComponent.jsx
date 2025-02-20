import React, { useEffect, useRef } from "react";
import { DiffEditor } from "@monaco-editor/react";

function AppDiffEditorComponent({ editorState, onEditorStateChange }) {
  const editorRef = useRef(null);
  const cardLeftContentRef = useRef("");
  const cardRightContentRef = useRef("");

  const height = `${window.innerHeight - 120}px`;
  const width = `${window.innerWidth - 432}px`;

  useEffect(() => {
    cardLeftContentRef.current = editorState.originalEditorContent;
    cardRightContentRef.current = editorState.modifiedEditorContent;

    if (editorRef.current) {
      const originalEditor = editorRef.current.getOriginalEditor();
      const modifiedEditor = editorRef.current.getModifiedEditor();

      originalEditor.setValue(editorState.originalEditorContent || "");
      modifiedEditor.setValue(editorState.modifiedEditorContent || "");
    }
  }, [editorState]);

  function handleEditorMount(editor) {
    editorRef.current = editor;

    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();

    originalEditor.setValue(cardLeftContentRef.current);
    modifiedEditor.setValue(cardRightContentRef.current);

    const updateState = () => {
      const updatedState = {
        originalEditorContent: originalEditor.getValue(),
        modifiedEditorContent: modifiedEditor.getValue(),
      };
      onEditorStateChange(updatedState);
    };

    originalEditor.onDidChangeModelContent(updateState);
    modifiedEditor.onDidChangeModelContent(updateState);
  }

  return (
    <DiffEditor
      height={height}
      width={width}
      onMount={handleEditorMount}
      options={{
        readOnly: false,
        originalEditable: true,
        wordWrap: "on",
        diffWordWrap: "on",
        diffAlgorithm: "advanced",
        renderMarginRevertIcon: true,
        diffCodeLens: true,
      }}
    />
  );
}

export default AppDiffEditorComponent;

