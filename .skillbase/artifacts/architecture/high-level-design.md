# High-Level Design: 3D Warehouse Visualizer

**Draft architecture documentation. Not an implementation, not a final approval.** Built from approved discovery (`discovery_approved`) and solution (`solution_approved`) evidence. Human approval (`architecture_approved`) is still required before Story Crafting.

## Executive summary

The 3D Warehouse Visualizer gives warehouse managers, planners and operations teams a visual, tenant-isolated way to understand warehouse layout, object status and space utilization, replacing manual spreadsheet review and WMS report correlation. Phase 1 (MVP) is a desktop application (Electron + React + TypeScript) rendering warehouse objects in 3D (React Three Fiber/Three.js) with an equally functional 2D fallback, backed by a .NET 10 modular monolith with EF Core 10 code-first over Azure SQL. Data enters via structured file import (CSV/XLSX) or scheduled read-only WMS sync; the system never writes back to the WMS. Tenant isolation is mandatory and fail-closed from day one.

## Problem and solution traceability

| HLD decision | Traces to |
|---|---|
| 3D + 2D dual-view application | PD-001, PD-009, PD-043, PD-063, PD-075, PD-084-089, PD-107, INV-003 |
| Electron + React + TypeScript frontend | PD-064, PD-090, `project.yaml` |
| .NET 10 + EF Core 10 + Azure SQL backend | `project.yaml`; recommended-solution.md; open item PD-077 |
| Read-only WMS integration, file import alternative | PD-045, PD-062, PD-092, PD-103, INV-002 |
| Mandatory fail-closed multitenancy | PD-061, PD-074, PD-094, PD-105, INV-001 |
| Modular monolith | POL-012; solution-options.md rejection of microservices (option C) |
| 100k / 500k-1M object performance targets, ~30 FPS | PD-035-037, PD-098, PD-101 |
| Out-of-scope exclusions (chatbot, WMS writes, real-time, CAD/BIM, full RBAC, predictive analytics) | PD-091 |

## MVP scope (Phase 1)

Import (file or scheduled read-only sync) -> 3D view -> 2D fallback (list/table, search, filter, object detail, 2D map if coordinates exist, usable if 3D fails) -> search/filter/select -> zones, categories, status display -> basic dashboard -> tenant-scoped access from the start -> basic visual bottleneck indicators if source data supports them -> order-tracking display only if read-only status data is available.

## Non-goals (Phase 1)

Chatbot/NL query; writing to WMS; true real-time tracking; advanced AI assistant features; CAD/BIM import; full role-based access control; automated warehouse optimization; production-grade predictive analytics; fast/slow-moving analytics; automated bottleneck detection; scenario comparison; advanced reporting/export. (PD-091, PD-095, PD-096; all Phase 2 candidates per `recommended-solution.md`.)

## Architecture principles

1. **Fail-closed multitenancy.** Absent or invalid tenant context yields no data, never all data (INV-001).
2. **WMS is read-only, always.** No code path writes to WMS systems (INV-002).
3. **2D is a first-class view, not a degraded one.** It must support the same core inspection tasks as 3D (INV-003).
4. **Modular monolith until an ADR says otherwise** (POL-012): one deployable backend, internally bounded by module.
5. **API-first, stable contracts.** The API is the only path between client and data; no direct client-to-database access.
6. **Twelve-Factor configuration.** All environment-specific values (connection strings, WMS endpoints, sync intervals) come from configuration/environment, never hard-coded.
7. **Observability-first.** Structured logs, health checks and import/sync outcomes are visible from day one, not retrofitted.
8. **Performance budget, not performance hope.** Rendering technique choices are driven by the stated 100k/500k-1M targets, validated by a spike before being relied upon (see `performance-and-3d-design.md`).
9. **Secure by design (OWASP).** Authorization, input validation and least privilege are part of every module boundary, not a separate layer bolted on later.

## System context

