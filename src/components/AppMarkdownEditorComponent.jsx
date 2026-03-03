import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import AuthContext from "../services/contexts/AuthContext";
import "../css/MarkdownPreview.css";

// Configure marked for GitHub-flavored markdown
marked.setOptions({
  breaks: true,
  gfm: true,
});

function AppMarkdownEditorComponent({ selectedCardContent }) {
  const { updateCardContent } = useContext(AuthContext);
  const editorRef = useRef(null);
  const debounceRef = useRef(null);
  const selectedCardRef = useRef(selectedCardContent);   // always current card, not stale
  const isProgrammatic = useRef(false);                  // suppress saves from setValue() calls
  const [previewHtml, setPreviewHtml] = useState("");

  const renderMarkdown = useCallback((text) => {
    // Diff Editor content is an object `{ originalEditorContent, modifiedEditorContent }`.
    // If the user navigates from Diff Editor to Markdown, AppMarkdownEditorComponent
    // may briefly receive that object before React finishes switching `selectedCardContent`.
    if (typeof text !== "string") {
      text = "";
    }
    const raw = marked.parse(text || "");
    return DOMPurify.sanitize(raw);
  }, []);

  // Keep selectedCardRef current on every render
  selectedCardRef.current = selectedCardContent;

  // Sync editor & preview when the selected card changes.
  // Read from localStorage to get the latest saved content — the prop may be stale
  // because EditorRouter only refreshes cardsForSelectedPath on path change, not on every save.
  useEffect(() => {
    if (!selectedCardContent?.cardId) return;

    let content = selectedCardContent?.content?.data;
    if (typeof content !== "string") {
      content = ""; // Prevent Monaco from crashing on object
    }

    // Always prefer the freshest value from localStorage
    try {
      const raw = localStorage.getItem("cardData");
      if (raw) {
        const cardData = JSON.parse(raw);
        const cards = cardData[selectedCardContent.type] || [];
        const fresh = cards.find((c) => c.cardId === selectedCardContent.cardId);
        if (fresh?.content?.data !== undefined) {
          content = fresh.content.data;
        }
      }
    } catch (_) { /* fall back to prop value */ }

    if (editorRef.current) {
      isProgrammatic.current = true;
      editorRef.current.setValue(content);
      isProgrammatic.current = false;
    }
    setPreviewHtml(renderMarkdown(content));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCardContent?.cardId]); // cardId change = real card switch; ignore object reference churn

  function handleEditorMount(editor) {
    editorRef.current = editor;

    let initialContent = selectedCardRef.current?.content?.data;
    if (typeof initialContent !== "string") {
      initialContent = "";
    }

    // Set initial content — flag as programmatic
    isProgrammatic.current = true;
    editor.setValue(initialContent);
    isProgrammatic.current = false;

    setPreviewHtml(renderMarkdown(initialContent));

    editor.onDidChangeModelContent(() => {
      // Ignore changes caused by our own setValue() calls (card switch, initial load)
      if (isProgrammatic.current) return;

      const value = editor.getValue();

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // Update preview
        setPreviewHtml(renderMarkdown(value));

        // Save to the card that is CURRENTLY selected (via ref — never stale)
        const card = selectedCardRef.current;
        if (card) {
          const updatedCard = {
            ...card,
            content: { ...card.content, data: value },
            metadata: {
              ...card.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
          updateCardContent(card.type, card.cardId, updatedCard);
        }
      }, 300);
    });
  }

  return (
    <div className="md-split-wrapper">
      {/* ── Left: Monaco editor ── */}
      <div className="md-editor-pane">
        <Editor
          height="100%"
          onMount={handleEditorMount}
          defaultLanguage="markdown"
          path="markdown"
          theme="light"
          options={{
            wordWrap: "on",
            minimap: { enabled: false },
            lineNumbers: "on",
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* ── Divider ── */}
      <div className="md-divider" />

      {/* ── Right: rendered preview ── */}
      <div className="md-preview-pane">
        <div
          className="md-preview-content"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
}

export default AppMarkdownEditorComponent;
