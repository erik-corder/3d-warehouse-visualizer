# Child Story Split: 3DW-STORY-001

**Draft split evidence, not an approval.** Records the split of `3DW-STORY-001` into four child stories, per the four-PR sequence already designed in `file-impact-map.md` (Run 2) and `implementation-plan.md`. No code created; no gate approved or advanced.

## Parent story

`3DW-STORY-001` — Create solution skeleton (foundation-enabler).

## Reason for split

After applying the Digital400 frontend, backend, linting, formatting and design-system standards (`.skillbase/artifacts/standards/engineering-standards-sources.md`), the story's implementation footprint grew to roughly 32 files — well beyond the "Too large" threshold (>15) for one PR. `file-impact-map.md` (Run 2) already designed a four-PR sequence within that one story; this document promotes that sequence into four formal child stories so each can be reviewed, estimated and (eventually) implemented independently.

The parent story's original acceptance criteria, business value and traceability are preserved in full across the four children — nothing is dropped, only distributed.

---

## 3DW-STORY-001A: Backend solution skeleton

**Type:** foundation-enabler

**User story:** As a developer, I want a minimal .NET 10 backend with the controller/service/DTO pattern, an EF Core code-first direction, a centralized exception-handling baseline, and dependency injection wired, so that later backend modules have a proven pattern to follow.

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

**API/data notes:** `api-and-data-design.md` (Error response format, EF Core/code-first guidance).

**Security/multitenancy notes:** No tenant context exists yet; not applicable. Exception responses must not leak internal detail (OWASP: sensitive data exposure) — satisfied by `AddProblemDetails()`'s default behavior outside `Development`.

**Traceability:** `high-level-design.md` (Backend architecture; Exception handling architecture); `api-and-data-design.md`; C#/.NET coding guideline (IAPD/373751943) for naming, structure, exception-handling and logging conventions.

**Estimated size:** M (12 files: 10 create + 2 test, per `file-impact-map.md` PR 1)

**PR-size risk:** Low (within guardrail as its own story)

---

## 3DW-STORY-001B: Frontend Electron/React/TypeScript skeleton and tooling

**Type:** foundation-enabler

**User story:** As a developer, I want a minimal Electron + React + TypeScript app with ESLint, Prettier and pre-commit enforcement configured, so that all future frontend work starts from a consistent, linted, formatted baseline.

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

**UX notes:** Loading/connected/not-connected states use text labels, not color alone (accessibility).

**Traceability:** TypeScript coding guideline (IAPD/373751928); Linters & Code Formatters (TD/102924295) — Next.js-specific ESLint plugins explicitly excluded per the standards source's own instruction; `high-level-design.md` (Frontend architecture).

**Estimated size:** M (11 files: 10 create + 1 test, per `file-impact-map.md` PR 2)

**PR-size risk:** Low (within guardrail as its own story)

---

## 3DW-STORY-001C: Design system foundation

**Type:** foundation-enabler

**User story:** As a developer, I want a small, reusable design-system foundation (tokens and a first atom component), so that this story's UI and every later UI story compose from shared building blocks instead of ad hoc markup.

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

**UX notes:** First entry in the design-system foundation; token names and the `StatusBadge` API are the pattern later UI stories (005-012) are expected to extend.

**Traceability:** TypeScript coding guideline (IAPD/373751928) — component-based architecture, `I`-prefixed interfaces; Frontend Design Rules (accessibility notes) from the `story-lld` skill itself.

**Estimated size:** S (6 files: 4 create + 1 test + 1 modify, per `file-impact-map.md` PR 3)

**PR-size risk:** Low

---

## 3DW-STORY-001D: Docker Compose and workspace baseline

**Type:** foundation-enabler

**User story:** As a developer, I want a Docker Compose file running the backend and a local SQL container, a shared `.editorconfig`, and documented setup steps, so that anyone can start the full local stack from a clean checkout without guesswork.

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

**Estimated size:** XS (4 files: 1 create infra + 1 create shared config + 2 modify, per `file-impact-map.md` PR 4)

**PR-size risk:** Low

---

## Dependency flow

```text
3DW-STORY-001A (backend skeleton) ──┐
                                     ├──> 3DW-STORY-001D (Compose + workspace)
3DW-STORY-001B (frontend + tooling) ┴──> 3DW-STORY-001C (design system)
                                          [001C also feeds into full manual QA for 001D]
```

001A and 001B may be implemented in parallel once the `/health` contract is agreed. 001C requires 001B. 001D requires 001A and 001B at minimum; full end-to-end QA (matching the original parent story's UI) is best done after 001C also lands.

## Traceability to parent

All four children together reproduce the parent `3DW-STORY-001`'s two acceptance-criteria scenarios in full (see 001A and 001D above, which together cover both). No scope was dropped in the split; `low-level-design.md`, `file-impact-map.md`, `test-design.md` and `implementation-plan.md` (all under this same `lld/3dw-story-001/` folder) remain the detailed design reference for all four children — this document is the split record, not a replacement for that detail.

## What this document does not do

It does not approve any of the four child stories, does not create them in Jira, does not create code, and does not advance or approve any SkillBase gate. A human still needs to review and approve this split (and, separately, approve each child story reaching its own gates) before implementation planning or coding begins on any of them.
