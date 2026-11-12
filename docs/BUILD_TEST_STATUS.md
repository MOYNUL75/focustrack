# FocusTrack verification — 12 November 2026

## Checks completed in this environment

- TypeScript/TSX transpilation syntax diagnostics: **12 files checked, 0 syntax errors**.
- Pure-function smoke tests: **8 passed / 8 run**. Tests cover cancellation exclusions, empty-day completion, time-efficiency separation, rescheduling percentage, category completion, daily snapshots and snapshot-series generation.
- ZIP file packaging is verified separately.

## Checks **not** completed

- `npm install` timed out (no installed `node_modules`), so `npm run build` and `npm test` using Vitest **could not be executed** here.
- Supabase integration tests require a configured test Supabase instance, database migrations, and test users. None were available; authentication, RLS isolation, CRUD/rescheduling RPC behavior and migration execution have **not** been integration-tested.
- Browser UI and Android APK builds have **not** been verified.

## Run checks locally or in CI

```bash
npm install --no-audit --no-fund
npm test
npm run build
```

A GitHub Actions `verify.yml` workflow runs these commands on pushes and pull requests. `deploy.yml` runs unit tests and build before GitHub Pages deployment. Workflow success cannot be claimed until it actually executes in your repository.

## Real Supabase integration checks still needed

1. Create isolated test Supabase environment and run `001_init.sql` then `002_hardening_and_daily_snapshots.sql`.
2. Create two separate test users. Check each cannot read or update the other's tasks, goals, habits, histories and daily snapshots.
3. Create, edit, complete, cancel, reschedule and delete tasks; verify returned errors and persisted database records.
4. Reschedule the same task twice; ensure no duplicates, original dates unchanged, and history count matches.
5. Archive a day, reschedule tasks, verify the historical daily completion does not change.
6. Import and export workbook data; validate duplicate detection and malformed input handling.

**This is still a partial application, not a fully tested production release.**
