import { MOVIES_PER_STRIP } from "../../constants/movies";
import type { Rating } from "../../constants/ratings";
import { MovieStripSlot } from "../MovieStripSlot/MovieStripSlot";
import "./MovieStrip.css";

interface MovieStripSlotData {
  imageDataUrl?: string;
  title?: string;
  rating?: Rating;
  watchDate?: string;
}

interface MovieStripProps {
  showRating?: boolean;
  showDate?: boolean;
  slots: MovieStripSlotData[];
  onImageChange: (slotIndex: number, imageDataUrl: string | null) => void;
  onTitleChange: (slotIndex: number, title: string) => void;
  onRatingChange?: (slotIndex: number, rating: Rating | null) => void;
  onWatchDateChange?: (slotIndex: number, watchDate: string) => void;
}

export function MovieStrip({
  showRating = false,
  showDate = false,
  slots,
  onImageChange,
  onTitleChange,
  onRatingChange,
  onWatchDateChange,
}: MovieStripProps) {
  const row = Array.from({ length: MOVIES_PER_STRIP }, (_, index) => slots[index] ?? {});

  return (
    <div className="movie-strip">
      <div className="movie-strip__sprockets movie-strip__sprockets--top" aria-hidden="true" />
      <div className="movie-strip__frames">
        {row.map((slot, index) => (
          <MovieStripSlot
            key={index}
            slotIndex={index}
            imageDataUrl={slot.imageDataUrl}
            title={slot.title}
            rating={slot.rating}
            watchDate={slot.watchDate}
            showRating={showRating}
            showDate={showDate}
            onImageChange={(url) => onImageChange(index, url)}
            onTitleChange={(title) => onTitleChange(index, title)}
            onRatingChange={
              onRatingChange ? (rating) => onRatingChange(index, rating) : undefined
            }
            onWatchDateChange={
              onWatchDateChange ? (watchDate) => onWatchDateChange(index, watchDate) : undefined
            }
          />
        ))}
      </div>
      <div className="movie-strip__sprockets movie-strip__sprockets--bottom" aria-hidden="true" />
    </div>
  );
}
