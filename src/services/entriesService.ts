import {
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import type { AnxietyLevel } from "../constants/anxiety";
import type { CryingLevel } from "../constants/crying";
import type { StressLevel } from "../constants/stress";
import type { FitnessActivity } from "../constants/fitness";
import type { Rating } from "../constants/ratings";
import type { ReadingTier } from "../constants/reading";
import type { AppSettings } from "../constants/appSettings";
import { normalizeAppSettings } from "../constants/appSettings";
import {
  mergePageBackgrounds,
  normalizePageBackgrounds,
  type PageBackgrounds,
} from "../constants/pageBackgrounds";
import {
  mergePageTextColors,
  normalizePageTextColors,
  type PageTextColors,
} from "../constants/pageTextColors";
import type {
  AnxietyEntries,
  FitnessEntries,
  MoodEntries,
  ReadingEntries,
  StressEntries,
  CryingEntries,
} from "../store/useMoodStore";
import type { TbrBook, TbrList } from "../types/tbr";
import { normalizeTbrList } from "../constants/tbr";
import {
  mergeTbrBookshelfColors,
  normalizeTbrBookshelfColors,
  type TbrBookshelfColors,
} from "../constants/tbrBookshelf";
import {
  mergeBookTrackerSlots,
  normalizeBookTrackerSlots,
} from "../constants/bookTracker";
import type { BookTrackerSlots } from "../types/bookTracker";
import {
  mergeRainbowBookSlots,
  normalizeRainbowBookSlots,
} from "../constants/rainbowBooks";
import type { RainbowBookSlots } from "../types/rainbowBooks";
import {
  mergeBookTrisPlacements,
  normalizeBookTrisPlacements,
} from "../constants/bookTris";
import type { BookTrisPlacements } from "../types/bookTris";
import {
  mergeAlphabetChallengeEntries,
  normalizeAlphabetChallengeEntries,
} from "../constants/alphabetChallenge";
import type { AlphabetChallengeEntries } from "../types/alphabetChallenge";
import {
  mergeSleepEntries,
  normalizeSleepEntries,
} from "../constants/sleep";
import type { SleepDayEntry, SleepEntries } from "../types/sleep";
import {
  mergeCalendarEvents,
  normalizeCalendarEvents,
} from "../constants/calendar";
import type { CalendarDayEntry, CalendarEvents } from "../types/calendar";
import { mergeGoalsByMonth, normalizeGoalsByMonth } from "../constants/goals";
import type { GoalsByMonth } from "../types/goals";
import {
  mergeDayReviewEntries,
  normalizeDayReviewEntries,
} from "../constants/dayReview";
import type { DayReviewEntry, DayReviewEntries } from "../types/dayReview";
import { mergeMoviesData, normalizeMoviesData } from "../constants/movies";
import type { MoviesData } from "../types/movies";
import { mergeShowsData, normalizeShowsData } from "../constants/shows";
import type { ShowsData } from "../types/shows";
import { normalizeDreamText } from "../constants/dream";
import { db } from "../lib/firebase";

interface UserDataDoc {
  moodEntries?: Record<string, number>;
  anxietyEntries?: Record<string, number>;
  stressEntries?: Record<string, number>;
  cryingEntries?: Record<string, number>;
  fitnessEntries?: Record<string, number>;
  readingEntries?: Record<string, number>;
  tbrList?: TbrBook[];
  tbrBookshelfColors?: TbrBookshelfColors;
  bookTrackerSlots?: BookTrackerSlots;
  rainbowBookSlots?: RainbowBookSlots;
  bookTrisPlacements?: BookTrisPlacements;
  alphabetChallengeEntries?: AlphabetChallengeEntries;
  sleepEntries?: SleepEntries;
  calendarEvents?: CalendarEvents;
  goalsByMonth?: GoalsByMonth;
  /** @deprecated legacy flat list — migrated on read */
  goalsList?: unknown;
  dayReviewEntries?: DayReviewEntries;
  moviesData?: MoviesData;
  showsData?: ShowsData;
  dreamText?: string;
  settings?: {
    year: number;
    allowFuture: boolean;
    navBackgroundColorId?: string;
    navTextColorId?: string;
  };
  pageBackgrounds?: Record<string, string>;
  pageTextColors?: Record<string, string>;
}

function userDocRef(userId: string) {
  if (!db) throw new Error("Cloud sync is not configured.");
  return doc(db, "users", userId);
}

function parseMoodEntries(raw: Record<string, number> | undefined): MoodEntries {
  const entries: MoodEntries = {};
  if (!raw) return entries;
  for (const [date, rating] of Object.entries(raw)) {
    if (rating >= 1 && rating <= 5) entries[date] = rating as Rating;
  }
  return entries;
}

function parseAnxietyEntries(
  raw: Record<string, number> | undefined,
): AnxietyEntries {
  const entries: AnxietyEntries = {};
  if (!raw) return entries;
  for (const [date, level] of Object.entries(raw)) {
    if (level >= 1 && level <= 5) entries[date] = level as AnxietyLevel;
  }
  return entries;
}

function parseStressEntries(
  raw: Record<string, number> | undefined,
): StressEntries {
  const entries: StressEntries = {};
  if (!raw) return entries;
  for (const [date, level] of Object.entries(raw)) {
    if (level >= 1 && level <= 5) entries[date] = level as StressLevel;
  }
  return entries;
}

function parseCryingEntries(
  raw: Record<string, number> | undefined,
): CryingEntries {
  const entries: CryingEntries = {};
  if (!raw) return entries;
  for (const [date, level] of Object.entries(raw)) {
    if (level >= 1 && level <= 5) entries[date] = level as CryingLevel;
  }
  return entries;
}

function parseFitnessEntries(
  raw: Record<string, number> | undefined,
): FitnessEntries {
  const entries: FitnessEntries = {};
  if (!raw) return entries;
  for (const [date, activity] of Object.entries(raw)) {
    if (activity >= 1 && activity <= 9) entries[date] = activity as FitnessActivity;
  }
  return entries;
}

function parseReadingEntries(
  raw: Record<string, number> | undefined,
): ReadingEntries {
  const entries: ReadingEntries = {};
  if (!raw) return entries;
  for (const [date, tier] of Object.entries(raw)) {
    if (tier >= 1 && tier <= 6) entries[date] = tier as ReadingTier;
  }
  return entries;
}

function parseTbrList(raw: TbrBook[] | undefined): TbrList {
  return normalizeTbrList(raw);
}

export async function fetchCloudData(userId: string): Promise<{
  moodEntries: MoodEntries;
  anxietyEntries: AnxietyEntries;
  stressEntries: StressEntries;
  cryingEntries: CryingEntries;
  fitnessEntries: FitnessEntries;
  readingEntries: ReadingEntries;
  tbrList: TbrList;
  tbrBookshelfColors: TbrBookshelfColors;
  bookTrackerSlots: BookTrackerSlots;
  rainbowBookSlots: RainbowBookSlots;
  bookTrisPlacements: BookTrisPlacements;
  alphabetChallengeEntries: AlphabetChallengeEntries;
  sleepEntries: SleepEntries;
  calendarEvents: CalendarEvents;
  goalsByMonth: GoalsByMonth;
  dayReviewEntries: DayReviewEntries;
  moviesData: MoviesData;
  showsData: ShowsData;
  dreamText: string;
  settings: AppSettings | null;
  pageBackgrounds: PageBackgrounds;
  pageTextColors: PageTextColors;
}> {
  const snapshot = await getDoc(userDocRef(userId));
  if (!snapshot.exists()) {
    return {
      moodEntries: {},
      anxietyEntries: {},
      stressEntries: {},
      cryingEntries: {},
      fitnessEntries: {},
      readingEntries: {},
      tbrList: [],
      tbrBookshelfColors: {},
      bookTrackerSlots: normalizeBookTrackerSlots([]),
      rainbowBookSlots: normalizeRainbowBookSlots([]),
      bookTrisPlacements: [],
      alphabetChallengeEntries: {},
      sleepEntries: {},
      calendarEvents: {},
      goalsByMonth: {},
      dayReviewEntries: {},
      moviesData: normalizeMoviesData(undefined),
      showsData: normalizeShowsData(undefined),
      dreamText: "",
      settings: null,
      pageBackgrounds: {},
      pageTextColors: {},
    };
  }

  const data = snapshot.data() as UserDataDoc;
  return {
    moodEntries: parseMoodEntries(data.moodEntries),
    anxietyEntries: parseAnxietyEntries(data.anxietyEntries),
    stressEntries: parseStressEntries(data.stressEntries),
    cryingEntries: parseCryingEntries(data.cryingEntries),
    fitnessEntries: parseFitnessEntries(data.fitnessEntries),
    readingEntries: parseReadingEntries(data.readingEntries),
    tbrList: parseTbrList(data.tbrList),
    tbrBookshelfColors: normalizeTbrBookshelfColors(data.tbrBookshelfColors),
    bookTrackerSlots: normalizeBookTrackerSlots(data.bookTrackerSlots),
    rainbowBookSlots: normalizeRainbowBookSlots(data.rainbowBookSlots),
    bookTrisPlacements: normalizeBookTrisPlacements(data.bookTrisPlacements),
    alphabetChallengeEntries: normalizeAlphabetChallengeEntries(
      data.alphabetChallengeEntries,
    ),
    sleepEntries: normalizeSleepEntries(data.sleepEntries),
    calendarEvents: normalizeCalendarEvents(data.calendarEvents),
    goalsByMonth: normalizeGoalsByMonth(data.goalsByMonth ?? data.goalsList),
    dayReviewEntries: normalizeDayReviewEntries(data.dayReviewEntries),
    moviesData: normalizeMoviesData(data.moviesData),
    showsData: normalizeShowsData(data.showsData),
    dreamText: normalizeDreamText(data.dreamText),
    settings: data.settings ? normalizeAppSettings(data.settings) : null,
    pageBackgrounds: normalizePageBackgrounds(data.pageBackgrounds),
    pageTextColors: normalizePageTextColors(data.pageTextColors),
  };
}

export async function syncLocalEntriesToCloud(
  userId: string,
  moodEntries: MoodEntries,
  anxietyEntries: AnxietyEntries,
  stressEntries: StressEntries,
  cryingEntries: CryingEntries,
  fitnessEntries: FitnessEntries,
  readingEntries: ReadingEntries,
  tbrList: TbrList,
  tbrBookshelfColors: TbrBookshelfColors,
  bookTrackerSlots: BookTrackerSlots,
  rainbowBookSlots: RainbowBookSlots,
  bookTrisPlacements: BookTrisPlacements,
  alphabetChallengeEntries: AlphabetChallengeEntries,
  sleepEntries: SleepEntries,
  calendarEvents: CalendarEvents,
  goalsByMonth: GoalsByMonth,
  dayReviewEntries: DayReviewEntries,
  moviesData: MoviesData,
  showsData: ShowsData,
  dreamText: string,
  pageBackgrounds: PageBackgrounds,
  pageTextColors: PageTextColors,
): Promise<void> {
  if (!db) return;

  const ref = userDocRef(userId);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const existing = snapshot.data() as UserDataDoc;
    await setDoc(
      ref,
      {
        moodEntries: { ...existing.moodEntries, ...moodEntries },
        anxietyEntries: { ...existing.anxietyEntries, ...anxietyEntries },
        stressEntries: { ...existing.stressEntries, ...stressEntries },
        cryingEntries: { ...existing.cryingEntries, ...cryingEntries },
        fitnessEntries: { ...existing.fitnessEntries, ...fitnessEntries },
        readingEntries: { ...existing.readingEntries, ...readingEntries },
        tbrList: mergeTbrLists(existing.tbrList ?? [], tbrList),
        tbrBookshelfColors: mergeTbrBookshelfColors(
          existing.tbrBookshelfColors ?? {},
          tbrBookshelfColors,
        ),
        bookTrackerSlots: mergeBookTrackerSlots(
          bookTrackerSlots,
          normalizeBookTrackerSlots(existing.bookTrackerSlots),
        ),
        rainbowBookSlots: mergeRainbowBookSlots(
          rainbowBookSlots,
          normalizeRainbowBookSlots(existing.rainbowBookSlots),
        ),
        bookTrisPlacements: mergeBookTrisPlacements(
          bookTrisPlacements,
          normalizeBookTrisPlacements(existing.bookTrisPlacements),
        ),
        alphabetChallengeEntries: mergeAlphabetChallengeEntries(
          alphabetChallengeEntries,
          normalizeAlphabetChallengeEntries(existing.alphabetChallengeEntries),
        ),
        sleepEntries: mergeSleepEntries(
          sleepEntries,
          normalizeSleepEntries(existing.sleepEntries),
        ),
        calendarEvents: mergeCalendarEvents(
          calendarEvents,
          normalizeCalendarEvents(existing.calendarEvents),
        ),
        goalsByMonth: mergeGoalsByMonth(
          goalsByMonth,
          normalizeGoalsByMonth(existing.goalsByMonth ?? existing.goalsList),
        ),
        dayReviewEntries: mergeDayReviewEntries(
          dayReviewEntries,
          normalizeDayReviewEntries(existing.dayReviewEntries),
        ),
        moviesData: mergeMoviesData(
          moviesData,
          normalizeMoviesData(existing.moviesData),
        ),
        showsData: mergeShowsData(
          showsData,
          normalizeShowsData(existing.showsData),
        ),
        dreamText,
        pageBackgrounds: mergePageBackgrounds(
          pageBackgrounds,
          normalizePageBackgrounds(existing.pageBackgrounds),
        ),
        pageTextColors: mergePageTextColors(
          pageTextColors,
          normalizePageTextColors(existing.pageTextColors),
        ),
      },
      { merge: true },
    );
  } else {
    await setDoc(ref, {
      moodEntries,
      anxietyEntries,
      stressEntries,
      cryingEntries,
      fitnessEntries,
      readingEntries,
      tbrList,
      tbrBookshelfColors,
      bookTrackerSlots,
      rainbowBookSlots,
      bookTrisPlacements,
      alphabetChallengeEntries,
      sleepEntries,
      calendarEvents,
      goalsByMonth,
      dayReviewEntries,
      moviesData,
      showsData,
      dreamText,
      pageBackgrounds,
      pageTextColors,
    });
  }
}

