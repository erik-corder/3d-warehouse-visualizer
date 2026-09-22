import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';

// 3DW-STORY-001B scope only: main + renderer. No preload/IPC bridge yet -
// the renderer calls the backend directly over fetch(); nothing needs
// main-process capabilities until a later story (e.g. file import).
//
// Dev-mode CORS note (found during manual verification, see
// implementation-summary.md "Scope deviations"): the backend
// (3DW-STORY-001A) has no CORS policy configured, so a direct
// cross-origin fetch from the Vite dev server's origin is blocked by the
// browser. This proxy makes the renderer's health check same-origin
// during `electron-vite dev` only - it does not apply to a packaged
// production build, which still needs a real resolution (backend CORS,
// or an IPC-based main-process proxy) - flagged as an open question, not
// solved here, since both options touch scope outside this story
// (backend code, or the preload/IPC bridge this story explicitly omits).
const apiProxyTarget = process.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
      lib: {
        entry: 'electron/main.ts',
      },
    },
  },
  renderer: {
    root: 'src/renderer',
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: 'src/renderer/index.html',
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [react()],
  },
});
