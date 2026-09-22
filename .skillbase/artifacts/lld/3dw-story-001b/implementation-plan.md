# Implementation Plan: 3DW-STORY-001B

Companion to `low-level-design.md` and `file-impact-map.md`. **Planning only — no code is created by this document.** Single PR (11 files, M) — no split needed.

## Implementation steps

1. Scaffold `frontend/` (Electron + React + TypeScript, `electron-vite` — confirm bundler choice first, see Open Questions).
2. Configure `electron/main.ts`: `BrowserWindow` with `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
3. Build `src/renderer/App.tsx` with loading/connected/not-connected states, calling `GET /health` (API base URL from configuration, not hardcoded — see Open Questions).
4. Add ESLint (`.eslintrc.cjs`), Prettier (`.prettierrc`), per the rule set in `low-level-design.md`.
5. Add Husky + lint-staged (`.husky/pre-commit`).
6. Add `App.test.tsx` (five cases: loading, connected, network error, non-200, malformed body).
7. Manual verification against the running `3DW-STORY-001A` backend.

## Recommended order

As listed — the app shell (steps 1-3) before tooling (steps 4-5), since tooling should lint/format what already exists rather than an empty scaffold; tests (step 6) after the component they test; manual verification (step 7) last, once `npm run lint`/`test` both pass.

## Checkpoints

- After step 3: app runs (`npm run dev` or equivalent) and shows loading -> connected/not-connected against a manually-started backend.
- After step 5: `npm run lint`/`format:check` pass; a deliberately malformed commit is blocked.
- After step 6: `npm run test` passes all five cases.
- After step 7: real end-to-end check against `3DW-STORY-001A`'s live backend confirmed.

## Validation commands expected later

See `test-design.md` ("Expected validation commands for later implementation").

## Definition of done

- `npm run test` passes (all five `App.test.tsx` cases).
- `npm run lint`/`format:check` pass.
- Pre-commit hook confirmed to block a malformed commit.
- Manual check against the real `3DW-STORY-001A` backend confirms "Connected"; stopping the backend confirms "Not connected."
- No secrets committed.

## Evidence to capture during implementation

- `npm run test`/`lint`/`format:check` output.
- A screenshot or terminal capture of the Electron app showing "Connected" against the real backend.
- Confirmation the pre-commit hook blocks a deliberately malformed commit (dry run).

## PR description outline

```text
## What
Frontend Electron/React/TypeScript skeleton with ESLint/Prettier/Husky tooling,
calling the already-implemented GET /health endpoint (3DW-STORY-001A).

## Why
3DW-STORY-001B (child of 3DW-STORY-001). See .skillbase/artifacts/lld/3dw-story-001b/.

## How to verify
[Exact commands from test-design.md]

## Out of scope
Design system (3DW-STORY-001C), Docker Compose (3DW-STORY-001D), backend (3DW-STORY-001A, already merged/implemented).
```
