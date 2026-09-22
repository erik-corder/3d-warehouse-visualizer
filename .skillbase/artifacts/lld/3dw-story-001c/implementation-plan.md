# Implementation Plan: 3DW-STORY-001C

Companion to `low-level-design.md` and `file-impact-map.md`. **Planning only — no code is created by this document.** Single PR (12-13 files, M) — no split needed.

## Implementation steps

1. Add the five token modules (`colors.ts`, `spacing.ts`, `typography.ts`, `radius.ts`, `shadows.ts`) plus their `index.ts` barrel.
2. Add `styles/theme.css`, expressing the same values as CSS custom properties; import it once (e.g. from `main.tsx` or `App.tsx`).
3. Add `StatusBadge.tsx` (typed props, `role="status"`, text-based label per state) + `StatusBadge.module.css` (referencing `theme.css`'s variables) + barrel `index.ts`.
4. Add `StatusBadge.test.tsx` (four cases: three states + the text-label accessibility assertion).
5. Modify `App.tsx`: import `StatusBadge` and `theme.css`, replace the three conditional `<p role="status">` blocks with one `<StatusBadge status={connectionState} />`.
6. Run `App.test.tsx`; update assertions only if the swap requires it (expected: no changes needed).
7. Manual verification against the real backend flow established by `3DW-STORY-001B`.

## Recommended order

As listed — tokens before styles (styles reference token values conceptually), styles before the atom (the atom's CSS references the theme variables), the atom and its test before wiring it into `App.tsx` (verify the atom works in isolation first), `App.tsx` last (smallest, most reviewable final diff).

## Checkpoints

- After step 4: `StatusBadge` renders correctly and passes its own tests, in isolation from `App.tsx`.
- After step 5: `npm run build` succeeds; app visually shows the correct status via `StatusBadge`.
- After step 6: full test suite (`StatusBadge.test.tsx` + `App.test.tsx`) passes.
- After step 7: manual check against the live `3DW-STORY-001A` backend confirms no regression from `001B`'s established behavior.

## Validation commands expected later

See `test-design.md` ("Expected validation commands for later implementation").

## Definition of done

- `npm run test` passes (all `StatusBadge.test.tsx` cases plus `App.test.tsx`, unchanged or updated as needed).
- `npm run lint`/`format:check`/`typecheck` pass.
- `npm run build` succeeds.
- Manual check confirms `StatusBadge` renders correctly against the real backend for both connected and not-connected states.
- No new dependencies added; no files outside this story's scope touched (especially: no `3DW-STORY-001A`/`001B` evidence files, no backend, no Docker Compose, no 3D code).

## Evidence to capture during implementation

- `npm run test`/`lint`/`format:check`/`typecheck`/`build` output.
- A screenshot or terminal capture of the app showing the `StatusBadge`-rendered status against the real backend.

## PR description outline

```text
## What
Design system foundation: tokens, theme.css, StatusBadge atom, wired into App.tsx
in place of the prior ad hoc status markup.

## Why
3DW-STORY-001C (child of 3DW-STORY-001). See .skillbase/artifacts/lld/3dw-story-001c/.

## How to verify
[Exact commands from test-design.md]

## Out of scope
Backend (3DW-STORY-001A), Docker Compose (3DW-STORY-001D), 3D rendering,
any further design-system components beyond StatusBadge.
```
