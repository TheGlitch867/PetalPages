import { CALENDAR_COLORS } from "../../constants/calendar";
import type { CalendarColorId } from "../../types/calendar";
import "./CalendarColorPicker.css";

interface CalendarColorPickerProps {
  value: CalendarColorId;
  onChange: (colorId: CalendarColorId) => void;
  label?: string;
}

export function CalendarColorPicker({
  value,
  onChange,
  label = "Box colour",
}: CalendarColorPickerProps) {
  return (
    <fieldset className="calendar-color-picker">
      <legend className="calendar-color-picker__legend">{label}</legend>
      <div className="calendar-color-picker__swatches" role="radiogroup" aria-label={label}>
        {CALENDAR_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            role="radio"
            className={`calendar-color-picker__swatch${value === color.id ? " calendar-color-picker__swatch--selected" : ""}${color.id === "white" ? " calendar-color-picker__swatch--bordered" : ""}`}
            style={{ background: color.fill }}
            onClick={() => onChange(color.id)}
            aria-checked={value === color.id}
            aria-label={color.label}
            title={color.label}
          />
        ))}
      </div>
    </fieldset>
  );
}
