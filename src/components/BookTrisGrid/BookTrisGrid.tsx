import { useMemo, useRef, useState } from "react";
import {
  BOOK_TRIS_COLS,
  BOOK_TRIS_ROWS,
  canPlacePiece,
  getBookTrisPiece,
  pieceAbsoluteCells,
} from "../../constants/bookTris";
import type { BookTrisPieceId, BookTrisPlacements } from "../../types/bookTris";
import "./BookTrisGrid.css";

interface BookTrisGridProps {
  placements: BookTrisPlacements;
  selectedPieceId: BookTrisPieceId | null;
  rotation: number;
  eraser: boolean;
  onRotate: () => void;
  onPlace: (pieceId: BookTrisPieceId, row: number, col: number, rotation: number) => void;
  onRemove: (placementId: string) => void;
}

const CELL = 22;
const DOUBLE_TAP_MS = 320;

export function BookTrisGrid({
  placements,
  selectedPieceId,
  rotation,
  eraser,
  onRotate,
  onPlace,
  onRemove,
}: BookTrisGridProps) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const lastTapRef = useRef<{ time: number; row: number; col: number } | null>(null);

  const filled = useMemo(() => {
    const cells = new Map<string, { color: string; placementId: string }>();
    for (const placed of placements) {
      const piece = getBookTrisPiece(placed.pieceId);
      for (const cell of pieceAbsoluteCells(
        placed.pieceId,
        placed.row,
        placed.col,
        placed.rotation,
      )) {
        cells.set(`${cell.r},${cell.c}`, {
          color: piece.color,
          placementId: placed.id,
        });
      }
    }
    return cells;
  }, [placements]);

  const preview = useMemo(() => {
    if (!selectedPieceId || eraser || !hover) return null;
    const abs = pieceAbsoluteCells(selectedPieceId, hover.row, hover.col, rotation);
    const valid = canPlacePiece(
      selectedPieceId,
      hover.row,
      hover.col,
      placements,
      rotation,
    );
    return {
      cells: new Set(abs.map(({ r, c }) => `${r},${c}`)),
      valid,
    };
  }, [selectedPieceId, eraser, hover, placements, rotation]);

  const placeAt = (row: number, col: number) => {
    if (!selectedPieceId || eraser) return;
    if (canPlacePiece(selectedPieceId, row, col, placements, rotation)) {
      onPlace(selectedPieceId, row, col, rotation);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    setHover({ row, col });
    const key = `${row},${col}`;
    const existing = filled.get(key);

    if (eraser && existing) {
      onRemove(existing.placementId);
      return;
    }

    if (selectedPieceId && !eraser) {
      const now = Date.now();
      const last = lastTapRef.current;

      if (last && now - last.time < DOUBLE_TAP_MS) {
        lastTapRef.current = null;
        placeAt(row, col);
        return;
      }

      const tapTime = now;
      lastTapRef.current = { time: tapTime, row, col };
      window.setTimeout(() => {
        if (lastTapRef.current?.time === tapTime) {
          lastTapRef.current = null;
          onRotate();
        }
      }, DOUBLE_TAP_MS);
      return;
    }

    if (existing && !eraser && !selectedPieceId) {
      onRemove(existing.placementId);
    }
  };

  return (
    <div className="book-tris-grid-wrap">
      <div
        className="book-tris-grid"
        style={{
          width: BOOK_TRIS_COLS * CELL,
          height: BOOK_TRIS_ROWS * CELL,
        }}
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: BOOK_TRIS_ROWS }, (_, row) =>
          Array.from({ length: BOOK_TRIS_COLS }, (_, col) => {
            const key = `${row},${col}`;
            const fill = filled.get(key);
            const isPreview = preview?.cells.has(key) ?? false;
            const previewValid = preview?.valid ?? false;

            return (
              <button
                key={key}
                type="button"
                className={[
                  "book-tris-grid__cell",
                  fill ? "book-tris-grid__cell--filled" : "",
                  isPreview
                    ? previewValid
                      ? "book-tris-grid__cell--preview-ok"
                      : "book-tris-grid__cell--preview-bad"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  width: CELL,
                  height: CELL,
                  left: col * CELL,
                  top: row * CELL,
                  background: fill?.color,
                }}
                onMouseEnter={() => setHover({ row, col })}
                onClick={() => handleCellClick(row, col)}
                aria-label={`Grid cell row ${row + 1} column ${col + 1}`}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
