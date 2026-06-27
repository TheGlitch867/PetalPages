import { useCallback, useEffect, useRef, useState } from "react";
import type { AnxietyLevel } from "../constants/anxiety";
import type { CryingLevel } from "../constants/crying";
import type { StressLevel } from "../constants/stress";
import type { FitnessActivity } from "../constants/fitness";
import type { Rating } from "../constants/ratings";
import type { ReadingTier } from "../constants/reading";
import type { Goal, GoalColorId, GoalUpdate, GoalsByMonth, GoalsList } from "../types/goals";
import {
  mergeGoalsByMonth,
  normalizeGoalsByMonth,
  normalizeGoalsList,
} from "../constants/goals";
import type { DayReviewEntry, DayReviewEntries } from "../types/dayReview";
import type { MoviesData } from "../types/movies";
import {
  createDefaultMoviesData,
  createEmptyFinishedStrip,
  createEmptyUpcomingStrip,
  mergeMoviesData,
  normalizeMoviesData,
} from "../constants/movies";
import type { ShowTvColorId, ShowsData } from "../types/shows";
import {
  createDefaultShowsData,
  createEmptyFinishedShowRow,
  createEmptyUpcomingShowRow,
  mergeShowsData,
  normalizeShowsData,
} from "../constants/shows";
import type { TbrBook, TbrBookUpdate, TbrList } from "../types/tbr";
import type { BookTrackerSlots } from "../types/bookTracker";
import type { RainbowBookSlots } from "../types/rainbowBooks";
import type { BookTrisPieceId, BookTrisPlacements } from "../types/bookTris";
import type { AlphabetChallengeEntries, AlphabetColorId, AlphabetLetter } from "../types/alphabetChallenge";
import type { SleepDayEntry, SleepEntries, SleepColorId, SleepQuality } from "../types/sleep";
import type { CalendarDayEntry, CalendarEvents, CalendarColorId } from "../types/calendar";
import {
  getDayReviewEntry,
  mergeDayReviewEntries,
  normalizeDayReviewEntries,
  isDayReviewEntryEmpty,
} from "../constants/dayReview";
import { mergeDreamText, normalizeDreamText } from "../constants/dream";
import {
  mergeAlphabetChallengeEntries,
  normalizeAlphabetChallengeEntries,
} from "../constants/alphabetChallenge";
import { getCalendarDayEntry, mergeCalendarEvents, normalizeCalendarEvents } from "../constants/calendar";
import { getSleepEntry, mergeSleepEntries, normalizeSleepEntries } from "../constants/sleep";
import {
  normalizeTbrList,
  type TbrColorId,
} from "../constants/tbr";
import {
  mergeTbrBookshelfColors,
  normalizeTbrBookshelfColors,
  type TbrBookshelfColors,
  type TbrBookshelfPartId,
} from "../constants/tbrBookshelf";
import {
  createEmptyBookTrackerSlots,
  mergeBookTrackerSlots,
  normalizeBookTrackerSlots,
} from "../constants/bookTracker";
import {
  createEmptyRainbowBookSlots,
  mergeRainbowBookSlots,
  normalizeRainbowBookSlots,
} from "../constants/rainbowBooks";
import {
  canPlacePiece,
  mergeBookTrisPlacements,
  normalizeBookTrisPlacements,
} from "../constants/bookTris";
import {
  fetchCloudData,
  mergeEntries,
  mergeTbrLists,
  syncLocalEntriesToCloud,
  upsertAlphabetChallengeEntries,
  upsertAnxietyEntry,
  upsertCryingEntry,
  upsertStressEntry,
  upsertBookTrackerSlots,
  upsertBookTrisPlacements,
  upsertCalendarDay,
  upsertDayReviewEntry,
  upsertDreamText,
  upsertShowsData,
  upsertMoviesData,
  upsertGoalsByMonth,
  upsertFitnessEntry,
  upsertMoodEntry,
  upsertReadingEntry,
  upsertRainbowBookSlots,
  upsertSleepEntry,
  upsertTbrBookshelfColors,
  upsertTbrList,
  upsertUserSettings,
  upsertPageBackgrounds,
  upsertPageTextColors,
} from "../services/entriesService";
import {
  mergePageBackgrounds,
  normalizePageBackgrounds,
  type PageBackgroundId,
  type PageBackgrounds,
} from "../constants/pageBackgrounds";
import type { NavThemeColorId } from "../constants/navTheme";
import {
  mergePageTextColors,
  normalizePageTextColors,
  type PageTextColors,
} from "../constants/pageTextColors";

const MOOD_ENTRIES_KEY = "rate-my-day-entries";
const ANXIETY_ENTRIES_KEY = "rate-my-day-anxiety-entries";
const STRESS_ENTRIES_KEY = "rate-my-day-stress-entries";
const CRYING_ENTRIES_KEY = "rate-my-day-crying-entries";
const FITNESS_ENTRIES_KEY = "rate-my-day-fitness-entries";
const READING_ENTRIES_KEY = "rate-my-day-reading-entries";
const TBR_LIST_KEY = "rate-my-day-tbr-list";
const TBR_BOOKSHELF_KEY = "rate-my-day-tbr-bookshelf";
const BOOK_TRACKER_KEY = "rate-my-day-book-tracker";
const RAINBOW_BOOKS_KEY = "rate-my-day-rainbow-books";
const BOOK_TRIS_KEY = "rate-my-day-book-tris";
const ALPHABET_CHALLENGE_KEY = "rate-my-day-alphabet-challenge";
const SLEEP_ENTRIES_KEY = "rate-my-day-sleep-entries";
const CALENDAR_EVENTS_KEY = "rate-my-day-calendar-events";
const GOALS_BY_MONTH_KEY = "rate-my-day-goals-list";
const DAY_REVIEW_ENTRIES_KEY = "rate-my-day-day-review-entries";
const MOVIES_KEY = "rate-my-day-movies";
const SHOWS_KEY = "rate-my-day-shows";
const DREAM_KEY = "rate-my-day-dream";
const SETTINGS_KEY = "rate-my-day-settings";
const PAGE_BACKGROUNDS_KEY = "rate-my-day-page-backgrounds";
const PAGE_TEXT_COLORS_KEY = "rate-my-day-page-text-colors";

export type MoodEntries = Record<string, Rating>;
export type AnxietyEntries = Record<string, AnxietyLevel>;
export type StressEntries = Record<string, StressLevel>;
export type CryingEntries = Record<string, CryingLevel>;
export type FitnessEntries = Record<string, FitnessActivity>;
export type ReadingEntries = Record<string, ReadingTier>;

