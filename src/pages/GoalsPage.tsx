import { useState, type FormEvent } from "react";
import { GoalsColorPicker } from "../components/GoalsColorPicker/GoalsColorPicker";
import { PageBackground } from "../components/PageBackground/PageBackground";
import { MONTH_NAMES } from "../constants/calendar";
import {
  DEFAULT_GOAL_COLOR,
  getGoalColor,
  getGoalsForMonth,
  goalTextStyle,
  shiftMonth,
  toMonthKey,
} from "../constants/goals";
import type { Goal, GoalColorId, GoalsByMonth } from "../types/goals";
import { todayParts } from "../utils/dateUtils";
import "./GoalsPage.css";

interface GoalsPageProps {
  goalsByMonth: GoalsByMonth;
  addGoal: (monthKey: string, title: string, colorId?: GoalColorId) => void;
  updateGoal: (monthKey: string, id: string, updates: { title?: string; colorId?: GoalColorId }) => void;
  toggleGoalCompleted: (monthKey: string, id: string) => void;
  removeGoal: (monthKey: string, id: string) => void;
}

export function GoalsPage({
  goalsByMonth,
  addGoal,
  updateGoal,
  toggleGoalCompleted,
  removeGoal,
}: GoalsPageProps) {
  const today = todayParts();
  const currentMonthKey = toMonthKey(today.year, today.month);
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);
  const [newTitle, setNewTitle] = useState("");
  const [newColorId, setNewColorId] = useState<GoalColorId>(DEFAULT_GOAL_COLOR);
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
  const [addColorOpen, setAddColorOpen] = useState(false);

  const viewMonthKey = toMonthKey(viewYear, viewMonth);
  const goals = getGoalsForMonth(goalsByMonth, viewMonthKey);
  const sorted = [...goals].sort((a, b) => a.order - b.order);
  const completedCount = sorted.filter((g) => g.completed).length;

  const isPast = viewMonthKey < currentMonthKey;
  const isFuture = viewMonthKey > currentMonthKey;
  const canEdit = !isPast;
  const canToggleComplete = !isFuture;

  const modeLabel = isPast
    ? "Review"
    : isFuture
      ? "Plan ahead"
      : "This month";

  const handleShiftMonth = (delta: number) => {
    const next = shiftMonth(viewYear, viewMonth, delta);
    setViewYear(next.year);
    setViewMonth(next.month);
    setOpenColorPicker(null);
    setAddColorOpen(false);
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed || !canEdit) return;
    addGoal(viewMonthKey, trimmed, newColorId);
    setNewTitle("");
  };

  return (
    <PageBackground pageId="goals" className="goals-page">
      <header className="goals-page__header">
        <h1 className="goals-page__title">Goals</h1>
        <p className="goals-page__sub">Monthly goals</p>

        <div className="goals-page__month-nav">
          <button
            type="button"
            className="goals-page__month-btn"
            onClick={() => handleShiftMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="goals-page__month-label">
            <span className="goals-page__month-name">{MONTH_NAMES[viewMonth]}</span>
            <span className="goals-page__month-year">{viewYear}</span>
            <span className={`goals-page__mode goals-page__mode--${isPast ? "past" : isFuture ? "future" : "current"}`}>
              {modeLabel}
            </span>
          </div>
          <button
            type="button"
            className="goals-page__month-btn"
            onClick={() => handleShiftMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {sorted.length > 0 && (
          <p className="goals-page__progress">
            {completedCount} of {sorted.length} finished
          </p>
        )}

        {isPast && (
          <p className="goals-page__hint">Past months are read-only — browse what you achieved.</p>
        )}
        {isFuture && (
          <p className="goals-page__hint">Set goals now for when this month arrives.</p>
        )}
      </header>

      {canEdit && (
        <form className="goals-page__add-form" onSubmit={handleAdd}>
          <GoalsColorPicker
            value={newColorId}
            open={addColorOpen}
            onOpenChange={setAddColorOpen}
            onChange={setNewColorId}
            label="new goal"
          />
          <input
            type="text"
            className="goals-page__add-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a goal…"
            aria-label="New goal"
            style={goalTextStyle(newColorId)}
          />
          <button type="submit" className="goals-page__add-btn" disabled={!newTitle.trim()}>
            Add
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="goals-page__empty">
          {isPast
            ? "No goals recorded for this month."
            : canEdit
              ? "No goals yet — add one above."
              : "No goals for this month."}
        </p>
      ) : (
        <ul className="goals-list">
          {sorted.map((goal) => (
            <GoalRow
              key={goal.id}
              goal={goal}
              canEdit={canEdit}
              canToggleComplete={canToggleComplete}
              openColorPicker={openColorPicker}
              setOpenColorPicker={setOpenColorPicker}
              onToggle={() => toggleGoalCompleted(viewMonthKey, goal.id)}
              onTitleChange={(title) => updateGoal(viewMonthKey, goal.id, { title })}
              onColorChange={(colorId) => updateGoal(viewMonthKey, goal.id, { colorId })}
              onRemove={() => removeGoal(viewMonthKey, goal.id)}
            />
          ))}
        </ul>
      )}
    </PageBackground>
  );
}

function GoalRow({
  goal,
  canEdit,
  canToggleComplete,
  openColorPicker,
  setOpenColorPicker,
  onToggle,
  onTitleChange,
  onColorChange,
  onRemove,
}: {
  goal: Goal;
  canEdit: boolean;
  canToggleComplete: boolean;
  openColorPicker: string | null;
  setOpenColorPicker: (id: string | null) => void;
  onToggle: () => void;
  onTitleChange: (title: string) => void;
  onColorChange: (colorId: GoalColorId) => void;
  onRemove: () => void;
}) {
  const color = getGoalColor(goal.colorId);
  const pickerOpen = openColorPicker === goal.id;

  return (
    <li className={`goals-list__item${!canEdit ? " goals-list__item--readonly" : ""}`}>
      <button
        type="button"
        className={`goals-list__checkbox${goal.completed ? " goals-list__checkbox--checked" : ""}`}
        onClick={() => canToggleComplete && onToggle()}
        disabled={!canToggleComplete}
        aria-label={`Mark "${goal.title}" as ${goal.completed ? "incomplete" : "complete"}`}
        aria-pressed={goal.completed}
        style={
          goal.completed
            ? { background: color.fill, borderColor: color.id === "white" ? "#ccc" : color.fill }
            : undefined
        }
      />
      {canEdit ? (
        <input
          type="text"
          className={`goals-list__input${goal.completed ? " goals-list__input--completed" : ""}`}
          value={goal.title}
          onChange={(e) => onTitleChange(e.target.value)}
          aria-label={`Goal: ${goal.title}`}
          style={goalTextStyle(goal.colorId)}
        />
      ) : (
        <span
          className={`goals-list__text${goal.completed ? " goals-list__text--completed" : ""}`}
          style={goalTextStyle(goal.colorId)}
        >
          {goal.title}
        </span>
      )}
      {canEdit && (
        <>
          <GoalsColorPicker
            value={goal.colorId}
            open={pickerOpen}
            onOpenChange={(open) => setOpenColorPicker(open ? goal.id : null)}
            onChange={onColorChange}
            label={goal.title}
          />
          <button
            type="button"
            className="goals-list__remove"
            onClick={onRemove}
            aria-label={`Remove goal "${goal.title}"`}
          >
            ×
          </button>
        </>
      )}
    </li>
  );
}
