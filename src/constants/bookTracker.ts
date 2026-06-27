import type { Rating } from "./ratings";
import type { BookTrackerSlot, BookTrackerSlots } from "../types/bookTracker";

export const BOOK_TRACKER_SLOT_COUNT = 25;

export function createEmptyBookTrackerSlots(): BookTrackerSlots {
  return Array.from({ length: BOOK_TRACKER_SLOT_COUNT }, () => ({}));
}

function isRating(value: unknown): value is Rating {
  return typeof value === "number" && value >= 1 && value <= 5;
}

function normalizeSlot(raw: unknown): BookTrackerSlot {
  if (!raw || typeof raw !== "object") return {};
  const slot = raw as BookTrackerSlot;
  const result: BookTrackerSlot = {};
  if (typeof slot.imageDataUrl === "string" && slot.imageDataUrl.startsWith("data:image/")) {
    result.imageDataUrl = slot.imageDataUrl;
  }
  if (isRating(slot.rating)) result.rating = slot.rating;
  return result;
}

export function normalizeBookTrackerSlots(raw: unknown): BookTrackerSlots {
  const empty = createEmptyBookTrackerSlots();
  if (!Array.isArray(raw)) return empty;
  return empty.map((_, index) => normalizeSlot(raw[index]));
}

export function mergeBookTrackerSlots(
  local: BookTrackerSlots,
  cloud: BookTrackerSlots,
): BookTrackerSlots {
  return local.map((localSlot, index) => {
    const cloudSlot = cloud[index] ?? {};
    return {
      imageDataUrl: localSlot.imageDataUrl ?? cloudSlot.imageDataUrl,
      rating: localSlot.rating ?? cloudSlot.rating,
    };
  });
}
