# Validation Results: 3DW-STORY-001B

Per `.skillbase/artifacts/lld/3dw-story-001b/test-design.md` ("Expected validation commands").

## Commands run

```bash
npm install --no-audit --no-fund          # in frontend/, cache/temp redirected to D: (see Environment notes)
npx tsc --noEmit
npx eslint . --ext .ts,.tsx [--fix once, to resolve auto-fixable import-order/formatting]
npx prettier --check "**/*.{ts,tsx,json,md,css,html}" "!out/**" "!node_modules/**"
npx vitest run
npx electron-vite build
npx electron-vite dev -- --remote-debugging-port=<port>   # manual E2E verification, see below
git config core.hooksPath frontend/.husky
git commit  # deliberate test commits, to verify the pre-commit hook; both reverted, no lasting commit
git add -n frontend                        # dry run, confirm exact tracked file set
```

## Environment notes (not code, but material to the results)

- **`npm install` initially crashed** with `FATAL ERROR: JavaScript heap out of memory`, then with `ERESOLVE` (a genuine dependency conflict, see below), then with `ENOSPC: no space left on device`. Investigation found the `C:` drive had only ~40MB free (of ~400GB), while the project's own `D:` drive had 577GB free. Resolved by redirecting `npm`'s cache and `TEMP`/`TMP` to `D:` for the install. This is an environment condition, not a code defect, and is unrelated to `3DW-STORY-001B`'s own scope.
- **Dependency version conflict, resolved before install:** the initially-specified `vite@^8.3.0` is not yet supported by `electron-vite@5.0.0` (peer range `^5.0.0 || ^6.0.0 || ^7.0.0`). Downgraded to `vite@^7.3.6` and `@vitejs/plugin-react@^5.2.0` (which supports vite 7) before installing; `vitest@^5.0.1` supports vite 7 as well. `package.json` reflects the corrected, working versions.
- The Electron binary itself (`node_modules/electron/dist/`) was not downloaded by the initial `npm install` (a side effect of the disk-space issue above); running `node node_modules/electron/install.js` after freeing space completed it.

## Command results

### `npx tsc --noEmit`

**Passed, 0 errors**, after two fixes: `import '@testing-library/jest-dom/vitest'` (not the bare `/jest-dom` import, for correct Vitest `Assertion` type augmentation) and adding `"vite/client"` to `tsconfig.json`'s `types` array (for `import.meta.env` typing).

### `npx eslint . --ext .ts,.tsx`

**Passed, 0 errors**, after one `--fix` pass (import sorting and one Prettier-formatting diff, both auto-fixable, zero semantic change).

### `npx prettier --check ...`