async function upsertEntryField(
  userId: string,
  field: keyof Pick<
    UserDataDoc,
    "moodEntries" | "anxietyEntries" | "stressEntries" | "cryingEntries" | "fitnessEntries" | "readingEntries"
  >,
  date: string,
  value: number | null,
): Promise<void> {
  if (!db) return;

  const ref = userDocRef(userId);
  const update: DocumentData =
    value === null
      ? { [`${field}.${date}`]: deleteField() }
      : { [`${field}.${date}`]: value };

  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    await updateDoc(ref, update);
  } else {
    await setDoc(ref, { [field]: value === null ? {} : { [date]: value } });
  }
}

export const upsertMoodEntry = (
  userId: string,
  date: string,
  rating: Rating | null,
) => upsertEntryField(userId, "moodEntries", date, rating);

export const upsertAnxietyEntry = (
  userId: string,
  date: string,
  level: AnxietyLevel | null,
) => upsertEntryField(userId, "anxietyEntries", date, level);

export const upsertStressEntry = (
  userId: string,
  date: string,
  level: StressLevel | null,
) => upsertEntryField(userId, "stressEntries", date, level);

export const upsertCryingEntry = (
  userId: string,
  date: string,
  level: CryingLevel | null,
) => upsertEntryField(userId, "cryingEntries", date, level);

