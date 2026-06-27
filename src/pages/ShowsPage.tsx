import { useState } from "react";
import { TvRow } from "../components/TvRow/TvRow";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { Rating } from "../constants/ratings";
import type { ShowTvColorId, ShowsData } from "../types/shows";
import "./ShowsPage.css";

interface ShowsPageProps {
  showsData: ShowsData;
  setFinishedShowImage: (
    rowIndex: number,
    slotIndex: number,
    imageDataUrl: string | null,
  ) => void;
  setFinishedShowTitle: (rowIndex: number, slotIndex: number, title: string) => void;
  setFinishedShowRating: (rowIndex: number, slotIndex: number, rating: Rating | null) => void;
  setFinishedShowColor: (rowIndex: number, slotIndex: number, colorId: ShowTvColorId) => void;
  addFinishedShowRow: () => void;
  removeFinishedShowRow: (rowIndex: number) => void;
  setUpcomingShowImage: (
    rowIndex: number,
    slotIndex: number,
    imageDataUrl: string | null,
  ) => void;
  setUpcomingShowTitle: (rowIndex: number, slotIndex: number, title: string) => void;
  setUpcomingShowAirDate: (rowIndex: number, slotIndex: number, airDate: string) => void;
  setUpcomingShowColor: (rowIndex: number, slotIndex: number, colorId: ShowTvColorId) => void;
  addUpcomingShowRow: () => void;
}

export function ShowsPage({
  showsData,
  setFinishedShowImage,
  setFinishedShowTitle,
  setFinishedShowRating,
  setFinishedShowColor,
  addFinishedShowRow,
  removeFinishedShowRow,
  setUpcomingShowImage,
  setUpcomingShowTitle,
  setUpcomingShowAirDate,
  setUpcomingShowColor,
  addUpcomingShowRow,
}: ShowsPageProps) {
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);

  return (
    <PageBackground pageId="shows" className="shows-page">
      <h1 className="shows-page__title">Shows</h1>

      <section className="shows-page__section">
        <h2 className="shows-page__section-title">Shows finished</h2>
        <p className="shows-page__section-hint">
          Tap a TV screen to add an image, pick a TV colour, write the title below, then rate with
          the stars.
        </p>
        <div className="shows-page__rows">
          {showsData.finishedRows.map((row, rowIndex) => (
            <div className="shows-page__row-wrap" key={`finished-${rowIndex}`}>
              {showsData.finishedRows.length > 1 && (
                <button
                  type="button"
                  className="shows-page__remove-row"
                  onClick={() => removeFinishedShowRow(rowIndex)}
                  aria-label={`Remove finished shows row ${rowIndex + 1}`}
                >
                  Remove row
                </button>
              )}
              <TvRow
                rowKey={`finished-${rowIndex}`}
                showRating
                slots={row}
                openColorPicker={openColorPicker}
                setOpenColorPicker={setOpenColorPicker}
                onImageChange={(slotIndex, url) =>
                  setFinishedShowImage(rowIndex, slotIndex, url)
                }
                onTitleChange={(slotIndex, title) =>
                  setFinishedShowTitle(rowIndex, slotIndex, title)
                }
                onColorChange={(slotIndex, colorId) =>
                  setFinishedShowColor(rowIndex, slotIndex, colorId)
                }
                onRatingChange={(slotIndex, rating) =>
                  setFinishedShowRating(rowIndex, slotIndex, rating)
                }
              />
            </div>
          ))}
        </div>
        <button type="button" className="shows-page__add-row" onClick={addFinishedShowRow}>
          + Add another row
        </button>
      </section>

      <section className="shows-page__section">
        <h2 className="shows-page__section-title">Upcoming shows</h2>
        <p className="shows-page__section-hint">
          Add images, titles, air dates, and TV colours for shows you want to watch.
        </p>
        <div className="shows-page__rows">
          {showsData.upcomingRows.map((row, rowIndex) => (
            <TvRow
              key={`upcoming-${rowIndex}`}
              rowKey={`upcoming-${rowIndex}`}
              showDate
              slots={row}
              openColorPicker={openColorPicker}
              setOpenColorPicker={setOpenColorPicker}
              onImageChange={(slotIndex, url) =>
                setUpcomingShowImage(rowIndex, slotIndex, url)
              }
              onTitleChange={(slotIndex, title) =>
                setUpcomingShowTitle(rowIndex, slotIndex, title)
              }
              onColorChange={(slotIndex, colorId) =>
                setUpcomingShowColor(rowIndex, slotIndex, colorId)
              }
              onAirDateChange={(slotIndex, airDate) =>
                setUpcomingShowAirDate(rowIndex, slotIndex, airDate)
              }
            />
          ))}
        </div>
        <button type="button" className="shows-page__add-row" onClick={addUpcomingShowRow}>
          + Add another row
        </button>
      </section>
    </PageBackground>
  );
}
