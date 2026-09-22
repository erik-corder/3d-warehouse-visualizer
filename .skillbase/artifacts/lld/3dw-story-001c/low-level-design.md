# Low-Level Design: 3DW-STORY-001C

**Draft LLD evidence, not an implementation. Human approval is still required before implementation planning or coding.**

## Story ID / Title / Type / Parent

`3DW-STORY-001C` — Design system foundation — **foundation-enabler** — child of `3DW-STORY-001` (split approved: `.skillbase/artifacts/evidence/3DW-STORY-001-split-human-approval.md`).

## Source acceptance criteria

```text
Given the StatusBadge component receives status="connected"
When it renders
Then it displays a "Connected" text label distinguishable without relying on color alone

Given App.tsx is updated to use StatusBadge
When the app runs against a live or unreachable backend
Then the displayed status is visually identical in meaning to 3DW-STORY-001B's behavior, now sourced from the shared component
```
(from `.skillbase/artifacts/stories/child-story-outlines.md`)

## Summary

A small, reusable design-system foundation for the Electron/React/TypeScript app: design tokens (colors, spacing, radius, typography, shadows), a CSS-variable theme structure, and one atom component (`StatusBadge`), wired into `App.tsx` only enough to prove the system works — replacing `3DW-STORY-001B`'s ad hoc status text with the same three states, sourced from the shared component. Frontend only.

## Scope

- `src/renderer/design-system/tokens/` — token values (colors, spacing, radius, typography, shadows) as typed TypeScript constants.
- `src/renderer/design-system/styles/` — a base CSS file defining the tokens as CSS custom properties (`:root` variables) and minimal global/theme structure.
- `src/renderer/design-system/components/atoms/StatusBadge/` — one atom component (`StatusBadge.tsx` + a co-located CSS Module), typed via a shared `IHealthStatus`-style contract.
- Modify `App.tsx` to compose `StatusBadge` in place of its existing ad hoc `<p role="status">` markup — the minimum wiring needed to prove the design system works end to end, not a UI redesign.
- A component test for `StatusBadge`, and an update to `App.test.tsx`'s assertions if the swap changes what they query for.

## Out of scope

**Explicitly excluded by this story's own scope statement:** backend code (`3DW-STORY-001A`, already implemented/merged), Docker Compose (`3DW-STORY-001D`), any 3D rendering, any change to `3DW-STORY-001A` or `3DW-STORY-001B`'s evidence files. Also out of scope, per the Senior Engineering Principles and the explicit design-system expectations: a full component library beyond `StatusBadge`, additional component libraries or dependencies not already approved, any broader UI redesign of `App.tsx` beyond the status display, and a theming/dark-mode switcher (tokens support it structurally via CSS variables, but no runtime theme-switching UI is built here).

## Assumptions

- Styling approach: CSS Modules (`StatusBadge.module.css`), consistent with `3DW-STORY-001B`'s own `low-level-design.md`, which already named this as the chosen approach ("no new runtime dependency, boring technology"). No CSS-in-JS or utility-CSS framework is introduced.
- Token format: plain TypeScript objects/`const` exports (e.g. `export const colors = { ... } as const`) for type-safe consumption in components, mirrored as CSS custom properties in a base stylesheet for actual styling — two representations of the same values, not duplicated business logic.
- `StatusBadge`'s prop contract reuses the `status: 'loading' | 'connected' | 'not-connected'` union already defined inline in `3DW-STORY-001B`'s `App.tsx`; this story promotes it to a shared, exported type under the design-system's typed contracts rather than redefining it.

## Dependencies

Depends on `3DW-STORY-001B` (needs `App.tsx` and the frontend app shell to already exist, to modify it). `3DW-STORY-001B` is implemented and `PASS_IMPLEMENTATION` (`.skillbase/artifacts/evidence/3DW-STORY-001B-implementation-validation.md`). No dependency on `3DW-STORY-001A` beyond what `001B` already established (backend is not touched here).

## Affected architecture areas

`high-level-design.md` (Frontend architecture); TypeScript coding guideline (Confluence IAPD/373751928) — component-based architecture, naming conventions; Linters & Code Formatters (Confluence TD/102924295) — both applied per `.skillbase/artifacts/standards/engineering-standards-sources.md`, Next.js-specific content excluded per that source's own instruction (unchanged rationale from `3DW-STORY-001A`/`001B`'s LLDs).

## Proposed design

```text
frontend/src/renderer/design-system/
  tokens/
    colors.ts
    spacing.ts
    typography.ts
    radius.ts
    shadows.ts
    index.ts                          (re-exports all token modules)
  styles/
    theme.css                         (CSS custom properties, generated conceptually from tokens/)
  components/
    atoms/
      StatusBadge/
        StatusBadge.tsx
        StatusBadge.module.css
        StatusBadge.test.tsx
        index.ts                      (barrel export)

frontend/src/renderer/App.tsx          (modified: composes StatusBadge)
frontend/src/renderer/App.test.tsx     (modified only if assertions need updating for the swap)
```

Atomic structure: `tokens/` (design values) -> `styles/` (tokens expressed as CSS) -> `components/atoms/` (the first, smallest reusable UI building block). No molecules/organisms introduced yet — `StatusBadge` is the only atom this story needs, per its own acceptance criteria; further atoms are added by later UI stories (005-012 in the original backlog) as they need them, not spun up speculatively here.

## Backend design

Not applicable — explicitly out of scope.

## Frontend design

