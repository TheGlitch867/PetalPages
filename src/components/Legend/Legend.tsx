import type { TrackerScale } from "../../constants/trackerScale";
import "./Legend.css";

interface LegendProps<T extends number> {
  scale: TrackerScale<T>;
  ariaLabel: string;
}

export function Legend<T extends number>({ scale, ariaLabel }: LegendProps<T>) {
  return (
    <aside className="legend" aria-label={ariaLabel}>
      {scale.levels.map((level) => (
        <div key={level} className="legend__item">
          <span
            className="legend__swatch"
            style={{ backgroundColor: scale.colors[level] }}
          />
          <span className="legend__label">{scale.labels[level]}</span>
        </div>
      ))}
    </aside>
  );
}
