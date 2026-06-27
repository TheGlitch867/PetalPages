import { useState } from "react";
import { STRESS_SCALE, type StressLevel } from "../constants/stress";
import { Legend } from "../components/Legend/Legend";
import { LevelPicker } from "../components/LevelPicker/LevelPicker";
import { YearGrid } from "../components/YearGrid/YearGrid";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import { toDateKey } from "../utils/dateUtils";
import "./TrackerPage.css";
import "./StressTrackerPage.css";

interface StressTrackerPageProps {
  settings: AppSettings;
  getStressLevel: (dateKey: string) => StressLevel | undefined;
  setStressLevel: (dateKey: string, level: StressLevel | null) => void;
}

export function StressTrackerPage({
  settings,
  getStressLevel,
  setStressLevel,
}: StressTrackerPageProps) {
  const [selectedCell, setSelectedCell] = useState<{
    month: number;
    day: number;
  } | null>(null);

  const handleLevelSelect = (level: StressLevel | null) => {
    if (!selectedCell) return;
    setStressLevel(
      toDateKey(settings.year, selectedCell.month, selectedCell.day),
      level,
    );
    setSelectedCell(null);
  };

  return (
    <PageBackground pageId="stress" className="tracker-page stress-tracker-page">
      <h1 className="tracker-page__title">Stress Tracker</h1>
      <div className="tracker-page__content">
        <YearGrid
          year={settings.year}
          allowFuture={settings.allowFuture}
          scale={STRESS_SCALE}
          getValue={getStressLevel}
          selectedCell={selectedCell}
          onCellSelect={(month, day) => setSelectedCell({ month, day })}
        />
        <Legend scale={STRESS_SCALE} ariaLabel="Stress level legend" />
      </div>

      {selectedCell && (
        <LevelPicker
          year={settings.year}
          month={selectedCell.month}
          day={selectedCell.day}
          scale={STRESS_SCALE}
          currentValue={getStressLevel(
            toDateKey(settings.year, selectedCell.month, selectedCell.day),
          )}
          onSelect={handleLevelSelect}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </PageBackground>
  );
}
