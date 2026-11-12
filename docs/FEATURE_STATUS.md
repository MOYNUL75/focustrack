# FocusTrack — current implementation status

Last updated: 2026-11-12. This repository contains a working-oriented source implementation, **not a fully tested production release**. The GitHub Pages build, Supabase integration, and Android APK have not been validated against a real user project.

| Feature | Status / limitation |
|---|---|
| React, TypeScript, Vite, Tailwind, Lucide, Recharts | Included source |
| Supabase password auth, PostgreSQL, RLS | Included; needs project and integration testing |
| Task create/edit/delete, priorities/status | Basic UI implemented |
| Subtasks | Added standalone subtask component on task cards |
| Rescheduling with original ID and audit history | SQL RPC included; use migration 002 |
| Daily reviews | Manual, with reason/explanation/plan; not an automatic prompt |
| Historical daily snapshots | New manual capture feature, and preservation on rescheduling; not automatically closed each midnight |
| Dashboard and daily/weekly/monthly charts | Available, but weekly/monthly charts still use CURRENT task state, not archived snapshots |
| Calendar | Week view; not full day/week/month interactive navigation |
| Goals and habits | Basic creation and habit logging |
| Focus timer | Basic presets and logging; no custom lengths or background continuity |
| Excel | Multi-sheet export + first-sheet task import preview, rudimentary validation |
| GitHub Pages | Workflow included; environment secrets must be configured |
| Capacitor | Configuration included, Android native project/APK not pre-generated |
| Offline task sync / notifications | Not implemented |
| Drag/drop, fully advanced filters/pagination | Not implemented |
| Build/tests | Installation timed out in this environment; syntax-only check performed, no successful integration build claimed |

## Notes on history and metrics

The `daily_task_snapshots` table is a **manual archive mechanism**, not a complete event-sourced ledger. Snapshot a day in Daily Review after finishing it. Rescheduling captures the old day as rescheduled (unless a snapshot is already present). Archived results are *not yet wired into weekly/monthly charts*. To develop auditable historical analytics, migrate the reporting layer onto immutable outcomes and test task state transitions across dates and timezones.

## Important caveats

- Existing migration 001 must execute before 002. Migration 002 is intended for fresh projects or an existing 001 database, not to be rerun blindly.
- Never put a Supabase service-role key in a frontend .env file or GitHub Pages secret exposed to Vite.
- Application UI and SQL need testing against real Supabase accounts to verify authorization boundaries.
- Excel backups are not a substitute for managed database backups.