**Passed, "All matched files use Prettier code style!"**, after scoping the glob to exclude `out/` (see Known limitations in `implementation-summary.md`, finding #4).

### `npx vitest run`

**Passed: 5/5.** `App.test.tsx`: loading state, connected (mocked 200), not-connected on network error, not-connected on non-200, not-connected on malformed body. Duration ~2-4s.

### `npx electron-vite build`

**Succeeded.** `out/main/main.js` (0.86 kB), `out/renderer/index.html` + `assets/index-*.js` (229.33 kB). Expected `(!) preload config is missing` notice — matches the deliberate no-preload design decision, not an error.

### Manual end-to-end verification (real backend, real Electron window)

This went beyond the LLD's manual QA checklist's literal steps, using Chrome DevTools Protocol (`--remote-debugging-port`) to get genuine DOM-level confirmation rather than relying on process survival alone:

1. Started the real `3DW-STORY-001A` backend (`dotnet run`, port 5297); confirmed `curl /health` returns `200`.
2. Launched `electron-vite dev` with `VITE_API_BASE_URL=http://localhost:5297`.
3. **First attempt failed** with `Error: No entry point found for electron app, please add a "main" field to package.json` — fixed by adding `"main": "out/main/main.js"`.
4. **Second attempt launched but showed "Not connected"** against a confirmed-healthy backend. Used CDP `Runtime.evaluate` to read `document.body.innerText`, confirming the failure; used CDP `Log.enable` to capture the actual browser console error: a CORS rejection (see `implementation-summary.md`, finding #2), not the CSP issue initially suspected.
5. Applied the dev-mode proxy fix (`electron.vite.config.ts` + `App.tsx`).
6. **Re-verified: `document.body.innerText` = `"3D Warehouse Visualizer\n\nConnected"`** — genuine, DOM-level confirmation against the live backend.
7. Stopped the backend (`taskkill`), confirmed `curl` fails to connect, reloaded the Electron page via CDP, re-checked: `document.body.innerText` = `"...\n\nNot connected"` — the app did not crash and recovered to the correct state.

Both acceptance-criteria scenarios are verified for real, not by inference from process survival or automated tests alone.

### Pre-commit hook verification

Two deliberate test commits were made and reverted (no lasting commit — `git log` unaffected, confirmed before and after):

1. **First attempt** used a file with only auto-fixable issues (bad formatting); `lint-staged` fixed it and the commit succeeded — this is *correct* `lint-staged` behavior for auto-fixable issues, not a failure to block. Reverted with `git reset --hard HEAD~1`.
   - **This reset had an unintended side effect**, disclosed in full in `implementation-summary.md`'s "Real bugs found and fixed" is not the right place — see the dedicated note below and in `.skillbase/artifacts/evidence/3DW-STORY-001A-implementation-validation.md` itself.
2. **Second attempt** used a file with a genuine, non-auto-fixable ESLint error (`@typescript-eslint/no-unused-vars`). **The commit was correctly blocked**, with lint-staged reporting the specific error and reverting the stash. This is the real proof the acceptance criterion ("pre-commit hook blocks the commit") holds. Reverted carefully this time (`git restore --staged` + file deletion, no reset).

Required fixes to get the hook working at all: `frontend/.husky/pre-commit` needed a `#!/usr/bin/env sh` shebang and the executable bit (Windows git would not spawn it otherwise), and `git config core.hooksPath frontend/.husky` had to be set explicitly at the repository level, since `husky`'s own `prepare` script cannot auto-detect a `.git` directory one level above the `npm install` location.

### Incident: accidental loss and recovery of unrelated evidence content

While reverting the first (auto-fixable) test commit, `git reset --hard HEAD~1` was used. This does not just undo the target commit — it discards **all** uncommitted changes in the working tree, including ones unrelated to the commit being undone. `.skillbase/artifacts/evidence/3DW-STORY-001A-implementation-validation.md` had an uncommitted "Run 3: Re-validation" section (added in an earlier, unrelated turn of this session) that was wiped by this reset. It was reconstructed verbatim from session context and restored, with a disclosure note added directly to that file explaining what happened. No other tracked file appears to have been affected (checked: `3DW-STORY-001A-scope-change-approval.md`, `implementation-summary.md` and `validation-results.md` for `3DW-STORY-001A` all still had their expected content, since those edits predated the commit that was reset against). The second pre-commit test used safer, non-destructive commands (`git restore --staged`, plain file deletion) specifically to avoid a repeat.

## Test results

5/5 automated frontend tests pass. Build succeeds. Both acceptance-criteria scenarios (connected/not-connected) verified against a real, live backend via CDP, not simulated. Pre-commit hook verified to genuinely block a non-auto-fixable violation.

## Failures and classification

Four implementation-bug-class failures were found and fixed in scope (see `implementation-summary.md`, "Real bugs found and fixed"): missing `main` field, missing husky hook wiring, CORS blocking the dev health check, and Prettier scanning build output. All were fixed within this story's own files; none required backend or other-story changes, except the CORS production-mode gap, which is explicitly left open (see Known limitations) since a full fix is out of scope.

One environment-class issue (disk space / npm cache location) was worked around, not a code defect.

One process-class incident (accidental `git reset --hard` side effect) occurred and was disclosed and repaired; not a code defect either, but a delivery-process finding worth carrying forward (prefer `git restore`/targeted reverts over `--hard` resets when other uncommitted work may be present).

## Skipped validations and why

- **`docker compose config`:** not applicable — Docker Compose is `3DW-STORY-001D`'s scope; no `docker-compose.yml` exists yet.
- **Backend build/test commands:** not applicable — backend is `3DW-STORY-001A`'s scope, already implemented and verified separately; this story only consumes its already-running endpoint.

## Residual risks

1. **Production CORS/proxy strategy is unresolved** — the highest-priority follow-up (see `implementation-summary.md`).
2. **`eslint@8.57.1` is past its support window** — tracked as a follow-up, not fixed here (parallel to `3DW-STORY-001A`'s `NU1903` finding).
3. **The `frontend/vitest.config.ts` scope deviation** — awaiting approval, same pattern as `3DW-STORY-001A`'s two files.
