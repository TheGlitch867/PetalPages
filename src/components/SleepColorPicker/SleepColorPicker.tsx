import { SLEEP_COLORS } from "../../constants/sleep";
import type { SleepColorId } from "../../types/sleep";
import "./SleepColorPicker.css";

interface SleepColorPickerProps {
  value: SleepColorId;
  onChange: (colorId: SleepColorId) => void;
  label?: string;
}

export function SleepColorPicker({
  value,
  onChange,
  label = "Highlight colour",
}: SleepColorPickerProps) {
  return (
    <fieldset className="sleep-color-picker">
      <legend className="sleep-color-picker__legend">{label}</legend>
      <div className="sleep-color-picker__swatches" role="radiogroup" aria-label={label}>
        {SLEEP_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            role="radio"
            className={`sleep-color-picker__swatch${value === color.id ? " sleep-color-picker__swatch--selected" : ""}${color.id === "black" ? " sleep-color-picker__swatch--bordered" : ""}`}
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
