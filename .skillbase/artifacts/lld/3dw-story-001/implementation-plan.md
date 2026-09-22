# Implementation Plan: 3DW-STORY-001

**Run 2** — re-sequenced into four PRs per `file-impact-map.md`'s expanded split recommendation. Companion to `low-level-design.md` and `file-impact-map.md`. **Planning only — no code is created by this document.**

## Implementation steps

### PR 1 — Backend skeleton (controller/service/DTO/DbContext/exception baseline/DI)
1. Scaffold `backend/src/WarehouseVisualizer.Api` (.NET 10 Web API, minimal hosting, file-scoped namespaces).
2. Add `HealthStatusDto`, `IHealthService`/`HealthService`, `HealthController` (`GET /health`).
3. Add empty `ApplicationDbContext`, registered via `AddDbContext`, reading `ConnectionStrings:Sql` (name only, no value committed).
4. Wire DI: `AddScoped<IHealthService, HealthService>()`, `AddControllers()`, `AddProblemDetails()`, `UseExceptionHandler()`.
5. Add `HealthControllerTests` (integration, including the forced-exception case) and `HealthServiceTests` (unit).

### PR 2 — Frontend app shell + tooling
1. Scaffold `frontend/` (Electron + React + TypeScript, `electron-vite` — confirm bundler choice first, see Open Questions).
2. Configure `contextIsolation: true`, `nodeIntegration: false`.
3. Build `App.tsx` with loading/connected/not-connected states calling `/health`.
4. Add ESLint (`.eslintrc.cjs`), Prettier (`.prettierrc`), Husky + lint-staged (`.husky/pre-commit`), per the rule set in `low-level-design.md`'s "Standards applied".
5. Add `App.test.tsx`.

### PR 3 — Design-system foundation
1. Add `design-system/tokens.ts` (color/spacing/typography constants).
2. Add `design-system/components/StatusBadge.tsx` + `StatusBadge.module.css`.
3. Add `types/IHealthStatus.ts`.
4. Modify `App.tsx` to compose `StatusBadge` instead of ad hoc markup.
5. Add `StatusBadge.test.tsx`.

### PR 4 — Compose + docs + shared tooling
1. Add `docker-compose.yml`: API service + SQL container service.
2. Add root `.editorconfig` (2-space TS / 4-space C# sections).
3. Append `SQL_CONNECTION_STRING` name to `.env.example`.
4. Append "Running locally" section to `README.md` (including lint/format commands from PR 2).
5. Run the full manual QA checklist end to end (`test-design.md`).

## Recommended order

PR 1 -> PR 2 -> PR 3 -> PR 4, matching the dependency direction (PR 3 modifies PR 2's `App.tsx`; PR 4 verifies PR 1 + PR 2/3 together under Compose). PR 1 and PR 2 (steps 1-3, before tooling/design-system) could be built in parallel by different people, same as run 1's plan — only the shared `/health` contract needs to be agreed upfront.

## Checkpoints

- After PR 1: `dotnet test` passes; `curl /health` returns the DTO shape; forced-exception test confirms the problem-details baseline.
- After PR 2: `npm run lint`/`format:check` pass; Electron app shows "Connected" against the PR 1 backend (started manually).
- After PR 3: `StatusBadge` renders in place of the ad hoc markup with no visible regression; component tests pass.
- After PR 4: full Compose-based manual QA checklist passes.

## Validation commands expected later

See `test-design.md` ("Expected validation commands for later implementation").

## Definition of done

Unchanged core bar from run 1 (tests pass, no secrets committed, README lets a new developer start from a clean checkout), plus: lint/format checks pass and are enforced by the pre-commit hook; the forced-exception test confirms the exception-handling baseline; `StatusBadge` is the only place connection status is rendered (no duplicate ad hoc markup left behind from PR 2).

## Evidence to capture during implementation

Unchanged from run 1 (test output, a screenshot of "Connected", confirmation Compose builds from a clean checkout), plus: lint/format command output, and confirmation the pre-commit hook actually blocks a deliberately malformed commit during a dry run.

## PR description outline (per PR)

```text
## What
[One-line summary of this PR's slice: backend / frontend+tooling / design-system / compose]

## Why
Part of 3DW-STORY-001 (solution skeleton). See .skillbase/artifacts/lld/3dw-story-001/.
Standards applied per .skillbase/artifacts/standards/engineering-standards-sources.md.

## How to verify
[Exact commands from test-design.md relevant to this PR]

## Out of scope
[Point to the other PRs in this sequence for the remaining pieces]
```
