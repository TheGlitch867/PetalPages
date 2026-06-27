import type {
  SleepColorId,
  SleepDayEntry,
  SleepEntries,
  SleepQuality,
} from "../types/sleep";

export const SLEEP_HOUR_COUNT = 18;

export const SLEEP_PM_HOURS = [
  { index: 0, label: "7" },
  { index: 1, label: "8" },
  { index: 2, label: "9" },
  { index: 3, label: "10" },
  { index: 4, label: "11" },
  { index: 5, label: "12" },
] as const;

export const SLEEP_AM_HOURS = [
  { index: 6, label: "1" },
  { index: 7, label: "2" },
  { index: 8, label: "3" },
  { index: 9, label: "4" },
  { index: 10, label: "5" },
  { index: 11, label: "6" },
  { index: 12, label: "7" },
  { index: 13, label: "8" },
  { index: 14, label: "9" },
  { index: 15, label: "10" },
  { index: 16, label: "11" },
  { index: 17, label: "12" },
] as const;

export const SLEEP_COLORS = [
  { id: "red", label: "Red", fill: "#e53935" },
  { id: "orange", label: "Orange", fill: "#ff9800" },
  { id: "pale-yellow", label: "Pale yellow", fill: "#fff59d" },
  { id: "sunny-yellow", label: "Sunny yellow", fill: "#fdd835" },
  { id: "pale-green", label: "Pale green", fill: "#81c784" },
  { id: "grass-green", label: "Grass green", fill: "#43a047" },
  { id: "light-blue", label: "Light blue", fill: "#42a5f5" },
  { id: "ocean-blue", label: "Ocean blue", fill: "#00acc1" },
  { id: "light-purple", label: "Light purple", fill: "#c084fc" },
  { id: "lilac-purple", label: "Lilac purple", fill: "#ab47bc" },
  { id: "baby-pink", label: "Baby pink", fill: "#f06292" },
  { id: "rose-pink", label: "Rose pink", fill: "#c2185b" },
  { id: "grey", label: "Grey", fill: "#9e9e9e" },
  { id: "brown", label: "Brown", fill: "#795548" },
  { id: "black", label: "Black", fill: "#212121" },
] as const satisfies ReadonlyArray<{
  id: SleepColorId;
  label: string;
  fill: string;
}>;

export const DEFAULT_SLEEP_COLOR: SleepColorId = "light-purple";

const qualitySet = new Set<number>([1, 2, 3, 4, 5]);
const colorMap = new Map(SLEEP_COLORS.map((c) => [c.id, c]));

export function isSleepQuality(value: unknown): value is SleepQuality {
  return typeof value === "number" && qualitySet.has(value);
}

export function isSleepColorId(value: unknown): value is SleepColorId {
  return typeof value === "string" && colorMap.has(value as SleepColorId);
}

export function getSleepColor(colorId: SleepColorId | undefined) {
  if (colorId && colorMap.has(colorId)) return colorMap.get(colorId)!;
  return colorMap.get(DEFAULT_SLEEP_COLOR)!;
}

function normalizeHours(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  const hours = raw.filter(
    (h): h is number => typeof h === "number" && h >= 0 && h < SLEEP_HOUR_COUNT,
  );
  return [...new Set(hours)].sort((a, b) => a - b);
}

function normalizeDayEntry(raw: unknown): SleepDayEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const hours = normalizeHours(record.hours);
  const quality = isSleepQuality(record.quality) ? record.quality : undefined;
  const colorId = isSleepColorId(record.colorId) ? record.colorId : undefined;
  if (hours.length === 0 && !quality) return null;
  return { hours, quality, colorId };
}

export function normalizeSleepEntries(raw: unknown): SleepEntries {
  if (!raw || typeof raw !== "object") return {};
  const result: SleepEntries = {};
  for (const [dateKey, value] of Object.entries(raw)) {
    const entry = normalizeDayEntry(value);
    if (entry) result[dateKey] = entry;
  }
  return result;
}

export function mergeSleepEntries(local: SleepEntries, cloud: SleepEntries): SleepEntries {
  return { ...cloud, ...local };
}

export function getSleepEntry(
  entries: SleepEntries,
  dateKey: string,
): SleepDayEntry {
  return entries[dateKey] ?? { hours: [] };
}

export function isHourAsleep(entry: SleepDayEntry, hourIndex: number): boolean {
  return entry.hours.includes(hourIndex);
}

export function sleepHourFill(entry: SleepDayEntry): string {
  return getSleepColor(entry.colorId).fill;
}

export function sleepDurationHours(entry: SleepDayEntry): number {
  return entry.hours.length;
}
