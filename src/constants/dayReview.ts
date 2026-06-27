import type { Rating } from "./ratings";
import type {
  DayReviewEntry,
  DayReviewEntries,
  DayReviewFeelingId,
  DayReviewMoodId,
} from "../types/dayReview";

export const DAY_REVIEW_MOODS = [
  { id: "energetic", label: "Energetic", color: "#ff9800" },
  { id: "happy", label: "Happy", color: "#f06292" },
  { id: "ok", label: "OK", color: "#43a047" },
  { id: "tired", label: "Tired", color: "#78909c" },
  { id: "sad", label: "Sad", color: "#42a5f5" },
  { id: "angry", label: "Angry", color: "#e53935" },
] as const satisfies ReadonlyArray<{
  id: DayReviewMoodId;
  label: string;
  color: string;
}>;

export const DAY_REVIEW_FEELINGS: ReadonlyArray<{
  id: DayReviewFeelingId;
  label: string;
  mood: DayReviewMoodId;
}> = [
  { id: "excited", label: "Excited", mood: "energetic" },
  { id: "optimistic", label: "Optimistic", mood: "energetic" },
  { id: "lively", label: "Lively", mood: "energetic" },
  { id: "powerful", label: "Powerful", mood: "energetic" },
  { id: "ecstatic", label: "Ecstatic", mood: "energetic" },
  { id: "over-the-moon", label: "Over the moon", mood: "energetic" },
  { id: "on-cloud-nine", label: "On cloud nine", mood: "energetic" },
  { id: "peppy", label: "Peppy", mood: "energetic" },
  { id: "vibrant", label: "Vibrant", mood: "energetic" },
  { id: "motivated", label: "Motivated", mood: "energetic" },
  { id: "invigorated", label: "Invigorated", mood: "energetic" },
  { id: "spirited", label: "Spirited", mood: "energetic" },
  { id: "dynamic", label: "Dynamic", mood: "energetic" },
  { id: "buzzing", label: "Buzzing", mood: "energetic" },
  { id: "hyped", label: "Hyped", mood: "energetic" },
  { id: "pumped", label: "Pumped", mood: "energetic" },
  { id: "enthusiastic", label: "Enthusiastic", mood: "energetic" },
  { id: "thrilled", label: "Thrilled", mood: "energetic" },
  { id: "elated", label: "Elated", mood: "energetic" },
  { id: "cheerful", label: "Cheerful", mood: "happy" },
  { id: "joyful", label: "Joyful", mood: "happy" },
  { id: "merry", label: "Merry", mood: "happy" },
  { id: "jubilant", label: "Jubilant", mood: "happy" },
  { id: "delighted", label: "Delighted", mood: "happy" },
  { id: "pleased", label: "Pleased", mood: "happy" },
  { id: "blissful", label: "Blissful", mood: "happy" },
  { id: "upbeat", label: "Upbeat", mood: "happy" },
  { id: "sunny", label: "Sunny", mood: "happy" },
  { id: "gleeful", label: "Gleeful", mood: "happy" },
  { id: "lighthearted", label: "Lighthearted", mood: "happy" },
  { id: "buoyant", label: "Buoyant", mood: "happy" },
  { id: "glowing", label: "Glowing", mood: "happy" },
  { id: "amused", label: "Amused", mood: "happy" },
  { id: "playful", label: "Playful", mood: "happy" },
  { id: "content", label: "Content", mood: "ok" },
  { id: "calm", label: "Calm", mood: "ok" },
  { id: "fine", label: "Fine", mood: "ok" },
  { id: "approval", label: "Approval", mood: "ok" },
  { id: "alright", label: "Alright", mood: "ok" },
  { id: "peaceful", label: "Peaceful", mood: "ok" },
  { id: "relaxed", label: "Relaxed", mood: "ok" },
  { id: "balanced", label: "Balanced", mood: "ok" },
  { id: "steady", label: "Steady", mood: "ok" },
  { id: "settled", label: "Settled", mood: "ok" },
  { id: "comfortable", label: "Comfortable", mood: "ok" },
  { id: "unbothered", label: "Unbothered", mood: "ok" },
  { id: "composed", label: "Composed", mood: "ok" },
  { id: "adequate", label: "Adequate", mood: "ok" },
  { id: "neutral", label: "Neutral", mood: "ok" },
  { id: "okay", label: "Okay", mood: "ok" },
  { id: "weary", label: "Weary", mood: "tired" },
  { id: "fatigued", label: "Fatigued", mood: "tired" },
  { id: "drowsy", label: "Drowsy", mood: "tired" },
  { id: "drained", label: "Drained", mood: "tired" },
  { id: "worn-out", label: "Worn out", mood: "tired" },
  { id: "exhausted", label: "Exhausted", mood: "tired" },
  { id: "sleepy", label: "Sleepy", mood: "tired" },
  { id: "sluggish", label: "Sluggish", mood: "tired" },
  { id: "lethargic", label: "Lethargic", mood: "tired" },
  { id: "spent", label: "Spent", mood: "tired" },
  { id: "burnt-out", label: "Burnt out", mood: "tired" },
  { id: "run-down", label: "Run down", mood: "tired" },
  { id: "beat", label: "Beat", mood: "tired" },
  { id: "low-energy", label: "Low energy", mood: "tired" },
  { id: "heavy-eyed", label: "Heavy-eyed", mood: "tired" },
  { id: "upset", label: "Upset", mood: "sad" },
  { id: "down", label: "Down", mood: "sad" },
  { id: "depressed", label: "Depressed", mood: "sad" },
  { id: "blue", label: "Blue", mood: "sad" },
  { id: "gloomy", label: "Gloomy", mood: "sad" },
  { id: "heartbroken", label: "Heartbroken", mood: "sad" },
  { id: "lost", label: "Lost", mood: "sad" },
  { id: "miserable", label: "Miserable", mood: "sad" },
  { id: "sorrowful", label: "Sorrowful", mood: "sad" },
  { id: "melancholy", label: "Melancholy", mood: "sad" },
  { id: "lonely", label: "Lonely", mood: "sad" },
  { id: "hopeless", label: "Hopeless", mood: "sad" },
  { id: "hurt", label: "Hurt", mood: "sad" },
  { id: "grieving", label: "Grieving", mood: "sad" },
  { id: "empty", label: "Empty", mood: "sad" },
  { id: "tearful", label: "Tearful", mood: "sad" },
  { id: "dejected", label: "Dejected", mood: "sad" },
  { id: "unhappy", label: "Unhappy", mood: "sad" },
  { id: "annoyed", label: "Annoyed", mood: "angry" },
  { id: "furious", label: "Furious", mood: "angry" },
  { id: "enraged", label: "Enraged", mood: "angry" },
  { id: "irritated", label: "Irritated", mood: "angry" },
  { id: "livid", label: "Livid", mood: "angry" },
  { id: "infuriated", label: "Infuriated", mood: "angry" },
  { id: "cross", label: "Cross", mood: "angry" },
  { id: "exasperated", label: "Exasperated", mood: "angry" },
  { id: "mad", label: "Mad", mood: "angry" },
  { id: "seething", label: "Seething", mood: "angry" },
  { id: "resentful", label: "Resentful", mood: "angry" },
  { id: "aggravated", label: "Aggravated", mood: "angry" },
  { id: "outraged", label: "Outraged", mood: "angry" },
  { id: "bitter", label: "Bitter", mood: "angry" },
  { id: "frustrated", label: "Frustrated", mood: "angry" },
  { id: "heated", label: "Heated", mood: "angry" },
  { id: "indignant", label: "Indignant", mood: "angry" },
  { id: "snappy", label: "Snappy", mood: "angry" },
];

