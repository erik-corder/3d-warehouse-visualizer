# Child Story Outlines

**Draft story evidence, not an approved backlog entry in `jira-ready-stories.md`.** These are the formally registered child stories from the split of `3DW-STORY-001`, approved at the split level (`.skillbase/artifacts/evidence/3DW-STORY-001-split-human-approval.md`, gate `story_split_3dw_story_001_approved`, APPROVED, Isuru Sampath, 2026-09-22). Source: `.skillbase/artifacts/lld/3dw-story-001/child-story-split.md`. Human approval is still required before implementation planning or coding — for the split itself (already recorded) and separately for each child story below.

---

## 3DW-STORY-001A

**Parent story ID:** 3DW-STORY-001

**Title:** Backend solution skeleton

**Type:** foundation-enabler

**User story statement:** As a developer, I want a minimal .NET 10 backend with the controller/service/DTO pattern, an EF Core code-first direction, a centralized exception-handling baseline, and dependency injection wired, so that later backend modules have a proven pattern to follow.

**Business value:** Establishes the backend architectural conventions once, correctly, rather than each later module (Import, Tenancy, Warehouse Objects, Dashboard) inventing its own.

**Scope:** `HealthController` (`GET /health`) -> `IHealthService`/`HealthService` -> `HealthStatusDto`; empty `ApplicationDbContext` (no `DbSet`s, registered via `AddDbContext`); centralized exception-handling baseline (`AddProblemDetails()` + `UseExceptionHandler()`); DI registrations (`AddScoped<IHealthService, HealthService>()`, `AddControllers()`); backend project/solution scaffold.

**Out of scope:** Frontend, Docker Compose, design system, tenancy (Story 002), real domain entities (Story 004+), AutoMapper (open question, manual mapping assumed).

**Acceptance criteria:**
```text
Given the backend API is running
When GET /health is called
Then it returns 200 with body { "status": "ok" }

Given an unhandled exception occurs in the request pipeline
When the client receives the response
Then it matches the baseline problem-details shape { type, title, status, detail, instance }
And no stack trace or internal exception message is present outside the Development environment
```

**Test cases:** `HealthControllerTests` (integration, including the forced-exception case), `HealthServiceTests` (unit).

**Dependencies:** None. Can start immediately; may proceed in parallel with 3DW-STORY-001B once the `/health` request/response contract is agreed.

**Traceability:** `high-level-design.md` (Backend architecture; Exception handling architecture); `api-and-data-design.md`; C#/.NET coding guideline (IAPD/373751943).

**Size:** M (12 files: 10 create + 2 test)

**PR-size risk:** Low

**Requires LLD:** Yes

**Requires separate PR:** Yes

---

## 3DW-STORY-001B

**Parent story ID:** 3DW-STORY-001

**Title:** Frontend Electron/React/TypeScript skeleton and tooling

**Type:** foundation-enabler

**User story statement:** As a developer, I want a minimal Electron + React + TypeScript app with ESLint, Prettier and pre-commit enforcement configured, so that all future frontend work starts from a consistent, linted, formatted baseline.

**Business value:** Establishes the frontend tooling and app-shell conventions once; prevents style/lint drift from the first commit onward.

**Scope:** Electron main process + React/TypeScript renderer (`electron-vite`); `App.tsx` calling `GET /health` with loading/connected/not-connected states; ESLint (`.eslintrc.cjs`) per the standards' applied rule set; Prettier (`.prettierrc`); Husky + lint-staged pre-commit hook; `App.test.tsx`.

**Out of scope:** Design system (Story 001C — `App.tsx` here renders ad hoc status markup, replaced later); Docker Compose (Story 001D); any backend code (Story 001A).

**Acceptance criteria:**
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

**Test cases:** `App.test.tsx` (three UI states via mocked `fetch`); manual check that `npm run lint` / `format:check` pass on a clean checkout; manual check that the pre-commit hook blocks a deliberately malformed commit.

**Dependencies:** Depends on the `GET /health` contract agreed with 3DW-STORY-001A (`{ "status": "ok" }`); implementation can proceed in parallel with 001A if that contract is fixed upfront, using a mocked backend for early development.

**Traceability:** TypeScript coding guideline (IAPD/373751928); Linters & Code Formatters (TD/102924295) — Next.js-specific ESLint plugins explicitly excluded per the standards source's own instruction; `high-level-design.md` (Frontend architecture).

