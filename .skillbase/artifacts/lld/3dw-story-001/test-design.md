# Test Design: 3DW-STORY-001

**Run 2** — expanded for the added controller/service/DbContext/design-system layers. Companion to `low-level-design.md`. Test design only — no test code is written here.

## Unit tests

- **Backend:** `HealthServiceTests` — `HealthService` returns a `HealthStatusDto` with `Status == "ok"`. Trivial, but establishes the unit-test pattern (service tested independent of the HTTP layer) for later services.
- **Frontend:** `StatusBadge.test.tsx` — renders correctly for each of the three `status` values (`loading`, `connected`, `not-connected`), including that the text label (not color alone) differs per state (accessibility).

## Integration tests

- **Backend:** `HealthControllerTests` — using `WebApplicationFactory`, call `GET /health` end to end (through the controller, DI container, and `AddProblemDetails()`/`UseExceptionHandler()` pipeline), assert `200` and body `{ "status": "ok" }`. A second case forces an unhandled exception (e.g. via a test-only failing service registration) and asserts the response matches the baseline problem-details shape (`type, title, status, detail, instance`), with no stack trace present.

## API tests

Covered by `HealthControllerTests` above.

## Frontend/component tests

- `App.test.tsx` — same three states as run 1 (loading/connected/not-connected via mocked `fetch`), now asserting the `StatusBadge` atom is rendered with the corresponding prop rather than ad hoc markup.
- `StatusBadge.test.tsx` — isolated component test (see Unit tests above).

## Manual QA checklist

Same five steps as run 1's checklist, plus:
6. Confirm `npm run lint` and `npm run format:check` (or equivalent) pass cleanly on a fresh checkout.
7. Confirm a deliberately malformed commit (e.g. inconsistent quote style) is caught by the Husky/lint-staged pre-commit hook before it can be committed.
8. Confirm the forced-exception case (see Integration tests) returns a problem-details body with no stack trace or internal exception message when run outside the `Development` environment.

## Tenant isolation tests

Not applicable — unchanged from run 1 (no tenant-scoped data or endpoints exist yet).

## Error handling tests

- Backend unreachable: unchanged from run 1 (frontend shows "Not connected").
- Malformed/unexpected health response: unchanged from run 1.
- **New:** unhandled backend exception returns the baseline problem-details shape, not a raw 500 HTML error page or a leaked stack trace.

## Regression risks

Unchanged core risk from run 1 (later stories assuming guarantees this story doesn't actually provide, e.g. SQL connectivity). **New risk:** because this run establishes real architectural patterns (controller/service/DbContext, DI, exception handling), later stories are now more likely to copy this story's conventions directly — meaning any convention chosen here (e.g. manual mapping over AutoMapper, Scoped DI lifetimes) has outsized influence on the codebase. Recommend explicit confirmation of the Open Questions in `low-level-design.md` before, not after, Story 004 begins.

## Expected validation commands for later implementation

```bash
# Backend
dotnet test backend/WarehouseVisualizer.sln

# Frontend
npm --prefix frontend run test
npm --prefix frontend run lint
npm --prefix frontend run format:check

# Compose
docker compose up --build
curl -f http://localhost:<port>/health
```

(Exact commands/paths to be confirmed during implementation planning; recorded here as the expected shape, not a final contract.)
