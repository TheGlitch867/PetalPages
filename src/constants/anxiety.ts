import type { TrackerScale } from "./trackerScale";

export type AnxietyLevel = 1 | 2 | 3 | 4 | 5;

export const ANXIETY_SCALE: TrackerScale<AnxietyLevel> = {
  levels: [1, 2, 3, 4, 5],
  colors: {
    1: "#F5D76E",
    2: "#F5A623",
    3: "#E878A0",
    4: "#9B8EC4",
    5: "#5BBFB5",
  },
  labels: {
    1: "None",
    2: "Low",
    3: "Medium",
    4: "High",
    5: "Severe",
  },
  formatTooltip: (label) => label,
  pickerTitle: "Log anxiety",
  clearLabel: "Clear entry",
};