Actors: Warehouse Manager, Inventory Controller/Planner, Operations Manager, Warehouse Staff, Business User, IT/Technical/Data Team, Executive Management (PD-010, PD-056). External systems: the tenant's WMS (read-only source), and structured layout files (CSV/XLSX) supplied by the tenant. See `c4-views.md` for the diagram.

## Container architecture

- **Desktop client (Electron):** main process (file-system access for import, secure local config) + React/TypeScript renderer (UI, 3D/2D views, state).
- **Backend API (.NET 10, modular monolith):** exposes the stable API surface; internally organized by module (Import, Warehouse Objects/Layout, Tenancy, Dashboard).
- **Background worker (in-process or hosted service within the same deployable):** runs scheduled WMS sync and processes file imports asynchronously.
- **Azure SQL database:** system of record for imported/synced warehouse objects, tenant data, and application state. Never the WMS itself.
- **WMS (external, read-only):** the tenant's existing system; queried, never written to.

## Major runtime flows

1. **File import:** user selects a CSV/XLSX file in the Electron client -> uploaded to the Import module -> validated against the required/optional field schema -> normalized -> persisted as warehouse objects scoped to the active tenant -> import result (success/row-level failures) returned to the client.
2. **Scheduled WMS sync:** background worker polls the WMS read-only endpoint at a configured interval -> maps WMS records to the internal warehouse-object model -> upserts into Azure SQL, tenant-scoped -> sync outcome logged/observable.
3. **3D/2D view load:** client requests warehouse objects for the active tenant and warehouse -> API returns paginated/filtered object data -> client renders 3D (instanced meshes, culling, LOD) or 2D (table/map) from the same data set.
4. **Search/filter/select:** client-side and/or server-side filtering (by zone, category, status) against the same object data set powering both views.
5. **Dashboard:** aggregate queries (object counts, zone utilization, basic status breakdown) scoped to tenant, surfaced as a basic summary view.

## Module boundaries (backend, within the monolith)

- **Import:** file parsing, validation, normalization, row-level error reporting.
- **Sync:** scheduled read-only WMS polling, mapping, upsert, retry/backoff.
- **Warehouse Objects:** the core object/zone/layout model, query and filter API.
- **Tenancy:** tenant resolution, fail-closed enforcement, tenant-scoped data access helpers used by every other module.
- **Dashboard:** aggregate/summary queries over Warehouse Objects.
- Each module owns its own data access logic behind an internal boundary; cross-module calls go through explicit interfaces, not shared mutable state, so a future service split (if ever justified by an ADR) does not require a rewrite.

## Backend architecture

.NET 10 LTS, ASP.NET Core Web API, modular monolith (Candidate A in `solution-architecture-candidates.md`), with Import/Sync as a background worker within the same deployable (Candidate B) rather than a separate service, matching Phase 1 scale. EF Core 10 code-first against Azure SQL.

## Frontend architecture

Electron main process (file access, secure config) + React/TypeScript renderer (Candidate A). React Three Fiber for 3D; a parallel 2D React view (table/map) sharing the same data-fetching layer, so 3D and 2D never drift out of sync. Server state via a fetch/cache pattern (e.g. TanStack Query-style); local UI state (selection, view mode) in component/context state. No heavier global store justified at Phase 1 scale.

## 3D rendering architecture

Summary here; full detail in `performance-and-3d-design.md`. GPU instancing for repeated object types, level-of-detail for distant objects, spatial partitioning (octree/grid) with frustum/occlusion culling, and off-main-thread data preparation for large imports, sized against the 100k (Phase 1) and 500k-1M (Phase 2) targets at ~30 FPS.

## Data import/sync architecture

Two supported Phase 1 sources sharing one internal object model: (a) CSV/XLSX file import, and (b) scheduled read-only WMS sync (interval configurable, exact value an open question — PD-104). Both paths write to the same Warehouse Objects store; neither ever writes back to the WMS (INV-002).

## Multitenancy architecture

