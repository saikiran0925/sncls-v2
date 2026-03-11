import React, { useState, useRef, useCallback, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Helmet } from "react-helmet-async";
import useDrawboardStorage from "../hooks/useDrawboardStorage";
import "@excalidraw/excalidraw/index.css";
import "../css/DrawboardPage.css";

const DrawboardPage = () => {
  const {
    tabs,
    activeTabId,
    activeTab,
    createTab,
    deleteTab,
    renameTab,
    updateBoard,
    setActiveTab,
  } = useDrawboardStorage();

  const [editingTabId, setEditingTabId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const titleInputRef = useRef(null);
  const excalidrawApiRef = useRef(null);
  const debounceRef = useRef(null);
  // Track which tab the excalidraw instance last loaded so we can reload on switch
  const loadedTabIdRef = useRef(null);

  // Autofocus rename input
  useEffect(() => {
    if (editingTabId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTabId]);

  // When active tab changes, reload the canvas with that tab's elements
  useEffect(() => {
    if (!excalidrawApiRef.current || !activeTab) return;
    if (loadedTabIdRef.current === activeTab.id) return;

    excalidrawApiRef.current.updateScene({
      elements: activeTab.elements ?? [],
      appState: {
        ...(activeTab.appState ?? {}),
        // keep the toolbar / collaboration UI clean
        collaborators: new Map(),
      },
    });
    loadedTabIdRef.current = activeTab.id;
  }, [activeTab?.id]);

  const handleChange = useCallback(
    (elements, appState) => {
      if (!activeTab) return;
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // Persist only serialisable subset of appState (avoid circular refs)
        const { collaborators, ...safeAppState } = appState;
        updateBoard(activeTab.id, elements, safeAppState);
      }, 400);
    },
    [activeTab, updateBoard]
  );

  // ── Tab management ──────────────────────────────────────
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

  const handleTabSwitch = (id) => {
    if (id === activeTabId) return;
    // Reset the loaded ref so the useEffect above reloads the scene
    loadedTabIdRef.current = null;
    setActiveTab(id);
  };

  return (
    <>
      <Helmet>
        <title>Drawboard | SNCLS</title>
        <meta
          name="description"
          content="An Excalidraw-powered infinite canvas drawing board with multi-tab support and auto-save."
        />
      </Helmet>

      <div className="db-container">
        {/* ── Header ────────────────────────────────────── */}
        <div className="db-header">
          <div className="db-header-left">
            <h2 className="db-title">Drawboard</h2>
          </div>

          {/* ── Tab strip ─────────────────────────────── */}
          <div className="db-tab-strip">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`db-tab ${tab.id === activeTabId ? "active" : ""}`}
                onClick={() => handleTabSwitch(tab.id)}
                onDoubleClick={(e) => startRename(tab, e)}
                title={`${tab.title} — double-click to rename`}
              >
                {editingTabId === tab.id ? (
                  <input
                    ref={titleInputRef}
                    className="db-tab-label-input"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={handleRenameKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={30}
                  />
                ) : (
                  <span className="db-tab-label">{tab.title}</span>
                )}
                <span
                  className="db-tab-close"
                  onClick={(e) => handleDeleteTab(tab.id, e)}
                  title="Close board"
                >
                  ×
                </span>
              </div>
            ))}

            <button className="db-add-tab" onClick={createTab} title="New board">
              +
            </button>
          </div>
        </div>

        {/* ── Canvas ───────────────────────────────────── */}
        <div className="db-canvas-wrapper">
          {activeTab && (
            <Excalidraw
              key={activeTab.id}
              excalidrawAPI={(api) => {
                excalidrawApiRef.current = api;
                loadedTabIdRef.current = activeTab.id;
              }}
              initialData={{
                elements: activeTab.elements ?? [],
                appState: {
                  ...(activeTab.appState ?? {}),
                  collaborators: new Map(),
                },
              }}
              onChange={handleChange}
              UIOptions={{
                canvasActions: {
                  saveToActiveFile: false,
                  loadScene: false,
                  export: false,
                  saveAsImage: true,
                },
                tools: {
                  image: false,
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DrawboardPage;
