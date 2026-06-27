import { useState } from "react";
import { AuthDialog, type AuthMode } from "./components/AuthDialog/AuthDialog";
import { DreamReminderModal } from "./components/DreamReminderModal/DreamReminderModal";
import { FeedbackButton } from "./components/FeedbackButton/FeedbackButton";
import { NavDisclaimer } from "./components/NavDisclaimer/NavDisclaimer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AccountPage } from "./pages/AccountPage";
import { AnxietyTrackerPage } from "./pages/AnxietyTrackerPage";
import { FitnessTrackerPage } from "./pages/FitnessTrackerPage";
import { ReadingTrackerPage } from "./pages/ReadingTrackerPage";
import { AlphabetChallengePage } from "./pages/AlphabetChallengePage";
import { CalendarPage } from "./pages/CalendarPage";
import { GoalsPage } from "./pages/GoalsPage";
import { BookTrisPage } from "./pages/BookTrisPage";
import { ReadTheRainbowPage } from "./pages/ReadTheRainbowPage";
import { BookTrackerPage } from "./pages/BookTrackerPage";
import { TbrListPage } from "./pages/TbrListPage";
import { MoviesPage } from "./pages/MoviesPage";
import { RateMyDayPage } from "./pages/RateMyDayPage";
import { ReviewYourDayPage } from "./pages/ReviewYourDayPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ShowsPage } from "./pages/ShowsPage";
import { CryingTrackerPage } from "./pages/CryingTrackerPage";
import { DreamsPage } from "./pages/DreamsPage";
import { StressTrackerPage } from "./pages/StressTrackerPage";
import { SleepTrackerPage } from "./pages/SleepTrackerPage";
import { TrendsPage } from "./pages/TrendsPage";
import { DEFAULT_NAV_BACKGROUND, DEFAULT_NAV_TEXT, getNavThemeColor } from "./constants/navTheme";
import { getPageBackgroundUrl } from "./constants/pageBackgrounds";
import { PageBackgroundProvider } from "./context/PageBackgroundContext";
import { useMoodStore } from "./store/useMoodStore";
import petalPagesLogo from "./assets/petal-pages-logo.png";
import "./App.css";
import "./styles/pageWithBackground.css";

type Page = "dreams" | "home" | "review" | "anxiety" | "stress" | "crying" | "fitness" | "reading" | "movies" | "shows" | "sleep" | "calendar" | "goals" | "tbr" | "books" | "rainbow" | "booktris" | "alphabet" | "trends" | "account" | "settings";

