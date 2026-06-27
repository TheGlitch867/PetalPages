import type {
  CalendarColorId,
  CalendarDayEntry,
  CalendarEvents,
} from "../types/calendar";

export const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const CALENDAR_COLORS = [
  { id: "red", label: "Red", fill: "#e53935" },
  { id: "orange", label: "Orange", fill: "#ff9800" },
  { id: "pale-yellow", label: "Pale yellow", fill: "#fff59d" },
  { id: "sunny-yellow", label: "Sunny yellow", fill: "#fdd835" },
  { id: "light-green", label: "Light green", fill: "#81c784" },
  { id: "vibrant-green", label: "Vibrant green", fill: "#43a047" },
  { id: "baby-blue", label: "Baby blue", fill: "#87ceeb" },
  { id: "ocean-blue", label: "Ocean blue", fill: "#00acc1" },
  { id: "light-purple", label: "Light purple", fill: "#c084fc" },
  { id: "lilac-purple", label: "Lilac purple", fill: "#ab47bc" },
  { id: "baby-pink", label: "Baby pink", fill: "#f06292" },
  { id: "rose", label: "Rose", fill: "#c2185b" },
  { id: "white", label: "White", fill: "#ffffff" },
  { id: "grey", label: "Grey", fill: "#9e9e9e" },
  { id: "brown", label: "Brown", fill: "#795548" },
] as const satisfies ReadonlyArray<{
  id: CalendarColorId;
  label: string;
  fill: string;
}>;

export const DEFAULT_CALENDAR_COLOR: CalendarColorId = "white";

const colorMap = new Map(CALENDAR_COLORS.map((c) => [c.id, c]));

export function isCalendarColorId(value: unknown): value is CalendarColorId {
  return typeof value === "string" && colorMap.has(value as CalendarColorId);
}

export function getCalendarColor(colorId: CalendarColorId | undefined) {
  if (colorId && colorMap.has(colorId)) return colorMap.get(colorId)!;
  return colorMap.get(DEFAULT_CALENDAR_COLOR)!;
}

/** Monday-start weeks; null = empty cell */
export function buildMonthGrid(
  year: number,
  month: number,
): (number | null)[][] {
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const startOffset = (firstWeekday + 6) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function normalizeDayEntry(raw: unknown): CalendarDayEntry | null {
  if (typeof raw === "string") {
    const text = raw.trim();
    return text ? { text: raw } : null;
  }
  if (!raw || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const text = typeof record.text === "string" ? record.text : "";
  const colorId = isCalendarColorId(record.colorId) ? record.colorId : undefined;
  if (!text.trim() && !colorId) return null;
  return { text, colorId };
}

export function normalizeCalendarEvents(raw: unknown): CalendarEvents {
  if (!raw || typeof raw !== "object") return {};
  const result: CalendarEvents = {};
  for (const [key, value] of Object.entries(raw)) {
    const entry = normalizeDayEntry(value);
    if (entry) result[key] = entry;
  }
  return result;
}

export function mergeCalendarEvents(
  local: CalendarEvents,
  cloud: CalendarEvents,
): CalendarEvents {
  return { ...cloud, ...local };
}

export function getCalendarDayEntry(
  events: CalendarEvents,
  dateKey: string,
): CalendarDayEntry {
  return events[dateKey] ?? { text: "" };
}

export function calendarCellFill(entry: CalendarDayEntry): string {
  return getCalendarColor(entry.colorId).fill;
}
