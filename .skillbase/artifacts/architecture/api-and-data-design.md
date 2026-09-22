# API and Data Design: 3D Warehouse Visualizer

Companion to `high-level-design.md`. No API code or entity classes are defined here — conceptual design only, for HLD/ADR review.

## API style recommendation

REST/JSON over HTTPS, API-first with a stable versioned contract (`/api/v1/...`). Chosen over GraphQL for Phase 1: the query shapes (filtered lists of warehouse objects, dashboard aggregates) are well-known upfront, and REST keeps the .NET/EF Core toolchain and testing simple for a modular monolith. Revisit only if client query flexibility becomes a proven pain point.

## Major API groups

- **Auth/Tenancy:** resolves the caller's tenant and user context (mechanism TBD at ADR stage — see Security design); every other group depends on this succeeding.
- **Import:** submit a file for import, check import job status/result.
- **Sync (admin/observability only, not end-user facing):** view last sync run status, trigger a manual sync (if operationally needed).
- **Warehouse Objects:** list/query/filter objects by tenant, warehouse, zone, category, status; get a single object's detail.
- **Dashboard:** tenant-scoped summary/aggregate endpoints (counts by zone/category/status, basic utilization).

## Request/response conventions

- JSON in, JSON out. `camelCase` field names on the wire.
- Every authenticated request carries tenant context (see Tenant context handling below); the server never infers a default tenant.
- Timestamps: ISO 8601 UTC.
- List endpoints return `{ items: [...], page, pageSize, totalCount }`.

## Error response format

RFC 9457 ("problem details") style: `{ type, title, status, detail, instance }`, extended with a `code` field for machine-readable error categories. Three broad categories, per `high-level-design.md`:
1. **Tenant/auth failures** — HTTP 401/403, fail closed, no partial data ever returned.
2. **Data-quality failures** (e.g. malformed import rows) — HTTP 422, with a per-row error list for import endpoints rather than a single opaque failure.
3. **Transient failures** (e.g. WMS sync timeout) — HTTP 502/504, logged, retried by the worker with backoff; not surfaced as a hard client error where a retry is in progress.

## Pagination / filtering / search conventions

- Offset or cursor-based pagination (choice deferred to implementation planning) with sane server-side max page size to protect performance at 100k+ objects.
- Filter parameters: `zone`, `category`, `status`, free-text `search` (matching name/code/id). Combinable, all tenant-scoped implicitly.
- Sorting: a small fixed set of sortable fields (name, zone, status), not arbitrary field sorting, to keep query plans predictable at scale.

## Tenant context handling

- Tenant context is resolved once per request, server-side, from an authenticated identity (mechanism decided at ADR stage) — never from a client-supplied tenant ID alone, to prevent tenant-spoofing.
- If tenant context cannot be resolved, the request fails closed (401/403), per INV-001. No endpoint has an "all tenants" or "no tenant" mode.
- Internally, the resolved tenant ID flows through to every EF Core query via a global query filter (see `security-and-multitenancy-design.md`), so no individual query can accidentally omit the tenant scope.

## Import model

Conceptual import record (not an entity class): `objectId`, `objectType`, `displayName`, `x`, `y`, `z?`, `width`, `height?`, `depth`, `zone`, `status?`, `category?`, `tenantId?` (defaults to the importing user's tenant if omitted), `warehouseId?`, `metadata?` (free-form key/value). Required vs. optional fields per `solution-architecture-candidates.md` (PD-108-110). Import is row-oriented: each row succeeds or fails independently, with results reported per row.

## Core conceptual entities

- **Tenant:** the isolation boundary; every other tenant-scoped entity references it.
- **Warehouse:** a tenant's physical warehouse (a tenant may have more than one; Phase 1 assumption, not yet confirmed by discovery — open question).
- **WarehouseObject:** the core visual entity (rack, bin, pallet position, zone marker, aisle marker, or operational item — PD-099), with position/dimensions/zone/category/status.
- **Zone:** a named area within a warehouse; objects reference a zone.
- **ImportRun / SyncRun:** an observability record of an import or sync execution (source, timestamp, rows processed/failed, duration).

## EF Core / code-first guidance

- Code-first, EF Core 10, migrations checked into source control under a dedicated migrations project/folder (path TBD at implementation planning).
- A global query filter on every tenant-scoped `DbSet`, driven by the resolved tenant context (see Security design) — the mechanism that makes fail-closed tenancy structural rather than convention-based.
- Avoid `IgnoreQueryFilters()` outside of tightly reviewed, explicitly tenant-safe administrative code paths.
- Keep `WarehouseObject` schema close to the import model above; avoid premature normalization beyond what Phase 1 query patterns (list/filter/detail/dashboard) require.

## Migration strategy

- Standard EF Core migrations applied via a controlled release step (not automatic on app startup in production), to keep schema changes deliberate and reviewable.
- Local dev and CI apply migrations against the Compose-provisioned SQL container as part of the test setup, so schema drift is caught before Azure SQL.
- Destructive migrations require explicit human approval, per `CLAUDE.md` and POL-006 — this applies to any future schema change, not only the initial one.

## Azure SQL guidance

- Single Azure SQL database for Phase 1 scale (row-level tenancy, Candidate A in `solution-architecture-candidates.md`); schema-per-tenant or database-per-tenant remain candidates if isolation requirements tighten later (ADR needed if adopted).
- Connection strings and credentials via configuration/environment only (Twelve-Factor), never committed; `.env.example` stays names-only.
- Indexing strategy should be driven by the confirmed query patterns (tenant + zone/category/status filters, free-text search) once implementation planning begins; not specified further here to avoid over-documenting ahead of real usage data.
