# PetalPages

**Your life, one page at a time.**

PetalPages is a beautiful Windows desktop journal that blends bullet-journal style tracking with cozy, scenic pages. Log how you feel, build reading habits, plan your month, and spot patterns over the year — all in one app that works offline and syncs when you sign in.

![PetalPages logo](src/assets/petal-pages-logo.png)

---

## Why PetalPages?

Most trackers feel like spreadsheets. PetalPages feels like opening a favourite notebook — except every page can look exactly how you want it.

- **Fast daily check-ins** — tap a day on the grid and you are done in seconds
- **Private by default** — everything saves on your device; cloud sync is optional
- **Fully yours** — import custom backgrounds, pick text colours, and theme the sidebar
- **One app, many pages** — wellness, books, media, goals, and calendar in a single sidebar

---

## Highlights

### Year in Pixels wellness trackers

See your whole year at a glance with colour-coded grids inspired by bullet journals:

| Tracker | What you log |
| --- | --- |
| **Rate My Day** | Daily mood (1–5 stars) |
| **Anxiety Tracker** | Anxiety level across the year |
| **Stress Tracker** | Stress level across the year |
| **Crying Tracker** | Emotional release days |
| **Fitness Tracker** | Workout / activity days |
| **Reading Tracker** | How much you read each day |
| **Sleep Tracker** | Sleep hours, quality, and day colours |

Open **Wellness Trends** for charts that pull your mood, anxiety, fitness, reading, sleep, stress, and crying data together.

### Reflect, dream, and review

- **Review your day** — rate your day, pick moods and feelings, and leave notes
- **Dreams** — capture dream journal entries
- **Dream reminder** — a gentle startup popup when you have a dream saved

### Books & reading

Built for readers who love a bit of whimsy:

- **To Be Read** — manage your TBR list with a colourful bookshelf
- **Book Tracker** — log finished books with cover images and ratings
- **Read the Rainbow** — a rainbow-themed reading challenge
- **Book-tris** — place book-shaped pieces on a grid (bookish Tetris)
- **Alphabet Challenge** — read your way through the alphabet

### Life planning

- **Calendar** — events, notes, and colour-coded days
- **Goals** — monthly goals with colour tags and completion tracking

### Movies & shows

Track what you watch with cover art strips, ratings, and upcoming release dates — finished and upcoming lists for both **Movies** and **Shows**.

### Make it yours

PetalPages is deeply customisable without touching code:

- **Page backgrounds** — import a custom image for every page (or keep the beautiful defaults)
- **Page text colours** — choose readable text for each page against your backgrounds
- **Sidebar theme** — pick background and text colours for the navigation
- **Startup popup background** — set a separate backdrop for the dream reminder

Every page ships with hand-picked scenic artwork — meadows, oceans, auroras, coral reefs, firefly valleys, and more.

---

## Get started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- Windows with [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

### Install & run

```powershell
cd C:\Olivia\Scripts\Github\PetalPages
npm install
npm run tauri dev
```

If PowerShell cannot find `npm`:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run tauri dev
```

### Build an installer

```powershell
npm run tauri build
```

The Windows installer will be in `src-tauri/target/release/bundle/`.

---

## Cloud sync (optional)

Sign in from the **Account** tab to sync your data across devices. Without an account, everything stays local on your machine.

1. Create a project at the [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password (and Google if you like)
3. Create a **Firestore** database
4. Paste `firebase/firestore.rules` into **Firestore → Rules**
5. Register a web app under **Project Settings → General** and copy the config
6. Copy `.env.example` to `.env` and fill in your values:

```powershell
copy .env.example .env
```

7. Restart the dev server after saving `.env`

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Desktop shell | [Tauri 2](https://tauri.app/) |
| UI | React 19 + TypeScript |
| Bundler | Vite 7 |
| Cloud | Firebase Auth + Firestore |

---

## Project status

PetalPages is under active development. Feedback is welcome — use the in-app feedback button or open an issue on GitHub.

See [PLAN.md](./PLAN.md) for the full roadmap.

---

## License

See repository license details. PetalPages is a personal wellness and journaling project — use it to understand yourself, not as medical advice.
