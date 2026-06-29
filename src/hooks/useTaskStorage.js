import { useState, useCallback } from "react";

const STORAGE_KEY = "taskManagerData";

export const getTodayDate = () => new Date().toISOString().split("T")[0];

const makeDay = (date) => ({ id: `day_${date}`, date, tasks: [], starred: false });

const getInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const today = getTodayDate();
      if (!parsed.days.some((d) => d.date === today)) {
        parsed.days = [makeDay(today), ...parsed.days];
        parsed.activeDayId = `day_${today}`;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (_) {}
  const today = getTodayDate();
  return { days: [makeDay(today)], activeDayId: `day_${today}` };
};

const useTaskStorage = () => {
  const [state, setState] = useState(getInitialState);

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, []);

  const ensureToday = useCallback(() => {
    persist((prev) => {
      const today = getTodayDate();
      if (prev.days.some((d) => d.date === today)) return prev;
      return { ...prev, days: [makeDay(today), ...prev.days], activeDayId: `day_${today}` };
    });
  }, [persist]);

  const setActiveDay = useCallback((id) => {
    persist((prev) => ({ ...prev, activeDayId: id }));
  }, [persist]);

  const addTask = useCallback((dayId, text) => {
    const task = {
      id: `task_${Date.now()}`,
      text,
      done: false,
      pinned: false,
      dismissed: false,
      carriedOver: false,
      createdAt: new Date().toISOString(),
    };
    persist((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === dayId ? { ...d, tasks: [task, ...d.tasks] } : d
      ),
    }));
  }, [persist]);

  const updateTask = useCallback((dayId, taskId, updates) => {
    persist((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === dayId
          ? { ...d, tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)) }
          : d
      ),
    }));
  }, [persist]);

  const deleteTask = useCallback((dayId, taskId) => {
    persist((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === dayId ? { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) } : d
      ),
    }));
  }, [persist]);

  const carryOver = useCallback((fromDayId, taskId) => {
    persist((prev) => {
      const today = getTodayDate();
      const todayId = `day_${today}`;
      const fromDay = prev.days.find((d) => d.id === fromDayId);
      if (!fromDay) return prev;
      const task = fromDay.tasks.find((t) => t.id === taskId);
      if (!task) return prev;
      const newTask = { ...task, id: `task_${Date.now()}`, createdAt: new Date().toISOString(), done: false, carriedOver: false, carriedFrom: fromDayId };
      return {
        ...prev,
        days: prev.days.map((d) => {
          if (d.id === fromDayId) return { ...d, tasks: d.tasks.map((t) => t.id === taskId ? { ...t, carriedOver: true } : t) };
          if (d.id === todayId) return { ...d, tasks: [newTask, ...d.tasks] };
          return d;
        }),
      };
    });
  }, [persist]);

  const toggleDayStar = useCallback((dayId) => {
    persist((prev) => ({
      ...prev,
      days: prev.days.map((d) => d.id === dayId ? { ...d, starred: !d.starred } : d),
    }));
  }, [persist]);

  const dismiss = useCallback((fromDayId, taskId) => {
    persist((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === fromDayId
          ? { ...d, tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, dismissed: true } : t)) }
          : d
      ),
    }));
  }, [persist]);

  const activeDay = state.activeDayId ? (state.days.find((d) => d.id === state.activeDayId) || null) : null;

  const pendingPastTasks = state.days
    .filter((d) => d.date < getTodayDate())
    .flatMap((d) =>
      d.tasks
        .filter((t) => !t.done && !t.dismissed && !t.carriedOver)
        .map((t) => ({ ...t, dayId: d.id, dayDate: d.date }))
    );

  return {
    days: state.days,
    activeDayId: state.activeDayId,
    activeDay,
    pendingPastTasks,
    ensureToday,
    setActiveDay,
    addTask,
    updateTask,
    deleteTask,
    carryOver,
    dismiss,
    toggleDayStar,
  };
};

export default useTaskStorage;
