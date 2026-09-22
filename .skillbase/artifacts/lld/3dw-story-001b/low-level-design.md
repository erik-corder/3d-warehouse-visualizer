# Low-Level Design: 3DW-STORY-001B

**Draft LLD evidence, not an implementation. Human approval is still required before implementation planning or coding.**

## Story ID / Title / Type / Parent

`3DW-STORY-001B` — Frontend Electron/React/TypeScript skeleton and tooling — **foundation-enabler** — child of `3DW-STORY-001` (split approved: `.skillbase/artifacts/evidence/3DW-STORY-001-split-human-approval.md`).

## Source acceptance criteria

```text
Given the Electron app is launched against a running backend
When it calls the health endpoint
Then it displays a "connected" status

Given the backend is unreachable
When the Electron app attempts to call the health endpoint
Then it displays a "not connected" status without crashing

Given a staged file violates the configured lint/format rules
When a commit is attempted
Then the pre-commit hook blocks the commit
```
(from `.skillbase/artifacts/stories/child-story-outlines.md`)

## Summary

A minimal Electron + React + TypeScript app shell, with ESLint, Prettier and a pre-commit hook configured, calling the `GET /health` endpoint that `3DW-STORY-001A` already implements and has verified working (`200 {"status":"ok"}`). Frontend only, per this story's explicit scope.

## Scope

Electron main process + React/TypeScript renderer (`electron-vite`); `App.tsx` with loading/connected/not-connected states calling `GET /health`; ESLint (`.eslintrc.cjs`); Prettier (`.prettierrc`); Husky + lint-staged pre-commit hook; `App.test.tsx`.

## Out of scope

**Explicitly excluded by this story's own scope statement:** design system (`3DW-STORY-001C` — this story renders ad hoc status text, replaced later), Docker Compose (`3DW-STORY-001D`), any backend code (`3DW-STORY-001A`, already implemented separately).

## Assumptions

- Electron bundler: `electron-vite` — carried from the parent LLD, still not independently confirmed by any discovery/architecture source (open question below).
- API base URL: read from build-time/runtime configuration (e.g. `import.meta.env.VITE_API_BASE_URL`), not hardcoded to a specific port in source — Twelve-Factor, and avoids baking in a value that `3DW-STORY-001D`'s Compose networking may need to differ from local `dotnet run` defaults. A sensible local-dev default is used when the variable is unset. Exact convention is an open question, flagged below.
- `3DW-STORY-001A`'s contract (`GET /health` -> `200 { "status": "ok" }`) is already implemented and verified (`.skillbase/artifacts/evidence/3DW-STORY-001A-implementation-validation.md`, `PASS_IMPLEMENTATION`), so this story can be manually verified against a real backend, not only a mock.

## Dependencies

Depends on the `GET /health` contract from `3DW-STORY-001A` — already satisfied (implemented and passing). No dependency on `3DW-STORY-001C` or `3DW-STORY-001D`.

## Affected architecture areas

`high-level-design.md` (Frontend architecture); TypeScript coding guideline (Confluence IAPD/373751928) and Linters & Code Formatters (Confluence TD/102924295), both applied per `.skillbase/artifacts/standards/engineering-standards-sources.md`, with the Next.js-specific content from the frontend-architecture source page excluded, per that source's own instruction (unchanged rationale from the parent LLD).

## Proposed design

```text
frontend/
  package.json
  tsconfig.json
  electron.vite.config.ts
  electron/main.ts            (Electron main process, contextIsolation: true)
  src/renderer/
    index.html
    main.tsx
    App.tsx                   (loading / connected / not-connected states)
    App.test.tsx
  .eslintrc.cjs
  .prettierrc
  .husky/pre-commit
```

