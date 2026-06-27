export interface TrackerScale<T extends number = number> {
  levels: T[];
  colors: Record<T, string>;
  labels: Record<T, string>;
  formatTooltip: (label: string, level: T) => string;
  pickerTitle: string;
  clearLabel: string;
}

export const EMPTY_COLOR = "#FFFFFF";
export const DISABLED_COLOR = "#E8E8E8";

export const MONTH_LETTERS = [
  "J",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
] as const;
