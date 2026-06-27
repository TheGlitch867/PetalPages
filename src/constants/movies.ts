import type { Rating } from "./ratings";
import type {
  FinishedMovieSlot,
  MoviesData,
  UpcomingMovieSlot,
} from "../types/movies";

export const MOVIES_PER_STRIP = 4;

function isRating(value: unknown): value is Rating {
  return typeof value === "number" && value >= 1 && value <= 5;
}

export function createEmptyFinishedStrip(): FinishedMovieSlot[] {
  return Array.from({ length: MOVIES_PER_STRIP }, () => ({}));
}

export function createEmptyUpcomingStrip(): UpcomingMovieSlot[] {
  return Array.from({ length: MOVIES_PER_STRIP }, () => ({}));
}

export function createDefaultMoviesData(): MoviesData {
  return {
    finishedStrips: [createEmptyFinishedStrip()],
    upcomingStrips: [createEmptyUpcomingStrip()],
  };
}

function normalizeFinishedSlot(raw: unknown): FinishedMovieSlot {
  if (!raw || typeof raw !== "object") return {};
  const slot = raw as FinishedMovieSlot;
  const result: FinishedMovieSlot = {};
  if (typeof slot.imageDataUrl === "string" && slot.imageDataUrl.startsWith("data:image/")) {
    result.imageDataUrl = slot.imageDataUrl;
  }
  if (typeof slot.title === "string" && slot.title.trim()) {
    result.title = slot.title.trim();
  }
  if (isRating(slot.rating)) result.rating = slot.rating;
  return result;
}

function normalizeUpcomingSlot(raw: unknown): UpcomingMovieSlot {
  if (!raw || typeof raw !== "object") return {};
  const slot = raw as UpcomingMovieSlot;
  const result: UpcomingMovieSlot = {};
  if (typeof slot.imageDataUrl === "string" && slot.imageDataUrl.startsWith("data:image/")) {
    result.imageDataUrl = slot.imageDataUrl;
  }
  if (typeof slot.title === "string" && slot.title.trim()) {
    result.title = slot.title.trim();
  }
  if (typeof slot.watchDate === "string" && slot.watchDate.trim()) {
    result.watchDate = slot.watchDate.trim();
  }
  return result;
}

function normalizeStrips<T>(
  raw: unknown,
  normalizeSlot: (value: unknown) => T,
  createStrip: () => T[],
): T[][] {
  if (!Array.isArray(raw) || raw.length === 0) return [createStrip()];
  return raw.map((strip) => {
    if (!Array.isArray(strip)) return createStrip();
    const empty = createStrip();
    return empty.map((_, index) => normalizeSlot(strip[index]));
  });
}

export function normalizeMoviesData(raw: unknown): MoviesData {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return createDefaultMoviesData();
  }
  const data = raw as MoviesData;
  const finishedStrips = normalizeStrips(
    data.finishedStrips,
    normalizeFinishedSlot,
    createEmptyFinishedStrip,
  );
  const upcomingStrips = normalizeStrips(
    data.upcomingStrips,
    normalizeUpcomingSlot,
    createEmptyUpcomingStrip,
  );
  return { finishedStrips, upcomingStrips };
}

function mergeFinishedSlot(local: FinishedMovieSlot, cloud: FinishedMovieSlot): FinishedMovieSlot {
  return {
    imageDataUrl: local.imageDataUrl ?? cloud.imageDataUrl,
    title: local.title?.trim() ? local.title : cloud.title,
    rating: local.rating ?? cloud.rating,
  };
}

function mergeUpcomingSlot(local: UpcomingMovieSlot, cloud: UpcomingMovieSlot): UpcomingMovieSlot {
  return {
    imageDataUrl: local.imageDataUrl ?? cloud.imageDataUrl,
    title: local.title?.trim() ? local.title : cloud.title,
    watchDate: local.watchDate?.trim() ? local.watchDate : cloud.watchDate,
  };
}

function mergeStripArrays<T>(
  local: T[][],
  cloud: T[][],
  mergeSlot: (a: T, b: T) => T,
  createStrip: () => T[],
): T[][] {
  const count = Math.max(local.length, cloud.length, 1);
  return Array.from({ length: count }, (_, stripIndex) => {
    const localStrip = local[stripIndex] ?? createStrip();
    const cloudStrip = cloud[stripIndex] ?? createStrip();
    return createStrip().map((emptySlot, slotIndex) =>
      mergeSlot(localStrip[slotIndex] ?? emptySlot, cloudStrip[slotIndex] ?? emptySlot),
    );
  });
}

export function mergeMoviesData(local: MoviesData, cloud: MoviesData): MoviesData {
  return {
    finishedStrips: mergeStripArrays(
      local.finishedStrips,
      cloud.finishedStrips,
      mergeFinishedSlot,
      createEmptyFinishedStrip,
    ),
    upcomingStrips: mergeStripArrays(
      local.upcomingStrips,
      cloud.upcomingStrips,
      mergeUpcomingSlot,
      createEmptyUpcomingStrip,
    ),
  };
}
