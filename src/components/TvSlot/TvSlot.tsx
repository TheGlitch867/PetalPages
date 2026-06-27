import { useRef } from "react";
import { getTvSetStyle } from "../../constants/shows";
import type { Rating } from "../../constants/ratings";
import type { ShowTvColorId } from "../../types/shows";
import { fileToCompressedDataUrl } from "../../utils/imageUtils";
import { ShowTvColorPicker } from "../ShowTvColorPicker/ShowTvColorPicker";
import { StarRating } from "../StarRating/StarRating";
import "./TvSlot.css";

interface TvSlotProps {
  slotIndex: number;
  imageDataUrl?: string;
  title?: string;
  rating?: Rating;
  airDate?: string;
  colorId?: ShowTvColorId;
  showRating?: boolean;
  showDate?: boolean;
  colorPickerOpen: boolean;
  onColorPickerOpenChange: (open: boolean) => void;
  onImageChange: (imageDataUrl: string | null) => void;
  onTitleChange: (title: string) => void;
  onColorChange: (colorId: ShowTvColorId) => void;
  onRatingChange?: (rating: Rating | null) => void;
  onAirDateChange?: (airDate: string) => void;
}

export function TvSlot({
  slotIndex,
  imageDataUrl,
  title = "",
  rating,
  airDate = "",
  colorId,
  showRating = false,
  showDate = false,
  colorPickerOpen,
  onColorPickerOpenChange,
  onImageChange,
  onTitleChange,
  onColorChange,
  onRatingChange,
  onAirDateChange,
}: TvSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tvStyle = getTvSetStyle(colorId);

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file, 280, 210, 0.85);
      onImageChange(dataUrl);
    } catch {
      // ignore invalid uploads
    }
  };

  return (
    <div className="tv-slot">
      <div className="tv-slot__set">
        <div className="tv-slot__antenna" aria-hidden="true">
          <span className="tv-slot__antenna-left" style={tvStyle.antenna} />
          <span className="tv-slot__antenna-right" style={tvStyle.antenna} />
        </div>
        <div className="tv-slot__cabinet" style={tvStyle.cabinet}>
          <button
            type="button"
            className="tv-slot__screen-btn"
            onClick={() => inputRef.current?.click()}
            aria-label={
              imageDataUrl ? `Change show image ${slotIndex + 1}` : `Add show image ${slotIndex + 1}`
            }
          >
            <div className="tv-slot__screen">
              {imageDataUrl ? (
                <img
                  src={imageDataUrl}
                  alt={title.trim() || `Show ${slotIndex + 1}`}
                  className="tv-slot__image"
                />
              ) : (
                <span className="tv-slot__placeholder">
                  <span className="tv-slot__plus">+</span>
                  <span className="tv-slot__hint">Add image</span>
                </span>
              )}
            </div>
          </button>
          <div className="tv-slot__dial" aria-hidden="true" />
        </div>
        <div className="tv-slot__legs" aria-hidden="true">
          <span style={tvStyle.legs} />
          <span style={tvStyle.legs} />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="tv-slot__file"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {imageDataUrl && (
        <button
          type="button"
          className="tv-slot__clear-image"
          onClick={() => onImageChange(null)}
          aria-label={`Remove show image ${slotIndex + 1}`}
          title="Remove image"
        >
          ×
        </button>
      )}
      <div className="tv-slot__meta">
        <ShowTvColorPicker
          value={colorId}
          open={colorPickerOpen}
          onOpenChange={onColorPickerOpenChange}
          onChange={onColorChange}
          label={title.trim() || `show ${slotIndex + 1}`}
        />
        <input
          type="text"
          className="tv-slot__title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Show title…"
          aria-label={`Show title ${slotIndex + 1}`}
        />
      </div>
      {showDate && onAirDateChange && (
        <input
          type="date"
          className="tv-slot__date"
          value={airDate}
          onChange={(e) => onAirDateChange(e.target.value)}
          aria-label={`Air date for show ${slotIndex + 1}`}
        />
      )}
      {showRating && onRatingChange && (
        <StarRating
          value={rating}
          onChange={onRatingChange}
          label={`Rate show ${slotIndex + 1}`}
        />
      )}
    </div>
  );
}
