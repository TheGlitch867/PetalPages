import type { TrackerScale } from "./trackerScale";

export type CryingLevel = 1 | 2 | 3 | 4 | 5;

export const CRYING_SCALE: TrackerScale<CryingLevel> = {
  levels: [1, 2, 3, 4, 5],
  colors: {
    1: "#b3e5fc",
    2: "#64b5f6",
    3: "#26a69a",
    4: "#9e9e9e",
    5: "#1565c0",
  },
  labels: {
    1: "None",
    2: "Overwhelmed",
    3: "Tearful",
    4: "Good cry",
    5: "Full meltdown",
  },
  formatTooltip: (label) => label,
  pickerTitle: "Log crying",
  clearLabel: "Clear entry",
};
