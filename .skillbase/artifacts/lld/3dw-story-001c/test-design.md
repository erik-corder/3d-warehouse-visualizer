# Test Design: 3DW-STORY-001C

Companion to `low-level-design.md`. Test design only — no test code is written here.

## Unit tests

None beyond the component test below — tokens are plain data (no logic to unit-test) and `theme.css` is declarative.

## Integration tests

Not applicable — no API, no backend, no cross-process behavior in this story.

## API tests

Not applicable.

## Frontend/component tests

- `StatusBadge.test.tsx`:
  - `status="loading"` renders the expected loading label.
  - `status="connected"` renders "Connected" (or the agreed label) with `role="status"`.
  - `status="not-connected"` renders "Not connected" with `role="status"`.
  - The rendered output for each state includes a distinct **text** label (not relying on a CSS class or color alone) — the accessibility requirement from the acceptance criteria, asserted directly (e.g. via `getByText`, not by inspecting computed styles).
- `App.test.tsx` (existing, from `3DW-STORY-001B`): re-run unchanged if possible; updated only if the `StatusBadge` swap changes what needs to be queried. The five existing cases (loading, connected, network error, non-200, malformed body) should continue to pass, since they assert on visible text, which `StatusBadge` still renders.

## Manual QA checklist

1. `npm run lint`, `npm run format:check`, `npm run typecheck` all pass on a fresh checkout.
2. `npm run test` passes, including both `StatusBadge.test.tsx` and the (possibly updated) `App.test.tsx`.
3. `npm run build` (`electron-vite build`) succeeds.
4. Launch the app against the real, running `3DW-STORY-001A` backend (as `3DW-STORY-001B`'s own manual QA already established); confirm the status now renders via `StatusBadge` and is visually correct for both the connected and not-connected cases.
5. Visual check: the status label remains legible and distinguishable without relying on color (e.g. view with a grayscale filter or simply confirm the text itself conveys the state).

## Tenant isolation tests

Not applicable — no tenant-scoped data or endpoints are involved.

## Error handling tests

Not applicable — `StatusBadge` has no I/O and no failure modes of its own; `App.tsx`'s existing error handling (from `001B`) is unchanged and already covered by `App.test.tsx`.

## Regression risks

Low. The main risk is `App.test.tsx` assertions coupling to markup structure rather than visible text — if so, the `StatusBadge` swap could break existing tests for reasons unrelated to actual behavior. Mitigated by keeping assertions text/role-based (already the pattern `001B` used) and by explicitly checking this during implementation (see `low-level-design.md`, Open questions).

## Expected validation commands for later implementation

```bash
npm --prefix frontend run lint
npm --prefix frontend run format:check
npm --prefix frontend run typecheck
npm --prefix frontend run test
npm --prefix frontend run build
```

(Same commands `3DW-STORY-001B` already established; no new tooling commands needed for this story.)
