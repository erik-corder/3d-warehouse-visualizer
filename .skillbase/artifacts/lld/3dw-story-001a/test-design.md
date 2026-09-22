# Test Design: 3DW-STORY-001A

Companion to `low-level-design.md`. Test design only — no test code is written here.

## Unit tests

- `HealthServiceTests` — `HealthService` returns a `HealthStatusDto` with `Status == "ok"`. Trivial, but establishes the unit-test pattern (service tested independent of the HTTP layer) for later services.

## Integration tests

- `HealthControllerTests` — using `WebApplicationFactory`, call `GET /health` end to end (through the controller, DI container, and `AddProblemDetails()`/`UseExceptionHandler()` pipeline), assert `200` and body `{ "status": "ok" }`. A second case forces an unhandled exception (e.g. via a test-only failing service registration) and asserts the response matches the baseline problem-details shape (`type, title, status, detail, instance`), with no stack trace present.

## API tests

Covered by `HealthControllerTests` above; no separate API-level suite needed for a single route.

## Frontend/component tests

Not applicable — backend only.

## Manual QA checklist

1. `dotnet run` starts the API without error.
2. `curl http://localhost:<port>/health` (or equivalent) returns `200` with `{ "status": "ok" }`.
3. Force an unhandled exception (e.g. a temporary test endpoint or a debugger-triggered throw) and confirm the response is a problem-details body, not a raw exception page, and contains no stack trace when run outside `Development`.
4. Confirm no secrets or real connection strings are present in any committed file.

## Tenant isolation tests

Not applicable — no tenant-scoped data or endpoints exist in this story.

## Error handling tests

- Unhandled exception -> problem-details shape, no leaked internal detail (see Integration tests).
- Malformed request to `/health` (e.g. unexpected verb `POST /health`) -> standard 404/405, not a crash.

## Regression risks

Minimal — new, isolated code with nothing else in the repository to regress. Main forward risk: `3DW-STORY-001D`'s Docker Compose work assumes this story's API can run and respond to `/health` inside a container — flag this explicitly for whoever picks up `001D`, since this story's own verification is native (`dotnet run`), not containerized.

## Expected validation commands for later implementation

```bash
dotnet test backend/WarehouseVisualizer.sln
dotnet run --project backend/src/WarehouseVisualizer.Api
curl -f http://localhost:<port>/health
```

(Exact paths/ports to be confirmed during implementation planning; recorded here as the expected shape, not a final contract.)