**Size:** M (11 files: 10 create + 1 test)

**PR-size risk:** Low

**Requires LLD:** Yes

**Requires separate PR:** Yes

---

## 3DW-STORY-001C

**Parent story ID:** 3DW-STORY-001

**Title:** Design system foundation

**Type:** foundation-enabler

**User story statement:** As a developer, I want a small, reusable design-system foundation (tokens and a first atom component), so that this story's UI and every later UI story compose from shared building blocks instead of ad hoc markup.

**Business value:** Prevents each later UI story (object list, detail, search, dashboard) from inventing its own styling approach; keeps the "professional UI patterns" and "atomic/component structure where useful" standards satisfied from the start.

**Scope:** `design-system/tokens.ts` (color/spacing/typography constants); `design-system/components/StatusBadge.tsx` + `StatusBadge.module.css` (an atom taking a `status: 'loading' | 'connected' | 'not-connected'` prop); `types/IHealthStatus.ts` (typed contract matching the backend DTO); modify `App.tsx` to compose `StatusBadge` instead of ad hoc markup; `StatusBadge.test.tsx`.

**Out of scope:** Any component beyond `StatusBadge`; a full component library; visual design system tooling (e.g. Storybook) — not requested by any discovery/architecture source.

**Acceptance criteria:**
```text
Given the StatusBadge component receives status="connected"
When it renders
Then it displays a "Connected" text label distinguishable without relying on color alone

Given App.tsx is updated to use StatusBadge
When the app runs against a live or unreachable backend
Then the displayed status is visually identical in meaning to 3DW-STORY-001B's behavior, now sourced from the shared component
```

**Test cases:** `StatusBadge.test.tsx` (all three states render with correct labels); `App.test.tsx` re-run (from 001B) to confirm no regression after the swap to `StatusBadge`.

**Dependencies:** Depends on 3DW-STORY-001B (needs the app shell and `App.tsx` to exist before it can be modified to use `StatusBadge`).

**Traceability:** TypeScript coding guideline (IAPD/373751928) — component-based architecture, `I`-prefixed interfaces; Frontend Design Rules (accessibility notes) from the `story-lld` skill itself.

**Size:** S (6 files: 4 create + 1 test + 1 modify)

**PR-size risk:** Low

**Requires LLD:** Yes

**Requires separate PR:** Yes

---

## 3DW-STORY-001D

**Parent story ID:** 3DW-STORY-001

**Title:** Docker Compose and workspace baseline

**Type:** foundation-enabler

**User story statement:** As a developer, I want a Docker Compose file running the backend and a local SQL container, a shared `.editorconfig`, and documented setup steps, so that anyone can start the full local stack from a clean checkout without guesswork.

**Business value:** Removes tribal knowledge from local setup; gives later stories (which need the SQL container, e.g. Story 004+) a ready foundation.

**Scope:** `docker-compose.yml` (API service + containerized SQL service; Electron runs natively, not containerized); root `.editorconfig` (2-space TypeScript / 4-space C# sections); append a `SQL_CONNECTION_STRING` name (value empty) to `.env.example`; append a "Running locally" section to `README.md`.

**Out of scope:** Any actual database schema or connection use (no `DbSet`s exist yet); CI pipeline definition.

**Acceptance criteria:**
```text
Given the Docker Compose stack is started
When the backend API's health endpoint is called
Then it returns a 200 response

Given a developer follows the README's "Running locally" section on a clean checkout
When they run the documented commands
Then the full stack (backend + SQL container, with Electron launched natively) starts successfully
```

**Test cases:** `docker compose up --build` succeeds from a clean checkout; `curl -f http://localhost:<port>/health` returns 200; manual confirmation no secrets or real connection strings are present in any committed file.

**Dependencies:** Depends on 3DW-STORY-001A (API to containerize) and 3DW-STORY-001B (Electron app to launch natively against it). For full manual QA coverage (matching the original parent story's acceptance criteria end to end, including the visual `StatusBadge` status), should run after 3DW-STORY-001C too, though this story's own acceptance criteria can be satisfied by 001A + 001B alone.

**Traceability:** `high-level-design.md` (Local development and Docker Compose architecture); original `3DW-STORY-001` acceptance criteria (both scenarios reproduced here as the parent's contract).

**Size:** XS (4 files: 1 create infra + 1 create shared config + 2 modify)

**PR-size risk:** Low

**Requires LLD:** Yes

**Requires separate PR:** Yes
