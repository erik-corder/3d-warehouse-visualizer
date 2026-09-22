# Jira-Ready Stories: 3D Warehouse Visualizer

**Draft story evidence, ready for Jira formatting, not yet created in Jira.** No Jira issues, code, or approvals were made in producing this file. See `story-map.md` for sequencing and `story-slicing-review.md` for sizing rationale.

---

## 3DW-STORY-001: Create solution skeleton

**Type:** foundation-enabler

**User story:** As a developer, I want a minimal, runnable backend, frontend and local-dev stack, so that every later story has somewhere to attach real behavior.

**Business value:** Unblocks all subsequent stories; proves the toolchain (Electron + React + TypeScript, .NET 10, Docker Compose) works end to end before any business logic is added.

**Scope:** Empty .NET 10 Web API project with a health-check endpoint; empty Electron + React + TypeScript app that can launch and call the health endpoint; Docker Compose file wiring the API to a containerized SQL Server/Azure SQL Edge instance for local dev.

**Out of scope:** Any business/domain logic, authentication, tenancy, or UI beyond a "connected" indicator.

**Acceptance criteria:**
```text
Given the Docker Compose stack is started
When the backend API's health endpoint is called
Then it returns a 200 response

Given the Electron app is launched against the running backend
When it calls the health endpoint
Then it displays a "connected" status
```

**Test cases:** Compose stack starts cleanly from a fresh checkout; health endpoint returns 200; Electron app shows "connected" against a running backend and a clear "not connected" state when the backend is down.

**Dependencies:** None (first story).

**UX notes:** None beyond a minimal connection-status indicator; no visual design needed yet.

**API/data notes:** No data model yet. Health endpoint only.

**Security/multitenancy notes:** None yet; tenancy is Story 002.

**Performance notes:** None.

**Traceability:** `high-level-design.md` (Container architecture); `recommended-solution.md` (stack); POL-012 (modular monolith).

**Estimated size:** S

**PR-size risk:** Low

---

## 3DW-STORY-002: Tenant context resolution and fail-closed middleware baseline

**Type:** foundation-enabler

**User story:** As the system, I need every request to resolve a tenant context or be rejected, so that no data can ever be served or written without a known tenant (INV-001).

**Business value:** The single most important non-negotiable guarantee in the system; every later feature depends on this existing first.

**Scope:** Backend middleware that resolves tenant context from the authenticated request and rejects (401/403) any request where it cannot. No authorization beyond "does a valid tenant context exist" — role-based permissions are Phase 2.

