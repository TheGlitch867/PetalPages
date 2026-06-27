import type { TrackerScale } from "./trackerScale";

export type FitnessActivity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Intensity score (1–5) for trends chart */
export const FITNESS_INTENSITY: Record<FitnessActivity, number> = {
  1: 2,
  2: 4,
  3: 4,
  4: 3,
  5: 2,
  6: 4,
  7: 4,
  8: 5,
  9: 1,
};

export const FITNESS_SCALE: TrackerScale<FitnessActivity> = {
  levels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  colors: {
    1: "#87CEEB",
    2: "#00CED1",
    3: "#1E90FF",
    4: "#104E8B",
    5: "#9B8EC4",
    6: "#E878A0",
    7: "#FFB6C1",
    8: "#F5A623",
    9: "#FF69B4",
  },
  labels: {
    1: "Walk",
    2: "Run",
    3: "Weights",
    4: "Dance",
    5: "Yoga",
    6: "Cycling",
    7: "Swimming",
    8: "Sports",
    9: "None",
  },
  formatTooltip: (label) => label,
  pickerTitle: "Log fitness",
  clearLabel: "Clear entry",
};

export function fitnessIntensity(activity: FitnessActivity): number {
  return FITNESS_INTENSITY[activity];
}
