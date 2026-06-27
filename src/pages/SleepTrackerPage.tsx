import { useCallback, useRef, useState } from "react";
import { SleepColorPicker } from "../components/SleepColorPicker/SleepColorPicker";
import { SleepQualityStars } from "../components/SleepQualityStars/SleepQualityStars";
import {
  DEFAULT_SLEEP_COLOR,
  SLEEP_AM_HOURS,
  SLEEP_PM_HOURS,
  getSleepEntry,
  isHourAsleep,
  sleepHourFill,
} from "../constants/sleep";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import type { SleepColorId, SleepQuality } from "../types/sleep";
import { isFutureDate, isValidDay, toDateKey, todayParts } from "../utils/dateUtils";
import "./SleepTrackerPage.css";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface SleepTrackerPageProps {
  settings: AppSettings;
  getSleepEntryForDate: (dateKey: string) => ReturnType<typeof getSleepEntry>;
  setSleepHour: (
    dateKey: string,
    hourIndex: number,
    asleep: boolean,
    colorId?: SleepColorId,
  ) => void;
  setSleepDayColor: (dateKey: string, colorId: SleepColorId) => void;
  setSleepQuality: (dateKey: string, quality: SleepQuality | null) => void;
}

export function SleepTrackerPage({
  settings,
  getSleepEntryForDate,
  setSleepHour,
  setSleepDayColor,
  setSleepQuality,
}: SleepTrackerPageProps) {
  const today = todayParts();
  const [viewMonth, setViewMonth] = useState(
    settings.year === today.year ? today.month : 0,
  );
  const [brushColor, setBrushColor] = useState<SleepColorId>(DEFAULT_SLEEP_COLOR);
  const paintingRef = useRef(false);
  const paintOnRef = useRef(true);

  const year = settings.year;

  const shiftMonth = (delta: number) => {
    setViewMonth((m) => {
      let next = m + delta;
      if (next < 0) next = 11;
      if (next > 11) next = 0;
      return next;
    });
  };

  const applyHour = useCallback(
    (dateKey: string, hourIndex: number, asleep: boolean) => {
      setSleepHour(dateKey, hourIndex, asleep, asleep ? brushColor : undefined);
    },
    [setSleepHour, brushColor],
  );

  const handleHourMouseDown = (
    dateKey: string,
    hourIndex: number,
    currentlyAsleep: boolean,
    disabled: boolean,
  ) => {
    if (disabled) return;
    paintingRef.current = true;
    paintOnRef.current = !currentlyAsleep;
    applyHour(dateKey, hourIndex, paintOnRef.current);
  };

  const handleHourMouseEnter = (
    dateKey: string,
    hourIndex: number,
    disabled: boolean,
  ) => {
    if (disabled || !paintingRef.current) return;
    applyHour(dateKey, hourIndex, paintOnRef.current);
  };

  const stopPainting = () => {
    paintingRef.current = false;
  };

  return (
    <PageBackground
      pageId="sleep"
      className="sleep-tracker-page"
      onMouseUp={stopPainting}
      onMouseLeave={stopPainting}
    >
      <header className="sleep-tracker-page__header">
        <h1 className="sleep-tracker-page__title">Sleep Tracker</h1>
        <p className="sleep-tracker-page__sub">
          Pick a colour, then colour in the hours you slept · rate with stars
        </p>
        <div className="sleep-tracker-page__month-nav">
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            ‹
          </button>
          <span>
            {MONTH_NAMES[viewMonth]} {year}
          </span>
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
            ›
          </button>
        </div>
        <SleepColorPicker value={brushColor} onChange={setBrushColor} />
      </header>

      <div className="sleep-tracker-page__grid-wrap">
        <div className="sleep-tracker-grid">
          <div className="sleep-tracker-grid__header">
            <div className="sleep-tracker-grid__corner" />
            <div className="sleep-tracker-grid__period sleep-tracker-grid__period--pm">PM</div>
            <div className="sleep-tracker-grid__period sleep-tracker-grid__period--am">AM</div>
            <div className="sleep-tracker-grid__quality-head">Sleep quality</div>
          </div>

          <div className="sleep-tracker-grid__hours">
            <div className="sleep-tracker-grid__corner" />
            {SLEEP_PM_HOURS.map((h) => (
              <div key={h.index} className="sleep-tracker-grid__hour-label">
                {h.label}
              </div>
            ))}
            {SLEEP_AM_HOURS.map((h) => (
              <div key={h.index} className="sleep-tracker-grid__hour-label">
                {h.label}
              </div>
            ))}
            <div className="sleep-tracker-grid__quality-head" aria-hidden="true" />
          </div>

          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
            const valid = isValidDay(year, viewMonth, day);
            const dateKey = toDateKey(year, viewMonth, day);
            const disabled =
              !valid || (!settings.allowFuture && isFutureDate(year, viewMonth, day));
            const entry = valid ? getSleepEntryForDate(dateKey) : { hours: [] };
            const fillColor = sleepHourFill(entry);
            const hasHours = entry.hours.length > 0;

            return (
              <div
                key={day}
                className={`sleep-tracker-grid__row${valid ? "" : " sleep-tracker-grid__row--invalid"}`}
              >
                <div className="sleep-tracker-grid__day">
                  {day}
                  {valid && hasHours && (
                    <button
                      type="button"
                      className="sleep-tracker-grid__day-color"
                      style={{ background: fillColor }}
                      onClick={() => setSleepDayColor(dateKey, brushColor)}
                      title="Apply selected colour to this day"
                      aria-label={`Change highlight colour for day ${day}`}
                    />
                  )}
                </div>

                {[...SLEEP_PM_HOURS, ...SLEEP_AM_HOURS].map((h) => {
                  const asleep = valid && isHourAsleep(entry, h.index);
                  return (
                    <button
                      key={h.index}
                      type="button"
                      className={`sleep-tracker-grid__cell${asleep ? " sleep-tracker-grid__cell--asleep" : ""}${disabled ? " sleep-tracker-grid__cell--disabled" : ""}`}
                      style={asleep ? { background: fillColor } : undefined}
                      disabled={disabled}
                      aria-label={`Day ${day}, ${h.label} ${h.index < 6 ? "PM" : "AM"}${asleep ? ", asleep" : ""}`}
                      onMouseDown={() =>
                        handleHourMouseDown(dateKey, h.index, asleep, disabled)
                      }
                      onMouseEnter={() => handleHourMouseEnter(dateKey, h.index, disabled)}
                    />
                  );
                })}

                <div className="sleep-tracker-grid__quality">
                  {valid ? (
                    <SleepQualityStars
                      value={entry.quality}
                      onChange={(q) => setSleepQuality(dateKey, q)}
                      label={`Sleep quality for ${MONTH_NAMES[viewMonth]} ${day}`}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageBackground>
  );
}
