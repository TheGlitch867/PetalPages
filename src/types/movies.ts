import type { Rating } from "../constants/ratings";

export interface FinishedMovieSlot {
  imageDataUrl?: string;
  title?: string;
  rating?: Rating;
}

export interface UpcomingMovieSlot {
  imageDataUrl?: string;
  title?: string;
  watchDate?: string;
}

export interface MoviesData {
  finishedStrips: FinishedMovieSlot[][];
  upcomingStrips: UpcomingMovieSlot[][];
}
