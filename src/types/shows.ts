import type { Rating } from "../constants/ratings";

export type ShowTvColorId =
  | "red"
  | "orange"
  | "pale-yellow"
  | "sunny-yellow"
  | "light-green"
  | "vibrant-green"
  | "light-blue"
  | "ocean-blue"
  | "light-purple"
  | "lilac-purple"
  | "light-pink"
  | "rose"
  | "white"
  | "grey"
  | "black"
  | "brown";

export interface FinishedShowSlot {
  imageDataUrl?: string;
  title?: string;
  rating?: Rating;
  colorId?: ShowTvColorId;
}

export interface UpcomingShowSlot {
  imageDataUrl?: string;
  title?: string;
  airDate?: string;
  colorId?: ShowTvColorId;
}

export interface ShowsData {
  finishedRows: FinishedShowSlot[][];
  upcomingRows: UpcomingShowSlot[][];
}
