# Recommended Solution: 3D Warehouse Visualizer

**Draft solution evidence. Not an approved architecture. Human approval is still required before HLD/ADRs.**

## Recommended solution

**Option 1: Electron + React + TypeScript (frontend) + React Three Fiber/Three.js (3D) + .NET 10 LTS backend + EF Core 10 code-first + Azure SQL, as a modular monolith.**

## Why it fits discovery

- It is the direction already stated in `.skillbase/project.yaml` and reaffirmed by the business owner: Electron desktop with TypeScript as the frontend, "subject to ADR confirmation" (PD-064, PD-090).
- It maps directly onto the BDD's Phase 1 scope (PD-092 to PD-094, PD-107 to PD-110): file/sync import, a 3D view, a working 2D fallback, search/filter/select, zones/categories/status, a basic dashboard, tenant isolation from the start, and WMS treated as read-only.
- A single backend service gives one place to enforce the invariants: multitenancy fail-closed (INV-001), WMS as a read-only source (INV-002), and a complete 2D fallback fed by the same data as the 3D view (INV-003).
- It keeps to the modular monolith architecture required by POL-012 unless an approved ADR changes it; no discovery evidence argues for microservices or another architecture at this stage.
- It rejects the two riskiest alternatives (local-first sync, a heavy CAD/game engine) that would solve problems discovery does not raise (PD-091: no offline-first requirement, no CAD/BIM import in MVP).

## MVP boundary

In scope for MVP (Phase 1), per BDD §4 and traceability PD-092 to PD-094, PD-107 to PD-110:
- Import warehouse layout/object data from CSV/XLSX files, or a scheduled read-only WMS sync, depending on access availability.
- 3D visualization of warehouse objects.
- A 2D fallback that is functional, not decorative: object list/table, search and filter, selected-object detail, a basic 2D map if coordinate data exists, and the ability to keep working when 3D cannot load.
- Search, filter and select of warehouse objects.
- Display of zones, object categories and status where the source data provides them.
- A basic operational visibility dashboard.
- Tenant isolation from the start: every record tenant-scoped, access tenant-scoped, minimal but non-bypassable admin/security model.
- WMS treated strictly as read-only; the system never writes back to it.
- Basic visual bottleneck indicators only if the source data supports it (PD-097); automated bottleneck detection is Phase 2.
- Order tracking only if available as read-only status data (PD-095); otherwise Phase 2.

Explicitly out of scope for MVP (PD-091, PD-095, PD-096):
- Chatbot features.
- Writing updates back to WMS.
- True real-time tracking (Phase 1 uses manual import or scheduled sync only).
- Advanced AI assistant features.
- Advanced CAD/BIM import.
- Full role-based access beyond the Phase 1 minimum.
- Automated warehouse optimization.
- Production-grade predictive analytics.
- Fast/slow-moving item analysis (Phase 2 candidate).
- Automated bottleneck detection (Phase 2).

## Phase 1 and Phase 2 split

| Area | Phase 1 (MVP) | Phase 2 |
|---|---|---|
| Data volume | Up to 100,000 objects (PD-035) | 500,000 to 1,000,000 objects (PD-036) |
| Data source | File import (CSV/XLSX) or scheduled read-only WMS sync (PD-103) | Same, at larger scale and possibly near-real-time (PD-104) |
| Tracking | Manual/scheduled only, no true real-time (PD-058, PD-091) | Near-real-time if the business confirms a use case (BOR-8) |
| Access model | Minimal, tenant-scoped, non-bypassable isolation (PD-105) | Full role-based access and tenant-level configuration (PD-106) |
| Analytics | Basic dashboard; basic visual bottleneck indicators if data supports it | Advanced heatmaps, automated bottleneck detection, fast/slow-moving analysis, scenario comparison (BDD §4/§6) |
| Reporting | Basic summary only | Advanced reporting and export (BDD §4) |
| Order tracking | Only if read-only status data is available | Full order/pick/pack/dispatch visibility (page §4/§5, PD-004/PD-005, still open per PD-071) |