Summary here; full detail in `security-and-multitenancy-design.md`. Row-level tenant isolation (`tenant_id` on every tenant-scoped table, enforced via EF Core global query filters), fail-closed: no resolvable tenant context means no data, not unscoped data.

## Security architecture

Summary here; full detail in `security-and-multitenancy-design.md`. Tenant-scoped authorization on every request, least-privilege access to the WMS (read-only credentials only), secrets from environment/configuration only (never committed — `.env.example` remains names-only), audit logging of import/sync and access-denied events.

## Exception handling architecture

RFC 9457-style problem-details error contract from the API, distinguishing: (a) tenant/auth failures — fail closed, no partial data; (b) data-quality failures — e.g. malformed import rows, reported per-row, not all-or-nothing; (c) transient failures — e.g. WMS sync timeout, retried with backoff and logged. The Electron client isolates 3D-rendering failures so the 2D fallback remains usable (INV-003).

## Observability architecture

Structured logging (correlation/request IDs, tenant ID on every log line) from day one. Health checks for the API and the background worker. Import/sync runs produce a visible outcome record (rows processed, rows failed, duration) rather than silent success/failure. No dedicated metrics/tracing stack is mandated for Phase 1; the logging and health-check baseline is the minimum, with richer observability an open question for later phases.

## Local development and Docker Compose architecture

Azure SQL substituted locally with a containerized SQL Server (Linux) or Azure SQL Edge; the .NET API (and worker) containerized alongside it in Docker Compose. Electron/React run natively against the composed backend via local configuration, since a desktop client is not itself containerized.

## CI/CD overview

Build and test the .NET backend and React/TypeScript frontend independently; run backend integration tests against the same Compose-defined SQL container CI and local dev share, to avoid environment drift. Electron packaging is a separate build step from the web/desktop-shared codebase build. No specific CI platform is mandated here; that choice is an open item, not an architectural constraint from discovery.

## Test strategy overview

Backend: xUnit unit tests plus EF Core integration tests against the containerized SQL instance, with explicit fail-closed tenancy tests. Frontend: Vitest/React Testing Library for components, Playwright (or Electron-specific E2E tooling) for import -> 3D -> 2D fallback flows. Performance: a dedicated spike/test harness validating the 100k and 500k-1M targets before those numbers are relied on elsewhere. Full detail in `performance-and-3d-design.md`.

## Performance strategy

Summary here; full detail in `performance-and-3d-design.md`. Design for 100k objects at ~30 FPS in Phase 1, with headroom techniques (instancing, LOD, culling, worker-thread loading) chosen so Phase 2's 500k-1M target does not require a rewrite, only tuning.

## Open questions (carried from discovery/solution, not resolved here)

- PD-100: "Supported machine" hardware/performance profile.
- PD-102: Exact KPI baselines and sample data.
- PD-104: Exact WMS sync interval.
- PD-111: Units/coordinate-system normalization, pending real sample data.
- PD-077: Independent business reconfirmation of the .NET/EF Core/Azure SQL backend stack (only the frontend was explicitly reconfirmed by the business owner).
- CI/CD platform choice (not constrained by discovery).
- Observability stack beyond structured logging and health checks (deferred).

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| 500k-1M object target unvalidated (no real sample data yet, PD-111) | Run a performance spike with synthetic data before committing rendering specifics; revisit once real samples arrive |
| Tenant model under-specified if rushed | Treat fail-closed tenancy tests as a required part of Phase 1 "done", not optional |
| Dual import sources (file + WMS sync) double the integration surface | Both map to one internal object model; add integration tests for both paths independently |
| Backend stack (.NET/EF Core/Azure SQL) not independently reconfirmed by the business owner | Flag explicitly in ADR-0003 for sign-off alongside the frontend ADR |
| 2D fallback treated as an afterthought during build | Design 2D and 3D against the same data contract from the start (see Frontend architecture) so neither can silently fall behind |
