import { useEffect, useRef } from "react";
import {
  ALPHABET_CHALLENGE_COLORS,
  getAlphabetColor,
} from "../../constants/alphabetChallenge";
import type { AlphabetColorId } from "../../types/alphabetChallenge";
import "./AlphabetColorPicker.css";

interface AlphabetColorPickerProps {
  value: AlphabetColorId | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (colorId: AlphabetColorId) => void;
  letter: string;
}

export function AlphabetColorPicker({
  value,
  open,
  onOpenChange,
  onChange,
  letter,
}: AlphabetColorPickerProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const current = getAlphabetColor(value);

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
    <div className="alphabet-color-picker" ref={popoverRef}>
      <button
        type="button"
        className="alphabet-color-picker__trigger"
        onClick={() => onOpenChange(!open)}
        aria-label={`Choose colour for letter ${letter}`}
        aria-expanded={open}
        title="Choose colour"
      >
        <span
          className="alphabet-color-picker__trigger-swatch"
          style={{
            background: current?.fill ?? "#fff",
            borderColor: current?.id === "white" || !current ? "#ccc" : "transparent",
          }}
        />
      </button>
      {open && (
        <div className="alphabet-color-picker__popover" role="listbox" aria-label={`Colours for ${letter}`}>
          {ALPHABET_CHALLENGE_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              role="option"
              className={`alphabet-color-picker__swatch${value === color.id ? " alphabet-color-picker__swatch--selected" : ""}`}
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
