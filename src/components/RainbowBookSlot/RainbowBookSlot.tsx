import { useRef } from "react";
import type { RainbowBookSlot } from "../../types/rainbowBooks";
import { fileToCompressedDataUrl } from "../../utils/imageUtils";
import "./RainbowBookSlot.css";

interface RainbowColorDef {
  id: string;
  label: string;
  border: string;
  spine: string;
  labelColor: string;
}

interface RainbowBookSlotProps {
  color: RainbowColorDef;
  slot: RainbowBookSlot;
  onImageChange: (imageDataUrl: string | null) => void;
}

export function RainbowBookSlot({ color, slot, onImageChange }: RainbowBookSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isWhite = color.id === "white";

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      onImageChange(dataUrl);
    } catch {
      // ignore invalid uploads
    }
  };

  return (
    <div className="rainbow-book-slot">
      <div className="rainbow-book-slot__book">
        <div
          className="rainbow-book-slot__spine"
          style={{ background: color.spine, borderColor: color.border }}
          aria-hidden="true"
        />
        <button
          type="button"
          className={`rainbow-book-slot__cover${isWhite ? " rainbow-book-slot__cover--white" : ""}`}
          style={{ borderColor: color.border }}
          onClick={() => inputRef.current?.click()}
          aria-label={
            slot.imageDataUrl
              ? `Change ${color.label} book cover`
              : `Add cover for ${color.label} book`
          }
        >
          {slot.imageDataUrl ? (
            <img
              src={slot.imageDataUrl}
              alt={`${color.label} book cover`}
              className="rainbow-book-slot__image"
            />
          ) : (
            <span className="rainbow-book-slot__placeholder">
              <span className="rainbow-book-slot__plus" style={{ color: color.border }}>
                +
              </span>
            </span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="rainbow-book-slot__file"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {slot.imageDataUrl && (
          <button
            type="button"
            className="rainbow-book-slot__clear"
            onClick={() => onImageChange(null)}
            aria-label={`Remove ${color.label} book cover`}
            title="Remove cover"
          >
            ×
          </button>
        )}
      </div>
      <span
        className="rainbow-book-slot__label"
        style={{ color: color.labelColor }}
      >
        {color.label}
      </span>
    </div>
  );
}
