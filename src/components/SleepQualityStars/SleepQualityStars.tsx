import type { SleepQuality } from "../../types/sleep";
import "./SleepQualityStars.css";

interface SleepQualityStarsProps {
  value?: SleepQuality;
  onChange: (quality: SleepQuality | null) => void;
  label?: string;
}

const STARS: SleepQuality[] = [1, 2, 3, 4, 5];

export function SleepQualityStars({
  value,
  onChange,
  label = "Sleep quality",
}: SleepQualityStarsProps) {
  return (
    <div className="sleep-quality-stars" role="group" aria-label={label}>
      {STARS.map((star) => {
        const filled = value != null && star <= value;
        return (
          <button
            key={star}
            type="button"
            className={`sleep-quality-stars__star${filled ? " sleep-quality-stars__star--filled" : ""}`}
            onClick={() => onChange(value === star ? null : star)}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            aria-pressed={filled}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
