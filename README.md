# FocusTrack

Plan. Execute. Review. Improve.

## Setup

1. Install Node.js 22 and run `npm install`.
2. Create a Supabase project. In SQL Editor run `supabase/migrations/001_init.sql`.
3. Copy `.env.example` to `.env`; fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (public anon/publishable key only).
4. In Supabase Authentication enable Email sign-in and configure your Site URL and allowed redirect URLs.
5. Run `npm run dev`; open the displayed URL.
6. Run `npm run build` for production.

## GitHub Pages

Push to the `main` branch; configure Pages to use **GitHub Actions**. Set repository Actions variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Vite computes the repository base path from `GITHUB_REPOSITORY`. Configure Supabase authentication redirect URLs for the GitHub Pages URL.

## Android

Run `npm install`, `npm run build`, `npx cap add android`, `npx cap sync android`, `npx cap open android`. Build an APK in Android Studio (Build > Build Bundle(s) / APK(s) > Build APK(s)). Install Android SDK and Java as required by Capacitor 7. Android uses the same Supabase instance. The native Android project is generated locally and is not bundled in this repository.

## Features and limitations

Implemented: Supabase email authentication, owner-only RLS, dashboard, quick task creation/edit/delete, statuses, search, basic calendar week view, daily review with atomic rescheduling, basic weekly/monthly charts, goal and habit creation, Pomodoro timer and focus-session saving, Excel export/import preview and basic duplicate checks, responsive navigation and dark mode.

**Not production-complete:** historical analytics are based on current scheduled dates rather than event snapshots; daily review is manually initiated; some advanced features (subtask UI, drag/drop, pagination, advanced filtering, full calendar views, detailed goal progress, notification scheduling, offline sync, persistent user settings, richer Excel reports, comprehensive automated tests) remain to be implemented. Do not treat this scaffold as fully tested or release-ready.

## Security

Never commit `.env` or service-role keys. Supabase RLS protects each user-owned table. Additional production hardening should validate cross-table user ownership in database triggers and constraints.