export const upsertFitnessEntry = (
  userId: string,
  date: string,
  activity: FitnessActivity | null,
) => upsertEntryField(userId, "fitnessEntries", date, activity);

export const upsertReadingEntry = (
  userId: string,
  date: string,
  tier: ReadingTier | null,
) => upsertEntryField(userId, "readingEntries", date, tier);

export async function upsertSleepEntry(
  userId: string,
  dateKey: string,
  entry: SleepDayEntry | null,
): Promise<void> {
  if (!db) return;

  const ref = userDocRef(userId);
  const update: DocumentData =
    entry === null
      ? { [`sleepEntries.${dateKey}`]: deleteField() }
      : { [`sleepEntries.${dateKey}`]: entry };

  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    await updateDoc(ref, update);
  } else {
    await setDoc(ref, { sleepEntries: entry === null ? {} : { [dateKey]: entry } });
  }
}

export async function upsertCalendarDay(
  userId: string,
  dateKey: string,
  entry: CalendarDayEntry | null,
): Promise<void> {
  if (!db) return;

  const ref = userDocRef(userId);
  const update: DocumentData =
    entry === null
      ? { [`calendarEvents.${dateKey}`]: deleteField() }
      : { [`calendarEvents.${dateKey}`]: entry };

  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    await updateDoc(ref, update);
  } else {
    await setDoc(ref, { calendarEvents: entry === null ? {} : { [dateKey]: entry } });
  }
}

