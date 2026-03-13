import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tooltip } from "antd";
import { LuClipboardCopy, LuDownload } from "react-icons/lu";
import { TbMarkdown } from "react-icons/tb";
import { Helmet } from "react-helmet-async";
import useMarkdownStorage from "../hooks/useMarkdownStorage";
import "../css/MarkdownEditorPage.css";
import { showNotification } from "../utilities/utils.jsx";

const MarkdownEditorPage = () => {
  const {
    tabs,
    activeTabId,
    activeTab,
    createTab,
    deleteTab,
    renameTab,
    updateContent,
    setActiveTab,
  } = useMarkdownStorage();

  const [editingTabId, setEditingTabId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [lineCount, setLineCount] = useState(
    () => (activeTab?.content?.split("\n").length ?? 1)
  );
  const debounceRef = useRef(null);
  const titleInputRef = useRef(null);
  const editorRef = useRef(null);
  const lineNumRef = useRef(null);

  // Autofocus the title input when renaming
  useEffect(() => {
    if (editingTabId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTabId]);

  const handleEditorChange = useCallback(
    (e) => {
      const value = e.target.value;
      setLineCount(value.split("\n").length);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (activeTab) {
          updateContent(activeTab.id, value);
        }
      }, 300);
    },
    [activeTab, updateContent]
  );

  const handleEditorScroll = useCallback(() => {
    if (lineNumRef.current && editorRef.current) {
      lineNumRef.current.scrollTop = editorRef.current.scrollTop;
    }
  }, []);

  const handleCopy = () => {
    if (!activeTab) return;
    navigator.clipboard.writeText(activeTab.content || "");
    showNotification("success", "Copied to clipboard");
  };

  const handleDownload = () => {
    if (!activeTab) return;
    const blob = new Blob([activeTab.content || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab.title || "note"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startRename = (tab, e) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditingTitle(tab.title);
  };

  const commitRename = () => {
    if (editingTabId) {
      renameTab(editingTabId, editingTitle.trim() || "Untitled");
      setEditingTabId(null);
    }
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === "Enter") commitRename();
    if (e.key === "Escape") setEditingTabId(null);
  };

  const handleDeleteTab = (id, e) => {
    e.stopPropagation();
    deleteTab(id);
  };

  return (
    <>
      <Helmet>
        <title>Markdown Editor | SNCLS</title>
        <meta name="description" content="A live split-pane markdown editor with tab support. Write markdown on the left and see the rendered preview on the right." />
      </Helmet>

      <div className="mde-container">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mde-header">
          <div className="mde-header-left">
            <h2 className="mde-title">Markdown</h2>
          </div>

          {/* ── Tab strip ─────────────────────────────────────── */}
          <div className="mde-tab-strip">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`mde-tab ${tab.id === activeTabId ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                onDoubleClick={(e) => startRename(tab, e)}
                title={`${tab.title} — double-click to rename`}
              >
                {editingTabId === tab.id ? (
                  <input
                    ref={titleInputRef}
                    className="mde-tab-label-input"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={handleRenameKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={30}
                  />
                ) : (
                  <span className="mde-tab-label">{tab.title}</span>
                )}
                <span
                  className="mde-tab-close"
                  onClick={(e) => handleDeleteTab(tab.id, e)}
                  title="Close tab"
                >
                  ×
                </span>
              </div>
            ))}

            <button className="mde-add-tab" onClick={createTab} title="New tab">
              +
            </button>
          </div>

          {/* ── Action buttons ─────────────────────────────────── */}
          <div className="mde-actions">
            <Tooltip placement="bottom" title="Copy markdown">
              <button className="mde-action-btn" onClick={handleCopy}>
                <LuClipboardCopy />
              </button>
            </Tooltip>
            <Tooltip placement="bottom" title="Download .md">
              <button className="mde-action-btn" onClick={handleDownload}>
                <LuDownload />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* ── Split body ─────────────────────────────────────── */}
        {activeTab ? (
          <div className="mde-body">
            {/* Left: editor with line numbers */}
            <div className="mde-pane">
              <div className="mde-editor-wrapper">
                <div className="mde-line-numbers" ref={lineNumRef}>
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i + 1} className="mde-line-number">{i + 1}</div>
                  ))}
                </div>
                <textarea
                  key={activeTab.id}
                  ref={editorRef}
                  className="mde-editor"
                  defaultValue={activeTab.content}
                  onChange={handleEditorChange}
                  onScroll={handleEditorScroll}
                  placeholder="Start writing markdown here…"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Right: preview */}
            <div className="mde-pane">
              <div className="mde-preview">
                {activeTab.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeTab.content}
                  </ReactMarkdown>
                ) : (
                  <div className="mde-preview-empty">Nothing to preview yet…</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mde-no-tab">No tab open — click + to begin</div>
        )}
      </div>
    </>
  );
};

export default MarkdownEditorPage;
