import { useRef } from "react";
import type { Rating } from "../../constants/ratings";
import type { BookTrackerSlot } from "../../types/bookTracker";
import { fileToCompressedDataUrl } from "../../utils/imageUtils";
import { StarRating } from "../StarRating/StarRating";
import "./BookCoverSlot.css";

interface BookCoverSlotProps {
  index: number;
  slot: BookTrackerSlot;
  onImageChange: (imageDataUrl: string | null) => void;
  onRatingChange: (rating: Rating | null) => void;
}

export function BookCoverSlot({
  index,
  slot,
  onImageChange,
  onRatingChange,
}: BookCoverSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="book-cover-slot">
      <div className="book-cover-slot__book">
        <div className="book-cover-slot__spine" aria-hidden="true" />
        <button
          type="button"
          className="book-cover-slot__cover"
          onClick={() => inputRef.current?.click()}
          aria-label={
            slot.imageDataUrl
              ? `Change cover for book ${index + 1}`
              : `Add cover for book ${index + 1}`
          }
        >
          {slot.imageDataUrl ? (
            <img
              src={slot.imageDataUrl}
              alt={`Book ${index + 1} cover`}
              className="book-cover-slot__image"
            />
          ) : (
            <span className="book-cover-slot__placeholder">
              <span className="book-cover-slot__plus">+</span>
              <span className="book-cover-slot__hint">Add cover</span>
            </span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="book-cover-slot__file"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {slot.imageDataUrl && (
          <button
            type="button"
            className="book-cover-slot__clear"
            onClick={() => onImageChange(null)}
            aria-label={`Remove cover for book ${index + 1}`}
            title="Remove cover"
          >
            ×
          </button>
        )}
      </div>
      <StarRating
        value={slot.rating}
        onChange={onRatingChange}
        label={`Rate book ${index + 1}`}
      />
    </div>
  );
}
