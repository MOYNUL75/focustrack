# ◈ FocusTrack
**Plan. Execute. Review. Improve.**

A GitHub-ready React/TypeScript productivity dashboard starter using Vite, Tailwind, Lucide React, Recharts, Supabase, SheetJS and Capacitor.

> **Important:** This is a substantial *development version*, not a fully verified production-grade app. See [`docs/FEATURE_STATUS.md`](docs/FEATURE_STATUS.md) for missing functionality and limitations.

## Quick start

```bash
npm install
cp .env.example .env
# Edit .env with your real Supabase URL and public anon/publishable key
npm run dev
```

Apply SQL migrations **in order**, 001 then 002, in Supabase SQL Editor. The second migration adds archived snapshots, related ownership checks, and preserves records during task rescheduling.

```bash
npm test
npm run build
```

## Features currently exposed

- Password login/sign-up through Supabase; account-scoped tables and RLS rules.
- Dashboard task counters, completion progress, current-date view and charts.
- Quick task creation, editing, deletion, priorities, statuses, search and subtasks.
- Manual review and reschedule with reason, deadline, action plan and audit trail.
- Manual daily archiving through `capture_daily_snapshot` on the Daily Review page.
- Basic goals, habits, weekly calendar, Pomodoro timer and Excel workbook import/export.
- GitHub Pages workflow and Capacitor configuration for a shared codebase.

## Repository

```
focustrack/
  .github/workflows/deploy.yml
  docs/{SETUP_CHECKLIST,FEATURE_STATUS}.md
  public/{favicon.svg,manifest.webmanifest}
  src/
    components/{Subtasks,DailyArchive}.tsx
    utils/{analytics,historical}.ts
    ui.tsx, lib.ts, main.tsx, style.css
  supabase/migrations/{001_init,002_hardening_and_daily_snapshots}.sql
  .env.example, .gitignore, .nvmrc
  capacitor.config.ts, package.json, index.html, vite.config.ts, tsconfig.json
```

See [`docs/SETUP_CHECKLIST.md`](docs/SETUP_CHECKLIST.md) for cloud deployment and Android build steps.

## Security and portability

- Supabase is intended to be the primary persistent store. There is **no automatic offline sync** yet.
- Never use a service-role key or database password in frontend code.
- Do not commit `.env` files. For GitHub Pages, add only the public Supabase variables to Actions secrets.
- Capacitor config does not include an Android binary or a generated native Android project.

## Tests

Unit tests are included for the pure calculation modules; database integration and browser/mobile E2E suites remain to be developed. `npm install` timed out during preparation of this ZIP, so a full build is **not verified**.

## Deploy to `github.io` in one upload

See **[GitHub Pages deployment guide](docs/GITHUB_PAGES_DEPLOYMENT.md)**. Upload the ZIP **contents** at the root of the GitHub repo. The included `.github/workflows/deploy.yml` deploys on every push to `main`. GitHub Pages requires Supabase public URL/key repository **variables** and two SQL migrations to support real account data.
