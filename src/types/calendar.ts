export type CalendarColorId =
  | "red"
  | "orange"
  | "pale-yellow"
  | "sunny-yellow"
  | "light-green"
  | "vibrant-green"
  | "baby-blue"
  | "ocean-blue"
  | "light-purple"
  | "lilac-purple"
  | "baby-pink"
  | "rose"
  | "white"
  | "grey"
  | "brown";

export interface CalendarDayEntry {
  text: string;
  colorId?: CalendarColorId;
}

export type CalendarEvents = Record<string, CalendarDayEntry>;