import {
  defaultAppSettings,
  normalizeAppSettings,
  type AppSettings,
} from "../constants/appSettings";

export type { AppSettings };

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function loadDreamText(): string {
  try {
    return normalizeDreamText(localStorage.getItem(DREAM_KEY));
  } catch {
    return "";
  }
}

export function useMoodStore(userId: string | null) {
  const [moodEntries, setMoodEntries] = useState<MoodEntries>(() =>
    loadJson(MOOD_ENTRIES_KEY, {}),
  );
  const [anxietyEntries, setAnxietyEntries] = useState<AnxietyEntries>(() =>
    loadJson(ANXIETY_ENTRIES_KEY, {}),
  );
  const [stressEntries, setStressEntries] = useState<StressEntries>(() =>
    loadJson(STRESS_ENTRIES_KEY, {}),
  );
  const [cryingEntries, setCryingEntries] = useState<CryingEntries>(() =>
    loadJson(CRYING_ENTRIES_KEY, {}),
  );
  const [fitnessEntries, setFitnessEntries] = useState<FitnessEntries>(() =>
    loadJson(FITNESS_ENTRIES_KEY, {}),
  );
  const [readingEntries, setReadingEntries] = useState<ReadingEntries>(() =>
    loadJson(READING_ENTRIES_KEY, {}),
  );
  const [tbrList, setTbrList] = useState<TbrList>(() =>
    normalizeTbrList(loadJson(TBR_LIST_KEY, [])),
  );
  const [tbrBookshelfColors, setTbrBookshelfColors] = useState<TbrBookshelfColors>(() =>
    normalizeTbrBookshelfColors(loadJson(TBR_BOOKSHELF_KEY, {})),
  );
  const [bookTrackerSlots, setBookTrackerSlots] = useState<BookTrackerSlots>(() =>
    normalizeBookTrackerSlots(loadJson(BOOK_TRACKER_KEY, createEmptyBookTrackerSlots())),
  );
  const [rainbowBookSlots, setRainbowBookSlots] = useState<RainbowBookSlots>(() =>
    normalizeRainbowBookSlots(loadJson(RAINBOW_BOOKS_KEY, createEmptyRainbowBookSlots())),
  );
  const [bookTrisPlacements, setBookTrisPlacements] = useState<BookTrisPlacements>(() =>
    normalizeBookTrisPlacements(loadJson(BOOK_TRIS_KEY, [])),
  );
  const [alphabetChallengeEntries, setAlphabetChallengeEntries] =
    useState<AlphabetChallengeEntries>(() =>
      normalizeAlphabetChallengeEntries(loadJson(ALPHABET_CHALLENGE_KEY, {})),
    );
  const [sleepEntries, setSleepEntries] = useState<SleepEntries>(() =>
    normalizeSleepEntries(loadJson(SLEEP_ENTRIES_KEY, {})),
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvents>(() =>
    normalizeCalendarEvents(loadJson(CALENDAR_EVENTS_KEY, {})),
  );
  const [goalsByMonth, setGoalsByMonth] = useState<GoalsByMonth>(() =>
    normalizeGoalsByMonth(loadJson(GOALS_BY_MONTH_KEY, {})),
  );
  const [dayReviewEntries, setDayReviewEntries] = useState<DayReviewEntries>(() =>
    normalizeDayReviewEntries(loadJson(DAY_REVIEW_ENTRIES_KEY, {})),
  );
  const [moviesData, setMoviesData] = useState<MoviesData>(() =>
    normalizeMoviesData(loadJson(MOVIES_KEY, createDefaultMoviesData())),
  );
  const [showsData, setShowsData] = useState<ShowsData>(() =>
    normalizeShowsData(loadJson(SHOWS_KEY, createDefaultShowsData())),
  );
  const [dreamText, setDreamTextState] = useState(() => loadDreamText());
  const [settings, setSettings] = useState<AppSettings>(() =>
    normalizeAppSettings(loadJson(SETTINGS_KEY, defaultAppSettings())),
  );
  const [pageBackgrounds, setPageBackgrounds] = useState<PageBackgrounds>(() =>
    normalizePageBackgrounds(loadJson(PAGE_BACKGROUNDS_KEY, {})),
  );
  const [pageTextColors, setPageTextColors] = useState<PageTextColors>(() =>
    normalizePageTextColors(loadJson(PAGE_TEXT_COLORS_KEY, {})),
  );
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [cloudReady, setCloudReady] = useState(!userId);
  const skipSettingsSync = useRef(false);
  const skipPageBackgroundsSync = useRef(false);
  const skipPageTextColorsSync = useRef(false);

  useEffect(() => {
    localStorage.setItem(MOOD_ENTRIES_KEY, JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem(ANXIETY_ENTRIES_KEY, JSON.stringify(anxietyEntries));
  }, [anxietyEntries]);

  useEffect(() => {
    localStorage.setItem(STRESS_ENTRIES_KEY, JSON.stringify(stressEntries));
  }, [stressEntries]);

  useEffect(() => {
    localStorage.setItem(CRYING_ENTRIES_KEY, JSON.stringify(cryingEntries));
  }, [cryingEntries]);

  useEffect(() => {
    localStorage.setItem(FITNESS_ENTRIES_KEY, JSON.stringify(fitnessEntries));
  }, [fitnessEntries]);

  useEffect(() => {
    localStorage.setItem(READING_ENTRIES_KEY, JSON.stringify(readingEntries));
  }, [readingEntries]);

  useEffect(() => {
    localStorage.setItem(TBR_LIST_KEY, JSON.stringify(tbrList));
  }, [tbrList]);

  useEffect(() => {
    localStorage.setItem(TBR_BOOKSHELF_KEY, JSON.stringify(tbrBookshelfColors));
  }, [tbrBookshelfColors]);

  useEffect(() => {
    localStorage.setItem(BOOK_TRACKER_KEY, JSON.stringify(bookTrackerSlots));
  }, [bookTrackerSlots]);

  useEffect(() => {
    localStorage.setItem(RAINBOW_BOOKS_KEY, JSON.stringify(rainbowBookSlots));
  }, [rainbowBookSlots]);

  useEffect(() => {
    localStorage.setItem(BOOK_TRIS_KEY, JSON.stringify(bookTrisPlacements));
  }, [bookTrisPlacements]);

  useEffect(() => {
    localStorage.setItem(
      ALPHABET_CHALLENGE_KEY,
      JSON.stringify(alphabetChallengeEntries),
    );
  }, [alphabetChallengeEntries]);

  useEffect(() => {
    localStorage.setItem(SLEEP_ENTRIES_KEY, JSON.stringify(sleepEntries));
  }, [sleepEntries]);

  useEffect(() => {
    localStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem(GOALS_BY_MONTH_KEY, JSON.stringify(goalsByMonth));
  }, [goalsByMonth]);

  useEffect(() => {
    localStorage.setItem(DAY_REVIEW_ENTRIES_KEY, JSON.stringify(dayReviewEntries));
  }, [dayReviewEntries]);

  useEffect(() => {
    localStorage.setItem(MOVIES_KEY, JSON.stringify(moviesData));
  }, [moviesData]);

  useEffect(() => {
    localStorage.setItem(SHOWS_KEY, JSON.stringify(showsData));
  }, [showsData]);

  useEffect(() => {
    localStorage.setItem(DREAM_KEY, dreamText);
  }, [dreamText]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(PAGE_BACKGROUNDS_KEY, JSON.stringify(pageBackgrounds));
  }, [pageBackgrounds]);

  useEffect(() => {
    localStorage.setItem(PAGE_TEXT_COLORS_KEY, JSON.stringify(pageTextColors));
  }, [pageTextColors]);

  useEffect(() => {
    if (!userId) {
      setCloudReady(true);
      setSyncError(null);
      return;
    }

    let cancelled = false;

    async function loadCloudData() {
      setSyncing(true);
      setSyncError(null);
      setCloudReady(false);

      try {
        const localMood = loadJson<MoodEntries>(MOOD_ENTRIES_KEY, {});
        const localAnxiety = loadJson<AnxietyEntries>(ANXIETY_ENTRIES_KEY, {});
        const localStress = loadJson<StressEntries>(STRESS_ENTRIES_KEY, {});
        const localCrying = loadJson<CryingEntries>(CRYING_ENTRIES_KEY, {});
        const localFitness = loadJson<FitnessEntries>(FITNESS_ENTRIES_KEY, {});
        const localReading = loadJson<ReadingEntries>(READING_ENTRIES_KEY, {});
        const localTbrList = normalizeTbrList(loadJson(TBR_LIST_KEY, []));
        const localBookshelf = normalizeTbrBookshelfColors(loadJson(TBR_BOOKSHELF_KEY, {}));
        const localBookTracker = normalizeBookTrackerSlots(
          loadJson(BOOK_TRACKER_KEY, createEmptyBookTrackerSlots()),
        );
        const localRainbowBooks = normalizeRainbowBookSlots(
          loadJson(RAINBOW_BOOKS_KEY, createEmptyRainbowBookSlots()),
        );
        const localBookTris = normalizeBookTrisPlacements(loadJson(BOOK_TRIS_KEY, []));
        const localAlphabet = normalizeAlphabetChallengeEntries(
          loadJson(ALPHABET_CHALLENGE_KEY, {}),
        );
        const localSleep = normalizeSleepEntries(loadJson(SLEEP_ENTRIES_KEY, {}));
        const localCalendar = normalizeCalendarEvents(loadJson(CALENDAR_EVENTS_KEY, {}));
        const localGoals = normalizeGoalsByMonth(loadJson(GOALS_BY_MONTH_KEY, {}));
        const localDayReview = normalizeDayReviewEntries(loadJson(DAY_REVIEW_ENTRIES_KEY, {}));
        const localMovies = normalizeMoviesData(loadJson(MOVIES_KEY, createDefaultMoviesData()));
        const localShows = normalizeShowsData(loadJson(SHOWS_KEY, createDefaultShowsData()));
        const localDream = loadDreamText();
        const localSettings = normalizeAppSettings(loadJson(SETTINGS_KEY, defaultAppSettings()));
        const localPageBackgrounds = normalizePageBackgrounds(
          loadJson(PAGE_BACKGROUNDS_KEY, {}),
        );
        const localPageTextColors = normalizePageTextColors(
          loadJson(PAGE_TEXT_COLORS_KEY, {}),
        );

        await syncLocalEntriesToCloud(
          userId!,
          localMood,
          localAnxiety,
          localStress,
          localCrying,
          localFitness,
          localReading,
          localTbrList,
          localBookshelf,
          localBookTracker,
          localRainbowBooks,
          localBookTris,
          localAlphabet,
          localSleep,
          localCalendar,
          localGoals,
          localDayReview,
          localMovies,
          localShows,
          localDream,
          localPageBackgrounds,
          localPageTextColors,
        );

        const cloud = await fetchCloudData(userId!);
        if (cancelled) return;

        setMoodEntries(mergeEntries(localMood, cloud.moodEntries));
        setAnxietyEntries(mergeEntries(localAnxiety, cloud.anxietyEntries));
        setStressEntries(mergeEntries(localStress, cloud.stressEntries));
        setCryingEntries(mergeEntries(localCrying, cloud.cryingEntries));
        setFitnessEntries(mergeEntries(localFitness, cloud.fitnessEntries));
        setReadingEntries(mergeEntries(localReading, cloud.readingEntries));
        setTbrList(mergeTbrLists(localTbrList, cloud.tbrList));
        setTbrBookshelfColors(
          mergeTbrBookshelfColors(localBookshelf, cloud.tbrBookshelfColors),
        );
        setBookTrackerSlots(
          mergeBookTrackerSlots(localBookTracker, cloud.bookTrackerSlots),
        );
        setRainbowBookSlots(
          mergeRainbowBookSlots(localRainbowBooks, cloud.rainbowBookSlots),
        );
        setBookTrisPlacements(
          mergeBookTrisPlacements(localBookTris, cloud.bookTrisPlacements),
        );
        setAlphabetChallengeEntries(
          mergeAlphabetChallengeEntries(localAlphabet, cloud.alphabetChallengeEntries),
        );
        setSleepEntries(mergeSleepEntries(localSleep, cloud.sleepEntries));
        setCalendarEvents(mergeCalendarEvents(localCalendar, cloud.calendarEvents));
        setGoalsByMonth(mergeGoalsByMonth(localGoals, cloud.goalsByMonth));
        setDayReviewEntries(mergeDayReviewEntries(localDayReview, cloud.dayReviewEntries));
        setMoviesData(mergeMoviesData(localMovies, cloud.moviesData));
        setShowsData(mergeShowsData(localShows, cloud.showsData));
        setDreamTextState(mergeDreamText(localDream, cloud.dreamText));

        if (cloud.settings) {
          skipSettingsSync.current = true;
          setSettings(normalizeAppSettings(cloud.settings));
        } else {
          await upsertUserSettings(userId!, localSettings);
        }

        skipPageBackgroundsSync.current = true;
        setPageBackgrounds(
          mergePageBackgrounds(localPageBackgrounds, cloud.pageBackgrounds ?? {}),
        );
        if (Object.keys(cloud.pageBackgrounds ?? {}).length === 0 && Object.keys(localPageBackgrounds).length > 0) {
          await upsertPageBackgrounds(userId!, localPageBackgrounds);
        }

        skipPageTextColorsSync.current = true;
        setPageTextColors(
          mergePageTextColors(localPageTextColors, cloud.pageTextColors ?? {}),
        );
        if (Object.keys(cloud.pageTextColors ?? {}).length === 0 && Object.keys(localPageTextColors).length > 0) {
          await upsertPageTextColors(userId!, localPageTextColors);
        }

        setCloudReady(true);
      } catch (err) {
        if (!cancelled) {
          setSyncError(
            err instanceof Error ? err.message : "Failed to sync with cloud.",
          );
          setCloudReady(true);
        }
      } finally {
        if (!cancelled) setSyncing(false);
      }
    }

    loadCloudData();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !cloudReady || skipSettingsSync.current) {
      skipSettingsSync.current = false;
      return;
    }

    upsertUserSettings(userId, settings).catch((err) => {
      setSyncError(
        err instanceof Error ? err.message : "Failed to save settings.",
      );
    });
  }, [userId, settings, cloudReady]);

  useEffect(() => {
    if (!userId || !cloudReady || skipPageBackgroundsSync.current) {
      skipPageBackgroundsSync.current = false;
      return;
    }

    upsertPageBackgrounds(userId, pageBackgrounds).catch((err) => {
      setSyncError(
        err instanceof Error ? err.message : "Failed to save page backgrounds.",
      );
    });
  }, [userId, pageBackgrounds, cloudReady]);

  useEffect(() => {
    if (!userId || !cloudReady || skipPageTextColorsSync.current) {
      skipPageTextColorsSync.current = false;
      return;
    }

    upsertPageTextColors(userId, pageTextColors).catch((err) => {
      setSyncError(
        err instanceof Error ? err.message : "Failed to save page text colours.",
      );
    });
  }, [userId, pageTextColors, cloudReady]);

  const setRating = useCallback(
    (dateKey: string, rating: Rating | null) => {
      setMoodEntries((prev) => {
        const next = { ...prev };
        if (rating === null) delete next[dateKey];
        else next[dateKey] = rating;
        return next;
      });
      if (userId && cloudReady) {
        upsertMoodEntry(userId, dateKey, rating).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save mood.");
        });
      }
    },
    [userId, cloudReady],
  );

  const getRating = useCallback(
    (dateKey: string): Rating | undefined => moodEntries[dateKey],
    [moodEntries],
  );

  const setAnxietyLevel = useCallback(
    (dateKey: string, level: AnxietyLevel | null) => {
      setAnxietyEntries((prev) => {
        const next = { ...prev };
        if (level === null) delete next[dateKey];
        else next[dateKey] = level;
        return next;
      });
      if (userId && cloudReady) {
        upsertAnxietyEntry(userId, dateKey, level).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save anxiety.");
        });
      }
    },
    [userId, cloudReady],
  );

  const getAnxietyLevel = useCallback(
    (dateKey: string): AnxietyLevel | undefined => anxietyEntries[dateKey],
    [anxietyEntries],
  );

  const setStressLevel = useCallback(
    (dateKey: string, level: StressLevel | null) => {
      setStressEntries((prev) => {
        const next = { ...prev };
        if (level === null) delete next[dateKey];
        else next[dateKey] = level;
        return next;
      });
      if (userId && cloudReady) {
        upsertStressEntry(userId, dateKey, level).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save stress.");
        });
      }
    },
    [userId, cloudReady],
  );

  const getStressLevel = useCallback(
    (dateKey: string): StressLevel | undefined => stressEntries[dateKey],
    [stressEntries],
  );

  const setCryingLevel = useCallback(
    (dateKey: string, level: CryingLevel | null) => {
      setCryingEntries((prev) => {
        const next = { ...prev };
        if (level === null) delete next[dateKey];
        else next[dateKey] = level;
        return next;
      });
      if (userId && cloudReady) {
        upsertCryingEntry(userId, dateKey, level).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save crying log.");
        });
      }
    },
    [userId, cloudReady],
  );

  const getCryingLevel = useCallback(
    (dateKey: string): CryingLevel | undefined => cryingEntries[dateKey],
    [cryingEntries],
  );

  const setFitnessActivity = useCallback(
    (dateKey: string, activity: FitnessActivity | null) => {
      setFitnessEntries((prev) => {
        const next = { ...prev };
        if (activity === null) delete next[dateKey];
        else next[dateKey] = activity;
        return next;
      });
      if (userId && cloudReady) {
        upsertFitnessEntry(userId, dateKey, activity).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save fitness.");
        });
      }
    },
    [userId, cloudReady],
  );

  const getFitnessActivity = useCallback(
    (dateKey: string): FitnessActivity | undefined => fitnessEntries[dateKey],
    [fitnessEntries],
  );

  const setReadingTier = useCallback(
    (dateKey: string, tier: ReadingTier | null) => {
      setReadingEntries((prev) => {
        const next = { ...prev };
        if (tier === null) delete next[dateKey];
        else next[dateKey] = tier;
        return next;
      });
      if (userId && cloudReady) {
        upsertReadingEntry(userId, dateKey, tier).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save reading.");
        });
      }
    },
    [userId, cloudReady],
  );

  const getReadingTier = useCallback(
    (dateKey: string): ReadingTier | undefined => readingEntries[dateKey],
    [readingEntries],
  );

  const syncSleepEntry = useCallback(
    (dateKey: string, entry: SleepDayEntry | null) => {
      if (userId && cloudReady) {
        upsertSleepEntry(userId, dateKey, entry).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save sleep.");
        });
      }
    },
    [userId, cloudReady],
  );

  const setSleepHour = useCallback(
    (dateKey: string, hourIndex: number, asleep: boolean, colorId?: SleepColorId) => {
      setSleepEntries((prev) => {
        const existing = getSleepEntry(prev, dateKey);
        const hoursSet = new Set(existing.hours);
        if (asleep) hoursSet.add(hourIndex);
        else hoursSet.delete(hourIndex);
        const hours = [...hoursSet].sort((a, b) => a - b);
        const next = { ...prev };
        const updated: SleepDayEntry = {
          ...existing,
          hours,
          colorId: asleep && colorId ? colorId : existing.colorId,
        };
        if (hours.length === 0 && !updated.quality) {
          delete next[dateKey];
          syncSleepEntry(dateKey, null);
        } else {
          next[dateKey] = updated;
          syncSleepEntry(dateKey, updated);
        }
        return next;
      });
    },
    [syncSleepEntry],
  );

  const setSleepDayColor = useCallback(
    (dateKey: string, colorId: SleepColorId) => {
      setSleepEntries((prev) => {
        const existing = getSleepEntry(prev, dateKey);
        if (existing.hours.length === 0) return prev;
        const next = { ...prev };
        const updated: SleepDayEntry = { ...existing, colorId };
        next[dateKey] = updated;
        syncSleepEntry(dateKey, updated);
        return next;
      });
    },
    [syncSleepEntry],
  );

  const setSleepQuality = useCallback(
    (dateKey: string, quality: SleepQuality | null) => {
      setSleepEntries((prev) => {
        const existing = getSleepEntry(prev, dateKey);
        const next = { ...prev };
        const updated: SleepDayEntry = {
          ...existing,
          quality: quality ?? undefined,
        };
        if (updated.hours.length === 0 && !updated.quality) {
          delete next[dateKey];
          syncSleepEntry(dateKey, null);
        } else {
          next[dateKey] = updated;
          syncSleepEntry(dateKey, updated);
        }
        return next;
      });
    },
    [syncSleepEntry],
  );

  const getSleepEntryForDate = useCallback(
    (dateKey: string) => getSleepEntry(sleepEntries, dateKey),
    [sleepEntries],
  );

  const syncCalendarDay = useCallback(
    (dateKey: string, entry: CalendarDayEntry | null) => {
      if (userId && cloudReady) {
        upsertCalendarDay(userId, dateKey, entry).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save calendar.");
        });
      }
    },
    [userId, cloudReady],
  );

  const setCalendarEvent = useCallback(
    (dateKey: string, text: string) => {
      setCalendarEvents((prev) => {
        const next = { ...prev };
        const existing = getCalendarDayEntry(prev, dateKey);
        const trimmed = text.trim();
        if (!trimmed && !existing.colorId) {
          delete next[dateKey];
          syncCalendarDay(dateKey, null);
        } else {
          const updated: CalendarDayEntry = { ...existing, text };
          next[dateKey] = updated;
          syncCalendarDay(dateKey, updated);
        }
        return next;
      });
    },
    [syncCalendarDay],
  );

  const setCalendarDayColor = useCallback(
    (dateKey: string, colorId: CalendarColorId) => {
      setCalendarEvents((prev) => {
        const next = { ...prev };
        const existing = getCalendarDayEntry(prev, dateKey);
        const updated: CalendarDayEntry = { ...existing, colorId };
        next[dateKey] = updated;
        syncCalendarDay(dateKey, updated);
        return next;
      });
    },
    [syncCalendarDay],
  );

  const getCalendarDayEntryForDate = useCallback(
    (dateKey: string) => getCalendarDayEntry(calendarEvents, dateKey),
    [calendarEvents],
  );

  const syncTbrList = useCallback(
    (list: TbrList) => {
      if (userId && cloudReady) {
        upsertTbrList(userId, list).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save reading list.");
        });
      }
    },
    [userId, cloudReady],
  );

  const addTbrBook = useCallback(
    (title: string, colorId: TbrColorId) => {
      setTbrList((prev) => {
        const nextOrder =
          prev.length === 0 ? 0 : Math.max(...prev.map((b) => b.order)) + 1;
        const book: TbrBook = {
          id: crypto.randomUUID(),
          title,
          completed: false,
          order: nextOrder,
          colorId,
        };
        const next = [...prev, book];
        syncTbrList(next);
        return next;
      });
    },
    [syncTbrList],
  );

  const updateTbrBook = useCallback(
    (id: string, updates: TbrBookUpdate) => {
      setTbrList((prev) => {
        const next = prev.map((b) => (b.id === id ? { ...b, ...updates } : b));
        syncTbrList(next);
        return next;
      });
    },
    [syncTbrList],
  );

  const toggleTbrBookCompleted = useCallback(
    (id: string) => {
      setTbrList((prev) => {
        const next = prev.map((b) => {
          if (b.id !== id) return b;
          const completed = !b.completed;
          return {
            ...b,
            completed,
            completedAt: completed ? new Date().toISOString().slice(0, 10) : undefined,
          };
        });
        syncTbrList(next);
        return next;
      });
    },
    [syncTbrList],
  );

  const removeTbrBook = useCallback(
    (id: string) => {
      setTbrList((prev) => {
        const next = prev.filter((b) => b.id !== id);
        syncTbrList(next);
        return next;
      });
    },
    [syncTbrList],
  );

  const syncGoalsByMonth = useCallback(
    (byMonth: GoalsByMonth) => {
      if (userId && cloudReady) {
        upsertGoalsByMonth(userId, byMonth).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save goals.");
        });
      }
    },
    [userId, cloudReady],
  );

  const updateMonthGoals = useCallback(
    (monthKey: string, updater: (list: GoalsList) => GoalsList) => {
      setGoalsByMonth((prev) => {
        const current = normalizeGoalsList(prev[monthKey] ?? []);
        const nextList = updater(current);
        const next: GoalsByMonth = { ...prev };
        if (nextList.length === 0) {
          delete next[monthKey];
        } else {
          next[monthKey] = nextList;
        }
        syncGoalsByMonth(next);
        return next;
      });
    },
    [syncGoalsByMonth],
  );

  const addGoal = useCallback(
    (monthKey: string, title: string, colorId?: GoalColorId) => {
      updateMonthGoals(monthKey, (prev) => {
        const nextOrder =
          prev.length === 0 ? 0 : Math.max(...prev.map((g) => g.order)) + 1;
        const goal: Goal = {
          id: crypto.randomUUID(),
          title,
          completed: false,
          order: nextOrder,
          colorId,
        };
        return [...prev, goal];
      });
    },
    [updateMonthGoals],
  );

  const updateGoal = useCallback(
    (monthKey: string, id: string, updates: GoalUpdate) => {
      updateMonthGoals(monthKey, (prev) =>
        prev
          .map((g) => {
            if (g.id !== id) return g;
            const title = updates.title !== undefined ? updates.title : g.title;
            return { ...g, ...updates, title };
          })
          .filter((g) => g.title.trim()),
      );
    },
    [updateMonthGoals],
  );

  const toggleGoalCompleted = useCallback(
    (monthKey: string, id: string) => {
      updateMonthGoals(monthKey, (prev) =>
        prev.map((g) => {
          if (g.id !== id) return g;
          const completed = !g.completed;
          return {
            ...g,
            completed,
            completedAt: completed ? new Date().toISOString().slice(0, 10) : undefined,
          };
        }),
      );
    },
    [updateMonthGoals],
  );

  const removeGoal = useCallback(
    (monthKey: string, id: string) => {
      updateMonthGoals(monthKey, (prev) => prev.filter((g) => g.id !== id));
    },
    [updateMonthGoals],
  );

  const saveDayReview = useCallback(
    (dateKey: string, entry: DayReviewEntry | null) => {
      setDayReviewEntries((prev) => {
        const next = { ...prev };
        if (entry === null || isDayReviewEntryEmpty(entry)) {
          delete next[dateKey];
        } else {
          next[dateKey] = entry;
        }
        if (userId && cloudReady) {
          upsertDayReviewEntry(userId, dateKey, entry).catch((err) => {
            setSyncError(
              err instanceof Error ? err.message : "Failed to save day review.",
            );
          });
        }
        return next;
      });
    },
    [userId, cloudReady],
  );

  const getDayReviewForDate = useCallback(
    (dateKey: string) => getDayReviewEntry(dayReviewEntries, dateKey),
    [dayReviewEntries],
  );

  const syncMoviesData = useCallback(
    (data: MoviesData) => {
      if (userId && cloudReady) {
        upsertMoviesData(userId, data).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save movies.");
        });
      }
    },
    [userId, cloudReady],
  );

  const updateFinishedStrip = useCallback(
    (
      stripIndex: number,
      slotIndex: number,
      updater: (slot: MoviesData["finishedStrips"][0][0]) => MoviesData["finishedStrips"][0][0],
    ) => {
      setMoviesData((prev) => {
        const next: MoviesData = {
          ...prev,
          finishedStrips: prev.finishedStrips.map((strip, si) =>
            si === stripIndex
              ? strip.map((slot, slotI) => (slotI === slotIndex ? updater(slot) : slot))
              : strip,
          ),
        };
        syncMoviesData(next);
        return next;
      });
    },
    [syncMoviesData],
  );

  const setFinishedMovieImage = useCallback(
    (stripIndex: number, slotIndex: number, imageDataUrl: string | null) => {
      updateFinishedStrip(stripIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (imageDataUrl == null) delete next.imageDataUrl;
        else next.imageDataUrl = imageDataUrl;
        return next;
      });
    },
    [updateFinishedStrip],
  );

  const setFinishedMovieTitle = useCallback(
    (stripIndex: number, slotIndex: number, title: string) => {
      updateFinishedStrip(stripIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (title.trim()) next.title = title;
        else delete next.title;
        return next;
      });
    },
    [updateFinishedStrip],
  );

  const setFinishedMovieRating = useCallback(
    (stripIndex: number, slotIndex: number, rating: Rating | null) => {
      updateFinishedStrip(stripIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (rating == null) delete next.rating;
        else next.rating = rating;
        return next;
      });
    },
    [updateFinishedStrip],
  );

  const addFinishedMovieStrip = useCallback(() => {
    setMoviesData((prev) => {
      const next: MoviesData = {
        ...prev,
        finishedStrips: [...prev.finishedStrips, createEmptyFinishedStrip()],
      };
      syncMoviesData(next);
      return next;
    });
  }, [syncMoviesData]);

  const removeFinishedMovieStrip = useCallback(
    (stripIndex: number) => {
      setMoviesData((prev) => {
        if (prev.finishedStrips.length <= 1) return prev;
        const next: MoviesData = {
          ...prev,
          finishedStrips: prev.finishedStrips.filter((_, i) => i !== stripIndex),
        };
        syncMoviesData(next);
        return next;
      });
    },
    [syncMoviesData],
  );

  const updateUpcomingStrip = useCallback(
    (
      stripIndex: number,
      slotIndex: number,
      updater: (slot: MoviesData["upcomingStrips"][0][0]) => MoviesData["upcomingStrips"][0][0],
    ) => {
      setMoviesData((prev) => {
        const next: MoviesData = {
          ...prev,
          upcomingStrips: prev.upcomingStrips.map((strip, si) =>
            si === stripIndex
              ? strip.map((slot, slotI) => (slotI === slotIndex ? updater(slot) : slot))
              : strip,
          ),
        };
        syncMoviesData(next);
        return next;
      });
    },
    [syncMoviesData],
  );

  const setUpcomingMovieImage = useCallback(
    (stripIndex: number, slotIndex: number, imageDataUrl: string | null) => {
      updateUpcomingStrip(stripIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (imageDataUrl == null) delete next.imageDataUrl;
        else next.imageDataUrl = imageDataUrl;
        return next;
      });
    },
    [updateUpcomingStrip],
  );

  const setUpcomingMovieTitle = useCallback(
    (stripIndex: number, slotIndex: number, title: string) => {
      updateUpcomingStrip(stripIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (title.trim()) next.title = title;
        else delete next.title;
        return next;
      });
    },
    [updateUpcomingStrip],
  );

  const setUpcomingMovieWatchDate = useCallback(
    (stripIndex: number, slotIndex: number, watchDate: string) => {
      updateUpcomingStrip(stripIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (watchDate.trim()) next.watchDate = watchDate;
        else delete next.watchDate;
        return next;
      });
    },
    [updateUpcomingStrip],
  );

  const addUpcomingMovieStrip = useCallback(() => {
    setMoviesData((prev) => {
      const next: MoviesData = {
        ...prev,
        upcomingStrips: [...prev.upcomingStrips, createEmptyUpcomingStrip()],
      };
      syncMoviesData(next);
      return next;
    });
  }, [syncMoviesData]);

  const syncShowsData = useCallback(
    (data: ShowsData) => {
      if (userId && cloudReady) {
        upsertShowsData(userId, data).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save shows.");
        });
      }
    },
    [userId, cloudReady],
  );

  const updateFinishedShowRow = useCallback(
    (
      rowIndex: number,
      slotIndex: number,
      updater: (slot: ShowsData["finishedRows"][0][0]) => ShowsData["finishedRows"][0][0],
    ) => {
      setShowsData((prev) => {
        const next: ShowsData = {
          ...prev,
          finishedRows: prev.finishedRows.map((row, ri) =>
            ri === rowIndex
              ? row.map((slot, slotI) => (slotI === slotIndex ? updater(slot) : slot))
              : row,
          ),
        };
        syncShowsData(next);
        return next;
      });
    },
    [syncShowsData],
  );

  const setFinishedShowImage = useCallback(
    (rowIndex: number, slotIndex: number, imageDataUrl: string | null) => {
      updateFinishedShowRow(rowIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (imageDataUrl == null) delete next.imageDataUrl;
        else next.imageDataUrl = imageDataUrl;
        return next;
      });
    },
    [updateFinishedShowRow],
  );

  const setFinishedShowTitle = useCallback(
    (rowIndex: number, slotIndex: number, title: string) => {
      updateFinishedShowRow(rowIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (title.trim()) next.title = title;
        else delete next.title;
        return next;
      });
    },
    [updateFinishedShowRow],
  );

  const setFinishedShowRating = useCallback(
    (rowIndex: number, slotIndex: number, rating: Rating | null) => {
      updateFinishedShowRow(rowIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (rating == null) delete next.rating;
        else next.rating = rating;
        return next;
      });
    },
    [updateFinishedShowRow],
  );

  const setFinishedShowColor = useCallback(
    (rowIndex: number, slotIndex: number, colorId: ShowTvColorId) => {
      updateFinishedShowRow(rowIndex, slotIndex, (slot) => ({ ...slot, colorId }));
    },
    [updateFinishedShowRow],
  );

  const addFinishedShowRow = useCallback(() => {
    setShowsData((prev) => {
      const next: ShowsData = {
        ...prev,
        finishedRows: [...prev.finishedRows, createEmptyFinishedShowRow()],
      };
      syncShowsData(next);
      return next;
    });
  }, [syncShowsData]);

  const removeFinishedShowRow = useCallback(
    (rowIndex: number) => {
      setShowsData((prev) => {
        if (prev.finishedRows.length <= 1) return prev;
        const next: ShowsData = {
          ...prev,
          finishedRows: prev.finishedRows.filter((_, i) => i !== rowIndex),
        };
        syncShowsData(next);
        return next;
      });
    },
    [syncShowsData],
  );

  const updateUpcomingShowRow = useCallback(
    (
      rowIndex: number,
      slotIndex: number,
      updater: (slot: ShowsData["upcomingRows"][0][0]) => ShowsData["upcomingRows"][0][0],
    ) => {
      setShowsData((prev) => {
        const next: ShowsData = {
          ...prev,
          upcomingRows: prev.upcomingRows.map((row, ri) =>
            ri === rowIndex
              ? row.map((slot, slotI) => (slotI === slotIndex ? updater(slot) : slot))
              : row,
          ),
        };
        syncShowsData(next);
        return next;
      });
    },
    [syncShowsData],
  );

  const setUpcomingShowImage = useCallback(
    (rowIndex: number, slotIndex: number, imageDataUrl: string | null) => {
      updateUpcomingShowRow(rowIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (imageDataUrl == null) delete next.imageDataUrl;
        else next.imageDataUrl = imageDataUrl;
        return next;
      });
    },
    [updateUpcomingShowRow],
  );

  const setUpcomingShowTitle = useCallback(
    (rowIndex: number, slotIndex: number, title: string) => {
      updateUpcomingShowRow(rowIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (title.trim()) next.title = title;
        else delete next.title;
        return next;
      });
    },
    [updateUpcomingShowRow],
  );

  const setUpcomingShowAirDate = useCallback(
    (rowIndex: number, slotIndex: number, airDate: string) => {
      updateUpcomingShowRow(rowIndex, slotIndex, (slot) => {
        const next = { ...slot };
        if (airDate.trim()) next.airDate = airDate;
        else delete next.airDate;
        return next;
      });
    },
    [updateUpcomingShowRow],
  );

  const setUpcomingShowColor = useCallback(
    (rowIndex: number, slotIndex: number, colorId: ShowTvColorId) => {
      updateUpcomingShowRow(rowIndex, slotIndex, (slot) => ({ ...slot, colorId }));
    },
    [updateUpcomingShowRow],
  );

  const addUpcomingShowRow = useCallback(() => {
    setShowsData((prev) => {
      const next: ShowsData = {
        ...prev,
        upcomingRows: [...prev.upcomingRows, createEmptyUpcomingShowRow()],
      };
      syncShowsData(next);
      return next;
    });
  }, [syncShowsData]);

  const setDreamText = useCallback(
    (text: string) => {
      setDreamTextState(text);
      if (userId && cloudReady) {
        upsertDreamText(userId, text).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save dream.");
        });
      }
    },
    [userId, cloudReady],
  );

  const syncBookshelfColors = useCallback(
    (colors: TbrBookshelfColors) => {
      if (userId && cloudReady) {
        upsertTbrBookshelfColors(userId, colors).catch((err) => {
          setSyncError(
            err instanceof Error ? err.message : "Failed to save bookshelf colours.",
          );
        });
      }
    },
    [userId, cloudReady],
  );

  const setTbrBookshelfPartColor = useCallback(
    (partId: TbrBookshelfPartId, colorId: TbrColorId | null) => {
      setTbrBookshelfColors((prev) => {
        const next = { ...prev };
        if (colorId === null) delete next[partId];
        else next[partId] = colorId;
        syncBookshelfColors(next);
        return next;
      });
    },
    [syncBookshelfColors],
  );

  const syncBookTracker = useCallback(
    (slots: BookTrackerSlots) => {
      if (userId && cloudReady) {
        upsertBookTrackerSlots(userId, slots).catch((err) => {
          setSyncError(
            err instanceof Error ? err.message : "Failed to save book tracker.",
          );
        });
      }
    },
    [userId, cloudReady],
  );

  const updateBookTrackerSlot = useCallback(
    (index: number, patch: { imageDataUrl?: string | null; rating?: Rating | null }) => {
      setBookTrackerSlots((prev) => {
        const next = prev.map((slot, i) => {
          if (i !== index) return slot;
          const updated = { ...slot };
          if ("imageDataUrl" in patch) {
            if (patch.imageDataUrl == null) delete updated.imageDataUrl;
            else updated.imageDataUrl = patch.imageDataUrl;
          }
          if ("rating" in patch) {
            if (patch.rating == null) delete updated.rating;
            else updated.rating = patch.rating;
          }
          return updated;
        });
        syncBookTracker(next);
        return next;
      });
    },
    [syncBookTracker],
  );

  const setBookTrackerImage = useCallback(
    (index: number, imageDataUrl: string | null) => {
      updateBookTrackerSlot(index, { imageDataUrl });
    },
    [updateBookTrackerSlot],
  );

  const setBookTrackerRating = useCallback(
    (index: number, rating: Rating | null) => {
      updateBookTrackerSlot(index, { rating });
    },
    [updateBookTrackerSlot],
  );

  const syncRainbowBooks = useCallback(
    (slots: RainbowBookSlots) => {
      if (userId && cloudReady) {
        upsertRainbowBookSlots(userId, slots).catch((err) => {
          setSyncError(
            err instanceof Error ? err.message : "Failed to save Read the Rainbow.",
          );
        });
      }
    },
    [userId, cloudReady],
  );

  const setRainbowBookImage = useCallback(
    (index: number, imageDataUrl: string | null) => {
      setRainbowBookSlots((prev) => {
        const next = prev.map((slot, i) => {
          if (i !== index) return slot;
          if (imageDataUrl == null) return {};
          return { imageDataUrl };
        });
        syncRainbowBooks(next);
        return next;
      });
    },
    [syncRainbowBooks],
  );

  const syncBookTris = useCallback(
    (placements: BookTrisPlacements) => {
      if (userId && cloudReady) {
        upsertBookTrisPlacements(userId, placements).catch((err) => {
          setSyncError(err instanceof Error ? err.message : "Failed to save Book-tris.");
        });
      }
    },
    [userId, cloudReady],
  );

  const placeBookTrisPiece = useCallback(
    (pieceId: BookTrisPieceId, row: number, col: number, rotation: number) => {
      setBookTrisPlacements((prev) => {
        if (!canPlacePiece(pieceId, row, col, prev, rotation)) return prev;
        const next = [
          ...prev,
          { id: crypto.randomUUID(), pieceId, row, col, rotation: rotation % 4 },
        ];
        syncBookTris(next);
        return next;
      });
    },
    [syncBookTris],
  );

  const removeBookTrisPiece = useCallback(
    (placementId: string) => {
      setBookTrisPlacements((prev) => {
        const next = prev.filter((p) => p.id !== placementId);
        syncBookTris(next);
        return next;
      });
    },
    [syncBookTris],
  );

  const syncAlphabetChallenge = useCallback(
    (entries: AlphabetChallengeEntries) => {
      if (userId && cloudReady) {
        upsertAlphabetChallengeEntries(userId, entries).catch((err) => {
          setSyncError(
            err instanceof Error ? err.message : "Failed to save Alphabet Challenge.",
          );
        });
      }
    },
    [userId, cloudReady],
  );

  const setAlphabetBookTitle = useCallback(
    (letter: AlphabetLetter, title: string) => {
      setAlphabetChallengeEntries((prev) => {
        const next = { ...prev };
        const existing = next[letter] ?? { title: "" };
        const trimmed = title.trim();
        if (!trimmed && !existing.colorId && !existing.completed) {
          delete next[letter];
        } else {
          next[letter] = { ...existing, title };
        }
        syncAlphabetChallenge(next);
        return next;
      });
    },
    [syncAlphabetChallenge],
  );

  const setAlphabetLetterColor = useCallback(
    (letter: AlphabetLetter, colorId: AlphabetColorId) => {
      setAlphabetChallengeEntries((prev) => {
        const next = { ...prev };
        const existing = next[letter] ?? { title: "" };
        next[letter] = { ...existing, colorId };
        syncAlphabetChallenge(next);
        return next;
      });
    },
    [syncAlphabetChallenge],
  );

  const toggleAlphabetLetterCompleted = useCallback(
    (letter: AlphabetLetter) => {
      setAlphabetChallengeEntries((prev) => {
        const next = { ...prev };
        const existing = next[letter] ?? { title: "" };
        next[letter] = { ...existing, completed: !existing.completed };
        syncAlphabetChallenge(next);
        return next;
      });
    },
    [syncAlphabetChallenge],
  );

  const clearAlphabetChallenge = useCallback(() => {
    setAlphabetChallengeEntries({});
    syncAlphabetChallenge({});
  }, [syncAlphabetChallenge]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const setPageBackground = useCallback((pageId: PageBackgroundId, dataUrl: string) => {
    setPageBackgrounds((prev) => ({ ...prev, [pageId]: dataUrl }));
  }, []);

  const clearPageBackground = useCallback((pageId: PageBackgroundId) => {
    setPageBackgrounds((prev) => {
      const next = { ...prev };
      delete next[pageId];
      return next;
    });
  }, []);

  const setPageTextColor = useCallback((pageId: PageBackgroundId, colorId: NavThemeColorId) => {
    setPageTextColors((prev) => ({ ...prev, [pageId]: colorId }));
  }, []);

  const clearPageTextColor = useCallback((pageId: PageBackgroundId) => {
    setPageTextColors((prev) => {
      const next = { ...prev };
      delete next[pageId];
      return next;
    });
  }, []);

  return {
    settings,
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
    setRating,
    getRating,
    setAnxietyLevel,
    getAnxietyLevel,
    setStressLevel,
    getStressLevel,
    setCryingLevel,
    getCryingLevel,
    setFitnessActivity,
    getFitnessActivity,
    setReadingTier,
    getReadingTier,
    getSleepEntryForDate,
    setSleepHour,
    setSleepDayColor,
    setSleepQuality,
    getCalendarDayEntryForDate,
    setCalendarEvent,
    setCalendarDayColor,
    addGoal,
    updateGoal,
    toggleGoalCompleted,
    removeGoal,
    getDayReviewForDate,
    saveDayReview,
    setFinishedMovieImage,
    setFinishedMovieTitle,
    setFinishedMovieRating,
    addFinishedMovieStrip,
    removeFinishedMovieStrip,
    setUpcomingMovieImage,
    setUpcomingMovieTitle,
    setUpcomingMovieWatchDate,
    addUpcomingMovieStrip,
    setFinishedShowImage,
    setFinishedShowTitle,
    setFinishedShowRating,
    setFinishedShowColor,
    addFinishedShowRow,
    removeFinishedShowRow,
    setUpcomingShowImage,
    setUpcomingShowTitle,
    setUpcomingShowAirDate,
    setUpcomingShowColor,
    addUpcomingShowRow,
    setDreamText,
    addTbrBook,
    updateTbrBook,
    toggleTbrBookCompleted,
    removeTbrBook,
    setTbrBookshelfPartColor,
    setBookTrackerImage,
    setBookTrackerRating,
    setRainbowBookImage,
    placeBookTrisPiece,
    removeBookTrisPiece,
    setAlphabetBookTitle,
    setAlphabetLetterColor,
    toggleAlphabetLetterCompleted,
    clearAlphabetChallenge,
    updateSettings,
    pageBackgrounds,
    setPageBackground,
    clearPageBackground,
    pageTextColors,
    setPageTextColor,
    clearPageTextColor,
    syncing,
    syncError,
    isSignedIn: Boolean(userId),
    cloudReady,
  };
}