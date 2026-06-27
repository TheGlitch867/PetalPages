import type { TrackerScale } from "./trackerScale";

export type StressLevel = 1 | 2 | 3 | 4 | 5;

export const STRESS_SCALE: TrackerScale<StressLevel> = {
  levels: [1, 2, 3, 4, 5],
  colors: {
    1: "#43a047",
    2: "#fdd835",
    3: "#ff9800",
    4: "#e53935",
    5: "#b71c1c",
  },
  labels: {
    1: "None",
    2: "Low",
    3: "Medium",
    4: "High",
    5: "Extreme",
  },
  formatTooltip: (label) => label,
  pickerTitle: "Log stress",
  clearLabel: "Clear entry",
};
