import { getTbrColor, type TbrColorId } from "../../constants/tbr";
import type { TbrBookshelfColors, TbrBookshelfPartId } from "../../constants/tbrBookshelf";
import "./TbrBookshelfColorIn.css";

interface TbrBookshelfColorInProps {
  colors: TbrBookshelfColors;
  brushColor: TbrColorId;
  eraser: boolean;
  onPartColor: (partId: TbrBookshelfPartId, colorId: TbrColorId | null) => void;
}

interface PartProps {
  id: TbrBookshelfPartId;
  d: string;
  colors: TbrBookshelfColors;
  brushColor: TbrColorId;
  eraser: boolean;
  onPartColor: TbrBookshelfColorInProps["onPartColor"];
  transform?: string;
}

function ColorablePart({
  id,
  d,
  colors,
  brushColor,
  eraser,
  onPartColor,
  transform,
}: PartProps) {
  const colorId = colors[id];
  const fill = colorId ? getTbrColor(colorId).fill : "#fff";

  return (
    <path
      d={d}
      transform={transform}
      fill={fill}
      stroke="#1a1a1a"
      strokeWidth={2}
      strokeLinejoin="round"
      className="tbr-bookshelf__part"
      onClick={() => onPartColor(id, eraser ? null : brushColor)}
      role="button"
      tabIndex={0}
      aria-label={`Colour bookshelf ${id.replace("-", " ")}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPartColor(id, eraser ? null : brushColor);
        }
      }}
    />
  );
}

export function TbrBookshelfColorIn({
  colors,
  brushColor,
  eraser,
  onPartColor,
}: TbrBookshelfColorInProps) {
  const partProps = { colors, brushColor, eraser, onPartColor };

  return (
    <div className="tbr-bookshelf">
      <svg
        className="tbr-bookshelf__svg"
        viewBox="0 0 560 150"
        role="img"
        aria-label="Colour-in bookshelf drawing"
      >
        {/* Binder rings */}
        <g className="tbr-bookshelf__rings" aria-hidden="true">
          <ellipse cx="18" cy="36" rx="10" ry="10" fill="none" stroke="#333" strokeWidth="2" />
          <ellipse cx="18" cy="72" rx="10" ry="10" fill="none" stroke="#333" strokeWidth="2" />
          <ellipse cx="18" cy="108" rx="10" ry="10" fill="none" stroke="#333" strokeWidth="2" />
        </g>

        {/* Wooden shelf */}
        <rect
          x="34"
          y="118"
          width="510"
          height="16"
          rx="3"
          fill="#e8c89a"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        <line x1="34" y1="126" x2="544" y2="126" stroke="#c9a66b" strokeWidth="1.5" />

        {/* Upright books — left cluster */}
        <ColorablePart
          id="book-1"
          d="M 44 118 L 44 68 Q 44 64 48 64 L 56 64 Q 60 64 60 68 L 60 118 Z"
          {...partProps}
        />
        <ColorablePart
          id="book-2"
          d="M 64 118 L 64 58 Q 64 54 68 54 L 86 54 Q 90 54 90 58 L 90 118 Z"
          {...partProps}
        />
        <ColorablePart
          id="book-3"
          d="M 94 118 L 94 66 Q 94 62 98 62 L 108 62 Q 112 62 112 66 L 112 118 Z"
          {...partProps}
        />

        {/* Leaning books */}
        <ColorablePart
          id="book-4"
          d="M 118 118 L 118 72 Q 118 68 122 68 L 132 68 Q 136 68 136 72 L 136 118 Z"
          transform="rotate(-14 127 118)"
          {...partProps}
        />
        <ColorablePart
          id="book-5"
          d="M 138 118 L 138 76 Q 138 72 142 72 L 152 72 Q 156 72 156 76 L 156 118 Z"
          transform="rotate(-10 147 118)"
          {...partProps}
        />
        <ColorablePart
          id="book-6"
          d="M 158 118 L 158 70 Q 158 66 162 66 L 172 66 Q 176 66 176 70 L 176 118 Z"
          transform="rotate(-8 167 118)"
          {...partProps}
        />

        {/* Middle thin books */}
        <ColorablePart
          id="book-7"
          d="M 186 118 L 186 72 Q 186 68 190 68 L 198 68 Q 202 68 202 72 L 202 118 Z"
          {...partProps}
        />
        <ColorablePart
          id="book-8"
          d="M 206 118 L 206 74 Q 206 70 210 70 L 218 70 Q 222 70 222 74 L 222 118 Z"
          {...partProps}
        />
        <ColorablePart
          id="book-9"
          d="M 226 118 L 226 70 Q 226 66 230 66 L 240 66 Q 244 66 244 70 L 244 118 Z"
          {...partProps}
        />
        {/* Spine dots on book-9 */}
        <circle cx="235" cy="82" r="2" fill="#1a1a1a" aria-hidden="true" />
        <circle cx="235" cy="92" r="2" fill="#1a1a1a" aria-hidden="true" />

        {/* Flat horizontal book */}
        <ColorablePart
          id="book-flat"
          d="M 256 118 L 256 108 Q 256 104 260 104 L 302 104 Q 306 104 306 108 L 306 118 Z"
          {...partProps}
        />

        {/* Plant pot */}
        <ColorablePart
          id="plant-pot"
          d="M 268 104 L 264 92 Q 263 88 267 88 L 293 88 Q 297 88 296 92 L 292 104 Z"
          {...partProps}
        />
        {/* Pot stripes */}
        <line x1="272" y1="90" x2="272" y2="102" stroke="#1a1a1a" strokeWidth="1" aria-hidden="true" />
        <line x1="280" y1="89" x2="280" y2="103" stroke="#1a1a1a" strokeWidth="1" aria-hidden="true" />
        <line x1="288" y1="90" x2="288" y2="102" stroke="#1a1a1a" strokeWidth="1" aria-hidden="true" />

        {/* Plant leaves */}
        <ColorablePart
          id="plant-leaves"
          d="M 280 88 Q 268 78 272 66 Q 276 74 280 80 Q 284 68 288 60 Q 292 72 290 82 Q 296 70 300 64 Q 298 76 292 86 Q 304 78 306 88 Z"
          {...partProps}
        />

        {/* Tall books — right */}
        <ColorablePart
          id="book-10"
          d="M 318 118 L 318 48 Q 318 44 322 44 L 334 44 Q 338 44 338 48 L 338 118 Z"
          {...partProps}
        />
        <ColorablePart
          id="book-11"
          d="M 344 118 L 344 46 Q 344 42 348 42 L 362 42 Q 366 42 366 46 L 366 118 Z"
          {...partProps}
        />
        <ColorablePart
          id="book-12"
          d="M 378 118 L 378 56 Q 378 52 382 52 L 394 52 Q 398 52 398 56 L 398 118 Z"
          transform="rotate(8 388 118)"
          {...partProps}
        />

        {/* Decorative spine lines on some books */}
        <line x1="52" y1="78" x2="58" y2="78" stroke="#1a1a1a" strokeWidth="1.5" aria-hidden="true" />
        <line x1="74" y1="70" x2="86" y2="70" stroke="#1a1a1a" strokeWidth="1.5" aria-hidden="true" />
        <line x1="74" y1="82" x2="86" y2="82" stroke="#1a1a1a" strokeWidth="1.5" aria-hidden="true" />
        <line x1="326" y1="58" x2="334" y2="58" stroke="#1a1a1a" strokeWidth="1.5" aria-hidden="true" />
        <line x1="352" y1="56" x2="362" y2="56" stroke="#1a1a1a" strokeWidth="1.5" aria-hidden="true" />
      </svg>
    </div>
  );
}
