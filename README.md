# Rate My Day

A Windows desktop mood logger with a bullet-journal **Year in Pixels** layout.

## Phase 1

- **Rate My Day** — Year in Pixels mood grid (1–5 stars)
- Year selector, future-date toggle, local persistence

## Phase 2 (current)

- **Anxiety Tracker** — second Year in Pixels page (None → Severe)
- **Account sign-in** — Firebase Authentication + Firestore cloud sync
- Works offline locally; syncs when signed in

## Cloud setup (one-time)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication → Sign-in method → Email/Password** and **Google**
3. Create a **Firestore Database** (start in production mode)
4. In **Firestore → Rules**, paste the contents of `firebase/firestore.rules`
5. In **Project Settings → General → Your apps**, register a web app and copy the config
6. Copy `.env.example` to `.env` and paste your Firebase values:

```powershell
copy .env.example .env
```

7. Restart the dev server after adding `.env`

## Run in development

```powershell
cd C:\Users\olivi\rate-my-day
npm install
npm run tauri dev
```

If PowerShell blocks `npm`, use:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run tauri dev
```

## Build for production

```powershell
npm run tauri build
```

The installer will be in `src-tauri/target/release/bundle/`.

## Stack

- Tauri 2
- React + TypeScript
- Vite
- Firebase (Auth + Firestore)

See [PLAN.md](./PLAN.md) for the full roadmap.
