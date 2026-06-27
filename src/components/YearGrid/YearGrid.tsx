import { MONTH_LETTERS } from "../../constants/trackerScale";
import type { TrackerScale } from "../../constants/trackerScale";
import { toDateKey } from "../../utils/dateUtils";
import { GridCell } from "./GridCell";
import "./YearGrid.css";

interface YearGridProps<T extends number> {
  year: number;
  allowFuture: boolean;
  scale: TrackerScale<T>;
  getValue: (dateKey: string) => T | undefined;
  selectedCell: { month: number; day: number } | null;
  onCellSelect: (month: number, day: number) => void;
}

export function YearGrid<T extends number>({
  year,
  allowFuture,
  scale,
  getValue,
  selectedCell,
  onCellSelect,
}: YearGridProps<T>) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="year-grid">
      <div className="year-grid__header">
        <div className="year-grid__corner" />
        {MONTH_LETTERS.map((letter, month) => (
          <div key={month} className="year-grid__month-label">
            {letter}
          </div>
        ))}
      </div>

      {days.map((day) => (
        <div key={day} className="year-grid__row">
          <div className="year-grid__day-label">{day}</div>
          {MONTH_LETTERS.map((_, month) => {
            const dateKey = toDateKey(year, month, day);
            return (
              <GridCell
                key={month}
                year={year}
                month={month}
                day={day}
                scale={scale}
                value={getValue(dateKey)}
                allowFuture={allowFuture}
                selected={
                  selectedCell?.month === month && selectedCell?.day === day
                }
                onSelect={() => onCellSelect(month, day)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
