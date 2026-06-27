import type { TrackerScale } from "../../constants/trackerScale";
import { formatDisplayDate } from "../../utils/dateUtils";
import "./LevelPicker.css";

interface LevelPickerProps<T extends number> {
  year: number;
  month: number;
  day: number;
  scale: TrackerScale<T>;
  currentValue?: T;
  onSelect: (value: T | null) => void;
  onClose: () => void;
}

export function LevelPicker<T extends number>({
  year,
  month,
  day,
  scale,
  currentValue,
  onSelect,
  onClose,
}: LevelPickerProps<T>) {
  return (
    <div className="level-picker-backdrop" onClick={onClose}>
      <div
        className="level-picker"
        role="dialog"
        aria-label={`${scale.pickerTitle} ${formatDisplayDate(year, month, day)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="level-picker__date">
          {formatDisplayDate(year, month, day)}
        </p>
        <div className="level-picker__options">
          {scale.levels.map((level) => (
            <button
              key={level}
              type="button"
              className={`level-picker__option${currentValue === level ? " level-picker__option--active" : ""}`}
              onClick={() => onSelect(level)}
            >
              <span
                className="level-picker__swatch"
                style={{ backgroundColor: scale.colors[level] }}
              />
              {scale.labels[level]}
            </button>
          ))}
        </div>
        {currentValue !== undefined && (
          <button
            type="button"
            className="level-picker__clear"
            onClick={() => onSelect(null)}
          >
            {scale.clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
