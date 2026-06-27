import rateMyDayBg from "../assets/rate-my-day-meadow.png";
import reviewDayBg from "../assets/review-your-day-ocean.png";
import anxietyBg from "../assets/anxiety-tracker-beach.png";
import stressBg from "../assets/stress-tracker-night.png";
import cryingBg from "../assets/crying-tracker-forest.png";
import fitnessBg from "../assets/fitness-tracker-mountains.png";
import readingBg from "../assets/reading-tracker-milky-way.png";
import moviesBg from "../assets/movies-page-waterfall.png";
import showsBg from "../assets/shows-page-snow-forest.png";
import sleepBg from "../assets/sleep-tracker-dreamy-sky.png";
import calendarBg from "../assets/calendar-page-cottage.png";
import goalsBg from "../assets/goals-page-aurora.png";
import dreamsBg from "../assets/dreams-desert-sunset.png";
import dreamReminderPopupBg from "../assets/dream-reminder-popup.png";
import tbrBg from "../assets/tbr-page-firefly-valley.png";
import bookTrackerBg from "../assets/book-tracker-wildflower-hill.png";
import rainbowBg from "../assets/rainbow-page-coral-reef.png";
import bookTrisBg from "../assets/booktris-page-sunrise-mountains.png";
import alphabetBg from "../assets/alphabet-challenge-forest-stream.png";

export const PAGE_BACKGROUND_IDS = [
  "dreams",
  "dream-reminder",
  "rate-my-day",
  "review",
  "anxiety",
  "stress",
  "crying",
  "fitness",
  "reading",
  "movies",
  "shows",
  "sleep",
  "calendar",
  "goals",
  "tbr",
  "books",
  "rainbow",
  "booktris",
  "alphabet",
  "trends",
  "account",
  "settings",
] as const;

export type PageBackgroundId = (typeof PAGE_BACKGROUND_IDS)[number];

export type PageBackgrounds = Partial<Record<PageBackgroundId, string>>;

export const PAGE_BACKGROUND_LABELS: Record<PageBackgroundId, string> = {
  dreams: "Dreams",
  "dream-reminder": "Dream reminder popup",
  "rate-my-day": "Rate My Day",
  review: "Review your day",
  anxiety: "Anxiety Tracker",
  stress: "Stress Tracker",
  crying: "Crying Tracker",
  fitness: "Fitness Tracker",
  reading: "Reading Tracker",
  movies: "Movies",
  shows: "Shows",
  sleep: "Sleep Tracker",
  calendar: "Calendar",
  goals: "Goals",
  tbr: "To Be Read",
  books: "Book Tracker",
  rainbow: "Read the Rainbow",
  booktris: "Book-tris",
  alphabet: "Alphabet Challenge",
  trends: "Wellness Trends",
  account: "Account",
  settings: "Settings",
};

export const PAGE_DEFAULT_BACKGROUNDS: Record<PageBackgroundId, string> = {
  dreams: dreamsBg,
  "dream-reminder": dreamReminderPopupBg,
  "rate-my-day": rateMyDayBg,
  review: reviewDayBg,
  anxiety: anxietyBg,
  stress: stressBg,
  crying: cryingBg,
  fitness: fitnessBg,
  reading: readingBg,
  movies: moviesBg,
  shows: showsBg,
  sleep: sleepBg,
  calendar: calendarBg,
  goals: goalsBg,
  tbr: tbrBg,
  books: bookTrackerBg,
  rainbow: rainbowBg,
  booktris: bookTrisBg,
  alphabet: alphabetBg,
  trends: goalsBg,
  account: rateMyDayBg,
  settings: rateMyDayBg,
};

function isDataImageUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image/");
}

export function normalizePageBackgrounds(raw: unknown): PageBackgrounds {
  if (!raw || typeof raw !== "object") return {};

  const result: PageBackgrounds = {};
  for (const id of PAGE_BACKGROUND_IDS) {
    const value = (raw as Record<string, unknown>)[id];
    if (isDataImageUrl(value)) result[id] = value;
  }
  return result;
}

export function mergePageBackgrounds(
  local: PageBackgrounds,
  cloud: PageBackgrounds,
): PageBackgrounds {
  return normalizePageBackgrounds({ ...cloud, ...local });
}

export function getPageBackgroundUrl(
  pageId: PageBackgroundId,
  pageBackgrounds: PageBackgrounds,
): string {
  return pageBackgrounds[pageId] ?? PAGE_DEFAULT_BACKGROUNDS[pageId];
}

export function getPageBackgroundStyle(
  pageId: PageBackgroundId,
  pageBackgrounds: PageBackgrounds,
): { backgroundImage: string } {
  return { backgroundImage: `url("${getPageBackgroundUrl(pageId, pageBackgrounds)}")` };
}
