# Publish FocusTrack on GitHub Pages (step-by-step)

## 1. Make a repository
Create a **public** GitHub repository called `focustrack` (or any name). Set `main` as its default branch.

**Important:** Upload the *contents* of this ZIP directly to the repository's root. You should see `package.json`, `index.html`, `src/`, `.github/`, `supabase/` at the top level. Do **not** upload a single outer `focustrack/` directory. GitHub web upload may hide dotfiles in your operating system; verify `.github/workflows/deploy.yml` is uploaded. GitHub's web uploader does not always preserve empty folders; that's okay.

## 2. Configure Supabase
Create a Supabase project and run the SQL files `001_init.sql`, then `002_hardening_and_daily_snapshots.sql` in its SQL Editor, *once each, in order*.

Get the Project URL and public **anon / publishable** key from your Supabase project settings. Do **not** use the service_role key (it bypasses RLS). This frontend is public and client-side: the URL/public key are visible in the published JavaScript. Database security depends on correct RLS.

In the GitHub repo: **Settings → Secrets and variables → Actions → Variables → New repository variable**:
- `VITE_SUPABASE_URL` = your Supabase Project URL (`https://...supabase.co`)
- `VITE_SUPABASE_ANON_KEY` = your *public anon key* (not a service key)

For email-based login confirmation, in Supabase: **Authentication → URL Configuration** set Site URL to the deployed GitHub Pages address and add the same address to Redirect URLs. You can add a wildcard for your repository path if needed.

## 3. Turn on Pages
GitHub repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Go to **Actions → Deploy FocusTrack to GitHub Pages** and use **Run workflow** (or push to `main`). The workflow installs dependencies, tests, compiles and deploys the `dist` output automatically. Wait for the green deployment check, then open the Pages URL shown in the environment or Settings → Pages. The project may fail to deploy if GitHub Actions is disabled or your organization disallows Pages.

## 4. Open the URL
- Repository `focustrack` under `yourname`: `https://yourname.github.io/focustrack/`
- Repository named exactly `yourname.github.io`: `https://yourname.github.io/`

The Vite config automatically switches between project and user-site asset paths, including case-sensitive repo names. Never commit `dist/` to the source repository; the workflow builds it.

## 5. Troubleshooting
- **404 or unstyled blank page**: ensure `package.json` is at the repo root, the deployment workflow succeeded, Source = GitHub Actions, and you're opening the correct project path.
- **App appears but login fails**: check GitHub repository variables, Supabase URL/key, Auth URL Configuration, and database migrations. Re-run the workflow after changing variables.
- **Dependency installation fails**: review the Actions log; this ZIP has no `package-lock.json` because the package registry was unavailable during packaging. Commit a generated lockfile (`npm install`) later for reproducibility.
- **GitHub repo upload misses `.github`**: upload this hidden directory and its workflow YAML files using Git or GitHub's Add file interface.
- **Changes not showing**: refresh the deployed page after Actions has completed successfully.

The GitHub Pages website hosts only the **static frontend**. Tasks and accounts live in Supabase. This is a development-stage application; deployment does not certify business logic, full integrations, offline functionality, or the Android APK.
