import {
  DISABLED_COLOR,
  EMPTY_COLOR,
  type TrackerScale,
} from "../../constants/trackerScale";
import {
  formatDisplayDate,
  isFutureDate,
  isValidDay,
  toDateKey,
} from "../../utils/dateUtils";
import "./GridCell.css";

interface GridCellProps<T extends number> {
  year: number;
  month: number;
  day: number;
  scale: TrackerScale<T>;
  value?: T;
  allowFuture: boolean;
  selected: boolean;
  onSelect: () => void;
}

export function GridCell<T extends number>({
  year,
  month,
  day,
  scale,
  value,
  allowFuture,
  selected,
  onSelect,
}: GridCellProps<T>) {
  const valid = isValidDay(year, month, day);
  const future = valid && isFutureDate(year, month, day);
  const disabled = !valid || (future && !allowFuture);
  const dateKey = toDateKey(year, month, day);

  let background = EMPTY_COLOR;
  if (!valid) {
    background = DISABLED_COLOR;
  } else if (value !== undefined) {
    background = scale.colors[value as T];
  }

  const title = valid
    ? `${formatDisplayDate(year, month, day)}${
        value !== undefined
          ? ` — ${scale.formatTooltip(scale.labels[value as T], value as T)}`
          : ""
      }`
    : undefined;

  return (
    <button
      type="button"
      className={`grid-cell${disabled ? " grid-cell--disabled" : ""}${selected ? " grid-cell--selected" : ""}`}
      style={{ backgroundColor: background }}
      disabled={disabled}
      title={title}
      aria-label={
        valid ? `${scale.pickerTitle} ${formatDisplayDate(year, month, day)}` : undefined
      }
      data-date={dateKey}
      onClick={onSelect}
    />
  );
}
