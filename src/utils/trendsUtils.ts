import type { AnxietyLevel } from "../constants/anxiety";
import { CRYING_SCALE, type CryingLevel } from "../constants/crying";
import { STRESS_SCALE, type StressLevel } from "../constants/stress";
import {
  fitnessIntensity,
  FITNESS_SCALE,
  type FitnessActivity,
} from "../constants/fitness";
import type { Rating } from "../constants/ratings";
import {
  readingIntensity,
  readingPagesEstimate,
  READING_SCALE,
  type ReadingTier,
} from "../constants/reading";
import type {
  AnxietyEntries,
  CryingEntries,
  FitnessEntries,
  MoodEntries,
  ReadingEntries,
  StressEntries,
} from "../store/useMoodStore";
import type { SleepEntries, SleepQuality } from "../types/sleep";
import { getSleepEntry, sleepDurationHours } from "../constants/sleep";

export type TrendsRange = "7d" | "30d" | "90d";

export interface TrendsDataPoint {
  dateKey: string;
  label: string;
  mood?: Rating;
  anxiety?: AnxietyLevel;
  stress?: StressLevel;
  crying?: CryingLevel;
  fitness?: number;
  fitnessActivity?: FitnessActivity;
  reading?: number;
  readingTier?: ReadingTier;
  sleep?: number;
  sleepQuality?: SleepQuality;
  sleepHours?: number;
}

export interface TrendsSummary {
  avgMood: number | null;
  avgAnxiety: number | null;
  avgStress: number | null;
  avgCrying: number | null;
  avgFitness: number | null;
  avgReadingPages: number | null;
  moodDays: number;
  anxietyDays: number;
  stressDays: number;
  cryingDays: number;
  fitnessDays: number;
  readingDays: number;
  avgSleepQuality: number | null;
  avgSleepHours: number | null;
  sleepDays: number;
  topActivity: string | null;
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function rangeDays(range: TrendsRange): number {
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  return 90;
}

export function buildTrendsSeries(
  moodEntries: MoodEntries,
  anxietyEntries: AnxietyEntries,
  stressEntries: StressEntries,
  cryingEntries: CryingEntries,
  fitnessEntries: FitnessEntries,
  readingEntries: ReadingEntries,
  sleepEntries: SleepEntries,
  range: TrendsRange,
): TrendsDataPoint[] {
  const days = rangeDays(range);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const points: TrendsDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = toDateKey(date);

    const label =
      range === "7d"
        ? date.toLocaleDateString(undefined, { weekday: "short" })
        : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    const activity = fitnessEntries[dateKey];
    const readingTier = readingEntries[dateKey];
    const sleepEntry = getSleepEntry(sleepEntries, dateKey);
    const sleepHours = sleepDurationHours(sleepEntry);
    const hasSleepHours = sleepHours > 0;

    points.push({
      dateKey,
      label,
      mood: moodEntries[dateKey],
      anxiety: anxietyEntries[dateKey],
      stress: stressEntries[dateKey],
      crying: cryingEntries[dateKey],
      fitness: activity != null ? fitnessIntensity(activity) : undefined,
      fitnessActivity: activity,
      reading: readingTier != null ? readingIntensity(readingTier) : undefined,
      readingTier,
      sleep: sleepEntry.quality,
      sleepQuality: sleepEntry.quality,
      sleepHours: hasSleepHours ? sleepHours : undefined,
    });
  }

  return points;
}

export function summarizeTrends(points: TrendsDataPoint[]): TrendsSummary {
  const moodValues = points.map((p) => p.mood).filter((v): v is Rating => v != null);
  const anxietyValues = points
    .map((p) => p.anxiety)
    .filter((v): v is AnxietyLevel => v != null);
  const stressValues = points
    .map((p) => p.stress)
    .filter((v): v is StressLevel => v != null);
  const cryingValues = points
    .map((p) => p.crying)
    .filter((v): v is CryingLevel => v != null);
  const fitnessValues = points
    .map((p) => p.fitness)
    .filter((v): v is number => v != null);
  const readingPageEstimates = points
    .map((p) =>
      p.readingTier != null ? readingPagesEstimate(p.readingTier) : null,
    )
    .filter((v): v is number => v != null);
  const sleepQualityValues = points
    .map((p) => p.sleepQuality)
    .filter((v): v is SleepQuality => v != null);
  const sleepHourValues = points
    .map((p) => p.sleepHours)
    .filter((v): v is number => v != null);

  const avg = (values: number[]) =>
    values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

  const activityCounts = new Map<string, number>();
  points.forEach((p) => {
    if (p.fitnessActivity != null) {
      const name = FITNESS_SCALE.labels[p.fitnessActivity];
      activityCounts.set(name, (activityCounts.get(name) ?? 0) + 1);
    }
  });

  let topActivity: string | null = null;
  let topCount = 0;
  activityCounts.forEach((count, name) => {
    if (count > topCount) {
      topCount = count;
      topActivity = name;
    }
  });

  return {
    avgMood: avg(moodValues),
    avgAnxiety: avg(anxietyValues),
    avgStress: avg(stressValues),
    avgCrying: avg(cryingValues),
    avgFitness: avg(fitnessValues),
    avgReadingPages: avg(readingPageEstimates),
    moodDays: moodValues.length,
    anxietyDays: anxietyValues.length,
    stressDays: stressValues.length,
    cryingDays: cryingValues.length,
    fitnessDays: fitnessValues.length,
    readingDays: readingPageEstimates.length,
    avgSleepQuality: avg(sleepQualityValues),
    avgSleepHours: avg(sleepHourValues),
    sleepDays: points.filter(
      (p) => p.sleepQuality != null || p.sleepHours != null,
    ).length,
    topActivity,
  };
}

export function moodStars(value: number | null): string {
  if (value == null) return "No data yet";
  return `${value.toFixed(1)} / 5 stars`;
}

export function anxietyLabel(value: number | null): string {
  if (value == null) return "No data yet";
  const labels = ["", "None", "Low", "Medium", "High", "Severe"];
  const rounded = Math.round(value);
  return `~${labels[rounded] ?? "Medium"} (${value.toFixed(1)})`;
}

export function stressLabel(value: number | null): string {
  if (value == null) return "No data yet";
  const rounded = Math.round(value) as StressLevel;
  const label = STRESS_SCALE.labels[rounded] ?? "Medium";
  return `~${label} (${value.toFixed(1)})`;
}

export function cryingLabel(value: number | null): string {
  if (value == null) return "No data yet";
  const rounded = Math.round(value) as CryingLevel;
  const label = CRYING_SCALE.labels[rounded] ?? "Tearful";
  return `~${label} (${value.toFixed(1)})`;
}

export function fitnessLabel(
  avg: number | null,
  topActivity: string | null,
): string {
  if (avg == null) return "No data yet";
  if (topActivity) return `Top: ${topActivity} · ${avg.toFixed(1)}/5`;
  return `Intensity ${avg.toFixed(1)} / 5`;
}

export function readingLabel(pages: number | null): string {
  if (pages == null) return "No data yet";
  return `~${Math.round(pages)} pages / day`;
}

export function sleepLabel(quality: number | null, hours: number | null): string {
  if (quality == null && hours == null) return "No data yet";
  const parts: string[] = [];
  if (hours != null) parts.push(`~${hours.toFixed(1)} hrs / night`);
  if (quality != null) parts.push(`${quality.toFixed(1)} / 5 stars`);
  return parts.join(" · ");
}

export function readingTooltip(tier: ReadingTier): string {
  return READING_SCALE.labels[tier];
}
