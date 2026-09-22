# Story Map: 3D Warehouse Visualizer

**Draft story evidence, not an approved backlog.** Built from approved discovery (`discovery_approved`), solution (`solution_approved`) and architecture (`architecture_approved`, evidence recorded) approvals. Human approval (`stories_approved`) is still required before Story LLD.

## MVP walking skeleton

The smallest end-to-end path that proves the architecture, in build order:

`Solution skeleton -> Tenant middleware -> Error contract -> Import CSV -> Object list -> Object detail -> 3D render (placeholder) -> Search/filter -> 3D failure isolation`

Once this skeleton works, a user can import a small file, see it as a list, inspect an object, see it in 3D, search it, and trust that a 3D failure won't strand them. Everything else (XLSX, per-row error reporting, dashboard, tenancy test suite, performance spike) adds breadth or confidence on top of that skeleton without changing its shape.

## Phase 1 story map (MVP)

| Order | Story | Type | Delivers |
|---|---|---|---|
| 1 | 3DW-STORY-001 Solution skeleton | foundation-enabler | A runnable, empty backend + frontend + local Compose stack |
| 2 | 3DW-STORY-002 Tenant context + fail-closed middleware | foundation-enabler | The isolation guarantee every later story depends on |
| 3 | 3DW-STORY-003 Backend error-contract baseline | foundation-enabler | A consistent error shape every later story reuses |
| 4 | 3DW-STORY-004 Import minimal CSV | vertical-feature | First real data enters the system |
| 5 | 3DW-STORY-005 Object list (2D) | vertical-feature | First visible, useful output |
| 6 | 3DW-STORY-006 Object detail panel | vertical-feature | Inspection, not just listing |
| 7 | 3DW-STORY-007 3D render, placeholder geometry | vertical-feature | The headline capability, minimally |
| 8 | 3DW-STORY-008 Search/filter object list | vertical-feature | Makes the list usable at more than a handful of objects |
| 9 | 3DW-STORY-009 Isolate 3D failures from 2D fallback | technical-enabler | Makes INV-003 real, not aspirational |
| 10 | 3DW-STORY-010 XLSX import | vertical-feature | Second required file format (PD-108) |
| 11 | 3DW-STORY-011 Per-row import error report | vertical-feature | Makes import trustworthy with messy real data |
| 12 | 3DW-STORY-012 Basic dashboard summary | vertical-feature | The "basic dashboard/summary" Phase 1 item |
| 13 | 3DW-STORY-013 Fail-closed tenancy test suite | test-enabler | Proves INV-001 holds, automatically, going forward |
| 14 | 3DW-STORY-014 3D performance spike (100k objects) | spike | De-risks the 100k/500k-1M target before it's assumed |

## Dependency flow

```text
001 (skeleton)
 ├─> 002 (tenant middleware)
 │     └─> 013 (fail-closed tenancy tests)
 └─> 003 (error contract)
       └─> 004 (CSV import)  [also depends on 002, 003]
             ├─> 005 (object list)
             │     ├─> 006 (object detail)
             │     ├─> 007 (3D render) ─> 009 (3D failure isolation)
             │     ├─> 008 (search/filter)
             │     └─> 012 (dashboard summary)
             ├─> 010 (XLSX import)
             └─> 011 (per-row import error report)
009 depends on 007 and (005 or 008) — needs a working 2D view to fall back to
014 (spike) depends on 007 (a working 3D baseline to extend/measure against); runs in parallel with 008-013
```

## What is intentionally deferred

Out of the MVP list, per `recommended-solution.md` Phase 2 and PD-091/PD-095/PD-096:
- Advanced heatmaps, automated bottleneck detection, fast/slow-moving analysis, scenario comparison.
- Near-real-time or true real-time tracking (Phase 1 is file import / scheduled sync only).
- Full role-based access control and tenant-level configuration (Phase 1 keeps a minimal, non-bypassable model).
- Advanced reporting and export.
- Order tracking beyond read-only status data, if such data isn't available.
- Chatbot/NL query, CAD/BIM import, automated warehouse optimization, predictive analytics — out of scope entirely per PD-091, not just deferred.
- Finalizing the exact 3D rendering technique set for 500k-1,000,000 objects — Story 014 (this MVP) is a spike to de-risk it, not the full Phase 2 implementation.
