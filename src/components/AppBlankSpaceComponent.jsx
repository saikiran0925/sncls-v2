import Editor from "@monaco-editor/react";

function AppBlankSpaceComponent(props) {
  const editorRef = props.editorRef;
  let editorContent;
  let currentEditorState;
  if (editorRef.current) {
    currentEditorState = editorRef.current.editorState;
  }

  console.log("Current editorRef is: ", editorRef.current);
  const height = `${window.innerHeight - 120}px`;
  const width = `${window.innerWidth - 432}px`;

  function handleEditorMount(editor, monaco) {
    console.log("Editor instance: ", editor);
    console.log("Editor value: ", editor.getValue());
    // const originalEditor = editor.getModifiedEditor();
    // const originalEditor = editor.getOriginalEditor();

    const originalContent = props.editorState?.editorContent || "";

    editor.setValue(originalContent);

    editor.onDidChangeModelContent((_) => {
      console.log(editor.getValue());
      editorContent = editor.getValue();
      const editorState = {
        editorContent,
      };
      currentEditorState = editorState;
      console.log("Editor State: ", currentEditorState);
      props.onEditorStateChange(currentEditorState);
    });
  }

  return <Editor height={height} width={width} onMount={handleEditorMount} />;
}
export default AppBlankSpaceComponent;
