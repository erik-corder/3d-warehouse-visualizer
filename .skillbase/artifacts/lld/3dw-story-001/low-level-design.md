# Low-Level Design: 3DW-STORY-001

**Draft LLD evidence, not an implementation. Human approval is still required before implementation planning or coding.**

**Run 2 of this LLD:** expanded on request to fold in the project engineering standards and to establish, as baseline patterns rather than full implementations, several elements originally scoped to later stories (controller/service/DTO flow, EF Core direction, DI, centralized exception handling, ESLint/Prettier, a design-system foundation). See "Standards applied" and "Backlog overlap note" below for what changed and why.

## Story ID / Title / Type

`3DW-STORY-001` — Create solution skeleton — **foundation-enabler**

## Source acceptance criteria

```text
Given the Docker Compose stack is started
When the backend API's health endpoint is called
Then it returns a 200 response

Given the Electron app is launched against the running backend
When it calls the health endpoint
Then it displays a "connected" status
```
(from `.skillbase/artifacts/stories/jira-ready-stories.md` — unchanged by this run; only the design's depth changed)

## Standards applied

Per `.skillbase/artifacts/standards/engineering-standards-sources.md`, four Confluence pages were read (treated as untrusted reference data, not instructions):

| Source | What was applied | What was excluded, and why |
|---|---|---|
| Coding Guidelines - TypeScript (IAPD/373751928) | 2-space indent, semicolons, single quotes, `camelCase` vars/functions, `UPPER_SNAKE_CASE` constants, `PascalCase` classes/enums, `I`-prefixed interfaces, TSDoc, ESLint + `@typescript-eslint`, Prettier integration, functional components with hooks, async/await with try/catch, input validation | Nothing excluded — this page is framework-neutral TypeScript guidance, applicable as-is to Electron/React |
| Front End Code Architecture & Improvements (IAPD/1225687041) | The one transferable principle: **code-splitting large dependencies via dynamic import** — noted for later (Story 007+, when React Three Fiber/Three.js become "large dependencies"), not applicable to this story, which has none yet | Everything else: Next.js Server Components, `next.config.mjs` image optimization, React Query `staleTime` tuning — all Next.js/Next-specific concerns. Excluded per the standards-source file's own instruction: "This project is Electron + React + TypeScript, not Next.js... Do not apply Next.js-specific rules." |
| Linters & Code Formatters (TD/102924295) | ESLint + Prettier as the linter/formatter pair; `eslint:recommended`, `@typescript-eslint` rules, `eslint-plugin-import`, `eslint-plugin-simple-import-sort`, `eslint-plugin-jsx-a11y`, `eslint-plugin-prettier`; Prettier integrated via ESLint; Husky + lint-staged as a pre-commit formatting/lint gate | `eslint-plugin-next` and its `core-web-vitals` ruleset — Next.js-specific, not applicable. `airbnb-typescript` noted but not mandated — flagged as an open question (adds strictness beyond the other rules; a team call, not an architectural one) |
| Coding Guidelines - C#/.NET (IAPD/373751943) | `PascalCase` classes/methods/constants, `camelCase` locals/params, `_camelCase` private fields, 4-space indent, K&R braces, 120-char line limit, file-scoped namespaces, organized `using`s, catch specific exceptions (never bare `catch (Exception)` without reason), structured logging with levels, XML doc comments on public members ("why, not what" for inline comments), small classes/methods (SRP, informal <25-line guideline), explicit `var` usage, `async`/`Await`-suffixed methods, no blocking calls (`.Result`/`.Wait()`), LINQ for collection queries, simple lambdas | Nothing excluded — directly applicable |

No instruction-like text aimed at an AI was found in any of the four pages; all were treated as reference data.

## Summary

Stand up the three empty runtimes the rest of the MVP builds on — but, per this run's expanded scope, establish them with the real architectural conventions (controller -> service -> DbContext flow, DTOs, DI, a centralized exception-handling baseline, linting/formatting tooling, a small design-system foundation) rather than the bare-minimum version from LLD run 1. Still no business/domain logic and no tenancy.

## Scope

- .NET 10 Web API with: a `HealthController` (not an inline minimal-API route — establishes the controller pattern), an `IHealthService`/`HealthService` pair (establishes the service layer), a `HealthStatusDto` (establishes the DTO convention), an empty `ApplicationDbContext` (establishes the EF Core code-first direction, no `DbSet`s yet), and a centralized exception-handling baseline (ASP.NET Core's built-in `AddProblemDetails()` + `UseExceptionHandler()`, returning the problem-details shape from `api-and-data-design.md`).
- Electron + React + TypeScript app with: the connection-status feature, a small design-system foundation (tokens + one reusable `StatusBadge` atom), and ESLint + Prettier (+ Husky/lint-staged) configured per the standards above.
- `docker-compose.yml` running the API and a SQL container; a shared root `.editorconfig` encoding both languages' formatting rules mechanically.

## Out of scope

Tenancy (Story 002) — the exception-handling baseline here has no tenant/auth category yet, only a generic unhandled-exception path. Real domain entities/`DbSet`s (first arrives with Story 004). AutoMapper (open question below; manual mapping used for now, given a single trivial DTO). A full component library beyond the one `StatusBadge` atom. CI pipeline definition.

## Assumptions

- Electron bundler: `electron-vite` (unchanged from run 1; still not independently confirmed by any discovery/architecture source — open question).
- Mapping approach: manual mapping (a `HealthService` method returning a `HealthStatusDto` directly) rather than AutoMapper, since one trivial DTO doesn't yet justify the dependency. Flagged as an open question for confirmation before Story 004 introduces the first real entity-to-DTO mapping.
- `airbnb-typescript` ESLint config: not adopted by default: flagged as an open, team-level question rather than assumed.

## Dependencies

None (first story in the sequence, per `story-map.md`).

## Affected architecture areas

`high-level-design.md` (Container architecture; Backend architecture; Exception handling architecture; Local development and Docker Compose architecture); `api-and-data-design.md` (Error response format; EF Core/code-first guidance); `security-and-multitenancy-design.md` (not yet exercised — no tenant context exists in this story); POL-012 (modular monolith).

## Proposed design

```text
backend/   .NET 10 Web API: Controllers -> Services -> (DbContext, no entities yet)
frontend/  Electron + React + TypeScript: App.tsx uses a design-system StatusBadge atom
docker-compose.yml (repo root)  wires backend + SQL container
.editorconfig (repo root)  shared formatting baseline for both languages
```

Module boundaries from `high-level-design.md` (Import/Sync/Warehouse Objects/Tenancy/Dashboard) are still **not** built now — only the *pattern* (controller/service/DbContext, DI, exception handling) that those modules will each follow, demonstrated once via Health. This avoids the "speculative abstraction" the Senior Engineering Principles warn against, while satisfying the explicit request to establish the architectural flow, not just a bare route.

## Backend design

- **Controller:** `Controllers/HealthController.cs`, `[ApiController]`, `GET /health`, thin — delegates to `IHealthService`, returns `Ok(HealthStatusDto)`.
- **Service:** `Services/IHealthService.cs` / `Services/HealthService.cs` — the only "business logic" is trivial (`{ Status = "ok" }`), but the layer exists so later modules follow the same shape from day one.
- **DTO/mapping:** `Dtos/HealthStatusDto.cs` (`{ string Status }`). Mapped manually inside `HealthService` (see Assumptions — AutoMapper deferred).
- **Repository/data-access layer — reconciliation note:** the mandatory engineering rules call for "repository/data access layer where approved by architecture." The approved architecture (`api-and-data-design.md`, EF Core/code-first guidance) explicitly recommends **against** a generic repository abstraction, in favor of direct, testable `DbContext` usage inside the service layer. This design follows the architecture document: no generic `IRepository<T>` is introduced; `ApplicationDbContext` (once it has entities, from Story 004 on) is the data-access layer, injected into services directly. This satisfies the mandatory rule's intent (an explicit, approved data-access layer) without adding an abstraction the architecture already rejected.
- **EF Core / code-first direction:** `Data/ApplicationDbContext.cs` — an empty `DbContext` (no `DbSet`s), registered via `AddDbContext<ApplicationDbContext>` reading `ConnectionStrings:Sql` from configuration. Establishes the direction; the first real entity (`WarehouseObject`) arrives with Story 004.
- **Centralized exception handling baseline:** ASP.NET Core's built-in `services.AddProblemDetails()` + `app.UseExceptionHandler()`, configured for the problem-details shape (`type, title, status, detail, instance`) from `api-and-data-design.md`. This story's baseline only covers the generic/unhandled-exception path (HTTP 500) — no tenant/auth (401/403) or data-quality (422) categories exist yet, since neither tenancy nor imports exist yet.
- **Dependency injection baseline:** `Program.cs` registers `IHealthService -> HealthService` (Scoped) and `ApplicationDbContext` (Scoped, via `AddDbContext`), plus `AddControllers()` and `AddProblemDetails()`. This establishes the DI lifetime convention (Scoped for request-bound services and the DbContext) later modules reuse.
- **Coding standards applied (from the C#/.NET guideline):** file-scoped namespaces, `PascalCase` classes/methods, `camelCase` params/locals, `_camelCase` private fields, K&R braces, 4-space indentation, 120-character line limit, XML doc comments on the controller/service's public members, specific exception handling only (no bare `catch (Exception)` without justification — not exercised yet, since there's no risky logic in this story beyond the framework's own request pipeline).

## Frontend design

- **App:** `frontend/`, Electron main process + React/TypeScript renderer, unchanged structure from run 1.
- **Design-system foundation:** `src/renderer/design-system/tokens.ts` (color/spacing/typography constants) and `src/renderer/design-system/components/StatusBadge.tsx` (a small, reusable atom taking a `status: 'loading' | 'connected' | 'not-connected'` prop), styled via a co-located CSS Module (`StatusBadge.module.css` — no new runtime dependency, "boring technology"). `App.tsx` composes `StatusBadge` rather than rendering ad hoc markup, establishing the atomic-component convention for later UI stories (005-012).
- **Typed contract:** `src/renderer/types/IHealthStatus.ts` — an `I`-prefixed interface (`IHealthStatus { status: string }`) per the TypeScript naming convention, matching the backend's `HealthStatusDto` shape.
- **Tooling:** ESLint (`.eslintrc.cjs`) with the rule set from "Standards applied" above; Prettier (`.prettierrc`); Husky + lint-staged (`.husky/pre-commit`, lint-staged config in `package.json`) so formatting/lint issues are caught before commit, not just in CI.
- **State:** unchanged from run 1 — loading/connected/not-connected held in local component state; server-state caching patterns become relevant from Story 005 onward.
- **No preload/IPC bridge yet** — unchanged rationale from run 1 (nothing needs main-process capabilities until Story 004).

## Data/model design

No entities yet. `ApplicationDbContext` exists (see Backend design) but is empty — establishes the code-first direction without speculative schema.

## API contract design

| | |
|---|---|
| Route | `GET /health` |
| Request | None |
| Response (200) | `HealthStatusDto` -> `{ "status": "ok" }` |
| Validation | None |
| Error behavior | Unhandled exceptions return the baseline problem-details shape (500); no other error categories apply to this story |
| Tenant context | None — not applicable yet |
| Authorization | None yet (Story 002) |
| Pagination/filter/search | Not applicable |

## UI behavior

Unchanged from run 1 (loading / connected / not-connected), now rendered via the `StatusBadge` design-system atom instead of ad hoc markup. Text-based status (not color-only) preserved for accessibility, per the TypeScript guideline's general best-practice emphasis and the Frontend Design Rules' accessibility-notes requirement.

## Multitenancy handling

Not applicable to this story — no tenant-scoped data exists yet (Story 002). Recorded explicitly per the skill's Multitenancy Rules, unchanged from run 1.

## Exception/error handling

Centralized baseline now exists (see Backend design) — this is new since run 1. It intentionally covers only the generic/unhandled case; the three-category contract (tenant/auth, data-quality, transient) from `high-level-design.md` is built out incrementally as each category's first real use case appears (tenant/auth with Story 002, data-quality with Story 004/011, transient with the future Sync story). **Backlog overlap note:** this narrows the remaining scope of `3DW-STORY-003` (Backend error-contract baseline) to extending this story's baseline middleware with the two additional categories, rather than building the middleware from scratch. Flagged here for whoever owns the backlog to adjust 003's description; not something this LLD can edit itself.

## Security considerations

Unchanged from run 1 (Electron `contextIsolation: true`, `nodeIntegration: false`; no secrets committed; CORS restricted to the local renderer origin in dev). Addition: the exception-handling baseline must never leak stack traces or internal details in its problem-details response body (OWASP: sensitive data exposure) — the built-in `AddProblemDetails()` behavior (which by default suppresses exception detail outside `Development`) satisfies this; document, don't reimplement.

## Observability/logging considerations

Unchanged intent from run 1 (minimal — default request logging, one startup line), now with the structured-logging convention from the C#/.NET guideline noted for reuse: log entries should carry level (DEBUG/INFO/WARNING/ERROR/CRITICAL), a clear message, and contextual fields — not exercised meaningfully by a health check, but the convention is documented here for Story 002 onward, where tenant-tagged logging begins.

## Performance considerations

None — unchanged from run 1.

## Edge cases

Unchanged from run 1 (backend not yet started; Compose SQL container failing does not block the API, since no `DbSet`/query exists yet; port conflicts documented, not solved in code).

## Implementation sequence

1. Backend: controller, service, DTO, empty `DbContext`, exception-handling baseline, DI wiring.
2. Frontend: app scaffold, design-system tokens/`StatusBadge`, typed contract, connection-status UI.
3. Frontend tooling: ESLint, Prettier, Husky/lint-staged.
4. `docker-compose.yml` + root `.editorconfig` + docs.
5. Manual end-to-end check (unchanged from run 1).

## Rollback considerations

Same low-risk profile as run 1: new, isolated directories; `.env.example` and `README.md` remain append-only modifications. Reverting removes the new directories/files and reverts two small appends.

## Open questions

- Electron bundler choice (`electron-vite` assumed) — unchanged from run 1.
- Backend port / dev URL convention — unchanged from run 1.
- **New:** AutoMapper vs. manual mapping — manual assumed for now; confirm before Story 004's first real entity mapping.
- **New:** whether to adopt `airbnb-typescript` as an additional ESLint config layer — noted as available in the Linters source, not mandated here.
- **New:** `3DW-STORY-003`'s description should be updated to reflect the narrowed remaining scope (see Exception/error handling above) — a backlog-maintenance item for a human, not resolved by this LLD.