No design-system directory yet (`3DW-STORY-001C`'s scope) — `App.tsx` renders its own minimal status markup for this story, to be replaced when `001C` lands.

## Backend design

Not applicable — explicitly out of scope (`3DW-STORY-001A`, already implemented).

## Frontend design

- **Electron main process** (`electron/main.ts`): creates the `BrowserWindow` with `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` — secure defaults from the start, even though nothing sensitive is exposed yet. No preload/IPC bridge (unchanged rationale from the parent LLD: nothing needs main-process capabilities until a later story, e.g. file import).
- **Renderer** (`src/renderer/`): `App.tsx` calls `GET /health` on mount via the browser `fetch` API (no need for Electron IPC, since the renderer can reach an HTTP endpoint directly); three states — loading, connected, not-connected — held in local component state.
- **TypeScript strictness:** `tsconfig.json` sets `"strict": true` and related strict-family flags (`noImplicitAny`, `strictNullChecks`, etc. — bundled under `strict`), per the TypeScript coding guideline's "Type Safety: always specify types" principle.
- **ESLint/Prettier expectations:** ESLint (`.eslintrc.cjs`) with `eslint:recommended`, `@typescript-eslint/recommended`, `eslint-plugin-import`, `eslint-plugin-simple-import-sort`, `eslint-plugin-jsx-a11y`, `eslint-plugin-prettier` — the same rule set the parent LLD applied, again explicitly **excluding** `eslint-plugin-next`/`core-web-vitals` (Next.js-specific, not applicable to Electron). Prettier (`.prettierrc`) integrated via `eslint-plugin-prettier`. Husky + lint-staged (`.husky/pre-commit`, lint-staged config in `package.json`) block a commit that violates either.
- **Electron + React project structure:** `electron/` (main process) separated from `src/renderer/` (React app), matching the standard Electron project layout and keeping the Node-capable main process isolated from the sandboxed renderer.
- **Design system/component approach:** deliberately **not** introduced by this story — `App.tsx` uses plain, minimal markup for the three status states. `3DW-STORY-001C` introduces the design-system foundation (tokens, `StatusBadge`) and will modify `App.tsx` to compose it. Documented here so the omission is a stated decision, not an oversight (Engineering Standards Rules).
- **Professional UI behavior:** loading/connected/not-connected states are always one of the three, never an indeterminate blank screen; failures are caught and shown as "not connected," never an unhandled promise rejection reaching the console as the only signal.
- **Naming conventions:** `camelCase` variables/functions, `PascalCase` components (`App`), `I`-prefixed interfaces for typed contracts (e.g. `IHealthStatus`, matching the backend's `HealthStatusDto` shape) — per the TypeScript coding guideline, consistent with the parent LLD.
- **No Next.js-specific implementation:** confirmed — this is a plain Vite-bundled Electron/React app; no Next.js APIs, routing, or conventions are used anywhere.

## Data/model design

Not applicable — no data model in this story.

## API contract design

Consumed, not defined, by this story (the contract itself belongs to `3DW-STORY-001A`):

| | |
|---|---|
| Route | `GET /health` (already implemented) |
| Request | None |
| Response (200) | `{ "status": "ok" }` |
| Client handling | Success -> "connected"; network error, non-200, or malformed JSON -> "not connected" (all three failure modes treated the same at the UI layer, per Edge cases below) |
| Tenant context | Not applicable |
| Authorization | Not applicable |

## UI behavior

Three states: loading ("Checking connection..."), connected ("Connected"), not-connected ("Not connected"). Text-based labels, not color-only, for accessibility. No retry loop or manual "check again" control required for this story (out of scope; could be a natural follow-on, not requested here).

## Multitenancy handling

Not applicable to this story — no tenant-scoped data or endpoints are involved; the frontend calls only the unauthenticated `/health` route. Stated explicitly per the skill's Multitenancy Rules, not left silent.

## Exception/error handling

`fetch` calls wrapped in `try/catch`; any failure (network error, non-200 status, JSON parse failure) maps to the same "not connected" UI state — the user never sees a raw error object or stack trace. Errors are logged to the browser console in development only (no PII, no secrets — there are none to leak here), consistent with the parent LLD's exception-handling principles applied client-side.

## Security considerations

`contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` in the `BrowserWindow` configuration — unchanged and reinforced from the parent LLD. No secrets in the frontend bundle; the API base URL is a non-secret configuration value (an endpoint address, not a credential), still sourced from configuration rather than hardcoded, per Twelve-Factor. No `eslint-disable` blanket suppressions.

## Observability/logging considerations

Minimal: failed health checks logged to the browser console in development, for local debugging only. No telemetry or remote logging is introduced by this story (not requested by any discovery/architecture source).

## Performance considerations

None — a single health check on mount has no meaningful performance profile.

## Edge cases

- Backend not yet started: shows "not connected," does not crash or hang indefinitely (a reasonable fetch timeout is applied, exact value an implementation detail, not architecturally significant here).
- Backend returns `200` with an unexpected body shape: treated as "not connected" rather than trusting a malformed response as success.
- Rapid remount (e.g. hot reload during development): does not accumulate duplicate in-flight requests in a way that causes flickering between states (standard `useEffect` cleanup).

## Implementation sequence

1. Scaffold the Electron + React + TypeScript app (`electron-vite`).
2. Configure secure `BrowserWindow` defaults.
3. Build `App.tsx` with the three states, calling `GET /health`.
4. Add ESLint, Prettier, Husky + lint-staged.
5. Add `App.test.tsx`.
6. Manual verification against the real `3DW-STORY-001A` backend (already running/verified).

## Rollback considerations

Low risk: entirely new, isolated `frontend/` directory; no existing files modified. Reverting the PR removes the directory with no other impact.

## Open questions

- Electron bundler choice (`electron-vite` assumed) — unresolved, carried from the parent LLD.
- API base URL configuration convention (env var name, local-dev default) — new open question raised by this story; should be settled before `3DW-STORY-001D` wires Compose networking, since the two need to agree.
- Whether to adopt `airbnb-typescript` as an additional ESLint layer — unresolved, carried from the parent LLD.
