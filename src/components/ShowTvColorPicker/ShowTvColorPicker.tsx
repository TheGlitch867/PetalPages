import { useEffect, useRef } from "react";
import { getShowTvColor, SHOW_TV_COLORS } from "../../constants/shows";
import type { ShowTvColorId } from "../../types/shows";
import "./ShowTvColorPicker.css";

interface ShowTvColorPickerProps {
  value: ShowTvColorId | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (colorId: ShowTvColorId) => void;
  label: string;
}

export function ShowTvColorPicker({
  value,
  open,
  onOpenChange,
  onChange,
  label,
}: ShowTvColorPickerProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const current = getShowTvColor(value);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  return (
    <div className="show-tv-color-picker" ref={popoverRef}>
      <button
        type="button"
        className="show-tv-color-picker__trigger"
        onClick={() => onOpenChange(!open)}
        aria-label={`Choose TV colour for ${label}`}
        aria-expanded={open}
        title="TV colour"
      >
        <span
          className="show-tv-color-picker__trigger-swatch"
          style={{
            background: current.fill,
            borderColor:
              current.id === "white" || current.id === "pale-yellow" ? "#ccc" : "transparent",
          }}
        />
      </button>
      {open && (
        <div
          className="show-tv-color-picker__popover"
          role="listbox"
          aria-label={`TV colours for ${label}`}
        >
          {SHOW_TV_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              role="option"
              className={`show-tv-color-picker__swatch${value === color.id ? " show-tv-color-picker__swatch--selected" : ""}${color.id === "white" || color.id === "pale-yellow" ? " show-tv-color-picker__swatch--bordered" : ""}`}
              style={{ background: color.fill }}
              onClick={() => {
                onChange(color.id);
                onOpenChange(false);
              }}
              aria-selected={value === color.id}
              aria-label={color.label}
              title={color.label}
            />
          ))}
        </div>
      )}
    </div>
  );
}
