# Rate My Day — Windows Desktop App Plan

A personal mood logger and daily habit tracker for Windows, inspired by bullet-journal "Year in Pixels" layouts. The app helps you visualize how your days feel over time, build consistent routines, and spot patterns between mood and habits.

**Project path:** `C:\Users\olivi\rate-my-day`

---

## 0. Development Environment (verified)

| Prerequisite | Status |
|---|---|
| Node.js v24 + npm | ✅ Installed |
| Rust 1.96 + Cargo | ✅ Installed |
| MSVC C++ Build Tools | ✅ Installed |
| WebView2 Runtime | ✅ Installed |
| Git | ✅ Installed |
| Rust compile test | ✅ Passed |

**Recommended stack confirmed:** Tauri 2 + React + TypeScript

---

## 1. Vision & Goals

**Primary goal:** Make daily reflection fast enough that you actually do it — one click to rate a day, a few taps to log habits, and instant visual feedback across the year.

**Core principles:**
- **Low friction** — logging a day should take under 10 seconds
- **Visual first** — the Year in Pixels grid is the emotional center of the app
- **Private by default** — all data stored locally on your machine
- **Flexible** — habits and routines can be added, edited, or archived without breaking history
- **Honest tracking** — no gamification pressure; the app is a mirror, not a scoreboard

---

## 2. Target User & Use Cases

| Use case | What the user does |
|---|---|
| End-of-day check-in | Tap today's cell in the grid, pick 1–5 stars |
| Morning routine | Open Habits page, check off items for the day |
| Weekly review | Glance at the grid + habit streak summary |
| Pattern spotting | Filter or overlay habit completion on mood colors |
| Year-end reflection | Scroll the full Year in Pixels for the current year |

---

## 3. App Structure (Pages / Views)

### 3.1 Home — "Rate My Day" (Year in Pixels)

This is the **first page** and matches your reference layout.

```
┌─────────────────────────────────────────────────────────┐
│                    Rate My Day                          │
│                                                         │
│     J  F  M  A  M  J  J  A  S  O  N  D    ┌──────────┐ │
│  1  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■    │ ■ 5 stars│ │
│  2  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■    │ ■ 4 stars│ │
│  ...                                      │ ■ 3 stars│ │
│ 31  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■    │ ■ 2 stars│ │
│                                           │ ■ 1 star │ │
│                                           └──────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Layout details:**
- Title: *Rate My Day* in a handwritten/script font (e.g. Caveat, Pacifico, or similar)
- Grid: **12 columns** (months) × **31 rows** (days)
- Column headers: `J F M A M J J A S O N D`
- Row labels: `1–31` on the left
- Legend (right side): color swatch + star label for each rating

**Color palette (from reference):**

| Rating | Color | Hex (approx.) |
|---|---|---|
| 5 stars | Teal / light blue | `#5BBFB5` |
| 4 stars | Purple / lavender | `#9B8EC4` |
| 3 stars | Pink / magenta | `#E878A0` |
| 2 stars | Orange | `#F5A623` |
| 1 star | Yellow | `#F5D76E` |
| No entry | White / empty | `#FFFFFF` |
| Invalid day | Disabled / greyed | `#E8E8E8` |

**Interactions:**
- **Click a cell** → popover or small palette to pick 1–5 stars (or clear)
- **Hover** → tooltip showing full date (e.g. "March 15, 2026") and current rating
- **Click today** → optionally jump to Habits page for same-day logging
- **Invalid cells** (e.g. Feb 30) are non-interactive and visually muted

**Edge cases:**
- Months with fewer than 31 days: bottom rows for that column are disabled
- Leap year: Feb 29 is interactive in leap years only
- Future dates: optionally allow pre-rating or lock until the day arrives (user setting)

---

### 3.2 Anxiety Tracker

A second **Year in Pixels** page matching the bullet-journal anxiety layout — separate from mood ratings so you can track both independently.

**Layout:** Same 12×31 grid with month letters and day numbers. Title: *Anxiety Tracker* in script font.

**Color palette:**

| Level | Color | Hex |
|---|---|---|
| None | Yellow | `#F5D76E` |
| Low | Orange | `#F5A623` |
| Medium | Pink | `#E878A0` |
| High | Purple | `#9B8EC4` |
| Severe | Teal | `#5BBFB5` |

**Interactions:**
- Click a cell → pick None / Low / Medium / High / Severe (or clear)
- Hover → tooltip with date and current level
- Same invalid-day and future-date rules as Rate My Day
- Data stored separately from mood ratings

