# Low-Level Design: 3DW-STORY-001A

**Draft LLD evidence, not an implementation. Human approval is still required before implementation planning or coding.**

**Story source note:** `3DW-STORY-001A` is not present in `.skillbase/artifacts/stories/jira-ready-stories.md`, by design — per explicit instruction, that file is not edited. It is registered in `.skillbase/artifacts/stories/child-story-outlines.md` and designed in `.skillbase/artifacts/lld/3dw-story-001/child-story-split.md`, both used as the story source for this LLD, per explicit instruction widening the `story-lld` lookup rule for this run.

## Story ID / Title / Type / Parent

`3DW-STORY-001A` — Backend solution skeleton — **foundation-enabler** — child of `3DW-STORY-001` (split approved: `.skillbase/artifacts/evidence/3DW-STORY-001-split-human-approval.md`, gate `story_split_3dw_story_001_approved`, APPROVED, Isuru Sampath, 2026-09-22).

## Source acceptance criteria

```text
Given the backend API is running
When GET /health is called
Then it returns 200 with body { "status": "ok" }

Given an unhandled exception occurs in the request pipeline
When the client receives the response
Then it matches the baseline problem-details shape { type, title, status, detail, instance }
And no stack trace or internal exception message is present outside the Development environment
```
(from `.skillbase/artifacts/stories/child-story-outlines.md`)

## Summary

A minimal .NET 10 Web API establishing the controller -> service -> DTO pattern, an empty EF Core `DbContext` (code-first direction, no entities yet), a centralized exception-handling baseline, and dependency injection wiring — backend only, per this story's explicit scope.

## Scope

`HealthController` (`GET /health`) -> `IHealthService`/`HealthService` -> `HealthStatusDto`; empty `ApplicationDbContext` (no `DbSet`s); centralized exception-handling baseline (`AddProblemDetails()` + `UseExceptionHandler()`); DI registrations; backend project/solution scaffold; backend tests.

## Out of scope

**Explicitly excluded by this story's own scope statement:** frontend skeleton (`3DW-STORY-001B`), design system (`3DW-STORY-001C`), Docker Compose (`3DW-STORY-001D`). Also out of scope, unchanged from the parent's analysis: tenancy (Story 002), real domain entities (Story 004+), AutoMapper (open question below, manual mapping assumed).

## Assumptions

- Mapping approach: manual mapping (`HealthService` returns `HealthStatusDto` directly), not AutoMapper — same open question carried from the parent LLD, unresolved here, flagged again below.
- No connection to a running SQL instance is required for this story to pass its own acceptance criteria; `ApplicationDbContext` is registered but never opened against a real database until Story 004 introduces the first entity. (The SQL container itself is `3DW-STORY-001D`'s concern, not this story's.)

## Dependencies

None. Per `child-story-outlines.md`, can start immediately; may proceed in parallel with `3DW-STORY-001B` once the `GET /health` contract (`{ "status": "ok" }`) is agreed.

## Affected architecture areas

`high-level-design.md` (Backend architecture; Exception handling architecture); `api-and-data-design.md` (Error response format; EF Core/code-first guidance); C#/.NET coding guideline (Confluence IAPD/373751943, applied per `.skillbase/artifacts/standards/engineering-standards-sources.md`).

## Proposed design

```text
backend/
  WarehouseVisualizer.sln
  src/WarehouseVisualizer.Api/
    Program.cs                 (hosting, DI wiring, exception-handling baseline)
    appsettings.json / appsettings.Development.json
    Controllers/HealthController.cs
    Services/IHealthService.cs, HealthService.cs
    Dtos/HealthStatusDto.cs
    Data/ApplicationDbContext.cs   (empty, no DbSets)
  tests/WarehouseVisualizer.Api.Tests/
    HealthControllerTests.cs
    HealthServiceTests.cs
```

No module folders (Import/Sync/Warehouse Objects/Tenancy/Dashboard) yet — this story demonstrates the pattern once, via Health, for later modules to follow. Consistent with the Senior Engineering Principles' caution against speculative abstractions.

## Backend design

