import { BOOK_TRACKER_SLOT_COUNT } from "../constants/bookTracker";
import { BookCoverSlot } from "../components/BookCoverSlot/BookCoverSlot";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { Rating } from "../constants/ratings";
import type { BookTrackerSlots } from "../types/bookTracker";
import "./BookTrackerPage.css";

interface BookTrackerPageProps {
  bookTrackerSlots: BookTrackerSlots;
  setBookTrackerImage: (index: number, imageDataUrl: string | null) => void;
  setBookTrackerRating: (index: number, rating: Rating | null) => void;
}

export function BookTrackerPage({
  bookTrackerSlots,
  setBookTrackerImage,
  setBookTrackerRating,
}: BookTrackerPageProps) {
  const ratedCount = bookTrackerSlots.filter((s) => s.rating != null).length;
  const coverCount = bookTrackerSlots.filter((s) => s.imageDataUrl).length;

  return (
    <PageBackground pageId="books" className="book-tracker-page">
      <h1 className="book-tracker-page__title">Book Tracker</h1>
      <p className="book-tracker-page__sub">
        Tap a cover to add a photo, then rate with the stars below.
      </p>
      {(coverCount > 0 || ratedCount > 0) && (
        <p className="book-tracker-page__stats">
          {coverCount} cover{coverCount === 1 ? "" : "s"} · {ratedCount} rated
        </p>
      )}

      <div className="book-tracker-page__grid">
        {Array.from({ length: BOOK_TRACKER_SLOT_COUNT }, (_, index) => (
          <BookCoverSlot
            key={index}
            index={index}
            slot={bookTrackerSlots[index] ?? {}}
            onImageChange={(url) => setBookTrackerImage(index, url)}
            onRatingChange={(rating) => setBookTrackerRating(index, rating)}
          />
        ))}
      </div>
    </PageBackground>
  );
}
