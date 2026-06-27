export interface PlacedBookTrisPiece {
  id: string;
  pieceId: BookTrisPieceId;
  row: number;
  col: number;
  rotation: number;
}

export type BookTrisPlacements = PlacedBookTrisPiece[];

export interface BookTrisCell {
  r: number;
  c: number;
}

export interface BookTrisPieceDef {
  id: BookTrisPieceId;
  label: string;
  color: string;
  cells: BookTrisCell[];
}

export type BookTrisPieceId =
  | "z-red"
  | "t-orange"
  | "i-yellow"
  | "s-green"
  | "o-cyan"
  | "t-pink"
  | "j-pink"
  | "l-red";
