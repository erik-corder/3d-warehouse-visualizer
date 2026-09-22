# Performance and 3D Design: 3D Warehouse Visualizer

Companion to `high-level-design.md`. Performance-budget thinking: targets first, technique choices justified against them, validated before relied upon.

## Targets (from discovery/solution, not set here)

- Phase 1: 100,000 objects (PD-035, PD-098).
- Phase 2: 500,000 to 1,000,000 objects (PD-036).
- ~30 FPS for "normal navigation": pan, zoom, rotate, select, inspect, without blocking the user (PD-037, PD-101).
- "Supported machine" profile: not yet defined (PD-100) — an open item that any final performance budget depends on.

## 100k object target strategy (Phase 1)

- **GPU instancing:** render repeated object types (racks, bins, pallets) as `InstancedMesh` groups rather than individual `Mesh` objects, keeping draw calls low regardless of object count.
- **Frustum culling:** rely on Three.js's built-in culling plus explicit spatial partitioning (below) so off-screen regions are skipped early, not just culled per-object at render time.
- **Batched updates:** avoid per-frame React re-renders for object data that hasn't changed; update instance transforms imperatively where React Three Fiber allows it.
- This should comfortably hit ~30 FPS at 100k objects on typical business hardware with instancing alone; the remaining techniques below exist primarily to give Phase 2 headroom without a rewrite.

## 500k to 1M object future strategy (Phase 2)

- **Spatial partitioning (octree or grid):** divide the warehouse volume into cells; only process/render cells intersecting the camera frustum, so the renderer never considers the full object set per frame.
- **Level of detail (LOD):** simplified geometry or billboard impostors for distant/small-on-screen objects; full detail only near the camera.
- **Occlusion culling:** skip objects hidden behind others where the warehouse layout makes this cheap to compute (e.g. dense rack rows).
- **Worker-thread / streamed data loading:** parse, normalize and index large datasets off the main thread so import and initial scene build do not block the UI.
- These are designed in from Phase 1 (as architectural headroom) even though Phase 1's 100k target may not strictly need all of them, so Phase 2 is tuning, not a rewrite.

## React Three Fiber guidance

- Keep the R3F component tree thin over the data; avoid re-creating geometries/materials per render — memoize and reuse.
- Prefer imperative updates (refs, `useFrame`) for high-frequency changes (camera movement, instance transform updates) over React state, which is better suited to UI-level state (selection, filters, view mode).
- Keep the 2D fallback's data layer identical to 3D's, so neither view can silently diverge (ties to Frontend architecture in `high-level-design.md`).

## Three.js instancing strategy

- Group objects by visual type (rack, bin, pallet, zone marker, aisle marker, generic operational item — PD-099) into separate `InstancedMesh` pools, since instancing works best with a shared geometry/material per pool.
- Encode per-instance state (position, scale, color-by-status) via instance attributes rather than per-object materials, to keep pool counts low.

## LOD/culling strategy

- Define LOD thresholds by screen-space size, not fixed world-space distance, so the strategy scales correctly regardless of warehouse physical size.
- Start simple (two LOD tiers: full detail, impostor) for Phase 1; add finer tiers only if the Phase 2 spike shows it's needed.

## Worker/threading considerations

- Import parsing (CSV/XLSX) and WMS sync mapping happen server-side already (see `high-level-design.md`), so client-side worker use is mainly about preparing the fetched object set for rendering (spatial index construction, instance-buffer population) without blocking the render/UI thread.

## 2D fallback behavior

- The 2D fallback (object list/table, search/filter, object detail, basic 2D map when coordinates exist) must remain usable even when 3D fails to initialize or degrades — it is not a "lite" mode, it is the guaranteed-working mode (INV-003, PD-075, PD-107).
- 2D rendering (a table plus a simple 2D canvas/SVG map) has a far lower performance ceiling requirement than 3D and is not expected to need the techniques above at Phase 1 or Phase 2 scale.
- 3D rendering failures must be caught and isolated in the client shell so they cannot crash or block the 2D view (ties to Exception handling in `high-level-design.md`).

## Performance budgets

| Budget item | Phase 1 target | Notes |
|---|---|---|
| Object count | 100,000 | PD-035 |
| Frame rate, normal navigation | ~30 FPS | PD-037, PD-101; exact hardware profile open (PD-100) |
| Import processing | Not yet specified | Open item for implementation planning |
| Initial scene load time | Not yet specified | Open item; should be bounded once a supported-machine profile exists |

Phase 2 budgets (500,000-1,000,000 objects, same ~30 FPS target) are directional only until a performance spike validates the technique set above.

## Profiling plan

1. Build a small rendering spike using synthetic data at 100k and (separately) 500k-1M object counts before committing final technique choices in implementation planning.
2. Profile with the browser/Electron devtools performance panel (frame time breakdown: script, layout, GPU) rather than relying on FPS alone, since FPS can mask which stage is the bottleneck.
3. Re-run the spike once real sample data resolves PD-111 (units/coordinate system), since data shape affects instancing pool sizes and spatial partitioning granularity.

## Test data requirements

- Synthetic datasets at 100k and 500k-1M object counts, generated to match the field schema in `api-and-data-design.md`, for the performance spike above.
- Real sample warehouse layout files, still not supplied by any discovery source (PD-111) — needed to validate units, coordinate system, and realistic zone/object distributions before the spike results can be trusted for Phase 1 sign-off.
