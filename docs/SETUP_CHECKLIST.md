# Installation and deployment checklist

## Web development

- [ ] Install Node.js 22+.
- [ ] From the `focustrack` directory, run `npm install`.
- [ ] Create a Supabase project; run `supabase/migrations/001_init.sql` in SQL editor.
- [ ] Copy `.env.example` to `.env` and set public URL and anon/publishable key.
- [ ] Configure Supabase Auth redirect origins and email login.
- [ ] Run `npm run dev`, then test register/sign-in, CRUD and rescheduling.
- [ ] Run `npm test` and `npm run build`.

## GitHub Pages

- [ ] Create a GitHub repo and push the entire `focustrack` folder as repository root.
- [ ] Add repository **Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- [ ] Set Pages build/deployment source to GitHub Actions.
- [ ] Verify repo base-path and Supabase redirect allow-list.

## Android

- [ ] Install Android Studio, SDK and compatible JDK.
- [ ] Run `npm run build && npx cap add android && npx cap sync android`.
- [ ] Open with `npx cap open android` and build an APK in Android Studio.
- [ ] Configure Android native permissions/features separately (notifications are not implemented).

## Important

No service-role key belongs in frontend variables. Keep `.env` untracked. The native `android/` folder is generated after the Capacitor platform command and is not included in this archive.
