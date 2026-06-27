import { useEffect, useRef } from "react";
import { GOAL_COLORS, getGoalColor } from "../../constants/goals";
import type { GoalColorId } from "../../types/goals";
import "./GoalsColorPicker.css";

interface GoalsColorPickerProps {
  value: GoalColorId | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (colorId: GoalColorId) => void;
  label: string;
  disabled?: boolean;
}

export function GoalsColorPicker({
  value,
  open,
  onOpenChange,
  onChange,
  label,
  disabled = false,
}: GoalsColorPickerProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const current = getGoalColor(value);

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
    <div className="goals-color-picker" ref={popoverRef}>
      <button
        type="button"
        className="goals-color-picker__trigger"
        onClick={() => !disabled && onOpenChange(!open)}
        aria-label={`Choose text colour for ${label}`}
        aria-expanded={open}
        title="Text colour"
        disabled={disabled}
      >
        <span
          className="goals-color-picker__trigger-swatch"
          style={{
            background: current.fill,
            borderColor: current.id === "white" ? "#ccc" : "transparent",
          }}
        />
      </button>
      {open && !disabled && (
        <div
          className="goals-color-picker__popover"
          role="listbox"
          aria-label={`Text colours for ${label}`}
        >
          {GOAL_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              role="option"
              className={`goals-color-picker__swatch${value === color.id ? " goals-color-picker__swatch--selected" : ""}${color.id === "white" ? " goals-color-picker__swatch--bordered" : ""}`}
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
