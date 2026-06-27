export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export type SleepColorId =
  | "red"
  | "orange"
  | "pale-yellow"
  | "sunny-yellow"
  | "pale-green"
  | "grass-green"
  | "light-blue"
  | "ocean-blue"
  | "light-purple"
  | "lilac-purple"
  | "baby-pink"
  | "rose-pink"
  | "grey"
  | "brown"
  | "black";

export interface SleepDayEntry {
  /** Hour slot indices (0 = 7 PM … 17 = 12 PM) */
  hours: number[];
  quality?: SleepQuality;
  colorId?: SleepColorId;
}

export type SleepEntries = Record<string, SleepDayEntry>;
