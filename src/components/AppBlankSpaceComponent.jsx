import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

function AppBlankSpaceComponent({ selectedCardContent, onEditorStateChange }) {
  const editorRef = useRef(null);

  const height = `${window.innerHeight - 120}px`;
  const width = `${window.innerWidth - 432}px`;

  useEffect(() => {
    if (editorRef.current) {
      // Update the editor's content when selectedCardContent changes
      editorRef.current.setValue(selectedCardContent || "");
    }
  }, [selectedCardContent]);

  function handleEditorMount(editor) {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const editorContent = editor.getValue();
      const editorState = {
        editorContent,
      };
      onEditorStateChange(editorState);
    });
  }

  return <Editor height={height} width={width} onMount={handleEditorMount} />;
}

export default AppBlankSpaceComponent;