const moodIds = new Set(DAY_REVIEW_MOODS.map((m) => m.id));
const feelingIds = new Set(DAY_REVIEW_FEELINGS.map((f) => f.id));
const feelingsByMood = new Map<DayReviewMoodId, DayReviewFeelingId[]>();
for (const mood of DAY_REVIEW_MOODS) {
  feelingsByMood.set(
    mood.id,
    DAY_REVIEW_FEELINGS.filter((f) => f.mood === mood.id).map((f) => f.id),
  );
}

export function isDayReviewMoodId(value: unknown): value is DayReviewMoodId {
  return typeof value === "string" && moodIds.has(value as DayReviewMoodId);
}

export function isDayReviewFeelingId(value: unknown): value is DayReviewFeelingId {
  return typeof value === "string" && feelingIds.has(value as DayReviewFeelingId);
}

export function getFeelingsForMood(mood: DayReviewMoodId): typeof DAY_REVIEW_FEELINGS {
  return DAY_REVIEW_FEELINGS.filter((f) => f.mood === mood);
}

export function getFeelingLabel(id: DayReviewFeelingId): string {
  return DAY_REVIEW_FEELINGS.find((f) => f.id === id)?.label ?? id;
}

function isRating(value: unknown): value is Rating {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

export function normalizeDayReviewEntry(raw: unknown): DayReviewEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const rating = isRating(record.rating) ? record.rating : undefined;
  const mood = isDayReviewMoodId(record.mood) ? record.mood : undefined;
  const feelings = Array.isArray(record.feelings)
    ? record.feelings.filter(isDayReviewFeelingId)
    : undefined;
  const note = typeof record.note === "string" ? record.note : undefined;
  const highlight = typeof record.highlight === "string" ? record.highlight : undefined;
  const gratitude = typeof record.gratitude === "string" ? record.gratitude : undefined;
  const savedAt = typeof record.savedAt === "string" ? record.savedAt : undefined;

  const validFeelings =
    mood && feelings
      ? feelings.filter((id) => feelingsByMood.get(mood)?.includes(id))
      : feelings;

  if (
    rating === undefined &&
    mood === undefined &&
    (!validFeelings || validFeelings.length === 0) &&
    !note?.trim() &&
    !highlight?.trim() &&
    !gratitude?.trim()
  ) {
    return null;
  }

  return {
    rating,
    mood,
    feelings: validFeelings?.length ? validFeelings : undefined,
    note: note?.trim() || undefined,
    highlight: highlight?.trim() || undefined,
    gratitude: gratitude?.trim() || undefined,
    savedAt,
  };
}

