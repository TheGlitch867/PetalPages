import { getRotatedCells } from "../../constants/bookTris";
import type { BookTrisCell, BookTrisPieceDef } from "../../types/bookTris";
import "./BookTrisPiecePreview.css";

interface BookTrisPiecePreviewProps {
  piece: BookTrisPieceDef;
  cells?: BookTrisCell[];
  rotation?: number;
  cellSize?: number;
  className?: string;
  onClick?: () => void;
}

export function BookTrisPiecePreview({
  piece,
  cells,
  rotation = 0,
  cellSize = 14,
  className = "",
  onClick,
}: BookTrisPiecePreviewProps) {
  const displayCells = cells ?? getRotatedCells(piece.cells, rotation);
  const maxR = Math.max(...displayCells.map((c) => c.r));
  const maxC = Math.max(...displayCells.map((c) => c.c));

  const inner = (
    <div
      className={`book-tris-preview ${className}`.trim()}
      style={{
        width: (maxC + 1) * cellSize,
        height: (maxR + 1) * cellSize,
      }}
    >
      {displayCells.map((cell) => (
        <span
          key={`${cell.r}-${cell.c}`}
          className="book-tris-preview__cell"
          style={{
            width: cellSize - 2,
            height: cellSize - 2,
            left: cell.c * cellSize,
            top: cell.r * cellSize,
            background: piece.color,
          }}
        />
      ))}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="book-tris-preview-btn"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        aria-label={`Rotate ${piece.label} block`}
      >
        {inner}
      </button>
    );
  }

  return inner;
}