**Out of scope:** Full authentication provider integration details (assume a placeholder/dev-mode identity for this story if a real provider isn't chosen yet — flagged as an open item, not solved here); role-based access control.

**Acceptance criteria:**
```text
Given a request with no resolvable tenant context
When it reaches any tenant-scoped endpoint
Then the request is rejected with 401/403
And no data is returned

Given a request with a valid, resolvable tenant context
When it reaches a tenant-scoped endpoint
Then the request proceeds and the resolved tenant ID is available to downstream code
```

**Test cases:** Missing auth -> rejected; invalid/malformed tenant claim -> rejected; valid tenant -> proceeds; attempt to override tenant via a client-supplied header/parameter -> ignored, server-resolved value wins.

**Dependencies:** 3DW-STORY-001.

**UX notes:** A generic "access denied" state in the client for the rejected case.

**API/data notes:** Establishes the tenant-context pattern later endpoints reuse; no domain data model yet.

**Security/multitenancy notes:** This is the load-bearing story for INV-001. Ties directly to `security-and-multitenancy-design.md` fail-closed rules.

**Performance notes:** None.

**Traceability:** PD-061, PD-074, PD-094, PD-105, INV-001; `security-and-multitenancy-design.md`.

**Estimated size:** S

**PR-size risk:** Low

---

## 3DW-STORY-003: Backend error-contract baseline

**Type:** foundation-enabler

**User story:** As a developer, I want one consistent error response shape across the API, so that the client can handle failures predictably instead of special-casing each endpoint.

**Business value:** Reduces rework later; every story from here on reuses this contract instead of inventing its own error format.

**Scope:** RFC 9457-style problem-details error middleware, with the three categories from `high-level-design.md`: tenant/auth (401/403), data-quality (422, per-item detail supported), transient (502/504).

**Out of scope:** Any specific business error beyond a demonstration example; retry/backoff logic (used later by Sync, not in MVP scope for stories 001-014).

**Acceptance criteria:**
```text
Given an endpoint returns an error
When the client receives the response
Then the body matches the problem-details shape { type, title, status, detail, instance }

Given a data-quality error with multiple issues
When the client receives the response
Then it can extract a list of per-item errors, not just one message
```

**Test cases:** 401/403 shape; 422 shape with multiple errors; 5xx shape; no stack traces or secrets present in any error body.

**Dependencies:** 3DW-STORY-001.

**UX notes:** None yet; consumed by later stories' UI.

**API/data notes:** Defines the contract `api-and-data-design.md` describes.

**Security/multitenancy notes:** Error bodies must never leak tenant IDs, credentials, or internal details (OWASP: sensitive data exposure).

**Performance notes:** None.

**Traceability:** `api-and-data-design.md` (Error response format); `security-and-multitenancy-design.md` (OWASP table).

**Estimated size:** XS

**PR-size risk:** Low

---

## 3DW-STORY-004: Import a minimal CSV warehouse object file with required-column validation

**Type:** vertical-feature

**User story:** As a warehouse planner, I want to import a CSV file of warehouse objects, so that my layout data enters the system without manual re-entry.

**Business value:** First real data enters the system; directly answers PD-092 (Phase 1 import) and PD-087 (reduce manual spreadsheet analysis).

**Scope:** CSV upload endpoint; validation that all required columns are present (object id, object type, display name/code, x, y, width, depth, zone/area — PD-109); rejects the whole file if a required column is missing; stores valid rows as warehouse objects scoped to the resolved tenant. Optional fields (z, height, status, category, tenant id, warehouse id, metadata) accepted if present.

**Out of scope:** XLSX (Story 010); per-row partial success/error reporting for malformed individual rows (Story 011 — this story may reject the whole file on any row error, to keep scope tight); units/coordinate normalization (open item PD-111, deferred).

**Acceptance criteria:**
```text
Given a CSV file with all required columns and valid rows
When a user imports the file
Then the objects are stored, scoped to the importing user's tenant
And the user sees a success summary with the row count imported

Given a CSV file missing the object_id column
When the user imports the file
Then the import is rejected
And the user sees an error explaining that object_id is required
And no warehouse objects are stored

Given a CSV file imported by a user in Tenant A
When a user in Tenant B queries warehouse objects
Then Tenant A's imported objects are not returned
```

**Test cases:** All-required-columns-present, happy path; each required column individually missing (rejected with a specific message); optional columns present and absent; empty file; tenant isolation of imported data (ties to Story 002/013).

**Dependencies:** 3DW-STORY-001, 002, 003.

**UX notes:** A file picker and an import result summary (success count / rejection reason). No preview grid required for MVP.

**API/data notes:** Establishes the `WarehouseObject` conceptual entity from `api-and-data-design.md`. Import endpoint per the Import API group.

**Security/multitenancy notes:** Imported rows are written with the resolved (server-side) tenant ID only, never a client-supplied one.

**Performance notes:** No specific target for this story; large-file performance is addressed by Story 014 (spike) before it's relied upon.

**Traceability:** PD-092, PD-108, PD-109, PD-110; `api-and-data-design.md` (Import model).

**Estimated size:** S

**PR-size risk:** Low

---

## 3DW-STORY-005: Display imported warehouse objects in a 2D object list

**Type:** vertical-feature

**User story:** As a warehouse planner, I want to see my imported warehouse objects in a simple list, so that I know the import worked and can browse what's there.

**Business value:** First visible, useful output from the system; a working 2D list is also the backbone of the 2D fallback (INV-003).

**Scope:** A tenant-scoped, paginated list endpoint for warehouse objects; a table view in the client showing id, type, name/code, zone, status (where present).

**Out of scope:** Search/filter (Story 008); object detail (Story 006); 3D view (Story 007).

**Acceptance criteria:**
```text
Given a tenant has imported warehouse objects
When the user opens the object list
Then they see a paginated table of those objects, and only those belonging to their tenant

Given a tenant has imported no objects
When the user opens the object list
Then they see an empty-state message, not an error
```

**Test cases:** List reflects imported data; pagination works past one page; tenant isolation (only own-tenant rows visible); empty state.

**Dependencies:** 3DW-STORY-004.

**UX notes:** Basic table, sortable by name/zone/status per `api-and-data-design.md`'s fixed sortable-field set. No visual design system decisions needed yet.

**API/data notes:** `GET` list endpoint per the Warehouse Objects API group; response shape `{ items, page, pageSize, totalCount }`.

**Security/multitenancy notes:** Server-side tenant scoping via the global query filter established in Story 002's pattern.

**Performance notes:** Pagination protects against large result sets; no specific object-count target for this story.

**Traceability:** PD-002, PD-085, PD-086; `api-and-data-design.md` (pagination conventions).

**Estimated size:** S

**PR-size risk:** Low

---

## 3DW-STORY-006: Show selected object details

**Type:** vertical-feature

**User story:** As a warehouse planner, I want to click an object and see its full details, so that I can inspect it without leaving the list.

**Business value:** Turns a list into an actual inspection tool; directly answers PD-086.

**Scope:** A single-object detail endpoint; a detail panel/view in the client showing all fields for the selected object (required and optional, where present).

**Out of scope:** Editing (not in MVP scope anywhere); 3D highlighting of the selected object (could be a natural follow-on, not required here).

**Acceptance criteria:**
```text
Given a user selects an object from the list
When the detail view loads
Then all available fields for that object are shown

Given a user attempts to view an object belonging to another tenant (e.g. via a guessed ID)
When the detail endpoint is called
Then it returns 404/403, not the object's data
```

**Test cases:** Detail view shows all populated fields; missing optional fields render gracefully (not "undefined"); cross-tenant access attempt is denied.

**Dependencies:** 3DW-STORY-005.

**UX notes:** A simple detail panel or side-drawer; no specific visual design mandated.

**API/data notes:** `GET` single-object endpoint per the Warehouse Objects API group.

**Security/multitenancy notes:** Cross-tenant object-ID guessing must fail closed, same as list-level isolation.

**Performance notes:** None.

**Traceability:** PD-086; `api-and-data-design.md` (Warehouse Objects group).

**Estimated size:** XS

**PR-size risk:** Low

---

## 3DW-STORY-007: Render imported objects in 3D using placeholder geometry

**Type:** vertical-feature

**User story:** As a warehouse manager, I want to see my warehouse objects rendered in 3D, so that I can understand the layout spatially instead of reading a table.

**Business value:** The headline MVP capability (PD-001, PD-009, PD-084); even a placeholder-geometry version proves the core value proposition end to end.

**Scope:** React Three Fiber scene rendering each imported object as a simple placeholder shape (e.g. a box) positioned by its x/y/z and sized by width/height/depth, using GPU instancing for repeated types per `performance-and-3d-design.md`. Basic camera controls (pan/zoom/rotate).

**Out of scope:** LOD, culling, or any technique beyond basic instancing (deferred to Story 014's findings); object-type-specific visual models; selection highlighting in 3D.

**Acceptance criteria:**
```text
Given a tenant has imported warehouse objects with position and dimension data
When the user opens the 3D view
Then each object appears as a placeholder shape at its correct position and size

Given the user pans, zooms, and rotates the camera
When navigating the scene
Then the view responds without freezing for the imported object count
```

**Test cases:** Objects appear at correct coordinates for a small known dataset; camera controls function; objects missing optional z/height render using sensible defaults (e.g. z=0, height=width) rather than failing.

**Dependencies:** 3DW-STORY-005 (same underlying object data).

**UX notes:** No specific visual design required for placeholder geometry; this is a UI-mockup candidate before a design pass, not before this functional story.

**API/data notes:** Reuses the list endpoint from Story 005; no new API surface required.

**Security/multitenancy notes:** Same tenant-scoped data source as Story 005; no new exposure.

**Performance notes:** Uses GPU instancing from the start per `performance-and-3d-design.md`; full validation against the 100k target is Story 014, not this story.

**Traceability:** PD-001, PD-009, PD-042, PD-084; `performance-and-3d-design.md` (instancing strategy).

**Estimated size:** M

**PR-size risk:** Medium — **split recommendation:** if implementation reveals scene setup, camera controls, and instanced rendering each take meaningful independent effort, split into (a) scene/camera skeleton and (b) instanced object rendering. Kept as one story here because both are small individually against a tiny placeholder-geometry object set; revisit at Story LLD if the estimate grows.

---

## 3DW-STORY-008: Search and filter the object list

**Type:** vertical-feature

**User story:** As a warehouse planner, I want to search and filter the object list by zone, category, status, or text, so that I can find what I need without scrolling a long list.

**Business value:** Makes the list (and its role as the 2D fallback) actually usable beyond a handful of objects; directly required by INV-003/PD-107 ("search and filter").

**Scope:** Server-side filter parameters (`zone`, `category`, `status`, free-text `search`) on the list endpoint from Story 005; corresponding filter controls in the client.

**Out of scope:** Saved filters/views; combined complex boolean queries beyond simple AND-combination of the listed filters.

**Acceptance criteria:**
```text
Given a tenant has objects across multiple zones
When the user filters by a specific zone
Then only objects in that zone are shown

Given the user enters free-text matching an object's name or code
When search is applied
Then matching objects are shown, scoped to their tenant
```

**Test cases:** Single filter; combined filters (zone + status); free-text search matches name/code/id; no results state; filters remain tenant-scoped.

**Dependencies:** 3DW-STORY-005.

**UX notes:** Simple filter controls (dropdowns/text box) above the table; this doubles as the "2D fallback table search" capability named in `performance-and-3d-design.md`.

**API/data notes:** Extends the list endpoint's query parameters per `api-and-data-design.md` (Pagination/filtering/search conventions).

**Security/multitenancy notes:** Filters apply on top of, not instead of, the tenant scope — cannot be used to escape isolation.

**Performance notes:** Filtering is server-side to protect client performance at scale.

**Traceability:** PD-002, PD-044, PD-107; `api-and-data-design.md`.

**Estimated size:** S

**PR-size risk:** Low

---

## 3DW-STORY-009: Isolate 3D rendering failures so the 2D fallback stays usable

**Type:** technical-enabler

**User story:** As a warehouse planner, I want the application to keep working in 2D even if the 3D view fails to load, so that I'm never fully blocked from my data (INV-003).

**Business value:** Turns "we have a 2D fallback" from a claim into a tested guarantee; this is the invariant the business owner explicitly reconfirmed (BDD §10).

**Scope:** A client-side error boundary around the 3D view that catches rendering failures and switches to the 2D list/table view (Stories 005/008) instead of crashing the app shell.

**Out of scope:** Automatic retry of the 3D view; diagnostics/telemetry beyond a basic log entry (observability depth is an open item).

**Acceptance criteria:**
```text
Given the 3D view throws an error during rendering
When the failure occurs
Then the application shows the 2D fallback view instead of crashing
And the user can still search, filter, and inspect objects

Given the user is in the 2D fallback after a 3D failure
When they use search/filter/detail
Then all of it works exactly as it does when reached directly
```

**Test cases:** Simulated 3D render exception triggers fallback; 2D fallback remains fully functional after a 3D failure (not a read-only degraded mode); app shell does not crash.

**Dependencies:** 3DW-STORY-007, and 3DW-STORY-005/008 (the 2D view it falls back to).

**UX notes:** A brief, non-alarming notice that 3D is unavailable and 2D is being shown; no detailed error surfaced to the end user (details go to logs only, per Security/multitenancy notes).

**API/data notes:** None; purely client-side behavior over existing data.

**Security/multitenancy notes:** Error details logged must not include tenant data or credentials (OWASP: sensitive data exposure), consistent with Story 003's error-contract principles applied client-side.

**Performance notes:** None beyond not blocking the UI thread while handling the failure.

**Traceability:** INV-003, PD-075, PD-107; `high-level-design.md` (Exception handling architecture).

**Estimated size:** XS

**PR-size risk:** Low

---

## 3DW-STORY-010: Add XLSX import support alongside CSV

**Type:** vertical-feature

**User story:** As a warehouse planner, I want to import an XLSX file the same way I import CSV, so that I can use whichever format my layout data is already in.

**Business value:** Second required Phase 1 format (PD-108); avoids forcing users to convert files manually.

**Scope:** Extend the Story 004 import endpoint/client to accept `.xlsx`, mapping to the same required/optional field schema and validation rules.

**Out of scope:** Multi-sheet workbook handling beyond the first/only relevant sheet (open item, not specified by discovery); anything not already covered by Story 004's validation scope.

**Acceptance criteria:**
```text
Given an XLSX file with all required columns and valid rows
When a user imports the file
Then the objects are stored identically to a CSV import with the same data

Given an XLSX file missing a required column
When the user imports the file
Then it is rejected with the same validation behavior as Story 004
```

**Test cases:** XLSX happy path produces identical stored results to an equivalent CSV; missing-column rejection parity with Story 004; wrong file extension/corrupt file handled as a data-quality error (Story 003's contract), not a crash.

**Dependencies:** 3DW-STORY-004.

**UX notes:** Same file picker, now accepting both extensions; same result summary.

**API/data notes:** Reuses the Import API group and `WarehouseObject` model from Story 004.

**Security/multitenancy notes:** Same as Story 004; no new exposure.

**Performance notes:** None beyond what Story 004 already covers.

**Traceability:** PD-108; `api-and-data-design.md` (Import model).

**Estimated size:** XS

**PR-size risk:** Low

---

## 3DW-STORY-011: Per-row import error report

**Type:** vertical-feature

**User story:** As a warehouse planner, I want to see exactly which rows in my import file failed and why, so that I can fix my data instead of guessing.

**Business value:** Makes import trustworthy with real, imperfect data; directly reflects PD-111's noted uncertainty about source data quality.

**Scope:** Change import behavior (CSV and XLSX, Stories 004/010) from all-or-nothing on row-level issues to per-row: valid rows are stored, invalid rows are reported individually with a reason, and the result summary shows counts of each.

**Out of scope:** Auto-correction of bad data; re-import/patch of only the failed rows (user re-submits a corrected file in MVP).

**Acceptance criteria:**
```text
Given a file with 10 valid rows and 2 rows missing required field values
When the user imports the file
Then 10 objects are stored
And the user sees a report listing the 2 failed rows with specific reasons
And no valid row is rejected because of unrelated bad rows
```

**Test cases:** Mixed valid/invalid rows; all-valid file (no behavior change from Stories 004/010); all-invalid file (zero stored, full report); large failed-row count renders without breaking the UI.

**Dependencies:** 3DW-STORY-004 (and benefits from 010 for XLSX parity).

**UX notes:** An expandable error list in the import result summary, replacing the all-or-nothing reject message from Story 004.

**API/data notes:** Import endpoint response shape extended with a per-row result list, still within the Story 003 error-contract style for the failed-rows detail.

**Security/multitenancy notes:** Error report must not leak other tenants' data in any shared error-code text.

**Performance notes:** Row-level reporting must not meaningfully slow down import for the 100k-object Phase 1 target; validated alongside Story 014 if needed.

**Traceability:** PD-111 (data-quality uncertainty); `high-level-design.md` (Exception handling architecture, data-quality category).

**Estimated size:** S

**PR-size risk:** Low

---

## 3DW-STORY-012: Basic tenant-scoped dashboard summary

**Type:** vertical-feature

**User story:** As an operations manager, I want a basic summary of my warehouse objects (counts by zone, category, status), so that I get an at-a-glance view without opening the full list.

**Business value:** Directly answers the Phase 1 "basic dashboard/summary" item (PD-046, PD-093) and PD-007's goal of reducing manual report assembly.

**Scope:** A tenant-scoped aggregate endpoint (counts by zone, category, status); a simple summary view in the client (numbers/small table, not charts).

**Out of scope:** Charts/visualizations, trends over time, export — all Phase 2 ("advanced reporting and export").

**Acceptance criteria:**
```text
Given a tenant has imported warehouse objects across several zones and statuses
When the user opens the dashboard
Then they see accurate counts broken down by zone, category, and status, for their tenant only
```

**Test cases:** Counts match known imported data; empty-tenant state; counts change correctly after a new import (Story 004/010/011) or after deletion (out of scope for MVP, but no crash if zero objects remain); tenant isolation of the aggregate.

**Dependencies:** 3DW-STORY-005 (object data must exist and be queryable).

**UX notes:** A simple numbers/small-table summary; no chart library decision needed for MVP.

**API/data notes:** Aggregate endpoint per the Dashboard API group in `api-and-data-design.md`.

**Security/multitenancy notes:** Aggregate query respects the same tenant scope as all other endpoints; no cross-tenant leakage even in summed/counted form.

**Performance notes:** Aggregate query should be indexed appropriately at the 100k-object scale; specific indexing left to implementation planning per `api-and-data-design.md`.

**Traceability:** PD-046, PD-093, PD-007; `high-level-design.md` (Major runtime flows, Dashboard).

**Estimated size:** S

**PR-size risk:** Low

---

## 3DW-STORY-013: Automated fail-closed tenancy test suite

**Type:** test-enabler

**User story:** As the delivery team, I want an automated test suite proving that no endpoint can return or accept data without a valid tenant context, so that INV-001 stays enforced as the system grows.

**Business value:** Turns the Story 002 guarantee into a regression-proof one; the single highest-value non-functional investment given INV-001 is a hard project invariant.

**Scope:** Integration tests against every tenant-scoped endpoint that exists by this point (Stories 004-012's list/detail/import/dashboard endpoints): missing tenant context -> denied; cross-tenant ID access -> denied; valid tenant -> correctly scoped result only.

**Out of scope:** Load/performance testing (Story 014's concern); UI-level tenancy tests (covered incidentally by Playwright/E2E work in later planning, not this story).

**Acceptance criteria:**
```text
Given the full set of tenant-scoped endpoints implemented so far
When the test suite runs
Then every endpoint has at least one test proving fail-closed behavior on missing/invalid tenant context
And at least one test proving cross-tenant data is never returned
```

**Test cases:** One parametrized or per-endpoint test set covering: no auth, invalid tenant claim, valid tenant A cannot see tenant B's data, valid tenant A's writes are stamped with tenant A only.

**Dependencies:** 3DW-STORY-002, and functionally depends on Stories 004-012 existing to have endpoints to test (can be built incrementally alongside them rather than strictly after).

**UX notes:** None; backend test suite only.

**API/data notes:** Exercises the full API surface built so far.

**Security/multitenancy notes:** This story exists specifically to validate `security-and-multitenancy-design.md`'s fail-closed rules end to end.

**Performance notes:** None.

**Traceability:** INV-001; `security-and-multitenancy-design.md`.

**Estimated size:** S

**PR-size risk:** Low

---

## 3DW-STORY-014: 3D rendering performance spike at 100,000 objects

**Type:** spike

**User story:** As the delivery team, I want to measure whether the chosen 3D rendering approach can hit ~30 FPS at 100,000 objects, so that the Phase 1 performance target is validated before it's assumed true.

**Business value:** De-risks PD-035/PD-037/PD-098 before implementation planning locks in specifics; a timeboxed spike is far cheaper than discovering a performance problem after Phase 1 is built.

**Scope:** Generate a synthetic dataset of 100,000 placeholder objects (per `performance-and-3d-design.md`'s test-data guidance); measure frame time/FPS in the Story 007 3D view under normal navigation (pan/zoom/rotate); record findings and a go/no-go recommendation on the instancing-only approach versus needing LOD/culling sooner than planned.

**Out of scope:** Implementing LOD/culling/spatial partitioning (only recommended here, built later if the spike shows it's needed); the 500k-1M Phase 2 target (a follow-on spike, not this one).

**Acceptance criteria:**
```text
Given a synthetic dataset of 100,000 placeholder objects
When it is loaded into the Story 007 3D view and navigated normally
Then frame-time/FPS measurements are recorded and compared against the ~30 FPS target

Given the spike is complete
When the findings are written up
Then they state clearly whether instancing alone is sufficient for the Phase 1 target, or which additional technique (LOD/culling/worker-loading) is recommended next
```

**Test cases:** Not applicable in the usual sense — this is a spike; its "test" is the measurement itself, recorded and reproducible (same synthetic dataset, same measurement method, repeatable by another team member).

**Dependencies:** 3DW-STORY-007.

**UX notes:** None; internal measurement exercise.

**API/data notes:** Uses synthetic data, not a real import; no production API changes.

**Security/multitenancy notes:** None (synthetic, non-tenant data).

**Performance notes:** This story's entire output is a performance measurement; see `performance-and-3d-design.md` (Profiling plan).

**Traceability:** PD-035, PD-037, PD-098, PD-101; `performance-and-3d-design.md` (Profiling plan, Test data requirements).

**Estimated size:** S (timeboxed)

**PR-size risk:** Low (findings write-up + measurement scaffolding, not production code)
