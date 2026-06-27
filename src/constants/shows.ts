import type { CSSProperties } from "react";
import type { Rating } from "./ratings";
import type {
  FinishedShowSlot,
  ShowTvColorId,
  ShowsData,
  UpcomingShowSlot,
} from "../types/shows";

export const SHOWS_PER_ROW = 4;

export const SHOW_TV_COLORS = [
  { id: "red", label: "Red", fill: "#e53935" },
  { id: "orange", label: "Orange", fill: "#ff9800" },
  { id: "pale-yellow", label: "Pale yellow", fill: "#fff59d" },
  { id: "sunny-yellow", label: "Sunny yellow", fill: "#fdd835" },
  { id: "light-green", label: "Light green", fill: "#81c784" },
  { id: "vibrant-green", label: "Vibrant green", fill: "#43a047" },
  { id: "light-blue", label: "Light blue", fill: "#87ceeb" },
  { id: "ocean-blue", label: "Ocean blue", fill: "#00acc1" },
  { id: "light-purple", label: "Light purple", fill: "#c084fc" },
  { id: "lilac-purple", label: "Lilac purple", fill: "#ab47bc" },
  { id: "light-pink", label: "Light pink", fill: "#f06292" },
  { id: "rose", label: "Rose", fill: "#c2185b" },
  { id: "white", label: "White", fill: "#ffffff" },
  { id: "grey", label: "Grey", fill: "#9e9e9e" },
  { id: "black", label: "Black", fill: "#212121" },
  { id: "brown", label: "Brown", fill: "#795548" },
] as const satisfies ReadonlyArray<{
  id: ShowTvColorId;
  label: string;
  fill: string;
}>;

export const DEFAULT_SHOW_TV_COLOR: ShowTvColorId = "grey";

const tvColorMap = new Map(SHOW_TV_COLORS.map((c) => [c.id, c]));

export function isShowTvColorId(value: unknown): value is ShowTvColorId {
  return typeof value === "string" && tvColorMap.has(value as ShowTvColorId);
}

export function getShowTvColor(colorId: ShowTvColorId | undefined) {
  if (colorId && tvColorMap.has(colorId)) return tvColorMap.get(colorId)!;
  return tvColorMap.get(DEFAULT_SHOW_TV_COLOR)!;
}

