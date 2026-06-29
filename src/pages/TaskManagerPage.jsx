import React, { useState, useEffect, useRef } from "react";
import useTaskStorage, { getTodayDate } from "../hooks/useTaskStorage";
import "../css/CardSideBar.css";
import "../css/EditorComponent.css";
import "../css/TaskManagerPage.css";
import { Button, Empty } from "antd";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdOutlinePushPin, MdPushPin, MdDeleteOutline, MdArrowForward, MdClose, MdAdd } from "react-icons/md";
import { BsCheckSquareFill, BsSquare } from "react-icons/bs";

const getTodayStr = getTodayDate;

const formatCardTitle = (dateStr) => {
  const today = getTodayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterdayStr) return "Yesterday";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const formatCardSub = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatMainHeading = (dateStr) => {
  const today = getTodayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const d = new Date(dateStr + "T00:00:00");
  const full = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  if (dateStr === today) return `Today — ${full}`;
  if (dateStr === yesterdayStr) return `Yesterday — ${full}`;
  return full;
};

const TaskItem = ({ task, dayId, onToggle, onPin, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const saveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) onEdit(dayId, task.id, { text: trimmed });
    setEditing(false);
  };

  return (
    <div className={`tm-task-item ${task.done ? "tm-task-done" : ""}`}>
      <button className="tm-checkbox" onClick={() => onToggle(dayId, task.id, !task.done)}>
        {task.done
          ? <BsCheckSquareFill className="tm-check-icon tm-check-filled" />
          : <BsSquare className="tm-check-icon" />}
      </button>

      <div className="tm-task-text-wrap">
        {editing ? (
          <input
            ref={inputRef}
            className="tm-task-edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <span
            className="tm-task-text"
            onDoubleClick={() => { setEditing(true); setEditText(task.text); }}
          >
            {task.text}
          </span>
        )}
      </div>

      <div className="tm-task-actions">
        <button className="tm-icon-btn" title={task.pinned ? "Unpin" : "Pin"} onClick={() => onPin(dayId, task.id, !task.pinned)}>
          {task.pinned
            ? <MdPushPin className="tm-action-icon tm-action-pinned" />
            : <MdOutlinePushPin className="tm-action-icon" />}
        </button>
        <button className="tm-icon-btn tm-delete-btn" title="Delete" onClick={() => onDelete(dayId, task.id)}>
          <MdDeleteOutline className="tm-action-icon" />
        </button>
      </div>
    </div>
  );
};

