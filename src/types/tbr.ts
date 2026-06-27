import type { TbrColorId } from "../constants/tbr";

export interface TbrBook {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  order: number;
  colorId: TbrColorId;
}

export type TbrList = TbrBook[];

export interface TbrBookUpdate {
  title?: string;
  colorId?: TbrColorId;
}
