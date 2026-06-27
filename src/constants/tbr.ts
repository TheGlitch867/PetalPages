import type { TbrList } from "../types/tbr";

export const TBR_COLORS = [
  { id: "red", label: "Red", row: "#ffe8e8", fill: "#e53935" },
  { id: "orange", label: "Orange", row: "#fff0dc", fill: "#ff9800" },
  { id: "pale-yellow", label: "Pale yellow", row: "#fffef0", fill: "#fdd835" },
  { id: "bright-yellow", label: "Bright yellow", row: "#fffde7", fill: "#fbc02d" },
  { id: "pale-green", label: "Pale green", row: "#e8f5e9", fill: "#81c784" },
  { id: "grass-green", label: "Grass green", row: "#e0f2e3", fill: "#43a047" },
  { id: "baby-blue", label: "Baby blue", row: "#e8f7ff", fill: "#87ceeb" },
  { id: "light-blue", label: "Light blue", row: "#e3f2fd", fill: "#42a5f5" },
  { id: "ocean-blue", label: "Ocean blue", row: "#e0f7fa", fill: "#00acc1" },
  { id: "dark-blue", label: "Dark blue", row: "#e3f2fd", fill: "#1565c0" },
  { id: "light-purple", label: "Light purple", row: "#f3e8ff", fill: "#c084fc" },
  { id: "lilac-purple", label: "Lilac purple", row: "#f3e5f5", fill: "#ab47bc" },
  { id: "baby-pink", label: "Baby pink", row: "#fce4ec", fill: "#f06292" },
  { id: "magenta-pink", label: "Magenta pink", row: "#fce4f3", fill: "#c2185b" },
] as const;

export type TbrColorId = (typeof TBR_COLORS)[number]["id"];

export const DEFAULT_TBR_COLOR: TbrColorId = "baby-pink";

const colorMap = new Map(TBR_COLORS.map((c) => [c.id, c]));

export function getTbrColor(colorId: TbrColorId | undefined, fallbackIndex = 0) {
  if (colorId && colorMap.has(colorId)) return colorMap.get(colorId)!;
  return TBR_COLORS[fallbackIndex % TBR_COLORS.length];
}

export function isTbrColorId(value: unknown): value is TbrColorId {
  return typeof value === "string" && colorMap.has(value as TbrColorId);
}

export function defaultColorForIndex(index: number): TbrColorId {
  return TBR_COLORS[index % TBR_COLORS.length].id;
}

export function normalizeTbrList(raw: unknown): TbrList {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item) =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        typeof item?.completed === "boolean" &&
        typeof item?.order === "number",
    )
    .map((item, index) => ({
      id: item.id as string,
      title: item.title as string,
      completed: item.completed as boolean,
      completedAt: typeof item.completedAt === "string" ? item.completedAt : undefined,
      order: item.order as number,
      colorId: isTbrColorId(item.colorId) ? item.colorId : defaultColorForIndex(index),
    }));
}
