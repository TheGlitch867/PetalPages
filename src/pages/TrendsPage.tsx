import { useMemo, useState } from "react";
import { TrendsChart } from "../components/TrendsChart/TrendsChart";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type {
  AnxietyEntries,
  CryingEntries,
  FitnessEntries,
  MoodEntries,
  ReadingEntries,
  StressEntries,
} from "../store/useMoodStore";
import type { SleepEntries } from "../types/sleep";
import {
  anxietyLabel,
  buildTrendsSeries,
  cryingLabel,
  fitnessLabel,
  moodStars,
  readingLabel,
  sleepLabel,
  stressLabel,
  summarizeTrends,
  type TrendsRange,
} from "../utils/trendsUtils";
import "./TrendsPage.css";

interface TrendsPageProps {
  moodEntries: MoodEntries;
  anxietyEntries: AnxietyEntries;
  stressEntries: StressEntries;
  cryingEntries: CryingEntries;
  fitnessEntries: FitnessEntries;
  readingEntries: ReadingEntries;
  sleepEntries: SleepEntries;
}

const RANGES: { id: TrendsRange; label: string }[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 3 months" },
];

export function TrendsPage({
  moodEntries,
  anxietyEntries,
  stressEntries,
  cryingEntries,
  fitnessEntries,
  readingEntries,
  sleepEntries,
}: TrendsPageProps) {
  const [range, setRange] = useState<TrendsRange>("7d");

  const points = useMemo(
    () =>
      buildTrendsSeries(
        moodEntries,
        anxietyEntries,
        stressEntries,
        cryingEntries,
        fitnessEntries,
        readingEntries,
        sleepEntries,
        range,
      ),
    [
      moodEntries,
      anxietyEntries,
      stressEntries,
      cryingEntries,
      fitnessEntries,
      readingEntries,
      sleepEntries,
      range,
    ],
  );

  const summary = useMemo(() => summarizeTrends(points), [points]);
  const hasData =
    summary.moodDays > 0 ||
    summary.anxietyDays > 0 ||
    summary.stressDays > 0 ||
    summary.cryingDays > 0 ||
    summary.fitnessDays > 0 ||
    summary.readingDays > 0 ||
    summary.sleepDays > 0;

  const avgReadingIntensity =
    summary.readingDays > 0 && summary.avgReadingPages != null
      ? points
          .filter((p) => p.reading != null)
          .reduce((s, p) => s + (p.reading ?? 0), 0) / summary.readingDays
      : null;

  return (
    <PageBackground pageId="trends" className="trends-page">
      <header className="trends-page__header">
        <span className="trends-page__icon" aria-hidden="true">
          ♥
        </span>
        <h1 className="trends-page__title">Wellness Trends</h1>
      </header>

      <div className="trends-page__cards trends-page__cards--seven">
        <div className="trends-card trends-card--mood">
          <div className="trends-card__icon" aria-hidden="true">
            ★
          </div>
          <div>
            <p className="trends-card__value">
              {summary.avgMood != null ? summary.avgMood.toFixed(1) : "—"}
            </p>
            <p className="trends-card__label">Rate my day</p>
            <p className="trends-card__sub">{moodStars(summary.avgMood)}</p>
          </div>
        </div>

        <div className="trends-card trends-card--stress">
          <div className="trends-card__icon" aria-hidden="true">
            ⚡
          </div>
          <div>
            <p className="trends-card__value trends-card__value--dark">
              {summary.avgStress != null ? summary.avgStress.toFixed(1) : "—"}
            </p>
            <p className="trends-card__label trends-card__label--dark">Stress tracker</p>
            <p className="trends-card__sub trends-card__sub--dark">
              {stressLabel(summary.avgStress)}
            </p>
          </div>
        </div>

        <div className="trends-card trends-card--crying">
          <div className="trends-card__icon" aria-hidden="true">
            💧
          </div>
          <div>
            <p className="trends-card__value trends-card__value--dark">
              {summary.avgCrying != null ? summary.avgCrying.toFixed(1) : "—"}
            </p>
            <p className="trends-card__label trends-card__label--dark">Crying tracker</p>
            <p className="trends-card__sub trends-card__sub--dark">
              {cryingLabel(summary.avgCrying)}
            </p>
          </div>
        </div>

        <div className="trends-card trends-card--sleep">
          <div className="trends-card__icon" aria-hidden="true">
            🌙
          </div>
          <div>
            <p className="trends-card__value trends-card__value--dark">
              {summary.avgSleepQuality != null
                ? summary.avgSleepQuality.toFixed(1)
                : "—"}
            </p>
            <p className="trends-card__label trends-card__label--dark">Sleep tracker</p>
            <p className="trends-card__sub trends-card__sub--dark">
              {sleepLabel(summary.avgSleepQuality, summary.avgSleepHours)}
            </p>
          </div>
        </div>

        <div className="trends-card trends-card--anxiety">
          <div className="trends-card__icon trends-card__icon--muted" aria-hidden="true">
            ◎
          </div>
          <div>
            <p className="trends-card__value trends-card__value--dark">
              {summary.avgAnxiety != null ? summary.avgAnxiety.toFixed(1) : "—"}
            </p>
            <p className="trends-card__label trends-card__label--dark">Anxiety tracker</p>
            <p className="trends-card__sub trends-card__sub--dark">
              {anxietyLabel(summary.avgAnxiety)}
            </p>
          </div>
        </div>

        <div className="trends-card trends-card--fitness">
          <div className="trends-card__icon" aria-hidden="true">
            🏋
          </div>
          <div>
            <p className="trends-card__value">
              {summary.avgFitness != null ? summary.avgFitness.toFixed(1) : "—"}
            </p>
            <p className="trends-card__label">Fitness tracker</p>
            <p className="trends-card__sub">
              {fitnessLabel(summary.avgFitness, summary.topActivity)}
            </p>
          </div>
        </div>

        <div className="trends-card trends-card--reading">
          <div className="trends-card__icon" aria-hidden="true">
            📖
          </div>
          <div>
            <p className="trends-card__value">
              {summary.avgReadingPages != null
                ? Math.round(summary.avgReadingPages)
                : "—"}
            </p>
            <p className="trends-card__label">Reading tracker</p>
            <p className="trends-card__sub">
              {readingLabel(summary.avgReadingPages)}
            </p>
          </div>
        </div>
      </div>

      <div className="trends-page__toolbar">
        <span className="trends-page__toolbar-label">Time range</span>
        <div className="trends-page__pills">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`trends-page__pill${range === r.id ? " trends-page__pill--active" : ""}`}
              onClick={() => setRange(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="trends-page__stats">
          <span className="trends-page__stat">{summary.moodDays} rate my day</span>
          <span className="trends-page__stat">{summary.stressDays} stress</span>
          <span className="trends-page__stat">{summary.cryingDays} crying</span>
          <span className="trends-page__stat">{summary.sleepDays} sleep</span>
          <span className="trends-page__stat">{summary.anxietyDays} anxiety</span>
          <span className="trends-page__stat">{summary.fitnessDays} fitness</span>
          <span className="trends-page__stat">{summary.readingDays} reading</span>
        </div>
      </div>

      {hasData ? (
        <TrendsChart
          points={points}
          avgMood={summary.avgMood}
          avgAnxiety={summary.avgAnxiety}
          avgStress={summary.avgStress}
          avgCrying={summary.avgCrying}
          avgFitness={summary.avgFitness}
          avgReading={avgReadingIntensity}
          avgSleep={summary.avgSleepQuality}
        />
      ) : (
        <div className="trends-page__empty">
          <p>No wellness data for this period yet.</p>
          <p className="trends-page__empty-sub">
            Log entries on Rate My Day, Stress Tracker, Crying Tracker, Sleep Tracker, and
            your other trackers to see trends here.
          </p>
        </div>
      )}
    </PageBackground>
  );
}
