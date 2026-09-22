# Story Slicing Review: 3D Warehouse Visualizer

Companion to `jira-ready-stories.md` and `story-map.md`.

## Revision note: Split Children Registered (2026-09-22)

After LLD work on `3DW-STORY-001` (applying the Digital400 engineering standards) grew its PR-size estimate to roughly 32 files, it was split into four child stories, approved at the split level (`.skillbase/artifacts/evidence/3DW-STORY-001-split-human-approval.md`): `3DW-STORY-001A` (Backend solution skeleton, M), `3DW-STORY-001B` (Frontend Electron/React/TypeScript skeleton and tooling, M), `3DW-STORY-001C` (Design system foundation, S), `3DW-STORY-001D` (Docker Compose and workspace baseline, XS). Full entries are registered in `.skillbase/artifacts/stories/child-story-outlines.md`; the split's design rationale is in `.skillbase/artifacts/lld/3dw-story-001/child-story-split.md`. `3DW-STORY-001` itself is now umbrella evidence only and is not to be implemented as a single PR; `jira-ready-stories.md` is unchanged by this registration. Each child still needs its own LLD and its own approval before implementation.

## Stories that were split and why

No story in the final 14 was left at "epic" size, but three of the skill's own "bad example" epics were deliberately avoided by pre-splitting them during crafting, rather than crafted large and split afterward:

- **"Build complete import module"** was never written as one story. It was split into 3DW-STORY-004 (minimal CSV import, required-column validation only), 3DW-STORY-010 (XLSX support), and 3DW-STORY-011 (per-row error reporting) — three independently shippable, independently reviewable slices instead of one large one.
- **"Build full 3D warehouse"** was split into 3DW-STORY-007 (placeholder-geometry render, instancing only) and 3DW-STORY-014 (a performance spike, not a feature build) for the 100k target; anything toward the 500k-1M target or richer visuals (heatmaps, LOD tuning beyond the spike's findings) is explicitly deferred to Phase 2 in `story-map.md`.
- **"Implement multitenancy"** was split into 3DW-STORY-002 (the fail-closed middleware baseline) and 3DW-STORY-013 (the automated test suite proving it holds), rather than one large "multitenancy" story; every other story then reuses 002's pattern instead of re-implementing isolation.

One story was internally reviewed for a possible split during this pass:

- **3DW-STORY-007 (3D render, placeholder geometry)** is rated Medium PR-size risk, the only one in the set. It bundles scene/camera setup with instanced-mesh rendering. It was kept as one story because both halves are individually small against a tiny placeholder object set, but a split into "scene/camera skeleton" and "instanced object rendering" is flagged for reconsideration at Story LLD if implementation estimates grow past 3 days.

## Stories rejected as too large

None were rejected outright in this pass — sizing was done by slicing before writing, not by writing large stories and then rejecting them. See the split rationale above for the three cases where a large scope was avoided from the outset instead.

## Dependency risks

- **3DW-STORY-002 (tenant middleware) is a hard dependency for nearly everything.** If its estimate or design slips, most of the MVP is blocked behind it. Recommend it stays first after the skeleton, with no scope creep (Phase 2 RBAC must not sneak into this story).
- **3DW-STORY-007 (3D render) is the fan-in point for two later stories** (009 failure isolation, 014 spike). A delay here delays both.
- **3DW-STORY-013 (tenancy test suite) functionally depends on Stories 004-012 existing** to have endpoints to test, but does not need to wait until all of them are done — it can and should be built incrementally alongside each new endpoint rather than as one late story, to avoid a large last-minute test-writing effort. This is noted as a process risk, not a scope risk.
- **Authentication/identity provider choice is an open item** (noted in 3DW-STORY-002's out-of-scope). If this isn't decided before Story LLD, 002 cannot be sized accurately, which cascades to every dependent story.

## Suggested first 3 implementation stories

1. **3DW-STORY-001** (solution skeleton) — nothing else can start without it.
2. **3DW-STORY-002** (tenant context + fail-closed middleware) — the project's highest-priority invariant (INV-001); building it first, before any feature, means no feature can ever be built without isolation as an afterthought.
3. **3DW-STORY-004** (import minimal CSV) — the first vertical slice delivering real, visible business value, and the dependency root for most of the remaining MVP stories (005-008, 010-012).

(3DW-STORY-003, the error-contract baseline, is small enough to run in parallel with or immediately after 002, and is a light dependency for 004 rather than a distinct "first three" priority.)

## Stories that need UI mockup before implementation

Per `workflow.yaml`'s stage order, `UI_MOCKUP` follows `STORY_CRAFTING` and precedes `STORY_LLD` — so in principle every user-facing story benefits from it. The stories where the UI is non-trivial enough that a mockup materially reduces implementation risk:
- 3DW-STORY-005 (object list) — table layout, columns, empty state.
- 3DW-STORY-006 (object detail) — panel/drawer layout and field presentation.
- 3DW-STORY-007 (3D render) — camera controls, initial view framing (even with placeholder geometry).
- 3DW-STORY-008 (search/filter) — filter control layout and interaction.
- 3DW-STORY-009 (3D failure isolation) — the fallback notice's wording/placement.
- 3DW-STORY-012 (dashboard summary) — summary layout, even without charts.

Stories 001-003, 010, 011, 013, 014 are backend/infrastructure/test/spike work with minimal or reused UI (010/011 reuse 004's import UI) and do not need a dedicated mockup pass.

## Stories that need LLD before implementation

Per the workflow, `STORY_LLD` is a required stage for all stories before `IMPLEMENTATION_PLAN`. The ones where the low-level design decisions are non-obvious enough to call out specifically:
- 3DW-STORY-002 (tenant middleware) — exact resolution mechanism, fail-closed enforcement point (middleware vs. filter vs. both), interaction with the chosen (still undecided) identity provider.
- 3DW-STORY-004 (CSV import) — validation and normalization logic detail, especially the interaction with Story 011's later per-row behavior (design both together to avoid rework).
- 3DW-STORY-007 (3D render) — instancing pool structure, coordinate-to-scene-unit mapping, camera default framing logic.
- 3DW-STORY-009 (3D failure isolation) — exact error-boundary placement and fallback-trigger conditions.
- 3DW-STORY-013 (tenancy test suite) — test structure/parametrization approach across a growing endpoint set.

## Stories that need a spike before implementation

- 3DW-STORY-007 can start with a small, known placeholder dataset without waiting on a spike. 3DW-STORY-014 **is** the spike for the 100k target and should run as early as Story 007 is functional, so its findings can inform Story LLD for any later Phase 2 rendering work, rather than surfacing after Phase 1 is already built out.
- No other MVP story requires a spike; open questions like the exact sync interval (PD-104) or units/coordinate normalization (PD-111) are business/data decisions, not technical spikes, and are tracked as open items rather than spike stories here.
