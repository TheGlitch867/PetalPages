import { useState } from "react";
import { READING_SCALE, type ReadingTier } from "../constants/reading";
import { Legend } from "../components/Legend/Legend";
import { LevelPicker } from "../components/LevelPicker/LevelPicker";
import { YearGrid } from "../components/YearGrid/YearGrid";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import { toDateKey } from "../utils/dateUtils";
import "./TrackerPage.css";
import "./ReadingTrackerPage.css";

interface ReadingTrackerPageProps {
  settings: AppSettings;
  getReadingTier: (dateKey: string) => ReadingTier | undefined;
  setReadingTier: (dateKey: string, tier: ReadingTier | null) => void;
}

export function ReadingTrackerPage({
  settings,
  getReadingTier,
  setReadingTier,
}: ReadingTrackerPageProps) {
  const [selectedCell, setSelectedCell] = useState<{
    month: number;
    day: number;
  } | null>(null);

  const handleLevelSelect = (tier: ReadingTier | null) => {
    if (!selectedCell) return;
    setReadingTier(
      toDateKey(settings.year, selectedCell.month, selectedCell.day),
      tier,
    );
    setSelectedCell(null);
  };

  return (
    <PageBackground pageId="reading" className="tracker-page reading-tracker-page">
      <h1 className="tracker-page__title">Reading Tracker</h1>
      <div className="tracker-page__content">
        <YearGrid
          year={settings.year}
          allowFuture={settings.allowFuture}
          scale={READING_SCALE}
          getValue={getReadingTier}
          selectedCell={selectedCell}
          onCellSelect={(month, day) => setSelectedCell({ month, day })}
        />
        <Legend scale={READING_SCALE} ariaLabel="Reading pages legend" />
      </div>

      {selectedCell && (
        <LevelPicker
          year={settings.year}
          month={selectedCell.month}
          day={selectedCell.day}
          scale={READING_SCALE}
          currentValue={getReadingTier(
            toDateKey(settings.year, selectedCell.month, selectedCell.day),
          )}
          onSelect={handleLevelSelect}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </PageBackground>
  );
}