---

### 3.3 Routines (Phase 3)

Grouped habit templates for morning/evening/custom blocks.

**Features:**
- Named routines (e.g. "Morning", "Wind Down")
- Ordered list of habits within a routine
- One-tap "Complete routine" or step through items
- Time-of-day reminder (optional, Phase 2)

---

### 3.4 Day Detail

Drill-down view when clicking a filled grid cell or "Today" shortcut.

**Shows:**
- Date and star rating (editable)
- Habits completed that day
- Free-text journal note (optional)
- Tags (e.g. "sick", "travel", "social")

---

### 3.5 Insights (Phase 2+)

Analytics derived from stored data.

**Examples:**
- Average mood by month
- Habit completion rate vs. mood (correlation hints, not medical claims)
- Best/worst streaks
- Monthly summary export

---

### 3.6 Settings

- Current year selector (default: current calendar year)
- Theme: light / dark / system
- Font size for grid
- Reminder notifications (Phase 2)
- Export / import data (JSON)
- Data folder location

---

## 4. Navigation

Simple sidebar or top tab bar:

```
[ Rate My Day ]  [ Anxiety Tracker ]  [ Settings ]
```

- **Rate My Day** is the default landing page
- Keyboard shortcuts: `1–5` to rate selected cell, `T` for today

---

## 5. Data Model

All data stored locally in a single SQLite database (or JSON files for v1 simplicity).

### Tables / entities

```
YearEntry
  id
  date          (YYYY-MM-DD, unique)
  rating        (1–5 or null)
  note          (optional text)
  tags          (optional JSON array)
  created_at
  updated_at

Habit
  id
  name
  color
  icon
  frequency     (daily | weekdays | custom)
  custom_days   (JSON, e.g. [1,3,5] for Mon/Wed/Fri)
  sort_order
  archived      (boolean)
  created_at

HabitLog
  id
  habit_id
  date          (YYYY-MM-DD)
  completed     (boolean)
  note          (optional)

Routine
  id
  name
  sort_order
  time_of_day   (morning | evening | custom)

RoutineHabit
  routine_id
  habit_id
  sort_order

Settings
  key
  value         (JSON)
```

### File location (Windows)

```
%APPDATA%\RateMyDay\
  data.db          (or data.json)
  exports\
```

---

## 6. Technical Architecture

### Recommended stack: **Tauri 2 + React + TypeScript**

| Layer | Choice | Why |
|---|---|---|
| UI | React + TypeScript | Rich grid UI, easy styling, component reuse |
| Desktop shell | Tauri 2 | Native Windows app, small binary (~5–10 MB), low RAM |
| Styling | Tailwind CSS or CSS Modules | Match bullet-journal aesthetic precisely |
| State | Zustand or React Context | Simple local state for grid + habits |
| Persistence | SQLite via `tauri-plugin-sql` or `better-sqlite3` in Rust sidecar | Reliable, queryable, single file |
| Fonts | Google Font "Caveat" for title | Matches handwritten journal look |

**Alternatives if tooling is limited:**

| Stack | Pros | Cons |
|---|---|---|
| **.NET WinUI 3 / WPF** | True native Windows, no Node required | More boilerplate for grid UI |
| **Python + CustomTkinter** | Fast to prototype | Less polished native feel |
| **Electron + React** | Familiar web stack | Heavy (~150 MB), needs Node.js |

**Recommendation:** Tauri 2 if Node.js + Rust toolchain can be installed; otherwise **.NET 8 + WinUI 3** for a fully native Windows path without Node.

---

## 7. Key Components (Frontend)

```
App
├── Layout (sidebar + main content)
├── RateMyDayPage
│   ├── YearGrid
│   │   ├── GridHeader (month letters)
│   │   ├── GridRow × 31 (day label + 12 cells)
│   │   └── GridCell (click, hover, disabled logic)
│   ├── Legend (5 color swatches)
│   └── RatingPicker (popover on cell click)
├── HabitsPage
│   ├── HabitList
│   ├── HabitItem (toggle + streak)
│   └── AddHabitModal
├── RoutinesPage
├── DayDetailPanel
├── InsightsPage (Phase 2)
└── SettingsPage
```

### Grid cell logic (pseudocode)

```
for each month (0–11):
  for each day (1–31):
    if day > daysInMonth(year, month):
      cell = DISABLED
    else if date > today && !allowFuture:
      cell = LOCKED
    else:
      cell = INTERACTIVE
      color = RATING_COLORS[entry.rating] ?? EMPTY
```

