import { MovieStrip } from "../components/MovieStrip/MovieStrip";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { Rating } from "../constants/ratings";
import type { MoviesData } from "../types/movies";
import "./MoviesPage.css";

interface MoviesPageProps {
  moviesData: MoviesData;
  setFinishedMovieImage: (
    stripIndex: number,
    slotIndex: number,
    imageDataUrl: string | null,
  ) => void;
  setFinishedMovieTitle: (stripIndex: number, slotIndex: number, title: string) => void;
  setFinishedMovieRating: (
    stripIndex: number,
    slotIndex: number,
    rating: Rating | null,
  ) => void;
  addFinishedMovieStrip: () => void;
  removeFinishedMovieStrip: (stripIndex: number) => void;
  setUpcomingMovieImage: (
    stripIndex: number,
    slotIndex: number,
    imageDataUrl: string | null,
  ) => void;
  setUpcomingMovieTitle: (stripIndex: number, slotIndex: number, title: string) => void;
  setUpcomingMovieWatchDate: (stripIndex: number, slotIndex: number, watchDate: string) => void;
  addUpcomingMovieStrip: () => void;
}

export function MoviesPage({
  moviesData,
  setFinishedMovieImage,
  setFinishedMovieTitle,
  setFinishedMovieRating,
  addFinishedMovieStrip,
  removeFinishedMovieStrip,
  setUpcomingMovieImage,
  setUpcomingMovieTitle,
  setUpcomingMovieWatchDate,
  addUpcomingMovieStrip,
}: MoviesPageProps) {
  return (
    <PageBackground pageId="movies" className="movies-page">
      <h1 className="movies-page__title">Movies</h1>

      <section className="movies-page__section">
        <h2 className="movies-page__section-title">Movies finished</h2>
        <p className="movies-page__section-hint">
          Tap a frame to add a poster, write the title below, then rate with the stars.
        </p>
        <div className="movies-page__strips">
          {moviesData.finishedStrips.map((strip, stripIndex) => (
            <div className="movies-page__strip-row" key={`finished-${stripIndex}`}>
              {moviesData.finishedStrips.length > 1 && (
                <button
                  type="button"
                  className="movies-page__remove-row"
                  onClick={() => removeFinishedMovieStrip(stripIndex)}
                  aria-label={`Remove finished movies row ${stripIndex + 1}`}
                >
                  Remove row
                </button>
              )}
              <MovieStrip
                showRating
                slots={strip}
                onImageChange={(slotIndex, url) =>
                  setFinishedMovieImage(stripIndex, slotIndex, url)
                }
                onTitleChange={(slotIndex, title) =>
                  setFinishedMovieTitle(stripIndex, slotIndex, title)
                }
                onRatingChange={(slotIndex, rating) =>
                  setFinishedMovieRating(stripIndex, slotIndex, rating)
                }
              />
            </div>
          ))}
        </div>
        <button type="button" className="movies-page__add-strip" onClick={addFinishedMovieStrip}>
          + Add another strip
        </button>
      </section>

      <section className="movies-page__section">
        <h2 className="movies-page__section-title">Upcoming movies</h2>
        <p className="movies-page__section-hint">
          Add posters, titles, and dates for movies you want to watch.
        </p>
        <div className="movies-page__strips">
          {moviesData.upcomingStrips.map((strip, stripIndex) => (
            <MovieStrip
              key={`upcoming-${stripIndex}`}
              showDate
              slots={strip}
              onImageChange={(slotIndex, url) =>
                setUpcomingMovieImage(stripIndex, slotIndex, url)
              }
              onTitleChange={(slotIndex, title) =>
                setUpcomingMovieTitle(stripIndex, slotIndex, title)
              }
              onWatchDateChange={(slotIndex, watchDate) =>
                setUpcomingMovieWatchDate(stripIndex, slotIndex, watchDate)
              }
            />
          ))}
        </div>
        <button type="button" className="movies-page__add-strip" onClick={addUpcomingMovieStrip}>
          + Add another strip
        </button>
      </section>
    </PageBackground>
  );
}
