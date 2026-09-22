# Solution Architecture Candidates: 3D Warehouse Visualizer

**Candidates for evaluation at the HLD/ADR stage. Nothing here is a ratified architecture decision.** Builds on `recommended-solution.md` (Option 1: Electron + React + TypeScript + React Three Fiber/Three.js + .NET 10 + EF Core 10 + Azure SQL, modular monolith).

## Backend architecture

- **Candidate A (recommended to carry forward): Modular monolith, .NET 10, organized by bounded modules** (e.g. Import, Layout/Objects, Tenancy, Dashboard/Reporting), each with its own internal boundary but deployed as one service. Matches POL-012 directly; simplest to operate and test at MVP scale.
- **Candidate B: Modular monolith with a separate background worker process** for scheduled WMS sync and file import processing, communicating via an internal queue/outbox, still one deployable "system" conceptually. Useful if import/sync jobs are long-running or need retry semantics separate from the request/response API.
- **Candidate C (rejected for MVP): Microservices split** (e.g. separate Import, Tenancy, Rendering-data services). No discovery evidence supports this complexity at Phase 1 scale; would need its own ADR to override POL-012.

## Frontend architecture

- **Candidate A (recommended to carry forward): Electron main process + React/TypeScript renderer**, with a thin IPC layer to the main process for file-system access (local file import) and secure storage of connection settings; all business/rendering logic in the renderer.
- **Candidate B: Electron with a local Node backend-for-frontend (BFF)** inside the main process, proxying to the .NET API, useful if offline caching of recent views is wanted later (Phase 2+, not MVP per non-goals).
- **State management candidates:** React context + a data-fetching cache (e.g. TanStack Query pattern) for server state, plus local component state for UI-only state (view mode, selection). No discovery requirement pushes toward a heavier global store at MVP scale.

## 3D rendering approach

Driven by the performance targets: 100,000 objects in Phase 1, 500,000 to 1,000,000 in Phase 2, at approximately 30 FPS for normal navigation (PD-035 to PD-037, PD-098, PD-101).

- **GPU instancing:** render repeated object types (racks, bins, pallets) as instanced meshes rather than individual meshes, to keep draw calls low at high object counts.
- **Level of detail (LOD):** simplified geometry/impostors for distant objects, full detail only near the camera.
- **Spatial partitioning and frustum/occlusion culling:** an octree or grid structure so only visible regions are processed per frame, essential at the 500k-1M end of the range.
- **Worker-thread or streamed data loading:** parse and prepare large imported datasets off the main thread so the UI stays responsive during import.
- **Candidate to validate before HLD commits:** a small performance spike using representative (or synthetic, pending real sample data per PD-111) object counts to confirm 30 FPS is achievable with React Three Fiber before locking in specifics.

## Data import/sync approach

- **Candidate A: File importer service** accepting CSV/XLSX per the Phase 1 field list (PD-108 to PD-110: object id, type, name/code, x/y position, width, depth, zone/area required; z, height, status, category, tenant id, warehouse id, metadata optional). Validates and normalizes units/coordinates once PD-111 is resolved with real sample data.
- **Candidate B: Scheduled read-only WMS sync**, pulling on a fixed interval (interval itself still open, PD-104) via whatever API the WMS exposes; strictly read-only, never writing back (INV-002, PD-062, PD-103).
- Both candidates should share a common internal "warehouse object" data model so the 3D/2D views and the dashboard do not need to know which source populated the data.

## Multitenancy approach

Constraint: tenant isolation mandatory from the start, fail closed when tenant context is absent (INV-001, PD-061, PD-074, PD-094, PD-105).

- **Candidate A (recommended to evaluate first): Row-level multitenancy** — a `tenant_id` column on tenant-scoped tables, enforced everywhere via EF Core global query filters, with a fail-closed default (no tenant context resolved -> no data returned, not "return everything"). Simplest to operate on a single Azure SQL database at MVP scale.
- **Candidate B: Schema-per-tenant** — stronger isolation, more operational overhead (migrations run per schema); worth considering if tenant count stays low and isolation requirements tighten.
- **Candidate C: Database-per-tenant** — strongest isolation, highest operational cost; likely overkill for Phase 1 MVP scale, but noted in case a specific customer's contract requires it.
- Whichever candidate is chosen, the Phase 1 admin/security model can be "minimal" per BDD §9, but must not be able to bypass isolation even in its minimal form.

## Exception handling approach

- **Candidate:** a consistent problem-details style error contract from the .NET API (RFC 9457-style), distinguishing tenant/auth failures (fail closed, no partial data) from data-quality failures (e.g. malformed import rows) from transient failures (WMS sync timeout, retryable).
- Import/sync failures should be surfaced per-row where possible (e.g. "312 of 400 rows imported, 88 failed: see report") rather than all-or-nothing, since PD-111 notes source data quality is not yet fully known.
- Client-side: the 2D fallback must remain usable even when the 3D view throws or fails to load (PD-107, INV-003), so 3D rendering failures must be caught and isolated from the rest of the app shell, not allowed to crash it.

## Docker Compose/local dev approach

- **Candidate:** Azure SQL for local development substituted with SQL Server (Linux container) or Azure SQL Edge in Docker Compose, alongside the .NET API service; Electron/React run natively (not containerized, since it is a desktop client), pointed at the composed backend via local config.
- CI should run the same Compose stack for integration tests as local dev uses, to avoid environment drift.

## Testing approach

- **Backend:** xUnit for .NET, with EF Core integration tests against a containerized SQL instance (matches the Compose candidate above); explicit tests for tenant fail-closed behavior (a request with no/invalid tenant context must be denied, not scoped to "all tenants").
- **Frontend:** Vitest + React Testing Library for component/unit tests; Playwright (or Electron-specific E2E tooling) for import -> 3D view -> 2D fallback flows.
- **Performance testing:** a dedicated test/spike harness to validate the 100k and 500k-1M object targets at ~30 FPS before those numbers are relied on in HLD (ties to the rendering-approach validation candidate above).
- **Import testing:** fixture files covering the required and optional fields (PD-109, PD-110), plus malformed/missing-field cases, once real sample data resolves PD-111.

## ADRs required later (not decided here)

1. Frontend platform: ratify Electron + React + TypeScript (currently a business position per PD-064/PD-090, not yet an ADR).
2. Backend stack and code-first ORM: ratify .NET 10 LTS + EF Core 10 + Azure SQL (assumed from `project.yaml`, not independently reconfirmed by the business owner — PD-077).
3. Modular monolith confirmation, or an explicit override with justification (POL-012).
4. Multitenancy implementation pattern (row-level vs schema-per-tenant vs database-per-tenant).
5. 3D rendering technique set for the performance targets (instancing/LOD/culling/worker-loading combination), informed by a performance spike.
6. Data import/sync architecture: file importer vs scheduled WMS sync vs supporting both from day one, and the sync interval (PD-104).
7. Units/coordinate-system normalization strategy for imported files (PD-111), once real sample data is available.
8. Exception-handling and error-contract standard across API and client.
9. CI/CD and local dev environment standard (Docker Compose composition, containerized SQL choice).
