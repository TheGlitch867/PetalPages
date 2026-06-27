import { useState } from "react";
import { FITNESS_SCALE, type FitnessActivity } from "../constants/fitness";
import { Legend } from "../components/Legend/Legend";
import { LevelPicker } from "../components/LevelPicker/LevelPicker";
import { YearGrid } from "../components/YearGrid/YearGrid";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { AppSettings } from "../store/useMoodStore";
import { toDateKey } from "../utils/dateUtils";
import "./TrackerPage.css";
import "./FitnessTrackerPage.css";

interface FitnessTrackerPageProps {
  settings: AppSettings;
  getFitnessActivity: (dateKey: string) => FitnessActivity | undefined;
  setFitnessActivity: (dateKey: string, activity: FitnessActivity | null) => void;
}

export function FitnessTrackerPage({
  settings,
  getFitnessActivity,
  setFitnessActivity,
}: FitnessTrackerPageProps) {
  const [selectedCell, setSelectedCell] = useState<{
    month: number;
    day: number;
  } | null>(null);

  const handleLevelSelect = (activity: FitnessActivity | null) => {
    if (!selectedCell) return;
    setFitnessActivity(
      toDateKey(settings.year, selectedCell.month, selectedCell.day),
      activity,
    );
    setSelectedCell(null);
  };

  return (
    <PageBackground pageId="fitness" className="tracker-page fitness-tracker-page">
      <h1 className="tracker-page__title">Fitness Tracker</h1>
      <div className="tracker-page__content tracker-page__content--fitness">
        <YearGrid
          year={settings.year}
          allowFuture={settings.allowFuture}
          scale={FITNESS_SCALE}
          getValue={getFitnessActivity}
          selectedCell={selectedCell}
          onCellSelect={(month, day) => setSelectedCell({ month, day })}
        />
        <Legend scale={FITNESS_SCALE} ariaLabel="Fitness activity legend" />
      </div>

      {selectedCell && (
        <LevelPicker
          year={settings.year}
          month={selectedCell.month}
          day={selectedCell.day}
          scale={FITNESS_SCALE}
          currentValue={getFitnessActivity(
            toDateKey(settings.year, selectedCell.month, selectedCell.day),
          )}
          onSelect={handleLevelSelect}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </PageBackground>
  );
}