export async function upsertUserSettings(
  userId: string,
  settings: AppSettings,
): Promise<void> {
  if (!db) return;

  await setDoc(
    userDocRef(userId),
    {
      settings: {
        year: settings.year,
        allowFuture: settings.allowFuture,
        navBackgroundColorId: settings.navBackgroundColorId,
        navTextColorId: settings.navTextColorId,
      },
    },
    { merge: true },
  );
}

export async function upsertPageBackgrounds(
  userId: string,
  pageBackgrounds: PageBackgrounds,
): Promise<void> {
  if (!db) return;

  await setDoc(
    userDocRef(userId),
    { pageBackgrounds: normalizePageBackgrounds(pageBackgrounds) },
    { merge: true },
  );
}

export async function upsertPageTextColors(
  userId: string,
  pageTextColors: PageTextColors,
): Promise<void> {
  if (!db) return;

  await setDoc(
    userDocRef(userId),
    { pageTextColors: normalizePageTextColors(pageTextColors) },
    { merge: true },
  );
}

export async function upsertTbrList(userId: string, tbrList: TbrList): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { tbrList }, { merge: true });
}

export async function upsertGoalsByMonth(userId: string, goalsByMonth: GoalsByMonth): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { goalsByMonth }, { merge: true });
}

export async function upsertDayReviewEntry(
  userId: string,
  dateKey: string,
  entry: DayReviewEntry | null,
): Promise<void> {
  if (!db) return;

  const ref = userDocRef(userId);
  const update: DocumentData =
    entry === null
      ? { [`dayReviewEntries.${dateKey}`]: deleteField() }
      : { [`dayReviewEntries.${dateKey}`]: entry };

  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    await updateDoc(ref, update);
  } else {
    await setDoc(ref, { dayReviewEntries: entry === null ? {} : { [dateKey]: entry } });
  }
}

