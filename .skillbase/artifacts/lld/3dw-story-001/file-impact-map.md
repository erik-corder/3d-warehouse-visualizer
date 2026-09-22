# File Impact Map: 3DW-STORY-001

**Run 2** — expanded per the standards/architecture-baseline request; supersedes run 1's smaller map. Companion to `low-level-design.md`. This is a map for future implementation; no implementation files are created by this LLD.

## Expected files to create

**Backend (10):**
- `backend/WarehouseVisualizer.sln`
- `backend/src/WarehouseVisualizer.Api/WarehouseVisualizer.Api.csproj`
- `backend/src/WarehouseVisualizer.Api/Program.cs`
- `backend/src/WarehouseVisualizer.Api/appsettings.json`
- `backend/src/WarehouseVisualizer.Api/appsettings.Development.json`
- `backend/src/WarehouseVisualizer.Api/Controllers/HealthController.cs`
- `backend/src/WarehouseVisualizer.Api/Services/IHealthService.cs`
- `backend/src/WarehouseVisualizer.Api/Services/HealthService.cs`
- `backend/src/WarehouseVisualizer.Api/Dtos/HealthStatusDto.cs`
- `backend/src/WarehouseVisualizer.Api/Data/ApplicationDbContext.cs`

**Backend tests (2):**
- `backend/tests/WarehouseVisualizer.Api.Tests/HealthControllerTests.cs`
- `backend/tests/WarehouseVisualizer.Api.Tests/HealthServiceTests.cs`

**Frontend (10):**
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/electron.vite.config.ts`
- `frontend/electron/main.ts`
- `frontend/src/renderer/index.html`
- `frontend/src/renderer/main.tsx`
- `frontend/src/renderer/App.tsx`
- `frontend/.eslintrc.cjs`
- `frontend/.prettierrc`
- `frontend/.husky/pre-commit`

**Frontend, design system + types (4):**
- `frontend/src/renderer/design-system/tokens.ts`
- `frontend/src/renderer/design-system/components/StatusBadge.tsx`
- `frontend/src/renderer/design-system/components/StatusBadge.module.css`
- `frontend/src/renderer/types/IHealthStatus.ts`

**Frontend tests (2):**
- `frontend/src/renderer/App.test.tsx`
- `frontend/src/renderer/design-system/components/StatusBadge.test.tsx`

**Infra (2):**
- `docker-compose.yml` (repo root)
- `.editorconfig` (repo root, shared 2-space TS / 4-space C# sections)

**Total new files: 30**

## Expected files to modify

- `.env.example` — append `SQL_CONNECTION_STRING=` (name only).
- `README.md` — append "Running locally" section.
- `frontend/package.json` (if created in an earlier PR of the sequence) — add `lint-staged` config block when the tooling PR lands, if package.json already exists by then.

**Total modified files: 2-3** (the third only if PRs are sequenced such that `package.json` predates the tooling PR — see Split recommendation).

## Files explicitly not to touch

Unchanged from run 1: `.skillbase/**`, `docs/adr/**`, `CLAUDE.md`, `.claude/**`. `.gitignore` — existing patterns already cover expected build output (`bin/`, `obj/`, `node_modules/`, `dist/`, `out/`); add `.husky/_` only if Husky's internal files aren't already covered (check during implementation, not assumed here).

## Expected backend impact

New, isolated `backend/` directory, now with a controller/service/DTO/DbContext layering instead of a single inline route (run 1's design). No existing backend code to modify.

## Expected frontend impact

New, isolated `frontend/` directory, now including linting/formatting tooling and a small design-system foundation in addition to the app shell. No existing frontend code to modify.

## Expected database impact

None. `ApplicationDbContext` is registered but has no `DbSet`s; the SQL container is available via Compose but nothing queries it yet.

## Migration expectation

**No.** No entities exist yet.

## Docker expectation

**Yes.** Unchanged from run 1.

## Test files expected

4 total: 2 backend (`HealthControllerTests`, `HealthServiceTests`), 2 frontend (`App.test.tsx`, `StatusBadge.test.tsx`). Included in the size estimate below.

## PR size estimate

**Total changed files: 30 create + 2-3 modify + (4 test files already counted within the 30) = ~32.**

This is well beyond the "Too large" threshold (>15) as a single PR — larger than run 1's 17-file estimate, because this run's scope was explicitly expanded to include the controller/service/DbContext pattern, DI, a centralized exception-handling baseline, linting/formatting tooling, and a design-system foundation, none of which were in run 1's minimal skeleton. **See split recommendation below.**

## Split recommendation

Four small, sequential PRs against this one story (story scope and acceptance criteria unchanged — this is a delivery-sequencing recommendation only):

1. **PR 1 — Backend skeleton (controller/service/DTO/DbContext/exception baseline/DI):** the 10 backend files + 2 backend test files = **12 files, M.**
2. **PR 2 — Frontend app shell + tooling:** `package.json`, `tsconfig.json`, `electron.vite.config.ts`, `electron/main.ts`, `index.html`, `main.tsx`, `App.tsx`, `.eslintrc.cjs`, `.prettierrc`, `.husky/pre-commit`, + `App.test.tsx` = **11 files, M.**
3. **PR 3 — Design-system foundation:** `tokens.ts`, `StatusBadge.tsx`, `StatusBadge.module.css`, `IHealthStatus.ts`, `StatusBadge.test.tsx`, + modify `App.tsx` (to compose `StatusBadge`) = **6 files, S.**
4. **PR 4 — Compose + docs + shared tooling:** `docker-compose.yml`, root `.editorconfig`, modify `.env.example`, modify `README.md` = **4 files, XS.**

Each PR stays within the S/M guardrail (none exceed 15). This is a larger sequence than run 1's three-PR recommendation, reflecting the larger scope. **Recommend a human/tech-lead review of whether this much baseline (design system, full DI/EF Core/exception-handling scaffolding) belongs in the first story at all, versus being split into its own dedicated foundation-enabler stories** (e.g. a separate "3DW-STORY-000b: backend architecture baseline" and "3DW-STORY-000c: design system foundation") — this LLD implements what was explicitly requested, but flags that the request measurably changed the story's size class from S (story-crafting's original estimate) to a four-PR sequence.
