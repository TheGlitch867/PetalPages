import type {
  BookTrisCell,
  BookTrisPieceDef,
  BookTrisPieceId,
  BookTrisPlacements,
  PlacedBookTrisPiece,
} from "../types/bookTris";

export const BOOK_TRIS_COLS = 10;
export const BOOK_TRIS_ROWS = 22;

export const BOOK_TRIS_PIECES: BookTrisPieceDef[] = [
  {
    id: "z-red",
    label: "Read a book under a week",
    color: "#e53935",
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 1, c: 1 },
      { r: 1, c: 2 },
    ],
  },
  {
    id: "t-orange",
    label: "new genre",
    color: "#ff9800",
    cells: [
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
      { r: 1, c: 2 },
    ],
  },
  {
    id: "i-yellow",
    label: "finished a series",
    color: "#fbc02d",
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 0, c: 3 },
    ],
  },
  {
    id: "s-green",
    label: "An audiobook",
    color: "#43a047",
    cells: [
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
    ],
  },
  {
    id: "o-cyan",
    label: "Read over 100 pages today",
    color: "#4dd0e1",
    cells: [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
    ],
  },
  {
    id: "t-pink",
    label: "Finished it under a month",
    color: "#c084fc",
    cells: [
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
      { r: 1, c: 2 },
    ],
  },
  {
    id: "j-pink",
    label: "Study book",
    color: "#ec407a",
    cells: [
      { r: 0, c: 0 },
      { r: 1, c: 0 },
      { r: 2, c: 0 },
      { r: 2, c: 1 },
    ],
  },
  {
    id: "l-red",
    label: "Read a suggestion from others",
    color: "#212121",
    cells: [
      { r: 0, c: 1 },
      { r: 1, c: 1 },
      { r: 2, c: 0 },
      { r: 2, c: 1 },
    ],
  },
];

const pieceMap = new Map(BOOK_TRIS_PIECES.map((p) => [p.id, p]));
const pieceIds = new Set(BOOK_TRIS_PIECES.map((p) => p.id));

export function getBookTrisPiece(id: BookTrisPieceId): BookTrisPieceDef {
  return pieceMap.get(id)!;
}

export function isBookTrisPieceId(value: unknown): value is BookTrisPieceId {
  return typeof value === "string" && pieceIds.has(value as BookTrisPieceId);
}

function normalizeCells(cells: BookTrisCell[]): BookTrisCell[] {
  if (cells.length === 0) return cells;
  const minR = Math.min(...cells.map((c) => c.r));
  const minC = Math.min(...cells.map((c) => c.c));
  return cells.map(({ r, c }) => ({ r: r - minR, c: c - minC }));
}

function rotateCells90CW(cells: BookTrisCell[]): BookTrisCell[] {
  return normalizeCells(cells.map(({ r, c }) => ({ r: c, c: -r })));
}

export function getRotatedCells(cells: BookTrisCell[], rotation: number): BookTrisCell[] {
  const turns = ((rotation % 4) + 4) % 4;
  let result = cells;
  for (let i = 0; i < turns; i++) {
    result = rotateCells90CW(result);
  }
  return result;
}

export function getPieceCells(pieceId: BookTrisPieceId, rotation = 0): BookTrisCell[] {
  return getRotatedCells(getBookTrisPiece(pieceId).cells, rotation);
}

export function pieceAbsoluteCells(
  pieceId: BookTrisPieceId,
  row: number,
  col: number,
  rotation = 0,
): BookTrisCell[] {
  return getPieceCells(pieceId, rotation).map(({ r, c }) => ({ r: row + r, c: col + c }));
}

export function cellsInBounds(cells: BookTrisCell[]): boolean {
  return cells.every(
    ({ r, c }) => r >= 0 && r < BOOK_TRIS_ROWS && c >= 0 && c < BOOK_TRIS_COLS,
  );
}

export function occupiedCells(placements: BookTrisPlacements): Map<string, string> {
  const map = new Map<string, string>();
  for (const placed of placements) {
    for (const cell of pieceAbsoluteCells(
      placed.pieceId,
      placed.row,
      placed.col,
      placed.rotation,
    )) {
      map.set(`${cell.r},${cell.c}`, placed.id);
    }
  }
  return map;
}

export function canPlacePiece(
  pieceId: BookTrisPieceId,
  row: number,
  col: number,
  placements: BookTrisPlacements,
  rotation = 0,
  excludePlacementId?: string,
): boolean {
  const abs = pieceAbsoluteCells(pieceId, row, col, rotation);
  if (!cellsInBounds(abs)) return false;

  const occupied = occupiedCells(
    excludePlacementId
      ? placements.filter((p) => p.id !== excludePlacementId)
      : placements,
  );

  return abs.every(({ r, c }) => !occupied.has(`${r},${c}`));
}

export function normalizeBookTrisPlacements(raw: unknown): BookTrisPlacements {
  if (!Array.isArray(raw)) return [];
  const parsed = raw
    .filter(
      (item): item is PlacedBookTrisPiece =>
        typeof item?.id === "string" &&
        isBookTrisPieceId(item.pieceId) &&
        typeof item.row === "number" &&
        typeof item.col === "number",
    )
    .map((item) => ({
      ...item,
      rotation:
        typeof item.rotation === "number"
          ? ((item.rotation % 4) + 4) % 4
          : 0,
    }));
  return resolveBookTrisPlacements(parsed);
}

export function mergeBookTrisPlacements(
  local: BookTrisPlacements,
  cloud: BookTrisPlacements,
): BookTrisPlacements {
  const map = new Map<string, PlacedBookTrisPiece>();
  for (const p of cloud) map.set(p.id, p);
  for (const p of local) map.set(p.id, p);
  return resolveBookTrisPlacements(Array.from(map.values()));
}

/** Resolve overlaps after merge — keep valid non-overlapping set */
export function resolveBookTrisPlacements(placements: BookTrisPlacements): BookTrisPlacements {
  const result: BookTrisPlacements = [];
  for (const p of placements) {
    if (canPlacePiece(p.pieceId, p.row, p.col, result, p.rotation)) {
      result.push(p);
    }
  }
  return result;
}
