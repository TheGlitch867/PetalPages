import type { CSSProperties } from "react";
import type { Goal, GoalColorId, GoalsByMonth, GoalsList } from "../types/goals";
import { todayParts } from "../utils/dateUtils";

export const GOAL_COLORS = [
  { id: "red", label: "Red", fill: "#e53935" },
  { id: "orange", label: "Orange", fill: "#ff9800" },
  { id: "pale-yellow", label: "Pale yellow", fill: "#fff59d" },
  { id: "sunny-yellow", label: "Sunny yellow", fill: "#fdd835" },
  { id: "light-green", label: "Light green", fill: "#81c784" },
  { id: "vibrant-green", label: "Vibrant green", fill: "#43a047" },
  { id: "baby-blue", label: "Light blue", fill: "#87ceeb" },
  { id: "ocean-blue", label: "Ocean blue", fill: "#00acc1" },
  { id: "light-purple", label: "Light purple", fill: "#c084fc" },
  { id: "lilac-purple", label: "Lilac purple", fill: "#ab47bc" },
  { id: "baby-pink", label: "Baby pink", fill: "#f06292" },
  { id: "rose", label: "Rose", fill: "#c2185b" },
  { id: "white", label: "White", fill: "#ffffff" },
  { id: "grey", label: "Grey", fill: "#9e9e9e" },
  { id: "brown", label: "Brown", fill: "#795548" },
] as const satisfies ReadonlyArray<{
  id: GoalColorId;
  label: string;
  fill: string;
}>;

export const DEFAULT_GOAL_COLOR: GoalColorId = "rose";

const colorMap = new Map(GOAL_COLORS.map((c) => [c.id, c]));

const LIGHT_TEXT_COLOR_IDS = new Set<GoalColorId>([
  "white",
  "pale-yellow",
  "sunny-yellow",
  "light-green",
  "baby-blue",
  "baby-pink",
]);

export function isGoalColorId(value: unknown): value is GoalColorId {
  return typeof value === "string" && colorMap.has(value as GoalColorId);
}

export function getGoalColor(colorId: GoalColorId | undefined) {
  if (colorId && colorMap.has(colorId)) return colorMap.get(colorId)!;
  return colorMap.get(DEFAULT_GOAL_COLOR)!;
}

export function goalTextStyle(colorId: GoalColorId | undefined): CSSProperties {
  const color = getGoalColor(colorId);
  const style: CSSProperties = { color: color.fill };
  if (LIGHT_TEXT_COLOR_IDS.has(color.id)) {
    style.textShadow = "0 0 1px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.25)";
  }
  return style;
}

export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function parseMonthKey(key: string): { year: number; month: number } {
  const [year, month] = key.split("-").map(Number);
  return { year, month: month - 1 };
}

export function shiftMonth(year: number, month: number, delta: number) {
  let nextMonth = month + delta;
  let nextYear = year;
  while (nextMonth < 0) {
    nextMonth += 12;
    nextYear -= 1;
  }
  while (nextMonth > 11) {
    nextMonth -= 12;
    nextYear += 1;
  }
  return { year: nextYear, month: nextMonth };
}

export function normalizeGoalsList(raw: unknown): GoalsList {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item) =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        typeof item?.completed === "boolean" &&
        typeof item?.order === "number",
    )
    .map((item) => ({
      id: item.id as string,
      title: item.title as string,
      completed: item.completed as boolean,
      completedAt: typeof item.completedAt === "string" ? item.completedAt : undefined,
      order: item.order as number,
      colorId: isGoalColorId(item.colorId) ? item.colorId : undefined,
    }))
    .sort((a, b) => a.order - b.order);
}

/** Accepts legacy flat array or month-keyed object. */
export function normalizeGoalsByMonth(raw: unknown): GoalsByMonth {
  if (Array.isArray(raw)) {
    const list = normalizeGoalsList(raw);
    if (list.length === 0) return {};
    const { year, month } = todayParts();
    return { [toMonthKey(year, month)]: list };
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const result: GoalsByMonth = {};
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (/^\d{4}-\d{2}$/.test(key)) {
        const list = normalizeGoalsList(value);
        if (list.length > 0) result[key] = list;
      }
    }
    return result;
  }
  return {};
}

export function getGoalsForMonth(byMonth: GoalsByMonth, monthKey: string): GoalsList {
  return normalizeGoalsList(byMonth[monthKey] ?? []);
}

export function mergeGoalsLists(local: GoalsList, cloud: GoalsList): GoalsList {
  const map = new Map<string, Goal>();
  for (const goal of cloud) map.set(goal.id, goal);
  for (const goal of local) map.set(goal.id, goal);
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

export function mergeGoalsByMonth(local: GoalsByMonth, cloud: GoalsByMonth): GoalsByMonth {
  const keys = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  const result: GoalsByMonth = {};
  for (const key of keys) {
    const merged = mergeGoalsLists(local[key] ?? [], cloud[key] ?? []);
    if (merged.length > 0) result[key] = merged;
  }
  return result;
}
