import { useState } from "react";
import { MOOD_SCALE, type Rating } from "../constants/ratings";
import { Legend } from "../components/Legend/Legend";
import { LevelPicker } from "../components/LevelPicker/LevelPicker";
import { YearGrid } from "../components/YearGrid/YearGrid";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import { toDateKey } from "../utils/dateUtils";
import "./TrackerPage.css";
import "./RateMyDayPage.css";

interface RateMyDayPageProps {
  settings: AppSettings;
  getRating: (dateKey: string) => Rating | undefined;
  setRating: (dateKey: string, rating: Rating | null) => void;
}

export function RateMyDayPage({
  settings,
  getRating,
  setRating,
}: RateMyDayPageProps) {
  const [selectedCell, setSelectedCell] = useState<{
    month: number;
    day: number;
  } | null>(null);

  const handleLevelSelect = (rating: Rating | null) => {
    if (!selectedCell) return;
    setRating(
      toDateKey(settings.year, selectedCell.month, selectedCell.day),
      rating,
    );
    setSelectedCell(null);
  };

  return (
    <PageBackground pageId="rate-my-day" className="tracker-page rate-my-day-page">
      <h1 className="tracker-page__title">Rate My Day</h1>
      <div className="tracker-page__content">
        <YearGrid
          year={settings.year}
          allowFuture={settings.allowFuture}
          scale={MOOD_SCALE}
          getValue={getRating}
          selectedCell={selectedCell}
          onCellSelect={(month, day) => setSelectedCell({ month, day })}
        />
        <Legend scale={MOOD_SCALE} ariaLabel="Mood rating legend" />
      </div>

      {selectedCell && (
        <LevelPicker
          year={settings.year}
          month={selectedCell.month}
          day={selectedCell.day}
          scale={MOOD_SCALE}
          currentValue={getRating(
            toDateKey(settings.year, selectedCell.month, selectedCell.day),
          )}
          onSelect={handleLevelSelect}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </PageBackground>
  );
}