- **Controller:** `Controllers/HealthController.cs`, `[ApiController]`, `GET /health`, thin — delegates to `IHealthService`, returns `Ok(HealthStatusDto)`.
- **Service:** `Services/IHealthService.cs` / `Services/HealthService.cs` — trivial logic (`{ Status = "ok" }"`), but the layer exists so later modules follow the same shape from day one.
- **DTO/mapping:** `Dtos/HealthStatusDto.cs` (`{ string Status }`), mapped manually inside `HealthService` (see Assumptions).
- **Repository/data-access layer — reconciliation, carried from the parent LLD:** the mandatory engineering rules call for a "repository/data access layer where approved by architecture." `api-and-data-design.md` explicitly recommends against a generic repository abstraction, favoring direct `DbContext` use in the service layer. This design follows the architecture document: no generic `IRepository<T>` here; `ApplicationDbContext` (once it has entities, from Story 004 on) is the data-access layer, injected directly into services.
- **EF Core / code-first direction:** `Data/ApplicationDbContext.cs` — empty `DbContext`, registered via `AddDbContext<ApplicationDbContext>`, reading a `ConnectionStrings:Sql` configuration name (the value itself is supplied later, by `3DW-STORY-001D`'s `.env.example` addition — not duplicated here).
- **Centralized exception handling baseline:** ASP.NET Core's built-in `services.AddProblemDetails()` + `app.UseExceptionHandler()`, configured for the problem-details shape (`type, title, status, detail, instance`) from `api-and-data-design.md`. Covers only the generic/unhandled-exception path (HTTP 500) — no tenant/auth (401/403) or data-quality (422) categories exist yet.
- **Dependency injection baseline:** `Program.cs` registers `IHealthService -> HealthService` (Scoped) and `ApplicationDbContext` (Scoped), plus `AddControllers()` and `AddProblemDetails()`. Establishes the Scoped-lifetime convention for request-bound services and the DbContext, for later modules to reuse.
- **Coding standards applied (C#/.NET guideline):** file-scoped namespaces, `PascalCase` classes/methods, `camelCase` params/locals, `_camelCase` private fields, K&R braces, 4-space indentation, 120-character line limit, XML doc comments on the controller's and service's public members, specific-exception handling only (no bare `catch (Exception)` without justification — not exercised meaningfully here, since there's no risky logic beyond the framework's own pipeline).

## Frontend design

Not applicable — explicitly out of scope for this story (`3DW-STORY-001B`).

## Data/model design

No entities yet. `ApplicationDbContext` exists but is empty — establishes the code-first direction without speculative schema, per the parent LLD's rationale.

## API contract design

| | |
|---|---|
| Route | `GET /health` |
| Request | None |
| Response (200) | `HealthStatusDto` -> `{ "status": "ok" }` |
| Validation | None |
| Error behavior | Unhandled exceptions return the baseline problem-details shape (500) |
| Tenant context | Not applicable yet |
| Authorization | Not applicable yet (Story 002) |
| Pagination/filter/search | Not applicable |

## UI behavior

Not applicable — backend only.

## Multitenancy handling

Not applicable to this story — no tenant-scoped data exists yet. Stated explicitly per the skill's Multitenancy Rules, not left silent.

## Exception/error handling

Covered under Backend design above. **Backlog overlap note, carried from the parent LLD:** this baseline narrows the remaining scope of `3DW-STORY-003` (Backend error-contract baseline) to extending this story's middleware with the tenant/auth and data-quality categories, rather than building it from scratch — a backlog-maintenance item for a human, not acted on here.

## Security considerations

No secrets committed (the `ConnectionStrings:Sql` name is added by `3DW-STORY-001D`, value never committed). The exception-handling baseline must not leak stack traces or internal details in its response body (OWASP: sensitive data exposure) — satisfied by `AddProblemDetails()`'s default behavior outside `Development`.

## Observability/logging considerations

Minimal: default ASP.NET Core request logging plus one startup log line. Structured-logging convention (level, message, contextual fields per the C#/.NET guideline) documented here for reuse from Story 002 onward, where tenant-tagged logging begins — not exercised meaningfully by a health check.

## Performance considerations

None — a health endpoint has no meaningful performance profile.

## Edge cases

- No database reachable: does not block this story's endpoint, since `ApplicationDbContext` is never opened for a query here.
- Backend fails to start due to misconfiguration: standard ASP.NET Core startup failure behavior; no special handling designed for this story.

## Implementation sequence

1. Scaffold the backend project/solution.
2. Add `HealthStatusDto`, `IHealthService`/`HealthService`, `HealthController`.
3. Add empty `ApplicationDbContext`, registered via DI.
4. Wire exception-handling baseline (`AddProblemDetails()`, `UseExceptionHandler()`).
5. Add `HealthServiceTests` (unit) and `HealthControllerTests` (integration, including the forced-exception case).

## Rollback considerations

Low risk: entirely new, isolated `backend/` directory; no existing files modified. Reverting the PR removes the directory with no other impact.

## Open questions

- AutoMapper vs. manual mapping — manual assumed for now; confirm before Story 004's first real entity mapping (unchanged from the parent LLD).
- Electron bundler choice, backend port/dev-URL convention — not this story's concern; tracked against `3DW-STORY-001B`/`001D` respectively.
- `3DW-STORY-003`'s description should be updated to reflect its narrowed remaining scope (see Exception/error handling) — a backlog-maintenance item for a human.
