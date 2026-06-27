import { useRef } from "react";
import type { Rating } from "../../constants/ratings";
import { fileToCompressedDataUrl } from "../../utils/imageUtils";
import { StarRating } from "../StarRating/StarRating";
import "./MovieStripSlot.css";

interface MovieStripSlotProps {
  slotIndex: number;
  imageDataUrl?: string;
  title?: string;
  rating?: Rating;
  watchDate?: string;
  showRating?: boolean;
  showDate?: boolean;
  onImageChange: (imageDataUrl: string | null) => void;
  onTitleChange: (title: string) => void;
  onRatingChange?: (rating: Rating | null) => void;
  onWatchDateChange?: (watchDate: string) => void;
}

export function MovieStripSlot({
  slotIndex,
  imageDataUrl,
  title = "",
  rating,
  watchDate = "",
  showRating = false,
  showDate = false,
  onImageChange,
  onTitleChange,
  onRatingChange,
  onWatchDateChange,
}: MovieStripSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file, 320, 200, 0.85);
      onImageChange(dataUrl);
    } catch {
      // ignore invalid uploads
    }
  };

  return (
    <div className="movie-strip-slot">
      <button
        type="button"
        className="movie-strip-slot__frame"
        onClick={() => inputRef.current?.click()}
        aria-label={
          imageDataUrl ? `Change poster ${slotIndex + 1}` : `Add poster ${slotIndex + 1}`
        }
      >
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt={title.trim() || `Movie poster ${slotIndex + 1}`}
            className="movie-strip-slot__image"
          />
        ) : (
          <span className="movie-strip-slot__placeholder">
            <span className="movie-strip-slot__plus">+</span>
            <span className="movie-strip-slot__hint">Add image</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="movie-strip-slot__file"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {imageDataUrl && (
        <button
          type="button"
          className="movie-strip-slot__clear-image"
          onClick={() => onImageChange(null)}
          aria-label={`Remove poster ${slotIndex + 1}`}
          title="Remove image"
        >
          ×
        </button>
      )}
      <input
        type="text"
        className="movie-strip-slot__title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Movie title…"
        aria-label={`Movie title ${slotIndex + 1}`}
      />
      {showDate && onWatchDateChange && (
        <input
          type="date"
          className="movie-strip-slot__date"
          value={watchDate}
          onChange={(e) => onWatchDateChange(e.target.value)}
          aria-label={`Watch date for movie ${slotIndex + 1}`}
        />
      )}
      {showRating && onRatingChange && (
        <StarRating
          value={rating}
          onChange={onRatingChange}
          label={`Rate movie ${slotIndex + 1}`}
        />
      )}
    </div>
  );
}
