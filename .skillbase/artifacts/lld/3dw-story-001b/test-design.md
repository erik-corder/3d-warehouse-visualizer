# Test Design: 3DW-STORY-001B

Companion to `low-level-design.md`. Test design only — no test code is written here.

## Unit tests

None beyond the component test below — there is no non-UI logic to unit-test in isolation for this story.

## Integration tests

Not applicable in the backend sense; the closest equivalent is the manual, real-backend verification in the Manual QA checklist below, since `3DW-STORY-001A`'s API is already implemented and running.

## API tests

Not applicable — this story consumes an existing, already-tested API (`3DW-STORY-001A`'s `HealthControllerTests`); it does not define new API behavior.

## Frontend/component tests

- `App.test.tsx`:
  - Mocked `fetch` resolving `200 { "status": "ok" }` -> renders "Connected".
  - Mocked `fetch` rejecting (network error) -> renders "Not connected".
  - Mocked `fetch` resolving with a non-200 status -> renders "Not connected".
  - Mocked `fetch` resolving `200` with a malformed/unexpected body -> renders "Not connected" (does not trust an unverified shape as success).
  - Initial render, before the mocked fetch resolves -> renders the loading state.

## Manual QA checklist

1. `npm run lint` and `npm run format:check` (or equivalent) pass cleanly on a fresh checkout.
2. A deliberately malformed commit (e.g. inconsistent quote style) is blocked by the Husky/lint-staged pre-commit hook.
3. With `3DW-STORY-001A`'s backend running (`dotnet run --project backend/src/WarehouseVisualizer.Api`), launch the Electron app and confirm it shows "Connected" — a real, not mocked, end-to-end check.
4. Stop the backend; relaunch or refresh the Electron app; confirm it shows "Not connected" without crashing.
5. Confirm `contextIsolation`/`nodeIntegration`/`sandbox` settings are present in the `BrowserWindow` configuration (a code-review check, not an automated test).
6. Confirm no secrets or API keys are present in any committed file (there should be none in this story).

## Tenant isolation tests

Not applicable — no tenant-scoped data or endpoints are involved.

## Error handling tests

Covered by the four failure-mode component tests above (network error, non-200, malformed body, and — implicitly — the loading state never getting stuck if the request never resolves, via a reasonable fetch timeout).

## Regression risks

Low — new, isolated code. The main forward risk: `3DW-STORY-001C` will modify `App.tsx` to compose the `StatusBadge` design-system component in place of this story's ad hoc markup; `App.test.tsx`'s assertions should target visible text/roles rather than implementation-specific markup structure, so they remain valid (or need only minor updates) after that swap.

## Expected validation commands for later implementation

```bash
npm --prefix frontend install
npm --prefix frontend run lint
npm --prefix frontend run format:check
npm --prefix frontend run test
npm --prefix frontend run dev   # manual verification against the running backend
```

(Exact script names/paths to be confirmed during implementation planning; recorded here as the expected shape, not a final contract.)
