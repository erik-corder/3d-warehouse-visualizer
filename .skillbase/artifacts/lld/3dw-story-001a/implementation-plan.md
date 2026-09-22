# Implementation Plan: 3DW-STORY-001A

Companion to `low-level-design.md` and `file-impact-map.md`. **Planning only — no code is created by this document.** Single PR (12 files, M) — no further split needed.

## Implementation steps

1. Scaffold `backend/src/WarehouseVisualizer.Api` (.NET 10 Web API, minimal hosting, file-scoped namespaces).
2. Add `Dtos/HealthStatusDto.cs`.
3. Add `Services/IHealthService.cs` and `Services/HealthService.cs`.
4. Add `Controllers/HealthController.cs` (`GET /health`).
5. Add `Data/ApplicationDbContext.cs` (empty, no `DbSet`s), register via `AddDbContext`.
6. Wire `Program.cs`: `AddControllers()`, `AddScoped<IHealthService, HealthService>()`, `AddProblemDetails()`, `UseExceptionHandler()`.
7. Add `appsettings.json` / `appsettings.Development.json` with a `ConnectionStrings:Sql` name placeholder (empty value).
8. Add `HealthServiceTests` (unit) and `HealthControllerTests` (integration, including the forced-exception case).

## Recommended order

As listed — DTO and service before the controller that depends on them; `ApplicationDbContext` and DI wiring can proceed in parallel with the controller/service work, since neither depends on the other; tests follow their respective units.

## Checkpoints

- After step 4: `dotnet run`, `curl /health` returns the DTO shape.
- After step 6: forced-exception case returns the baseline problem-details shape.
- After step 8: `dotnet test` passes for both test files.

## Validation commands expected later

See `test-design.md` ("Expected validation commands for later implementation").

## Definition of done

- `dotnet test` passes (both `HealthServiceTests` and `HealthControllerTests`).
- `GET /health` returns `200` with `{ "status": "ok" }` when run natively.
- The forced-exception case returns the baseline problem-details shape with no leaked detail outside `Development`.
- No secrets committed.

## Evidence to capture during implementation

- `dotnet test` output (pass/fail, counts).
- `curl` output for both the happy-path and forced-exception cases.

## PR description outline

```text
## What
Backend solution skeleton: HealthController -> HealthService -> HealthStatusDto,
empty ApplicationDbContext, centralized exception-handling baseline, DI wiring.

## Why
3DW-STORY-001A (child of 3DW-STORY-001). See .skillbase/artifacts/lld/3dw-story-001a/.

## How to verify
[Exact commands from test-design.md]

## Out of scope
Frontend (3DW-STORY-001B), design system (3DW-STORY-001C), Docker Compose (3DW-STORY-001D).
```
