import type { TrackerScale } from "./trackerScale";

export type Rating = 1 | 2 | 3 | 4 | 5;

export const MOOD_SCALE: TrackerScale<Rating> = {
  levels: [5, 4, 3, 2, 1],
  colors: {
    5: "#5BBFB5",
    4: "#9B8EC4",
    3: "#E878A0",
    2: "#F5A623",
    1: "#F5D76E",
  },
  labels: {
    5: "5 stars",
    4: "4 stars",
    3: "3 stars",
    2: "2 stars",
    1: "1 star",
  },
  formatTooltip: (label) => label,
  pickerTitle: "Rate",
  clearLabel: "Clear rating",
};

// Re-export for backward compatibility
export const RATING_COLORS = MOOD_SCALE.colors;
export const RATING_LABELS = MOOD_SCALE.labels;