export function normalizeDayReviewEntries(raw: unknown): DayReviewEntries {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result: DayReviewEntries = {};
  for (const [dateKey, value] of Object.entries(raw as Record<string, unknown>)) {
    const entry = normalizeDayReviewEntry(value);
    if (entry) result[dateKey] = entry;
  }
  return result;
}

export function mergeDayReviewEntries(
  local: DayReviewEntries,
  cloud: DayReviewEntries,
): DayReviewEntries {
  const keys = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  const result: DayReviewEntries = {};
  for (const key of keys) {
    const localEntry = local[key];
    const cloudEntry = cloud[key];
    if (!localEntry && cloudEntry) {
      result[key] = cloudEntry;
      continue;
    }
    if (localEntry && !cloudEntry) {
      result[key] = localEntry;
      continue;
    }
    if (!localEntry || !cloudEntry) continue;
    const localTime = localEntry.savedAt ? Date.parse(localEntry.savedAt) : 0;
    const cloudTime = cloudEntry.savedAt ? Date.parse(cloudEntry.savedAt) : 0;
    result[key] = localTime >= cloudTime ? localEntry : cloudEntry;
  }
  return result;
}

export function getDayReviewEntry(
  entries: DayReviewEntries,
  dateKey: string,
): DayReviewEntry {
  return entries[dateKey] ?? {};
}

export function isDayReviewEntryEmpty(entry: DayReviewEntry): boolean {
  return normalizeDayReviewEntry(entry) === null;
}

export function shiftDate(year: number, month: number, day: number, delta: number) {
  const next = new Date(year, month, day + delta);
  return { year: next.getFullYear(), month: next.getMonth(), day: next.getDate() };
}
