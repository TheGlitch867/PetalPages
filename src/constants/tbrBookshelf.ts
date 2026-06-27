import { isTbrColorId, type TbrColorId } from "./tbr";

export const TBR_BOOKSHELF_PARTS = [
  "book-1",
  "book-2",
  "book-3",
  "book-4",
  "book-5",
  "book-6",
  "book-7",
  "book-8",
  "book-9",
  "book-flat",
  "plant-pot",
  "plant-leaves",
  "book-10",
  "book-11",
  "book-12",
] as const;

export type TbrBookshelfPartId = (typeof TBR_BOOKSHELF_PARTS)[number];

export type TbrBookshelfColors = Partial<Record<TbrBookshelfPartId, TbrColorId>>;

const partSet = new Set<string>(TBR_BOOKSHELF_PARTS);

export function isTbrBookshelfPartId(value: unknown): value is TbrBookshelfPartId {
  return typeof value === "string" && partSet.has(value);
}

export function normalizeTbrBookshelfColors(raw: unknown): TbrBookshelfColors {
  if (!raw || typeof raw !== "object") return {};
  const result: TbrBookshelfColors = {};
  for (const [key, value] of Object.entries(raw)) {
    if (isTbrBookshelfPartId(key) && isTbrColorId(value)) {
      result[key] = value;
    }
  }
  return result;
}

export function mergeTbrBookshelfColors(
  local: TbrBookshelfColors,
  cloud: TbrBookshelfColors,
): TbrBookshelfColors {
  return { ...cloud, ...local };
}
