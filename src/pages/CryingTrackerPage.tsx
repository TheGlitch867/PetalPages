import { useState } from "react";
import { CRYING_SCALE, type CryingLevel } from "../constants/crying";
import { Legend } from "../components/Legend/Legend";
import { LevelPicker } from "../components/LevelPicker/LevelPicker";
import { YearGrid } from "../components/YearGrid/YearGrid";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import { toDateKey } from "../utils/dateUtils";
import "./TrackerPage.css";
import "./CryingTrackerPage.css";

interface CryingTrackerPageProps {
  settings: AppSettings;
  getCryingLevel: (dateKey: string) => CryingLevel | undefined;
  setCryingLevel: (dateKey: string, level: CryingLevel | null) => void;
}

export function CryingTrackerPage({
  settings,
  getCryingLevel,
  setCryingLevel,
}: CryingTrackerPageProps) {
  const [selectedCell, setSelectedCell] = useState<{
    month: number;
    day: number;
  } | null>(null);

  const handleLevelSelect = (level: CryingLevel | null) => {
    if (!selectedCell) return;
    setCryingLevel(
      toDateKey(settings.year, selectedCell.month, selectedCell.day),
      level,
    );
    setSelectedCell(null);
  };

  return (
    <PageBackground pageId="crying" className="tracker-page crying-tracker-page">
      <h1 className="tracker-page__title">Crying Tracker</h1>
      <div className="tracker-page__content">
        <YearGrid
          year={settings.year}
          allowFuture={settings.allowFuture}
          scale={CRYING_SCALE}
          getValue={getCryingLevel}
          selectedCell={selectedCell}
          onCellSelect={(month, day) => setSelectedCell({ month, day })}
        />
        <Legend scale={CRYING_SCALE} ariaLabel="Crying log legend" />
      </div>

      {selectedCell && (
        <LevelPicker
          year={settings.year}
          month={selectedCell.month}
          day={selectedCell.day}
          scale={CRYING_SCALE}
          currentValue={getCryingLevel(
            toDateKey(settings.year, selectedCell.month, selectedCell.day),
          )}
          onSelect={handleLevelSelect}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </PageBackground>
  );
}
