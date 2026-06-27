import { useState } from "react";
import { BookTrisGrid } from "../components/BookTrisGrid/BookTrisGrid";
import { BookTrisPiecePreview } from "../components/BookTrisPiecePreview/BookTrisPiecePreview";
import { BOOK_TRIS_PIECES } from "../constants/bookTris";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { BookTrisPieceId, BookTrisPlacements } from "../types/bookTris";
import "./BookTrisPage.css";

interface BookTrisPageProps {
  bookTrisPlacements: BookTrisPlacements;
  placeBookTrisPiece: (
    pieceId: BookTrisPieceId,
    row: number,
    col: number,
    rotation: number,
  ) => void;
  removeBookTrisPiece: (placementId: string) => void;
}

const TITLE_COLORS = [
  "#e53935",
  "#ff9800",
  "#fbc02d",
  "#fbc02d",
  "#1565c0",
  "#1565c0",
  "#4dd0e1",
  "#f06292",
  "#e53935",
];

export function BookTrisPage({
  bookTrisPlacements,
  placeBookTrisPiece,
  removeBookTrisPiece,
}: BookTrisPageProps) {
  const [selectedPieceId, setSelectedPieceId] = useState<BookTrisPieceId | null>(null);
  const [rotation, setRotation] = useState(0);
  const [eraser, setEraser] = useState(false);

  const selectPiece = (id: BookTrisPieceId) => {
    setEraser(false);
    if (selectedPieceId === id) {
      setSelectedPieceId(null);
      setRotation(0);
    } else {
      setSelectedPieceId(id);
      setRotation(0);
    }
  };

  const rotate = () => {
    setRotation((r) => (r + 1) % 4);
  };

  return (
    <PageBackground pageId="booktris" className="book-tris-page">
      <h1 className="book-tris-page__title" aria-label="Book-tris">
        {"BOOK-TRIS".split("").map((char, i) => (
          <span
            key={i}
            className="book-tris-page__title-char"
            style={{ color: TITLE_COLORS[i] }}
          >
            {char}
          </span>
        ))}
      </h1>

      <p className="book-tris-page__hint">
        Pick a block, tap grid squares to rotate the blocks. Double tap the blocks to place it.
        Blocks are unlimited. If you want to erase then press eraser and then press the blocks.
      </p>

      <div className="book-tris-page__layout">
        <aside className="book-tris-page__legend">
          <ul className="book-tris-page__legend-list">
            {BOOK_TRIS_PIECES.map((piece) => {
              const selected = selectedPieceId === piece.id;

              return (
                <li key={piece.id}>
                  <button
                    type="button"
                    className={[
                      "book-tris-page__legend-item",
                      selected ? "book-tris-page__legend-item--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => selectPiece(piece.id)}
                    aria-pressed={selected}
                  >
                    <BookTrisPiecePreview
                      piece={piece}
                      rotation={selected ? rotation : 0}
                      cellSize={13}
                      onClick={selected ? rotate : undefined}
                    />
                    <span className="book-tris-page__legend-label">{piece.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className={`book-tris-page__eraser${eraser ? " book-tris-page__eraser--active" : ""}`}
            onClick={() => {
              setEraser((e) => !e);
              setSelectedPieceId(null);
              setRotation(0);
            }}
          >
            {eraser ? "Eraser on" : "Eraser"}
          </button>
        </aside>

        <BookTrisGrid
          placements={bookTrisPlacements}
          selectedPieceId={selectedPieceId}
          rotation={rotation}
          eraser={eraser}
          onRotate={rotate}
          onPlace={placeBookTrisPiece}
          onRemove={removeBookTrisPiece}
        />
      </div>
    </PageBackground>
  );
}