const TaskManagerPage = () => {
  const {
    days, activeDayId, activeDay, pendingPastTasks,
    ensureToday, setActiveDay, addTask, updateTask, deleteTask, carryOver, dismiss, toggleDayStar,
  } = useTaskStorage();

  const [newTaskText, setNewTaskText] = useState("");
  const [pastCollapsed, setPastCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const inputRef = useRef(null);

  useEffect(() => { ensureToday(); }, [ensureToday]);

  const handleAdd = () => {
    const text = newTaskText.trim();
    if (!text || !activeDay) return;
    addTask(activeDay.id, text);
    setNewTaskText("");
    inputRef.current?.focus();
  };

  const isToday = activeDay?.date === getTodayStr();
  const pinnedTasks = activeDay?.tasks.filter((t) => t.pinned) || [];
  const regularTasks = activeDay?.tasks.filter((t) => !t.pinned) || [];
  const incompleteTasks = regularTasks.filter((t) => !t.done);
  const doneTasks = regularTasks.filter((t) => t.done);
  const totalTasks = (activeDay?.tasks || []).length;
  const doneCount = (activeDay?.tasks || []).filter((t) => t.done).length;

  return (
    <div style={{ display: "flex", flex: 1 }}>
      {/* ── Sidebar ── */}
      <div className="sidebar-container">
        <div className="inbox-header">
          <h2>SNCLS</h2>
          <div className="tabs">
            <button className={`tab ${selectedTab === "All" ? "active" : ""}`} onClick={() => {
              setSelectedTab("All");
            }}>All</button>
            <button className={`tab ${selectedTab === "Starred" ? "active" : ""}`} onClick={() => {
              setSelectedTab("Starred");
              const firstStarred = days.find((d) => d.starred);
              if (firstStarred) {
                setActiveDay(firstStarred.id);
              } else {
                setActiveDay(null);
              }
            }}>Starred</button>
          </div>
        </div>

        <div style={{ width: "100%", padding: "10px", textAlign: "center" }}>
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={() => {
              ensureToday();
              setActiveDay(`day_${getTodayStr()}`);
            }}
          >
            Today
          </Button>
        </div>

        <div className="card-list">
          {days.length > 0 ? (
            days.filter((day) => selectedTab === "Starred" ? day.starred : true).map((day) => {
              const done = day.tasks.filter((t) => t.done).length;
              const total = day.tasks.length;
              const hasPending = day.date < getTodayStr() && day.tasks.some((t) => !t.done && !t.dismissed && !t.carriedOver);
              const isActive = day.id === activeDayId;
              const firstTask = day.tasks.find((t) => !t.done && !t.pinned);

              return (
                <div
                  key={day.id}
                  className={`card ${isActive ? "active-card" : ""}`}
                  onClick={() => setActiveDay(day.id)}
                >
                  <div className="card-header">
                    <div className="card-title-container">
                      <div className="card-title-wrapper">
                        <h4 className="card-title">{formatCardTitle(day.date)}</h4>
                      </div>
                    </div>
                    {hasPending && (
                      <span title="Has incomplete tasks" style={{ fontSize: 8, color: "#f59e0b", marginLeft: 6 }}>●</span>
                    )}
                    <span
                      className="star-icon"
                      onClick={(e) => { e.stopPropagation(); toggleDayStar(day.id); }}
                    >
                      {day.starred ? <FaStar color="gold" /> : <FaRegStar />}
                    </span>
                  </div>

                  <p className="card-content">
                    {total === 0
                      ? "No tasks yet"
                      : firstTask
                        ? firstTask.text
                        : `All ${total} tasks done`}
                  </p>

                  <div className="card-footer">
                    <span className="card-timestamp">{formatCardSub(day.date)}</span>
                    {total > 0 && <span className="card-id">{done}/{total} done</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-data">
              <Empty description={selectedTab === "Starred" ? "No starred days" : "No days yet"} />
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="editor-container">
        {activeDay ? (
          <>
            <div className="editor-header tm-editor-header">
              <h2>{formatMainHeading(activeDay.date)}</h2>
              {totalTasks > 0 && (
                <span style={{ fontSize: 13, color: "#888" }}>{doneCount} of {totalTasks} done</span>
              )}
            </div>

            <div className="editor-component tm-scroll">
              {/* Pending from past */}
              {isToday && pendingPastTasks.length > 0 && (
                <div className="tm-past-section">
                  <button className="tm-past-header" onClick={() => setPastCollapsed((c) => !c)}>
                    <span className="tm-past-label">⏰ {pendingPastTasks.length} pending from past days</span>
                    <span>{pastCollapsed ? "▸" : "▾"}</span>
                  </button>
                  {!pastCollapsed && (
                    <div className="tm-past-list">
                      {pendingPastTasks.map((t) => (
                        <div key={t.id} className="tm-past-item">
                          <span className="tm-past-date">{formatCardSub(t.dayDate)}</span>
                          <span className="tm-past-text">{t.text}</span>
                          <div className="tm-past-actions">
                            <button className="tm-carry-btn" onClick={() => carryOver(t.dayId, t.id)}>
                              <MdArrowForward /> Today
                            </button>
                            <button className="tm-dismiss-btn" onClick={() => dismiss(t.dayId, t.id)}>
                              <MdClose />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pinned */}
              {pinnedTasks.length > 0 && (
                <div className="tm-section">
                  <div className="tm-section-label"><MdPushPin style={{ marginRight: 4 }} /> Pinned</div>
                  {pinnedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      dayId={activeDay.id}
                      onToggle={(d, id, done) => updateTask(d, id, { done })}
                      onPin={(d, id, pinned) => updateTask(d, id, { pinned })}
                      onDelete={deleteTask}
                      onEdit={updateTask}
                    />
                  ))}
                </div>
              )}

              {/* Tasks */}
              <div className="tm-section">
                {(pinnedTasks.length > 0 || (isToday && pendingPastTasks.length > 0)) && (
                  <div className="tm-section-label">Tasks</div>
                )}
                {incompleteTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    dayId={activeDay.id}
                    onToggle={(d, id, done) => updateTask(d, id, { done })}
                    onPin={(d, id, pinned) => updateTask(d, id, { pinned })}
                    onDelete={deleteTask}
                    onEdit={updateTask}
                  />
                ))}

                {doneTasks.length > 0 && (
                  <>
                    <div className="tm-done-divider">Completed ({doneTasks.length})</div>
                    {doneTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        dayId={activeDay.id}
                        onToggle={(d, id, done) => updateTask(d, id, { done })}
                        onPin={(d, id, pinned) => updateTask(d, id, { pinned })}
                        onDelete={deleteTask}
                        onEdit={updateTask}
                      />
                    ))}
                  </>
                )}

                {incompleteTasks.length === 0 && doneTasks.length === 0 && pinnedTasks.length === 0 && (
                  <div style={{ padding: "32px 0", textAlign: "center", color: "#aaa", fontSize: 14 }}>
                    No tasks yet — add one below
                  </div>
                )}
              </div>
            </div>

            {/* Add task */}
            <div className="tm-add-row">
              <input
                ref={inputRef}
                className="tm-add-input"
                placeholder="Add a task and press Enter…"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              />
              <Button
                type="primary"
                icon={<MdAdd style={{ fontSize: 16 }} />}
                onClick={handleAdd}
                disabled={!newTaskText.trim()}
              >
                Add
              </Button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#aaa" }}>
            Select a day to get started
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagerPage;