function shadeHex(hex: string, amount: number): string {
  const normalized = hex.replace("#", "");
  const num = parseInt(normalized, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function getTvSetStyle(colorId: ShowTvColorId | undefined): {
  cabinet: CSSProperties;
  antenna: CSSProperties;
  legs: CSSProperties;
} {
  const color = getShowTvColor(colorId);
  const fill = color.fill;
  const border =
    color.id === "white" || color.id === "pale-yellow"
      ? "#bbb"
      : shadeHex(fill, -45);
  const accent =
    color.id === "white" || color.id === "pale-yellow" || color.id === "sunny-yellow"
      ? "#666"
      : shadeHex(fill, -70);

  return {
    cabinet: {
      background: `linear-gradient(180deg, ${shadeHex(fill, 28)} 0%, ${fill} 55%, ${shadeHex(fill, -30)} 100%)`,
      borderColor: border,
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
    },
    antenna: { background: accent },
    legs: { background: accent },
  };
}

function isRating(value: unknown): value is Rating {
  return typeof value === "number" && value >= 1 && value <= 5;
}

export function createEmptyFinishedShowRow(): FinishedShowSlot[] {
  return Array.from({ length: SHOWS_PER_ROW }, () => ({}));
}

export function createEmptyUpcomingShowRow(): UpcomingShowSlot[] {
  return Array.from({ length: SHOWS_PER_ROW }, () => ({}));
}

export function createDefaultShowsData(): ShowsData {
  return {
    finishedRows: [createEmptyFinishedShowRow()],
    upcomingRows: [createEmptyUpcomingShowRow()],
  };
}

function normalizeFinishedSlot(raw: unknown): FinishedShowSlot {
  if (!raw || typeof raw !== "object") return {};
  const slot = raw as FinishedShowSlot;
  const result: FinishedShowSlot = {};
  if (typeof slot.imageDataUrl === "string" && slot.imageDataUrl.startsWith("data:image/")) {
    result.imageDataUrl = slot.imageDataUrl;
  }
  if (typeof slot.title === "string" && slot.title.trim()) {
    result.title = slot.title.trim();
  }
  if (isRating(slot.rating)) result.rating = slot.rating;
  if (isShowTvColorId(slot.colorId)) result.colorId = slot.colorId;
  return result;
}

function normalizeUpcomingSlot(raw: unknown): UpcomingShowSlot {
  if (!raw || typeof raw !== "object") return {};
  const slot = raw as UpcomingShowSlot;
  const result: UpcomingShowSlot = {};
  if (typeof slot.imageDataUrl === "string" && slot.imageDataUrl.startsWith("data:image/")) {
    result.imageDataUrl = slot.imageDataUrl;
  }
  if (typeof slot.title === "string" && slot.title.trim()) {
    result.title = slot.title.trim();
  }
  if (typeof slot.airDate === "string" && slot.airDate.trim()) {
    result.airDate = slot.airDate.trim();
  }
  if (isShowTvColorId(slot.colorId)) result.colorId = slot.colorId;
  return result;
}

function normalizeRows<T>(
  raw: unknown,
  normalizeSlot: (value: unknown) => T,
  createRow: () => T[],
): T[][] {
  if (!Array.isArray(raw) || raw.length === 0) return [createRow()];
  return raw.map((row) => {
    if (!Array.isArray(row)) return createRow();
    const empty = createRow();
    return empty.map((_, index) => normalizeSlot(row[index]));
  });
}

export function normalizeShowsData(raw: unknown): ShowsData {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return createDefaultShowsData();
  }
  const data = raw as ShowsData;
  return {
    finishedRows: normalizeRows(data.finishedRows, normalizeFinishedSlot, createEmptyFinishedShowRow),
    upcomingRows: normalizeRows(data.upcomingRows, normalizeUpcomingSlot, createEmptyUpcomingShowRow),
  };
}

function mergeFinishedSlot(local: FinishedShowSlot, cloud: FinishedShowSlot): FinishedShowSlot {
  return {
    imageDataUrl: local.imageDataUrl ?? cloud.imageDataUrl,
    title: local.title?.trim() ? local.title : cloud.title,
    rating: local.rating ?? cloud.rating,
    colorId: local.colorId ?? cloud.colorId,
  };
}

function mergeUpcomingSlot(local: UpcomingShowSlot, cloud: UpcomingShowSlot): UpcomingShowSlot {
  return {
    imageDataUrl: local.imageDataUrl ?? cloud.imageDataUrl,
    title: local.title?.trim() ? local.title : cloud.title,
    airDate: local.airDate?.trim() ? local.airDate : cloud.airDate,
    colorId: local.colorId ?? cloud.colorId,
  };
}

function mergeRowArrays<T>(
  local: T[][],
  cloud: T[][],
  mergeSlot: (a: T, b: T) => T,
  createRow: () => T[],
): T[][] {
  const count = Math.max(local.length, cloud.length, 1);
  return Array.from({ length: count }, (_, rowIndex) => {
    const localRow = local[rowIndex] ?? createRow();
    const cloudRow = cloud[rowIndex] ?? createRow();
    return createRow().map((emptySlot, slotIndex) =>
      mergeSlot(localRow[slotIndex] ?? emptySlot, cloudRow[slotIndex] ?? emptySlot),
    );
  });
}

export function mergeShowsData(local: ShowsData, cloud: ShowsData): ShowsData {
  return {
    finishedRows: mergeRowArrays(
      local.finishedRows,
      cloud.finishedRows,
      mergeFinishedSlot,
      createEmptyFinishedShowRow,
    ),
    upcomingRows: mergeRowArrays(
      local.upcomingRows,
      cloud.upcomingRows,
      mergeUpcomingSlot,
      createEmptyUpcomingShowRow,
    ),
  };
}
