# File Impact Map: 3DW-STORY-001C

Companion to `low-level-design.md`. This is a map for future implementation; no implementation files are created by this LLD.

## Expected files to create

**Design-system tokens (6):**
- `frontend/src/renderer/design-system/tokens/colors.ts`
- `frontend/src/renderer/design-system/tokens/spacing.ts`
- `frontend/src/renderer/design-system/tokens/typography.ts`
- `frontend/src/renderer/design-system/tokens/radius.ts`
- `frontend/src/renderer/design-system/tokens/shadows.ts`
- `frontend/src/renderer/design-system/tokens/index.ts`

**Design-system styles (1):**
- `frontend/src/renderer/design-system/styles/theme.css`

**Design-system atom (4):**
- `frontend/src/renderer/design-system/components/atoms/StatusBadge/StatusBadge.tsx`
- `frontend/src/renderer/design-system/components/atoms/StatusBadge/StatusBadge.module.css`
- `frontend/src/renderer/design-system/components/atoms/StatusBadge/index.ts`
- `frontend/src/renderer/design-system/components/atoms/StatusBadge/StatusBadge.test.tsx`

**Total new files: 11**

## Expected files to modify

- `frontend/src/renderer/App.tsx` — compose `StatusBadge` in place of the existing ad hoc status markup; import `theme.css` once.
- `frontend/src/renderer/App.test.tsx` — only if the `StatusBadge` swap requires assertion changes (expected minimal, since existing tests query by rendered text/role, not markup structure).

**Total modified files: 1-2**

## Files explicitly not to touch

`backend/**` (out of scope — already implemented, `3DW-STORY-001A`), `docker-compose.yml` (out of scope — `3DW-STORY-001D`), any 3D-rendering code (out of scope, does not exist yet), `.skillbase/artifacts/evidence/3DW-STORY-001A-*` and `3DW-STORY-001B-*` (explicitly excluded by this story's own scope statement), `.env.example`, `README.md` (owned by `3DW-STORY-001D`), `.skillbase/**` (governance), `docs/adr/**`, `CLAUDE.md`, `.claude/**`, `frontend/electron/**`, `frontend/electron.vite.config.ts`, `frontend/.eslintrc.cjs`, `frontend/.prettierrc`, `frontend/.husky/**`, `frontend/package.json` (no new dependencies needed — CSS Modules and existing React/TS/Vitest tooling are sufficient).

## Expected backend impact

None.

## Expected frontend impact

New, isolated `design-system/` directory under `frontend/src/renderer/`. One existing file (`App.tsx`) modified with a small, targeted diff (swap markup for the new component, add one import). No build/tooling configuration changes expected — CSS Modules are already supported by the existing Vite-based toolchain from `3DW-STORY-001B` with no additional plugin.

## Expected database impact

None.

## Migration expectation

**No.**

## Docker expectation

**No.**

## Test files expected

1: `StatusBadge.test.tsx` (component test, covering the three status values and the text-label accessibility requirement). `App.test.tsx` is a possible modification, not a new file, and is not expected to need new test cases — only assertion updates if any.

## PR size estimate

**Total changed files: 11 create + 1-2 modify = 12-13.**

**Size: M** (11-15 files, per the skill's guardrail table). Within guardrails — not "Too large." No split needed.

## Split recommendation

None needed. 12-13 files is within the M guardrail as a single PR.