---

## 8. Visual Design Spec

| Element | Spec |
|---|---|
| Background | Off-white `#FAFAF8` (paper feel) |
| Grid lines | Thin `#333` borders, 1px |
| Cell size | ~18–22 px square (responsive scaling) |
| Title font | Caveat or Pacifico, ~36–48 px |
| Body font | Inter or system UI, 14 px |
| Spacing | Legend 24 px right of grid |
| Window min size | 900 × 600 px |
| Window default | 1100 × 750 px |

**Dark mode (Phase 1.5):** invert background to `#1A1A1A`, keep rating colors vivid, grid lines `#444`.

---

## 9. Implementation Phases

### Phase 1 — MVP (core loop)

- [x] Project scaffold (Tauri 2 + React + TypeScript)
- [x] Rate My Day grid with correct month/day logic
- [x] Click cell → rate 1–5 → color cell
- [x] Legend panel
- [x] Persist ratings to local storage
- [x] Year selector (current year)
- [x] Settings: allow-future toggle
- [ ] Basic settings: data path, theme (deferred to Phase 1.5)

**Exit criteria:** You can open the app, rate any past day this year, close and reopen — data persists. ✅ Met

---

### Phase 2 — Anxiety tracker & day detail

- [x] Anxiety Tracker page (Year in Pixels grid)
- [x] Click cell → log None/Low/Medium/High/Severe → color cell
- [x] Separate persistence from mood ratings
- [ ] Day detail panel (mood + anxiety + note for a single day)
- [ ] "Today" shortcut from grid

**Exit criteria:** Full daily workflow — rate day + log anxiety in under 30 seconds.

---

### Phase 3 — Routines & polish

- [ ] Routines (group habits)
- [ ] Export / import JSON backup
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] System tray icon + "Rate today" quick action

---

### Phase 4 — Insights & reminders

- [ ] Monthly mood averages
- [ ] Habit vs. mood charts
- [ ] Windows toast reminders (optional)
- [ ] PDF / image export of Year in Pixels

---

## 10. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Startup time | < 2 seconds |
| Memory | < 100 MB (Tauri) / < 200 MB (Electron) |
| Offline | 100% — no network required |
| Privacy | No telemetry by default; opt-in only if ever added |
| Backup | Manual export; optional auto-backup to user-chosen folder |
| Accessibility | Keyboard navigation, sufficient color contrast, screen reader labels on cells |

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Node/Rust not installed | Document .NET fallback path; provide setup script |
| Grid performance with many years | Load one year at a time; lazy-load history |
| Data loss | Auto-save on every change; export reminder in Settings |
| Leap year / timezone bugs | Store dates as `YYYY-MM-DD` strings, no timestamps for day keys |
| Scope creep | Ship Phase 1 before habits; grid is the hero feature |

---

## 12. Project Structure (proposed)

```
rate-my-day/
├── PLAN.md                 ← this file
├── README.md
├── src/                    (frontend)
│   ├── components/
│   │   ├── YearGrid/
│   │   ├── Legend/
│   │   └── RatingPicker/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   └── utils/
│       └── dateUtils.ts    (daysInMonth, isValidDay, etc.)
├── src-tauri/              (if Tauri)
│   ├── src/
│   └── tauri.conf.json
├── package.json
└── .gitignore
```

---

## 13. Open Questions (decide before build)

1. **Tech stack:** Tauri (lighter, needs Node + Rust) vs. .NET WinUI (native, no Node)?
2. **Future dates:** Allow rating ahead of time, or lock until the day passes?
3. **Multi-year:** Single year view only at first, or year picker from day one?
4. **Journal notes:** Inline on grid click, or only on Day Detail page?
5. **Reminders:** Wanted in v1 or defer to Phase 4?

---

## 14. Success Metrics (personal)

You'll know the app works when:

- You open it most evenings for 2+ weeks straight
- The Year in Pixels grid shows a meaningful color pattern by month-end
- Habit streaks reflect real behavior, not wishful logging
- You can answer "Was March better than February?" in one glance

---

## 15. Next Step

All prerequisites are installed. Phase 1 can be built in a single focused session:

1. Scaffold Tauri 2 + React + TypeScript project
2. Build the Year in Pixels grid (12 months × 31 days)
3. Add click-to-rate with the 5-color legend
4. Persist ratings locally (SQLite or JSON)

The reference layout maps directly to the first screen with no ambiguity.