## Assumptions

- The team has, or will acquire, working skill in .NET 10, EF Core, React/TypeScript and React Three Fiber (PD-090 confirms only the frontend choice; the full stack's team-skill fit is not independently evidenced — see open questions).
- Azure SQL and EF Core 10 code-first remain the intended database/ORM (stated in `project.yaml`; not separately confirmed or contradicted by the business owner's answers, which addressed frontend platform only).
- "Object" for performance targets means one visual warehouse entity as defined in BDD §7 (rack, bin, pallet position, zone marker, aisle marker, or operational item), which is assumed sufficient to size rendering technique choices.
- The modular monolith architecture (POL-012) remains appropriate at this scale; nothing in discovery argues for splitting services yet.

## Risks

- **Performance risk at Phase 2 scale.** Reaching 500,000 to 1,000,000 rendered objects at ~30 FPS (PD-037, PD-098) is achievable with React Three Fiber using instancing, level-of-detail and culling, but this is a design risk, not yet validated with a prototype or real sample data (PD-111 notes sample files are still missing).
- **Team skill fit unconfirmed.** No discovery source states who will build this or what skills they currently have; the stack choice may need revisiting once that is known.
- **Two-track integration risk.** "File import or scheduled read-only WMS sync, depending on access availability" (PD-103) means the backend must support both paths from day one, which is more integration surface than a single fixed source.
- **Tenant model under time pressure.** A "minimal but non-bypassable" Phase 1 tenant model (PD-105) is easy to under-specify; getting the fail-closed behavior (INV-001) wrong at this stage is expensive to retrofit later.
- **Frontend choice not yet an ADR.** Electron/TypeScript is a business position (PD-064, PD-090), explicitly "subject to ADR confirmation," not yet a ratified architecture decision.

## Non-goals

- Offline-first operation or conflict-resolving local sync (rejected option 3; not requested by discovery).
- A browser-only deployment without Electron (rejected option 4; conflicts with the stated frontend direction).
- CAD/BIM-grade 3D fidelity or a licensed CAD/game engine (rejected option 5; explicitly out of scope per PD-091).
- Any chatbot or natural-language query feature (PD-008/PD-027 resolved out of scope by PD-055/PD-091).
- Writing back to the WMS in any form (INV-002, PD-062, PD-103).
- Full role-based access control in Phase 1 (PD-106; Phase 2 only).

## Remaining open questions (carried to HLD/ADR, not resolved here)

- **PD-100:** "Supported machine" hardware/performance profile — to be defined during HLD/performance planning.
- **PD-102:** Exact KPI baselines and sample data for validating the 50%/60%/40% targets (PD-098) — still not collected.
- **PD-104:** Exact sync interval for scheduled WMS reads — deferred to Solution Discovery by the business owner; still needs a number.
- **PD-111:** Units and coordinate-system normalization for imported files — needs real sample data, still not supplied.
- **PD-077:** `project.yaml` technical targets beyond Electron/TypeScript (.NET 10 LTS, EF Core 10 code-first, Azure SQL, React Three Fiber/Three.js) are the assumed stack here but have not been independently reconfirmed by the business owner the way the frontend was; recommend explicit sign-off alongside the frontend ADR.
- **PD-071:** Scope boundary for order tracking, fast/slow-moving analysis and bottleneck detection is partially set (PD-095 to PD-097) but still depends on unconfirmed WMS data availability.
- **New (this stage):** which multitenancy implementation pattern (row-level tenant_id with EF Core global query filters, schema-per-tenant, or database-per-tenant) best fits the fail-closed requirement at Azure SQL scale — see `solution-architecture-candidates.md`.
- **New (this stage):** which rendering technique combination (GPU instancing, spatial partitioning/octree culling, level-of-detail, worker-thread data loading) is needed to hit the 100k/500k-1M targets — needs a performance spike before HLD commits to specifics.

**Human approval is still required before HLD/ADRs.**
