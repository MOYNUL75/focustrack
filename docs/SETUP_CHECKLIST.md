# Setup checklist

## Prerequisites
- Node.js 22+, npm
- Supabase project (URL and publishable/anon key; **never** service_role)
- GitHub repository for Pages
- Android Studio/JDK/Android SDK for an APK

## Web setup
1. Extract this ZIP and open `focustrack` in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and enter public Supabase project values.
4. In Supabase SQL Editor, apply `supabase/migrations/001_init.sql`, then `002_hardening_and_daily_snapshots.sql` (once each, in order).
5. In Supabase Authentication, configure email sign-in, email confirmation and the site/redirect URLs.
6. Run `npm run dev`; open the Vite URL. Create a user and test create, reschedule, archive, Excel export.
7. Run `npm test` and `npm run build`. Fix any errors before deploying.

## GitHub Pages
- Set GitHub Actions secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (public key, not service_role).
- Enable Pages: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
- Push to `main`; workflow configures base as `/<repository>/`.
- The workflow deploys source; it does not create a Supabase project for you.

## Android
1. `npm run build`
2. `npx cap add android` (once) and `npx cap sync android`.
3. `npx cap open android`; build an APK using Android Studio.
4. Configure Android app icons, permissions and notifications separately.
5. Native APK and background/offline behavior are not validated in this ZIP.

## Essential manual tests
- Two distinct users cannot query each other's records.
- Task ID/original date are preserved by rescheduling.
- Completed/cancelled tasks cannot be rescheduled.
- A cancelled task is excluded from completion denominator.
- Excel duplicate and malformed rows are inspected.
- Responsive pages load on mobile; verify dark theme, loading and error states.
