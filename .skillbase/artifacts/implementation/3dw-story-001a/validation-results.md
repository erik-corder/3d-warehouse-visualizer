# Validation Results: 3DW-STORY-001A

Per `.skillbase/artifacts/lld/3dw-story-001a/test-design.md` ("Expected validation commands").

## Commands run

```bash
dotnet build backend/WarehouseVisualizer.sln
dotnet test backend/WarehouseVisualizer.sln
dotnet run --project backend/src/WarehouseVisualizer.Api --urls http://localhost:5299   # manual, backgrounded, killed after check
curl -sS -i http://localhost:5299/health
git add -n backend   # dry-run, to verify exact tracked file set and confirm no bin/obj leakage
```

## Command results

### `dotnet build`

**Succeeded.** 0 errors, 4 warnings — all four are the same `NU1903` advisory (`Microsoft.OpenApi` 2.0.0, `GHSA-v5pm-xwqc-g5wc`), duplicated across the two projects' restore and build passes. See Known limitations in `implementation-summary.md`.

### `dotnet test`

**Passed: 3, Failed: 0, Skipped: 0.** Duration ~1s.
- `HealthServiceTests.GetStatus_ReturnsOk` — PASS
- `HealthControllerTests.GetHealth_ReturnsOkWithStatus` — PASS
- `HealthControllerTests.GetHealth_WhenServiceThrows_ReturnsProblemDetailsWithoutLeakingDetail` — PASS

### Manual run + curl

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"status":"ok"}
```
Matches the approved acceptance criterion exactly. The app logged a benign `Failed to determine the https port for redirect` warning, expected since the manual check bound HTTP only (no HTTPS profile provided) — not a defect, not present under the normal `dotnet run` launch profile which includes both.

### `git add -n backend` (dry run)

14 files staged-if-added; 0 matched `bin/`/`obj/` patterns — confirms build output stays out of version control via the existing root `.gitignore`, with no story-specific `.gitignore` change needed (matching the file-impact-map's original claim).

## Test results

All 3 automated tests pass. The forced-exception integration test specifically confirms: HTTP 500, `Content-Type: application/problem+json`, and the response body contains neither the simulated exception's message (`"Simulated failure for HealthControllerTests"`) nor a stack-trace frame (`"at WarehouseVisualizer"`) — satisfying the acceptance criterion's "no stack trace or internal exception message" requirement. (Note: this holds regardless of environment, since `UseExceptionHandler()` without a custom handler never surfaces exception detail by default — stricter than the criterion's "outside the Development environment" qualifier requires, not weaker.)

## Failures and classification

None. All commands and tests succeeded on the first run; no retries were needed.

## Skipped validations and why

- **Frontend lint/typecheck/test commands:** not applicable — this story is backend-only by explicit scope.
- **`docker compose config`:** not applicable — Docker Compose is `3DW-STORY-001D`'s scope, not this story's; no `docker-compose.yml` exists yet.
- **`dotnet restore` as a standalone step:** folded into `dotnet build`/`dotnet test`, which restore automatically; running it separately would have been redundant.

## Residual risks

1. **`NU1903` (`Microsoft.OpenApi` 2.0.0) advisory** — template-introduced, not fixed in this story; tracked as a follow-up item in `implementation-summary.md`.
2. ~~Two files not itemized in `file-impact-map.md`~~ (`backend/src/WarehouseVisualizer.Api/Properties/launchSettings.json`, `backend/tests/WarehouseVisualizer.Api.Tests/WarehouseVisualizer.Api.Tests.csproj`) — **resolved 2026-09-22:** approved via `.skillbase/artifacts/evidence/3DW-STORY-001A-scope-change-approval.md`; see the Scope deviations section in `implementation-summary.md`.
3. **No real database connectivity is exercised** — by design for this story, but means `AddDbContext`/`UseSqlServer`'s configuration has not been validated against an actual SQL instance; that first happens when a later story (004+) queries through it.
