import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Not itemized in file-impact-map.md — see implementation-summary.md
// ("Scope deviations"). electron-vite's build config format is not a
// standard Vite config vitest can read directly, so a small dedicated
// test config is required for `vitest run` to resolve JSX/TSX and run in
// a DOM environment. Zero business logic.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/renderer/**/*.test.tsx'],
  },
});
