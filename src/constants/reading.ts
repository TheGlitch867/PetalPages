import type { TrackerScale } from "./trackerScale";

export type ReadingTier = 1 | 2 | 3 | 4 | 5 | 6;

/** Chart intensity (1–5) from pages tier */
export const READING_INTENSITY: Record<ReadingTier, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 5,
};

/** Estimated pages (midpoint of range) for averages */
export const READING_PAGES_ESTIMATE: Record<ReadingTier, number> = {
  1: 10,
  2: 30,
  3: 50,
  4: 70,
  5: 90,
  6: 120,
};

export const READING_SCALE: TrackerScale<ReadingTier> = {
  levels: [1, 2, 3, 4, 5, 6],
  colors: {
    1: "#A8E6A1",
    2: "#008B8B",
    3: "#40E0D0",
    4: "#87CEFA",
    5: "#E878A0",
    6: "#6B3FA0",
  },
  labels: {
    1: "0–20 pages",
    2: "21–40 pages",
    3: "41–60 pages",
    4: "61–80 pages",
    5: "81–100 pages",
    6: "100+ pages",
  },
  formatTooltip: (label) => label,
  pickerTitle: "Log reading",
  clearLabel: "Clear entry",
};

export function readingIntensity(tier: ReadingTier): number {
  return READING_INTENSITY[tier];
}

export function readingPagesEstimate(tier: ReadingTier): number {
  return READING_PAGES_ESTIMATE[tier];
}
