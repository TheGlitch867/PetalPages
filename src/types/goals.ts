export type GoalColorId =
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

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  order: number;
  colorId?: GoalColorId;
}

/** Goals for a single month, keyed by "YYYY-MM". */
export type GoalsList = Goal[];

export type GoalsByMonth = Record<string, GoalsList>;

export interface GoalUpdate {
  title?: string;
  colorId?: GoalColorId;
}
