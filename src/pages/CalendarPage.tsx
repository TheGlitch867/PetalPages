import { useState } from "react";
import { CalendarColorPicker } from "../components/CalendarColorPicker/CalendarColorPicker";
import {
  buildMonthGrid,
  calendarCellFill,
  DEFAULT_CALENDAR_COLOR,
  getCalendarDayEntry,
  MONTH_NAMES,
  WEEKDAY_LABELS,
} from "../constants/calendar";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import type { CalendarColorId } from "../types/calendar";
import { isValidDay, toDateKey, todayParts } from "../utils/dateUtils";
import "./CalendarPage.css";

interface CalendarPageProps {
  settings: AppSettings;
  getCalendarDayEntryForDate: (dateKey: string) => ReturnType<typeof getCalendarDayEntry>;
  setCalendarEvent: (dateKey: string, text: string) => void;
  setCalendarDayColor: (dateKey: string, colorId: CalendarColorId) => void;
}

export function CalendarPage({
  settings,
  getCalendarDayEntryForDate,
  setCalendarEvent,
  setCalendarDayColor,
}: CalendarPageProps) {
  const today = todayParts();
  const [viewMonth, setViewMonth] = useState(
    settings.year === today.year ? today.month : 0,
  );
  const [brushColor, setBrushColor] = useState<CalendarColorId>(DEFAULT_CALENDAR_COLOR);

  const year = settings.year;
  const weeks = buildMonthGrid(year, viewMonth);

  const shiftMonth = (delta: number) => {
    setViewMonth((m) => {
      let next = m + delta;
      if (next < 0) next = 11;
      if (next > 11) next = 0;
      return next;
    });
  };

  return (
    <PageBackground pageId="calendar" className="calendar-page">
      <header className="calendar-page__header">
        <h1 className="calendar-page__title">{MONTH_NAMES[viewMonth]}</h1>
        <p className="calendar-page__year">{year}</p>
        <div className="calendar-page__month-nav">
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            ‹
          </button>
          <span>{MONTH_NAMES[viewMonth]}</span>
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
            ›
          </button>
        </div>
        <CalendarColorPicker
          value={brushColor}
          onChange={setBrushColor}
          label="Pick a colour, then tap a day box to fill it"
        />
      </header>

      <div className="calendar-page__board">
        <div className="calendar-grid__weekdays">
          {WEEKDAY_LABELS.map((label, index) => (
            <div key={`${label}-${index}`} className="calendar-grid__weekday">
              {label}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-grid__week">
            {week.map((day, dayIndex) => {
              if (day == null) {
                return (
                  <div
                    key={`empty-${weekIndex}-${dayIndex}`}
                    className="calendar-grid__cell calendar-grid__cell--empty"
                    aria-hidden="true"
                  />
                );
              }

              const dateKey = toDateKey(year, viewMonth, day);
              const valid = isValidDay(year, viewMonth, day);
              const isToday =
                today.year === year &&
                today.month === viewMonth &&
                today.day === day;
              const entry = getCalendarDayEntryForDate(dateKey);
              const fill = calendarCellFill(entry);
              const hasContent = entry.text.trim().length > 0 || entry.colorId != null;

              return (
                <div
                  key={dateKey}
                  className={`calendar-grid__cell${isToday ? " calendar-grid__cell--today" : ""}${hasContent ? " calendar-grid__cell--filled" : ""}`}
                  style={{ background: fill }}
                >
                  <div className="calendar-grid__cell-top">
                    <button
                      type="button"
                      className="calendar-grid__color-btn"
                      onClick={() => setCalendarDayColor(dateKey, brushColor)}
                      aria-label={`Apply ${brushColor} to ${MONTH_NAMES[viewMonth]} ${day}`}
                      title="Apply selected colour"
                    />
                    <span className="calendar-grid__day">{day}</span>
                  </div>
                  <textarea
                    className="calendar-grid__input"
                    value={entry.text}
                    onChange={(e) => setCalendarEvent(dateKey, e.target.value)}
                    placeholder="Event…"
                    disabled={!valid}
                    aria-label={`Events for ${MONTH_NAMES[viewMonth]} ${day}, ${year}`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </PageBackground>
  );
}
