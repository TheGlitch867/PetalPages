import { useEffect, useState } from "react";
import {
  DAY_REVIEW_MOODS,
  getFeelingsForMood,
  shiftDate,
} from "../constants/dayReview";
import { MOOD_SCALE, type Rating } from "../constants/ratings";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import type {
  DayReviewEntry,
  DayReviewFeelingId,
  DayReviewMoodId,
} from "../types/dayReview";
import {
  daysInMonth,
  formatDisplayDate,
  isFutureDate,
  isValidDay,
  toDateKey,
  todayParts,
} from "../utils/dateUtils";
import "./ReviewYourDayPage.css";

interface ReviewYourDayPageProps {
  settings: AppSettings;
  getDayReviewForDate: (dateKey: string) => DayReviewEntry;
  saveDayReview: (dateKey: string, entry: DayReviewEntry | null) => void;
}

const RATINGS: Rating[] = [5, 4, 3, 2, 1];

export function ReviewYourDayPage({
  settings,
  getDayReviewForDate,
  saveDayReview,
}: ReviewYourDayPageProps) {
  const today = todayParts();
  const initialDay =
    settings.year === today.year
      ? today
      : { year: settings.year, month: 0, day: 1 };

  const [viewYear, setViewYear] = useState(initialDay.year);
  const [viewMonth, setViewMonth] = useState(initialDay.month);
  const [viewDay, setViewDay] = useState(initialDay.day);
  const [rating, setRating] = useState<Rating | undefined>();
  const [mood, setMood] = useState<DayReviewMoodId | undefined>();
  const [feelings, setFeelings] = useState<DayReviewFeelingId[]>([]);
  const [note, setNote] = useState("");
  const [highlight, setHighlight] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const dateKey = toDateKey(viewYear, viewMonth, viewDay);
  const isFuture = isFutureDate(viewYear, viewMonth, viewDay);
  const canEdit = settings.allowFuture || !isFuture;
  const moodFeelings = mood ? getFeelingsForMood(mood) : [];

  useEffect(() => {
    const saved = getDayReviewForDate(dateKey);
    setRating(saved.rating);
    setMood(saved.mood);
    setFeelings(saved.feelings ?? []);
    setNote(saved.note ?? "");
    setHighlight(saved.highlight ?? "");
    setGratitude(saved.gratitude ?? "");
    setSavedMessage(null);
  }, [dateKey, getDayReviewForDate]);

  const handleShiftDay = (delta: number) => {
    let next = shiftDate(viewYear, viewMonth, viewDay, delta);
    if (next.year !== settings.year) return;
    const maxDay = daysInMonth(next.year, next.month);
    if (next.day > maxDay) next = { ...next, day: maxDay };
    if (!isValidDay(next.year, next.month, next.day)) return;
    setViewYear(next.year);
    setViewMonth(next.month);
    setViewDay(next.day);
  };

  const handleMoodSelect = (nextMood: DayReviewMoodId) => {
    setMood(nextMood);
    const valid = new Set(getFeelingsForMood(nextMood).map((f) => f.id));
    setFeelings((prev) => prev.filter((id) => valid.has(id)));
  };

  const toggleFeeling = (id: DayReviewFeelingId) => {
    setFeelings((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    if (!canEdit) return;
    const entry: DayReviewEntry = {
      rating,
      mood,
      feelings: feelings.length > 0 ? feelings : undefined,
      note: note.trim() || undefined,
      highlight: highlight.trim() || undefined,
      gratitude: gratitude.trim() || undefined,
      savedAt: new Date().toISOString(),
    };
    const hasContent =
      entry.rating !== undefined ||
      entry.mood !== undefined ||
      (entry.feelings?.length ?? 0) > 0 ||
      Boolean(entry.note) ||
      Boolean(entry.highlight) ||
      Boolean(entry.gratitude);
    saveDayReview(dateKey, hasContent ? entry : null);
    setSavedMessage("Saved");
    window.setTimeout(() => setSavedMessage(null), 2000);
  };

  return (
    <PageBackground pageId="review" className="review-day-page">
      <header className="review-day-page__header">
        <h1 className="review-day-page__title">Review your day</h1>

        <div className="review-day-page__date-nav">
          <button
            type="button"
            className="review-day-page__date-btn"
            onClick={() => handleShiftDay(-1)}
            aria-label="Previous day"
          >
            ‹
          </button>
          <div className="review-day-page__date-label">
            <span>{formatDisplayDate(viewYear, viewMonth, viewDay)}</span>
            {dateKey === toDateKey(today.year, today.month, today.day) && (
              <span className="review-day-page__today-badge">Today</span>
            )}
          </div>
          <button
            type="button"
            className="review-day-page__date-btn"
            onClick={() => handleShiftDay(1)}
            aria-label="Next day"
          >
            ›
          </button>
        </div>

        {!canEdit && (
          <p className="review-day-page__hint">
            Future days cannot be reviewed yet. Turn on &ldquo;Allow future dates&rdquo; in Settings
            to plan ahead.
          </p>
        )}
      </header>

      <div className="review-day-page__sections">
        <section className="review-day-section">
          <h2 className="review-day-section__title">Rate your day overall</h2>
          <div className="review-day-rating" role="group" aria-label="Overall day rating">
            {RATINGS.map((level) => (
              <button
                key={level}
                type="button"
                className={`review-day-rating__option${rating === level ? " review-day-rating__option--active" : ""}`}
                onClick={() => canEdit && setRating(rating === level ? undefined : level)}
                disabled={!canEdit}
                aria-pressed={rating === level}
                aria-label={MOOD_SCALE.labels[level]}
              >
                <span
                  className="review-day-rating__swatch"
                  style={{ backgroundColor: MOOD_SCALE.colors[level] }}
                />
                <span className="review-day-rating__label">{MOOD_SCALE.labels[level]}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="review-day-section">
          <h2 className="review-day-section__title">What are you feeling?</h2>
          <div className="review-day-moods" role="group" aria-label="Primary feeling">
            {DAY_REVIEW_MOODS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`review-day-moods__btn${mood === item.id ? " review-day-moods__btn--active" : ""}`}
                style={
                  mood === item.id
                    ? { background: item.color, borderColor: item.color, color: "#fff" }
                    : { borderColor: item.color, color: item.color }
                }
                onClick={() => canEdit && handleMoodSelect(item.id)}
                disabled={!canEdit}
                aria-pressed={mood === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {mood && (
          <section className="review-day-section">
            <h2 className="review-day-section__title">
              Pick any words that fit — you can choose more than one
            </h2>
            <div className="review-day-feelings" role="group" aria-label="Specific feelings">
              {moodFeelings.map((item) => {
                const selected = feelings.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`review-day-feelings__chip${selected ? " review-day-feelings__chip--selected" : ""}`}
                    onClick={() => canEdit && toggleFeeling(item.id)}
                    disabled={!canEdit}
                    aria-pressed={selected}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="review-day-section">
          <h2 className="review-day-section__title">Why do you feel this way?</h2>
          <textarea
            className="review-day-section__note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write anything you'd like to remember about today…"
            rows={5}
            disabled={!canEdit}
            aria-label="Why you feel this way"
          />
        </section>

        <section className="review-day-section">
          <h2 className="review-day-section__title">Highlight of the day</h2>
          <textarea
            className="review-day-section__note"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            placeholder="What was the best part of your day?"
            rows={4}
            disabled={!canEdit}
            aria-label="Highlight of the day"
          />
        </section>

        <section className="review-day-section">
          <h2 className="review-day-section__title">Gratitude</h2>
          <textarea
            className="review-day-section__note"
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="What were you grateful for today?"
            rows={4}
            disabled={!canEdit}
            aria-label="Gratitude"
          />
        </section>

        {canEdit && (
          <div className="review-day-page__actions">
            <button type="button" className="review-day-page__save" onClick={handleSave}>
              Save
            </button>
            {savedMessage && (
              <span className="review-day-page__saved" role="status">
                {savedMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </PageBackground>
  );
}
