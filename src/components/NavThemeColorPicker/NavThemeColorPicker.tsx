import { NAV_THEME_COLORS } from "../../constants/navTheme";
import type { NavThemeColorId } from "../../constants/navTheme";
import "./NavThemeColorPicker.css";

interface NavThemeColorPickerProps {
  value: NavThemeColorId;
  onChange: (colorId: NavThemeColorId) => void;
  label: string;
  disabled?: boolean;
}

export function NavThemeColorPicker({
  value,
  onChange,
  label,
  disabled = false,
}: NavThemeColorPickerProps) {
  return (
    <fieldset className="nav-theme-picker" disabled={disabled}>
      <legend className="nav-theme-picker__legend">{label}</legend>
      <div className="nav-theme-picker__grid" role="listbox" aria-label={label}>
        {NAV_THEME_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            role="option"
            className={`nav-theme-picker__swatch${value === color.id ? " nav-theme-picker__swatch--selected" : ""}${color.id === "white" ? " nav-theme-picker__swatch--bordered" : ""}`}
            style={{ background: color.fill }}
            onClick={() => onChange(color.id)}
            aria-selected={value === color.id}
            aria-label={color.label}
            title={color.label}
            disabled={disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}
