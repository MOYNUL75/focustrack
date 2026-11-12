import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In CI, GITHUB_REPOSITORY is "owner/repo". For owner.github.io use root base.
// For a normal project, serve all assets under /repo/.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserSite = repo.toLowerCase().endsWith('.github.io');
const base = process.env.VITE_BASE_PATH || (repo && !isUserSite ? `/${repo}/` : '/');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  test: { environment: 'node' },
});
