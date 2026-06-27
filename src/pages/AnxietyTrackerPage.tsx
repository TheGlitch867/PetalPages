import { useState } from "react";
import { ANXIETY_SCALE, type AnxietyLevel } from "../constants/anxiety";
import { Legend } from "../components/Legend/Legend";
import { LevelPicker } from "../components/LevelPicker/LevelPicker";
import { YearGrid } from "../components/YearGrid/YearGrid";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import { toDateKey } from "../utils/dateUtils";
import "./TrackerPage.css";
import "./AnxietyTrackerPage.css";

interface AnxietyTrackerPageProps {
  settings: AppSettings;
  getAnxietyLevel: (dateKey: string) => AnxietyLevel | undefined;
  setAnxietyLevel: (dateKey: string, level: AnxietyLevel | null) => void;
}

export function AnxietyTrackerPage({
  settings,
  getAnxietyLevel,
  setAnxietyLevel,
}: AnxietyTrackerPageProps) {
  const [selectedCell, setSelectedCell] = useState<{
    month: number;
    day: number;
  } | null>(null);

  const handleLevelSelect = (level: AnxietyLevel | null) => {
    if (!selectedCell) return;
    setAnxietyLevel(
      toDateKey(settings.year, selectedCell.month, selectedCell.day),
      level,
    );
    setSelectedCell(null);
  };

  return (
    <PageBackground pageId="anxiety" className="tracker-page anxiety-tracker-page">
      <h1 className="tracker-page__title">Anxiety Tracker</h1>
      <div className="tracker-page__content">
        <YearGrid
          year={settings.year}
          allowFuture={settings.allowFuture}
          scale={ANXIETY_SCALE}
          getValue={getAnxietyLevel}
          selectedCell={selectedCell}
          onCellSelect={(month, day) => setSelectedCell({ month, day })}
        />
        <Legend scale={ANXIETY_SCALE} ariaLabel="Anxiety level legend" />
      </div>

      {selectedCell && (
        <LevelPicker
          year={settings.year}
          month={selectedCell.month}
          day={selectedCell.day}
          scale={ANXIETY_SCALE}
          currentValue={getAnxietyLevel(
            toDateKey(settings.year, selectedCell.month, selectedCell.day),
          )}
          onSelect={handleLevelSelect}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </PageBackground>
  );
}