export async function upsertTbrBookshelfColors(
  userId: string,
  colors: TbrBookshelfColors,
): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { tbrBookshelfColors: colors }, { merge: true });
}

export async function upsertBookTrackerSlots(
  userId: string,
  slots: BookTrackerSlots,
): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { bookTrackerSlots: slots }, { merge: true });
}

export async function upsertMoviesData(userId: string, moviesData: MoviesData): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { moviesData }, { merge: true });
}

export async function upsertShowsData(userId: string, showsData: ShowsData): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { showsData }, { merge: true });
}

export async function upsertDreamText(userId: string, dreamText: string): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { dreamText }, { merge: true });
}

export async function upsertRainbowBookSlots(
  userId: string,
  slots: RainbowBookSlots,
): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { rainbowBookSlots: slots }, { merge: true });
}

export async function upsertBookTrisPlacements(
  userId: string,
  placements: BookTrisPlacements,
): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { bookTrisPlacements: placements }, { merge: true });
}

export async function upsertAlphabetChallengeEntries(
  userId: string,
  entries: AlphabetChallengeEntries,
): Promise<void> {
  if (!db) return;

  await setDoc(userDocRef(userId), { alphabetChallengeEntries: entries }, { merge: true });
}

export function mergeEntries<T extends number>(
  local: Record<string, T>,
  cloud: Record<string, T>,
): Record<string, T> {
  return { ...local, ...cloud };
}

export function mergeTbrLists(local: TbrList, cloud: TbrList): TbrList {
  const map = new Map<string, TbrBook>();
  for (const book of cloud) map.set(book.id, book);
  for (const book of local) map.set(book.id, book);
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}
