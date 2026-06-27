import { RainbowBookSlot } from "../components/RainbowBookSlot/RainbowBookSlot";
import { RAINBOW_BOOK_COLORS } from "../constants/rainbowBooks";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { RainbowBookSlots } from "../types/rainbowBooks";
import "./ReadTheRainbowPage.css";

interface ReadTheRainbowPageProps {
  rainbowBookSlots: RainbowBookSlots;
  setRainbowBookImage: (index: number, imageDataUrl: string | null) => void;
}

export function ReadTheRainbowPage({
  rainbowBookSlots,
  setRainbowBookImage,
}: ReadTheRainbowPageProps) {
  const filledCount = rainbowBookSlots.filter((s) => s.imageDataUrl).length;

  return (
    <PageBackground pageId="rainbow" className="read-rainbow-page">
      <h1 className="read-rainbow-page__title">Read the Rainbow</h1>
      <p className="read-rainbow-page__sub">
        Read a book for each colour — tap a cover to add a photo.
      </p>
      {filledCount > 0 && (
        <p className="read-rainbow-page__stats">
          {filledCount} of {RAINBOW_BOOK_COLORS.length} covers added
        </p>
      )}

      <div className="read-rainbow-page__grid">
        {RAINBOW_BOOK_COLORS.map((color, index) => (
          <RainbowBookSlot
            key={color.id}
            color={color}
            slot={rainbowBookSlots[index] ?? {}}
            onImageChange={(url) => setRainbowBookImage(index, url)}
          />
        ))}
      </div>
    </PageBackground>
  );
}
