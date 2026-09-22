<!--
DRAFT — not yet postable as-is. This PR body assumes the story's changes live on a
dedicated story branch. As of this draft (2026-09-22), they instead sit on
`chore/skillbase-foundation`, mixed with unrelated governance-foundation commits.
See .skillbase/artifacts/pr/3dw-story-001a/pr-validation.md before using this body.
-->

## Summary

Implements a minimal .NET 10 backend skeleton establishing the controller -> service -> DTO
pattern, an empty EF Core `DbContext` (code-first direction, no entities yet), a centralized
exception-handling baseline, and dependency injection wiring. Backend only, per this child
story's explicit scope.

## Story

- **Story ID:** 3DW-STORY-001A
- **Title:** Backend solution skeleton
- **Type:** foundation-enabler (child of 3DW-STORY-001)
- **LLD:** `.skillbase/artifacts/lld/3dw-story-001a/low-level-design.md`
- **LLD approval:** `.skillbase/artifacts/evidence/3DW-STORY-001A-lld-human-approval.md`

## Scope

- `HealthController` (`GET /health`) -> `IHealthService`/`HealthService` -> `HealthStatusDto`
- Empty `ApplicationDbContext` (no `DbSet`s), registered via `AddDbContext`/`UseSqlServer`
- Centralized exception-handling baseline (`AddProblemDetails()` + `UseExceptionHandler()`)
- DI wiring (Scoped lifetimes for `IHealthService` and `ApplicationDbContext`)
- Backend project/solution scaffold and test project

## Out of Scope

Frontend (3DW-STORY-001B), design system (3DW-STORY-001C), Docker Compose (3DW-STORY-001D),
tenancy (Story 002), real domain entities (Story 004+), AutoMapper (manual mapping used for now).

## Files Changed

**Backend:**
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
- `backend/src/WarehouseVisualizer.Api/Properties/launchSettings.json` (template scaffold, approved as a scope addition)

**Tests:**
- `backend/tests/WarehouseVisualizer.Api.Tests/HealthControllerTests.cs`
- `backend/tests/WarehouseVisualizer.Api.Tests/HealthServiceTests.cs`
- `backend/tests/WarehouseVisualizer.Api.Tests/WarehouseVisualizer.Api.Tests.csproj` (template scaffold, approved as a scope addition)

**Documentation/evidence:**
- `.skillbase/artifacts/implementation/3dw-story-001a/implementation-summary.md`
- `.skillbase/artifacts/implementation/3dw-story-001a/validation-results.md`
- `.skillbase/artifacts/evidence/3DW-STORY-001A-implementation-validation.md`
- `.skillbase/artifacts/evidence/3DW-STORY-001A-scope-change-approval.md`

**Tooling/config:** none introduced by this story's own scope. (Note: as currently committed on `chore/skillbase-foundation`, an unrelated `.claude/skills/implement-story/SKILL.md` addition and a `.skillbase/skills.lock` update are bundled into the same commit as this story's code — see pr-validation.md. Neither belongs in this story's PR.)

## Validation

```text
dotnet build backend/WarehouseVisualizer.sln: passed, 0 errors (4 pre-existing NU1903 warnings)
dotnet test backend/WarehouseVisualizer.sln: passed, 3/3
manual curl /health: passed — 200 {"status":"ok"}
manual forced-exception check: passed — 500, application/problem+json, no leaked detail
```

## Evidence

- `.skillbase/artifacts/implementation/3dw-story-001a/implementation-summary.md`
- `.skillbase/artifacts/implementation/3dw-story-001a/validation-results.md`
- `.skillbase/artifacts/evidence/3DW-STORY-001A-implementation-validation.md`
- `.skillbase/artifacts/evidence/3DW-STORY-001A-scope-change-approval.md`

## Scope Changes

Two template-scaffold files not itemized in the original `file-impact-map.md` were approved as an addition (`.skillbase/artifacts/evidence/3DW-STORY-001A-scope-change-approval.md`): `Properties/launchSettings.json` and the test project's `.csproj`. No functional scope changed; the implementation remains within the approved M-size guardrail (14 files).

## Risks / Follow-ups

```text
Template dependency Microsoft.OpenApi 2.0.0 has known advisory NU1903 / GHSA-v5pm-xwqc-g5wc. Not fixed in this story because OpenAPI tooling was outside approved scope.
```

## Human Review Checklist

- [ ] Story scope matches approved LLD
- [ ] No unrelated files included
- [ ] Tests pass
- [ ] Scope-change approval reviewed, if applicable
- [ ] Security/package advisory follow-up considered
- [ ] No workflow stage is advanced by this PR
- [ ] **Branch contains only this story's changes** (currently failing — see pr-validation.md)
