import React, { useState, useRef, useCallback, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Helmet } from "react-helmet-async";
import useDrawboardStorage from "../hooks/useDrawboardStorage";
import "@excalidraw/excalidraw/index.css";
import "../css/DrawboardPage.css";

const STORAGE_KEY = "drawboardData";

/**
 * Write the given tab's canvas state directly to localStorage.
 * Used instead of React setState on tab-switch and unmount,
 * because React 18 makes setState a no-op after unmount, and
 * Excalidraw (a child) tears down its internal state before our
 * useEffect cleanup runs — making getSceneElements() unreliable there.
 */
const flushToLocalStorage = (tabId, elements, safeAppState) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    if (!data || !Array.isArray(data.tabs)) return;
    data.tabs = data.tabs.map((t) =>
      t.id === tabId
        ? { ...t, elements, appState: safeAppState, updatedAt: new Date().toISOString() }
        : t
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Drawboard flush failed:", e);
  }
};

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

  // Always-current ref for activeTab (safe to read in cleanups & callbacks)
  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  /**
   * latestStateRef – tracks the most-recent canvas state received via onChange.
   * Initialised with the active tab's stored data so that even if onChange never
   * fires (e.g. user just views without drawing), we still have correct data to flush.
   */
  const latestStateRef = useRef({
    tabId: activeTab?.id ?? null,
    elements: activeTab?.elements ?? [],
    appState: activeTab?.appState ?? {},
  });

  // ── Autofocus rename input ────────────────────────────────────────
  useEffect(() => {
    if (editingTabId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTabId]);

  // ── Load new tab's scene when activeTab changes ───────────────────
  useEffect(() => {
    if (!excalidrawApiRef.current || !activeTab) return;

    // Sync latestStateRef to the incoming tab so unmount flush is correct
    // even if the user doesn't draw anything on this tab
    latestStateRef.current = {
      tabId: activeTab.id,
      elements: activeTab.elements ?? [],
      appState: activeTab.appState ?? {},
    };

    excalidrawApiRef.current.updateScene({
      elements: activeTab.elements ?? [],
      appState: {
        ...(activeTab.appState ?? {}),
        collaborators: new Map(),
      },
    });
  }, [activeTab?.id]); // eslint-disable-line

  // ── onChange: track latest state in ref + debounced auto-save ────
  const handleChange = useCallback(
    (elements, appState) => {
      const tabId = activeTabRef.current?.id;
      if (!tabId) return;
      const { collaborators, ...safeAppState } = appState;

      // Always update the ref immediately — this is what we flush at cleanup time.
      // We do NOT rely on the Excalidraw API during unmount because React unmounts
      // the child (Excalidraw) before running the parent's useEffect cleanup,
      // which means getSceneElements() can return stale/empty data.
      latestStateRef.current = { tabId, elements, appState: safeAppState };

      // Debounced write to React state + localStorage during normal editing
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const latest = latestStateRef.current;
        if (latest.tabId !== tabId) return; // tab switched while debounce was pending
        updateBoard(tabId, latest.elements, latest.appState);
        flushToLocalStorage(tabId, latest.elements, latest.appState);
      }, 500);
    },
    [updateBoard]
  );

  // ── Unmount flush (navigation away) ──────────────────────────────
  // Uses latestStateRef — never the Excalidraw API — so it's safe
  // regardless of child unmount order.
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      const { tabId, elements, appState } = latestStateRef.current;
      if (!tabId) return;
      flushToLocalStorage(tabId, elements, appState);
    };
  }, []); // empty deps → cleanup only on unmount

  // ── Tab management ───────────────────────────────────────────────
  const handleTabSwitch = (id) => {
    if (id === activeTabId) return;

    // Flush the CURRENT tab's latest state before switching.
    // Read from latestStateRef rather than the Excalidraw API.
    const { tabId, elements, appState } = latestStateRef.current;
    if (tabId === activeTabId) {
      clearTimeout(debounceRef.current); // cancel pending debounce
      updateBoard(tabId, elements, appState);
      flushToLocalStorage(tabId, elements, appState);
    }

    setActiveTab(id);
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

        {/* ── Single persistent Excalidraw instance ──── */}
        <div className="db-canvas-wrapper">
          <Excalidraw
            excalidrawAPI={(api) => {
              excalidrawApiRef.current = api;
            }}
            initialData={{
              elements: activeTab?.elements ?? [],
              appState: {
                ...(activeTab?.appState ?? {}),
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
        </div>
      </div>
    </>
  );
};

export default DrawboardPage;
