import { TBR_COLORS, type TbrColorId } from "../../constants/tbr";
import "./TbrColorPicker.css";

interface TbrColorPickerProps {
  value: TbrColorId;
  onChange: (colorId: TbrColorId) => void;
  label?: string;
  compact?: boolean;
}

export function TbrColorPicker({
  value,
  onChange,
  label = "Book colour",
  compact = false,
}: TbrColorPickerProps) {
  return (
    <fieldset
      className={`tbr-color-picker${compact ? " tbr-color-picker--compact" : ""}`}
    >
      <legend className="tbr-color-picker__legend">{label}</legend>
      <div className="tbr-color-picker__swatches" role="radiogroup" aria-label={label}>
        {TBR_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            role="radio"
            className={`tbr-color-picker__swatch${value === color.id ? " tbr-color-picker__swatch--selected" : ""}`}
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
