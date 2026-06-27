import type { Rating } from "../../constants/ratings";
import "./StarRating.css";

interface StarRatingProps {
  value?: Rating;
  onChange: (rating: Rating | null) => void;
  label?: string;
}

const STARS: Rating[] = [1, 2, 3, 4, 5];

export function StarRating({ value, onChange, label = "Rate this book" }: StarRatingProps) {
  return (
    <div className="star-rating" role="group" aria-label={label}>
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          className={`star-rating__star${value != null && star <= value ? " star-rating__star--filled" : ""}`}
          onClick={() => onChange(value === star ? null : star)}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          aria-pressed={value != null && star <= value}
        >
          ★
        </button>
      ))}
    </div>
  );
}
