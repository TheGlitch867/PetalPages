import type {
  AlphabetChallengeEntries,
  AlphabetChallengeEntry,
  AlphabetColorId,
  AlphabetLetter,
} from "../types/alphabetChallenge";

export const ALPHABET_CHALLENGE_COLORS = [
  { id: "red", label: "Red", row: "#ffe8e8", fill: "#e53935" },
  { id: "orange", label: "Orange", row: "#fff0dc", fill: "#ff9800" },
  { id: "yellow", label: "Yellow", row: "#fffde7", fill: "#fdd835" },
  { id: "pale-yellow", label: "Pale yellow", row: "#fffef0", fill: "#fff59d" },
  { id: "pale-green", label: "Pale green", row: "#e8f5e9", fill: "#81c784" },
  { id: "grass-green", label: "Grass green", row: "#e0f2e3", fill: "#43a047" },
  { id: "baby-blue", label: "Baby blue", row: "#e8f7ff", fill: "#87ceeb" },
  { id: "ocean-blue", label: "Ocean blue", row: "#e0f7fa", fill: "#00acc1" },
  { id: "light-purple", label: "Light purple", row: "#f3e8ff", fill: "#c084fc" },
  { id: "lilac-blue", label: "Lilac blue", row: "#e8eaf6", fill: "#7986cb" },
  { id: "baby-pink", label: "Baby pink", row: "#fce4ec", fill: "#f06292" },
  { id: "magenta", label: "Magenta", row: "#fce4f3", fill: "#c2185b" },
  { id: "white", label: "White", row: "#fafafa", fill: "#ffffff" },
  { id: "grey", label: "Grey", row: "#eeeeee", fill: "#9e9e9e" },
  { id: "brown", label: "Brown", row: "#efebe9", fill: "#795548" },
] as const satisfies ReadonlyArray<{
  id: AlphabetColorId;
  label: string;
  row: string;
  fill: string;
}>;

export const ALPHABET_LETTERS: AlphabetLetter[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const ALPHABET_COLUMN_LEFT = ALPHABET_LETTERS.slice(0, 13);
export const ALPHABET_COLUMN_RIGHT = ALPHABET_LETTERS.slice(13);

const letterSet = new Set<string>(ALPHABET_LETTERS);
const colorMap = new Map(ALPHABET_CHALLENGE_COLORS.map((c) => [c.id, c]));

export function isAlphabetLetter(value: unknown): value is AlphabetLetter {
  return typeof value === "string" && letterSet.has(value);
}

export function isAlphabetColorId(value: unknown): value is AlphabetColorId {
  return typeof value === "string" && colorMap.has(value as AlphabetColorId);
}

export function getAlphabetColor(colorId: AlphabetColorId | undefined) {
  if (colorId && colorMap.has(colorId)) return colorMap.get(colorId)!;
  return null;
}

export function getAlphabetEntry(
  entries: AlphabetChallengeEntries,
  letter: AlphabetLetter,
): AlphabetChallengeEntry {
  return entries[letter] ?? { title: "" };
}

function normalizeEntry(raw: unknown): AlphabetChallengeEntry | null {
  if (typeof raw === "string") {
    const title = raw.trim();
    return title ? { title: raw } : null;
  }
  if (!raw || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title : "";
  const colorId = isAlphabetColorId(record.colorId) ? record.colorId : undefined;
  const completed = record.completed === true;

  if (!title.trim() && !colorId && !completed) return null;
  return { title, colorId, completed };
}

function entryIsEmpty(entry: AlphabetChallengeEntry | undefined): boolean {
  if (!entry) return true;
  return !entry.title.trim() && !entry.colorId && !entry.completed;
}

export function normalizeAlphabetChallengeEntries(raw: unknown): AlphabetChallengeEntries {
  if (!raw || typeof raw !== "object") return {};
  const result: AlphabetChallengeEntries = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!isAlphabetLetter(key)) continue;
    const entry = normalizeEntry(value);
    if (entry) result[key] = entry;
  }
  return result;
}

export function mergeAlphabetChallengeEntries(
  local: AlphabetChallengeEntries,
  cloud: AlphabetChallengeEntries,
): AlphabetChallengeEntries {
  const result: AlphabetChallengeEntries = { ...cloud };
  for (const letter of ALPHABET_LETTERS) {
    const localEntry = local[letter];
    const cloudEntry = cloud[letter];
    if (entryIsEmpty(localEntry) && entryIsEmpty(cloudEntry)) {
      delete result[letter];
      continue;
    }
    if (entryIsEmpty(localEntry)) {
      if (cloudEntry) result[letter] = cloudEntry;
      else delete result[letter];
      continue;
    }
    if (entryIsEmpty(cloudEntry)) {
      result[letter] = localEntry!;
      continue;
    }
    result[letter] = { ...cloudEntry!, ...localEntry! };
  }
  return result;
}

export function countFilledAlphabetEntries(entries: AlphabetChallengeEntries): number {
  return ALPHABET_LETTERS.filter((letter) => entries[letter]?.title?.trim()).length;
}

export function countCompletedAlphabetEntries(entries: AlphabetChallengeEntries): number {
  return ALPHABET_LETTERS.filter((letter) => entries[letter]?.completed).length;
}