function AppShell() {
  const [page, setPage] = useState<Page>("dreams");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [dreamReminderDismissed, setDreamReminderDismissed] = useState(false);
  const { user, loading: authLoading, cloudConfigured, signOut } = useAuth();
  const {
    settings,
    moodEntries,
    anxietyEntries,
    stressEntries,
    cryingEntries,
    fitnessEntries,
    readingEntries,
    sleepEntries,
    getRating,
    setRating,
    getAnxietyLevel,
    setAnxietyLevel,
    getStressLevel,
    setStressLevel,
    getCryingLevel,
    setCryingLevel,
    setFitnessActivity,
    getFitnessActivity,
    getReadingTier,
    setReadingTier,
    getSleepEntryForDate,
    setSleepHour,
    setSleepDayColor,
    setSleepQuality,
    getCalendarDayEntryForDate,
    setCalendarEvent,
    setCalendarDayColor,
    goalsByMonth,
    addGoal,
    updateGoal,
    toggleGoalCompleted,
    removeGoal,
    getDayReviewForDate,
    saveDayReview,
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
    dreamText,
    setDreamText,
    tbrList,
    tbrBookshelfColors,
    addTbrBook,
    updateTbrBook,
    toggleTbrBookCompleted,
    removeTbrBook,
    setTbrBookshelfPartColor,
    bookTrackerSlots,
    setBookTrackerImage,
    setBookTrackerRating,
    rainbowBookSlots,
    setRainbowBookImage,
    bookTrisPlacements,
    placeBookTrisPiece,
    removeBookTrisPiece,
    alphabetChallengeEntries,
    setAlphabetBookTitle,
    setAlphabetLetterColor,
    toggleAlphabetLetterCompleted,
    clearAlphabetChallenge,
    updateSettings,
    pageBackgrounds,
    setPageBackground,
    clearPageBackground,
    pageTextColors,
    setPageTextColor,
    clearPageTextColor,
    syncing,
    syncError,
    isSignedIn,
    cloudReady,
  } = useMoodStore(user?.uid ?? null);

  const dataReady = !authLoading && cloudReady;

  const showDreamReminder =
    dataReady && dreamText.trim().length > 0 && !dreamReminderDismissed;

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const navBackground = getNavThemeColor(settings.navBackgroundColorId, DEFAULT_NAV_BACKGROUND);
  const navText = getNavThemeColor(settings.navTextColorId, DEFAULT_NAV_TEXT);
  const dreamReminderBackgroundUrl = getPageBackgroundUrl("dream-reminder", pageBackgrounds);

  return (
    <PageBackgroundProvider pageBackgrounds={pageBackgrounds} pageTextColors={pageTextColors}>
    <div className={`app${showDreamReminder ? " app--blocked" : ""}`}>
      <nav
        className="nav"
        aria-hidden={showDreamReminder}
        style={
          {
            "--nav-bg": navBackground.fill,
            "--nav-text": navText.fill,
          } as React.CSSProperties
        }
      >
        <div className="nav__brand">
          <img
            className="nav__brand-logo"
            src={petalPagesLogo}
            alt=""
            aria-hidden="true"
          />
          <span className="nav__brand-title">PetalPages</span>
        </div>

        <div className="nav__tabs">
          <button
            type="button"
            className={`nav__tab${page === "dreams" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("dreams")}
          >
            Dreams
          </button>
          <button
            type="button"
            className={`nav__tab${page === "home" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("home")}
          >
            Rate My Day
          </button>
          <button
            type="button"
            className={`nav__tab${page === "review" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("review")}
          >
            Review your day
          </button>
          <button
            type="button"
            className={`nav__tab${page === "anxiety" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("anxiety")}
          >
            Anxiety Tracker
          </button>
          <button
            type="button"
            className={`nav__tab${page === "stress" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("stress")}
          >
            Stress Tracker
          </button>
          <button
            type="button"
            className={`nav__tab${page === "crying" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("crying")}
          >
            Crying Tracker
          </button>
          <button
            type="button"
            className={`nav__tab${page === "fitness" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("fitness")}
          >
            Fitness
          </button>
          <button
            type="button"
            className={`nav__tab${page === "reading" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("reading")}
          >
            Reading
          </button>
          <button
            type="button"
            className={`nav__tab${page === "movies" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("movies")}
          >
            Movies
          </button>
          <button
            type="button"
            className={`nav__tab${page === "shows" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("shows")}
          >
            Shows
          </button>
          <button
            type="button"
            className={`nav__tab${page === "sleep" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("sleep")}
          >
            Sleep Tracker
          </button>
          <button
            type="button"
            className={`nav__tab${page === "calendar" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("calendar")}
          >
            Calendar
          </button>
          <button
            type="button"
            className={`nav__tab${page === "goals" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("goals")}
          >
            Goals
          </button>
          <button
            type="button"
            className={`nav__tab${page === "tbr" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("tbr")}
          >
            To Be Read
          </button>
          <button
            type="button"
            className={`nav__tab${page === "books" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("books")}
          >
            Book Tracker
          </button>
          <button
            type="button"
            className={`nav__tab${page === "rainbow" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("rainbow")}
          >
            Read the Rainbow
          </button>
          <button
            type="button"
            className={`nav__tab${page === "booktris" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("booktris")}
          >
            Book-tris
          </button>
          <button
            type="button"
            className={`nav__tab${page === "alphabet" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("alphabet")}
          >
            Alphabet Challenge
          </button>
          <button
            type="button"
            className={`nav__tab${page === "trends" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("trends")}
          >
            Trends
          </button>
          <button
            type="button"
            className={`nav__tab${page === "account" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("account")}
          >
            Account
          </button>
          <button
            type="button"
            className={`nav__tab${page === "settings" ? " nav__tab--active" : ""}`}
            onClick={() => setPage("settings")}
          >
            Settings
          </button>
          <NavDisclaimer />
        </div>

        <div className="nav__footer">
          <div className="nav__actions">
          {authLoading && <span className="nav__badge">Loading…</span>}
          {!authLoading && syncing && (
            <span className="nav__badge">Syncing…</span>
          )}
          {!authLoading && !syncing && isSignedIn && (
            <span className="nav__badge nav__badge--ok">Cloud saved</span>
          )}
          {!authLoading && !isSignedIn && (
            <span className="nav__badge nav__badge--local">Local only</span>
          )}

          {!authLoading && user && (
            <span className="nav__email" title={user.email ?? undefined}>
              {user.email}
            </span>
          )}

          {!authLoading && cloudConfigured && !user && (
            <div className="nav__auth">
              <button
                type="button"
                className="nav__auth-btn nav__auth-btn--outline"
                onClick={() => openAuth("signin")}
              >
                Log in
              </button>
              <button
                type="button"
                className="nav__auth-btn nav__auth-btn--primary"
                onClick={() => openAuth("signup")}
              >
                Sign up
              </button>
            </div>
          )}

          {!authLoading && user && (
            <button
              type="button"
              className="nav__auth-btn nav__auth-btn--outline"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          )}
          </div>
          <p className="nav__author">A journal by MeadowMoments</p>
        </div>
      </nav>

      <div className="app__content">
        {syncError && <div className="sync-banner">{syncError}</div>}

        <main className="main">
        {!dataReady ? (
          <div className="loading-screen">Loading your data…</div>
        ) : (
          <>
            {page === "dreams" && (
              <DreamsPage dreamText={dreamText} setDreamText={setDreamText} />
            )}
            {page === "home" && (
              <RateMyDayPage
                settings={settings}
                getRating={getRating}
                setRating={setRating}
              />
            )}
            {page === "review" && (
              <ReviewYourDayPage
                settings={settings}
                getDayReviewForDate={getDayReviewForDate}
                saveDayReview={saveDayReview}
              />
            )}
            {page === "anxiety" && (
              <AnxietyTrackerPage
                settings={settings}
                getAnxietyLevel={getAnxietyLevel}
                setAnxietyLevel={setAnxietyLevel}
              />
            )}
            {page === "stress" && (
              <StressTrackerPage
                settings={settings}
                getStressLevel={getStressLevel}
                setStressLevel={setStressLevel}
              />
            )}
            {page === "crying" && (
              <CryingTrackerPage
                settings={settings}
                getCryingLevel={getCryingLevel}
                setCryingLevel={setCryingLevel}
              />
            )}
            {page === "fitness" && (
              <FitnessTrackerPage
                settings={settings}
                getFitnessActivity={getFitnessActivity}
                setFitnessActivity={setFitnessActivity}
              />
            )}
            {page === "reading" && (
              <ReadingTrackerPage
                settings={settings}
                getReadingTier={getReadingTier}
                setReadingTier={setReadingTier}
              />
            )}
            {page === "movies" && (
              <MoviesPage
                moviesData={moviesData}
                setFinishedMovieImage={setFinishedMovieImage}
                setFinishedMovieTitle={setFinishedMovieTitle}
                setFinishedMovieRating={setFinishedMovieRating}
                addFinishedMovieStrip={addFinishedMovieStrip}
                removeFinishedMovieStrip={removeFinishedMovieStrip}
                setUpcomingMovieImage={setUpcomingMovieImage}
                setUpcomingMovieTitle={setUpcomingMovieTitle}
                setUpcomingMovieWatchDate={setUpcomingMovieWatchDate}
                addUpcomingMovieStrip={addUpcomingMovieStrip}
              />
            )}
            {page === "shows" && (
              <ShowsPage
                showsData={showsData}
                setFinishedShowImage={setFinishedShowImage}
                setFinishedShowTitle={setFinishedShowTitle}
                setFinishedShowRating={setFinishedShowRating}
                setFinishedShowColor={setFinishedShowColor}
                addFinishedShowRow={addFinishedShowRow}
                removeFinishedShowRow={removeFinishedShowRow}
                setUpcomingShowImage={setUpcomingShowImage}
                setUpcomingShowTitle={setUpcomingShowTitle}
                setUpcomingShowAirDate={setUpcomingShowAirDate}
                setUpcomingShowColor={setUpcomingShowColor}
                addUpcomingShowRow={addUpcomingShowRow}
              />
            )}
            {page === "sleep" && (
              <SleepTrackerPage
                settings={settings}
                getSleepEntryForDate={getSleepEntryForDate}
                setSleepHour={setSleepHour}
                setSleepDayColor={setSleepDayColor}
                setSleepQuality={setSleepQuality}
              />
            )}
            {page === "calendar" && (
              <CalendarPage
                settings={settings}
                getCalendarDayEntryForDate={getCalendarDayEntryForDate}
                setCalendarEvent={setCalendarEvent}
                setCalendarDayColor={setCalendarDayColor}
              />
            )}
            {page === "goals" && (
              <GoalsPage
                goalsByMonth={goalsByMonth}
                addGoal={addGoal}
                updateGoal={updateGoal}
                toggleGoalCompleted={toggleGoalCompleted}
                removeGoal={removeGoal}
              />
            )}
            {page === "tbr" && (
              <TbrListPage
                tbrList={tbrList}
                tbrBookshelfColors={tbrBookshelfColors}
                addTbrBook={addTbrBook}
                updateTbrBook={updateTbrBook}
                toggleTbrBookCompleted={toggleTbrBookCompleted}
                removeTbrBook={removeTbrBook}
                setTbrBookshelfPartColor={setTbrBookshelfPartColor}
              />
            )}
            {page === "books" && (
              <BookTrackerPage
                bookTrackerSlots={bookTrackerSlots}
                setBookTrackerImage={setBookTrackerImage}
                setBookTrackerRating={setBookTrackerRating}
              />
            )}
            {page === "rainbow" && (
              <ReadTheRainbowPage
                rainbowBookSlots={rainbowBookSlots}
                setRainbowBookImage={setRainbowBookImage}
              />
            )}
            {page === "booktris" && (
              <BookTrisPage
                bookTrisPlacements={bookTrisPlacements}
                placeBookTrisPiece={placeBookTrisPiece}
                removeBookTrisPiece={removeBookTrisPiece}
              />
            )}
            {page === "alphabet" && (
              <AlphabetChallengePage
                alphabetChallengeEntries={alphabetChallengeEntries}
                setAlphabetBookTitle={setAlphabetBookTitle}
                setAlphabetLetterColor={setAlphabetLetterColor}
                toggleAlphabetLetterCompleted={toggleAlphabetLetterCompleted}
                clearAlphabetChallenge={clearAlphabetChallenge}
              />
            )}
            {page === "trends" && (
              <TrendsPage
                moodEntries={moodEntries}
                anxietyEntries={anxietyEntries}
                stressEntries={stressEntries}
                cryingEntries={cryingEntries}
                fitnessEntries={fitnessEntries}
                readingEntries={readingEntries}
                sleepEntries={sleepEntries}
              />
            )}
            {page === "account" && <AccountPage />}
            {page === "settings" && (
              <SettingsPage
                settings={settings}
                onUpdate={updateSettings}
                pageBackgrounds={pageBackgrounds}
                onSetPageBackground={setPageBackground}
                onClearPageBackground={clearPageBackground}
                pageTextColors={pageTextColors}
                onSetPageTextColor={setPageTextColor}
                onClearPageTextColor={clearPageTextColor}
              />
            )}
          </>
        )}
        </main>
      </div>

      <AuthDialog
        isOpen={authOpen && !showDreamReminder}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthOpen(false)}
      />

      {!showDreamReminder && <FeedbackButton />}

      {showDreamReminder && (
        <DreamReminderModal
          dreamText={dreamText.trim()}
          backgroundUrl={dreamReminderBackgroundUrl}
          onDismiss={() => setDreamReminderDismissed(true)}
        />
      )}
    </div>
    </PageBackgroundProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