- **Tokens (`design-system/tokens/`):** typed `const` objects per category — `colors` (a small palette: background, surface, text, border, and semantic status colors for connected/loading/not-connected), `spacing` (a small numeric scale, e.g. 4/8/12/16/24px), `radius` (e.g. small/medium), `typography` (font family, a small size scale, weight), and `shadows` (one or two elevation levels) if the atom's visual design calls for one — kept minimal, not a full scale system, per "avoid large UI redesign."
- **Theme structure (`design-system/styles/theme.css`):** the same values expressed as `:root` CSS custom properties (e.g. `--color-status-connected`, `--spacing-sm`), imported once (in `main.tsx` or `App.tsx`) so all design-system components can reference `var(--...)` in their CSS Modules without re-declaring values. This is the "base CSS variables" the story scope asks for.
- **`StatusBadge` atom:** a small, typed component (`status: 'loading' | 'connected' | 'not-connected'`, optionally a `label` override) rendering a text label (never color-only, preserving `3DW-STORY-001B`'s accessibility decision) styled via CSS Module referencing the theme's CSS variables. `role="status"` is preserved from `001B`'s original markup (accessibility: assistive tech announces status changes).
- **Wiring into `App.tsx`:** replace the three conditional `<p role="status">...</p>` blocks with a single `<StatusBadge status={connectionState} />`. This is the "wire into App.tsx only enough to prove the design system works" instruction — no other part of `App.tsx` changes (the `fetch`/proxy/CORS logic from `001B` is untouched).
- **TypeScript strictness:** unchanged, inherited from `001B`'s `tsconfig.json` (`strict: true`); `StatusBadge`'s props are explicitly typed, no `any`.
- **ESLint/Prettier expectations:** unchanged rule set from `001B` (`.eslintrc.cjs`, `.prettierrc` already exist and apply automatically to new files under `frontend/`); no new lint configuration needed for this story.
- **Naming conventions:** `PascalCase` component (`StatusBadge`), `camelCase` token export names, CSS Module class names in `camelCase` (matching the TypeScript guideline's general conventions), barrel `index.ts` files for clean imports (`import { StatusBadge } from '../design-system/components/atoms/StatusBadge'`).
- **No Next.js-specific implementation:** confirmed — plain React components and CSS Modules, no Next.js APIs anywhere.
- **No new component libraries:** confirmed — no dependency additions beyond what `001B` already installed (React, TypeScript, Vitest/RTL for testing). CSS Modules require no new runtime dependency (Vite supports them natively).

## Data/model design

Not applicable — no data model in this story.

## API contract design

Not applicable — this story does not call any API; it only changes how `3DW-STORY-001B`'s existing health-check result is *displayed*.

## UI behavior

Visually equivalent in meaning to `3DW-STORY-001B`'s three states (loading/connected/not-connected), now rendered through the shared `StatusBadge` atom instead of ad hoc markup. No new states, no new user interactions, no layout redesign beyond what's needed to host the atom in `App.tsx`.

## Multitenancy handling

Not applicable to this story — no tenant-scoped data or endpoints are involved (the design system and `StatusBadge` are presentation-only, consuming the same non-tenant-scoped health-check result `3DW-STORY-001B` already produces). Stated explicitly per the skill's Multitenancy Rules, not left silent.

## Exception/error handling

Not applicable — no new error paths are introduced. `StatusBadge` is a pure presentational component (given a valid `status` prop, it renders deterministically); it does not perform I/O, so it has nothing new to fail. `App.tsx`'s existing exception handling (from `001B`) is untouched.

## Security considerations

No new attack surface: no new dependencies, no new I/O, no secrets. CSS Modules are build-time-scoped class names, not a runtime security concern.

## Observability/logging considerations

None — no new logging needed for a presentational component.

## Performance considerations

None — a single small atom and a handful of CSS custom properties have no meaningful performance profile.

## Edge cases

- `StatusBadge` receiving an unexpected/future status value: not a concern for this story, since the `ConnectionState` union type (loading/connected/not-connected) is exhaustive and TypeScript's exhaustiveness checking (or a simple fallback render) covers it — no runtime string values reach the component that TypeScript didn't already validate at the call site.
- CSS custom properties not loaded before first render: `theme.css` is imported statically (not lazily), so this is not a real risk in practice; not solved with special-case code.

## Implementation sequence

1. Add token modules (`colors.ts`, `spacing.ts`, `typography.ts`, `radius.ts`, `shadows.ts`, `index.ts`).
2. Add `styles/theme.css` (CSS custom properties derived from the tokens), imported once.
3. Add `StatusBadge.tsx` + `StatusBadge.module.css` + barrel `index.ts`.
4. Add `StatusBadge.test.tsx`.
5. Modify `App.tsx` to compose `StatusBadge`; update `App.test.tsx` assertions only if needed (they should mostly still pass, since they query by rendered text, not markup structure — see `3DW-STORY-001B`'s `story-slicing-review.md`-equivalent forward-compatibility note in its own LLD).
6. Manual verification: app still shows the correct state against the real `3DW-STORY-001A`/`001B` backend flow, now via `StatusBadge`.

## Rollback considerations

Low risk: new, isolated `design-system/` directory; the only modified existing file is `App.tsx` (and possibly `App.test.tsx`), both small, single-purpose diffs. Reverting the PR removes the new directory and reverts the `App.tsx`/`App.test.tsx` changes with no other impact.

## Open questions

- Exact color palette values (hex/HSL) are not specified by any discovery or architecture source — this LLD names the token *categories* (background, surface, text, border, status colors) but leaves final values to implementation, choosing simple, accessible, professional defaults (e.g. sufficient contrast for text-on-background) rather than a fixed brand palette, since none has been approved yet. Flagged for a design/branding decision later, not a blocker for this small a scope.
- Whether `App.test.tsx`'s existing assertions (querying by text) need any change after the `StatusBadge` swap — expected to be minimal to none, confirmed during implementation, not decided here.
