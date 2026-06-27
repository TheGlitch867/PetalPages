import { useState } from "react";
import { AlphabetColorPicker } from "../components/AlphabetColorPicker/AlphabetColorPicker";
import { PageBackground } from "../components/PageBackground/PageBackground";
import {
  ALPHABET_COLUMN_LEFT,
  ALPHABET_COLUMN_RIGHT,
  countCompletedAlphabetEntries,
  countFilledAlphabetEntries,
  getAlphabetColor,
  getAlphabetEntry,
} from "../constants/alphabetChallenge";
import type {
  AlphabetChallengeEntries,
  AlphabetColorId,
  AlphabetLetter,
} from "../types/alphabetChallenge";
import "./AlphabetChallengePage.css";

interface AlphabetChallengePageProps {
  alphabetChallengeEntries: AlphabetChallengeEntries;
  setAlphabetBookTitle: (letter: AlphabetLetter, title: string) => void;
  setAlphabetLetterColor: (letter: AlphabetLetter, colorId: AlphabetColorId) => void;
  toggleAlphabetLetterCompleted: (letter: AlphabetLetter) => void;
  clearAlphabetChallenge: () => void;
}

function AlphabetColumn({
  letters,
  entries,
  onTitleChange,
  onColorChange,
  onToggleCompleted,
  openColorPicker,
  setOpenColorPicker,
}: {
  letters: AlphabetLetter[];
  entries: AlphabetChallengeEntries;
  onTitleChange: (letter: AlphabetLetter, title: string) => void;
  onColorChange: (letter: AlphabetLetter, colorId: AlphabetColorId) => void;
  onToggleCompleted: (letter: AlphabetLetter) => void;
  openColorPicker: AlphabetLetter | null;
  setOpenColorPicker: (letter: AlphabetLetter | null) => void;
}) {
  return (
    <ul className="alphabet-challenge__column">
      {letters.map((letter) => {
        const entry = getAlphabetEntry(entries, letter);
        const color = getAlphabetColor(entry.colorId);
        const highlight = color?.row ?? "transparent";

        return (
          <li key={letter} className="alphabet-challenge__item">
            <button
              type="button"
              className={`alphabet-challenge__checkbox${entry.completed ? " alphabet-challenge__checkbox--checked" : ""}`}
              onClick={() => onToggleCompleted(letter)}
              aria-label={`Mark letter ${letter} as ${entry.completed ? "incomplete" : "complete"}`}
              aria-pressed={entry.completed}
              style={
                entry.completed && color
                  ? { background: color.fill, borderColor: color.fill }
                  : undefined
              }
            />
            <span className="alphabet-challenge__letter">{letter}</span>
            <div
              className="alphabet-challenge__field"
              style={{ background: highlight }}
            >
              <input
                type="text"
                className="alphabet-challenge__input"
                value={entry.title}
                onChange={(e) => onTitleChange(letter, e.target.value)}
                placeholder="Title or author…"
                aria-label={`Book title or author for letter ${letter}`}
              />
            </div>
            <AlphabetColorPicker
              letter={letter}
              value={entry.colorId}
              open={openColorPicker === letter}
              onOpenChange={(open) => setOpenColorPicker(open ? letter : null)}
              onChange={(colorId) => onColorChange(letter, colorId)}
            />
          </li>
        );
      })}
    </ul>
  );
}

export function AlphabetChallengePage({
  alphabetChallengeEntries,
  setAlphabetBookTitle,
  setAlphabetLetterColor,
  toggleAlphabetLetterCompleted,
  clearAlphabetChallenge,
}: AlphabetChallengePageProps) {
  const [openColorPicker, setOpenColorPicker] = useState<AlphabetLetter | null>(null);
  const filled = countFilledAlphabetEntries(alphabetChallengeEntries);
  const completed = countCompletedAlphabetEntries(alphabetChallengeEntries);
  const hasContent = filled > 0 || completed > 0;

  const handleClear = () => {
    if (!hasContent) return;
    if (window.confirm("Clear all alphabet challenge entries? This cannot be undone.")) {
      clearAlphabetChallenge();
      setOpenColorPicker(null);
    }
  };

  return (
    <PageBackground pageId="alphabet" className="alphabet-challenge-page">
      <button
        type="button"
        className="alphabet-challenge-page__clear"
        onClick={handleClear}
        disabled={!hasContent}
      >
        Clear
      </button>
      <h1 className="alphabet-challenge-page__title">Alphabet Challenge</h1>
      <p className="alphabet-challenge-page__tagline">Read your way through the alphabet!</p>
      <p className="alphabet-challenge-page__instructions">
        Fill in each letter with either the title or{" "}
        <span className="alphabet-challenge-page__highlight">author</span> of the books
        you&apos;ve read.
      </p>

      {(filled > 0 || completed > 0) && (
        <p className="alphabet-challenge-page__progress">
          {filled} of 26 filled in
          {completed > 0 && ` · ${completed} checked off`}
        </p>
      )}

      <div className="alphabet-challenge-page__board">
        <div className="alphabet-challenge-page__columns">
          <AlphabetColumn
            letters={ALPHABET_COLUMN_LEFT}
            entries={alphabetChallengeEntries}
            onTitleChange={setAlphabetBookTitle}
            onColorChange={setAlphabetLetterColor}
            onToggleCompleted={toggleAlphabetLetterCompleted}
            openColorPicker={openColorPicker}
            setOpenColorPicker={setOpenColorPicker}
          />
          <AlphabetColumn
            letters={ALPHABET_COLUMN_RIGHT}
            entries={alphabetChallengeEntries}
            onTitleChange={setAlphabetBookTitle}
            onColorChange={setAlphabetLetterColor}
            onToggleCompleted={toggleAlphabetLetterCompleted}
            openColorPicker={openColorPicker}
            setOpenColorPicker={setOpenColorPicker}
          />
        </div>
      </div>
    </PageBackground>
  );
}
