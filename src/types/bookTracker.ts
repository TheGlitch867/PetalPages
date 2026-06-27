import type { Rating } from "../constants/ratings";

export interface BookTrackerSlot {
  imageDataUrl?: string;
  rating?: Rating;
}

export type BookTrackerSlots = BookTrackerSlot[];
