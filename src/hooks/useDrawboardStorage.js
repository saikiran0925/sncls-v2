import { useState, useCallback } from "react";

const STORAGE_KEY = "drawboardData";

const generateId = () => `db_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const generateTimestamp = () => new Date().toISOString();

const defaultTab = () => ({
  id: generateId(),
  title: "Board 1",
  elements: [],
  appState: {},
  createdAt: generateTimestamp(),
  updatedAt: generateTimestamp(),
});

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const save = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save drawboardData:", e);
  }
};

const getInitialState = () => {
  const stored = load();
  if (stored && Array.isArray(stored.tabs) && stored.tabs.length > 0) {
    return stored;
  }
  const tab = defaultTab();
  return { tabs: [tab], activeTabId: tab.id };
};

const useDrawboardStorage = () => {
  const [state, setState] = useState(getInitialState);

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(next);
      return next;
    });
  }, []);

  const createTab = useCallback(() => {
    const tab = defaultTab();
    tab.title = `Board ${Date.now().toString().slice(-4)}`;
    persist((prev) => ({
      ...prev,
      tabs: [...prev.tabs, tab],
      activeTabId: tab.id,
    }));
    return tab;
  }, [persist]);

  const deleteTab = useCallback((id) => {
    persist((prev) => {
      const tabs = prev.tabs.filter((t) => t.id !== id);
      if (tabs.length === 0) {
        const tab = defaultTab();
        return { tabs: [tab], activeTabId: tab.id };
      }
      const activeTabId =
        prev.activeTabId === id
          ? tabs[Math.max(0, prev.tabs.findIndex((t) => t.id === id) - 1)]?.id ?? tabs[0].id
          : prev.activeTabId;
      return { tabs, activeTabId };
    });
  }, [persist]);

  const renameTab = useCallback((id, title) => {
    persist((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) =>
        t.id === id ? { ...t, title, updatedAt: generateTimestamp() } : t
      ),
    }));
  }, [persist]);

  const updateBoard = useCallback((id, elements, appState) => {
    persist((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) =>
        t.id === id
          ? { ...t, elements, appState, updatedAt: generateTimestamp() }
          : t
      ),
    }));
  }, [persist]);

  const setActiveTab = useCallback((id) => {
    persist((prev) => ({ ...prev, activeTabId: id }));
  }, [persist]);

  const activeTab = state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0];

  return {
    tabs: state.tabs,
    activeTabId: state.activeTabId,
    activeTab,
    createTab,
    deleteTab,
    renameTab,
    updateBoard,
    setActiveTab,
  };
};

export default useDrawboardStorage;
