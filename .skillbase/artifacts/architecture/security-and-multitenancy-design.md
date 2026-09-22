# Security and Multitenancy Design: 3D Warehouse Visualizer

Companion to `high-level-design.md`. OWASP secure-design principles applied throughout. No code included.

## Tenant isolation model

**Row-level multitenancy** (Candidate A, `solution-architecture-candidates.md`): a `tenant_id` column on every tenant-scoped table, enforced by an EF Core global query filter applied uniformly, so individual queries cannot accidentally omit tenant scoping. Chosen over schema-per-tenant or database-per-tenant for Phase 1 scale and operational simplicity; either alternative remains available later via ADR if isolation requirements tighten (e.g. a specific customer contract requiring physical separation).

## Tenant context source

Resolved server-side, once per request, from an authenticated identity — never accepted as a raw client-supplied tenant ID. Exact identity/auth mechanism (e.g. an identity provider, token-based auth) is an open item for implementation planning; the architectural requirement is that tenant context always derives from something the server has independently verified, not from client input alone, to prevent tenant-spoofing (OWASP: broken access control).

## Fail-closed rules

Per INV-001 and PD-061/PD-074/PD-094/PD-105:
- No resolvable tenant context -> request denied (401/403), never defaulted to "all tenants" or "no tenant."
- The global query filter is the structural backstop: even a module that forgets to check tenant context explicitly still cannot read or write across tenants, because the filter is applied at the data-access layer, not left to per-endpoint discipline.
- Any code path that must bypass the filter (rare administrative cases) requires explicit, reviewed justification and its own audit trail — not a default escape hatch.

## Authorization approach

- Phase 1: minimal but non-bypassable — every authenticated user is scoped to exactly one tenant; within that tenant, access is not further role-differentiated beyond what is needed to keep isolation intact (PD-105).
- Full role-based access control (fine-grained permissions within a tenant) is explicitly Phase 2 (PD-106, PD-091) — deferred, not designed here beyond noting the boundary.

## Read-only WMS boundary

- The WMS integration (whether file import or scheduled sync) is architecturally one-directional: read from WMS, write to the application's own store. No code path issues writes, updates or deletes against the WMS (INV-002, PD-062, PD-103).
- WMS credentials, where used, are scoped to read-only access at the WMS side if the WMS supports it; this is a request to make at integration/credential-provisioning time, not something this design can enforce alone, so it is recorded as a requirement for whoever provisions WMS access.

## Secrets/configuration approach

- Twelve-Factor: all secrets and environment-specific configuration (connection strings, WMS endpoints, sync intervals) come from environment/configuration providers, never hard-coded or committed.
- `.env.example` remains names-only, per POL-007 and the existing repository convention; no default values that look like real secrets.
- Local development secrets are supplied via `.env` (git-ignored) or the developer's own environment, consistent with the existing `.gitignore`.

## Audit logging

- Log, at minimum: import/sync runs (who/what/when/outcome), access-denied events (tenant-resolution failures, authorization failures), and any administrative bypass of tenant scoping.
- Every log line tied to import/sync/API activity carries the resolved tenant ID (where one exists) and a correlation/request ID, so incidents can be traced without cross-tenant guesswork.
- Audit logs themselves must remain tenant-scoped on read (an operator viewing tenant A's audit trail must not see tenant B's), consistent with the isolation model above.

## Data protection concerns

- Data at rest: Azure SQL's standard encryption at rest is assumed sufficient for Phase 1; no additional field-level encryption is specified without a discovery-stated requirement for it.
- Data in transit: HTTPS/TLS between Electron client and backend API, and between the backend and Azure SQL/WMS, as a baseline requirement.
- No credentials or secrets are to be logged, ever, including in error responses (ties to the error-response design in `api-and-data-design.md`).

## OWASP risks and mitigations

| OWASP concern | Mitigation in this design |
|---|---|
| Broken access control | Tenant context resolved server-side only; global query filter as a structural backstop; fail-closed on missing/invalid context |
| Injection | EF Core parameterized queries throughout; no raw SQL string concatenation for user-supplied filter/search input |
| Security misconfiguration | Twelve-Factor config, no secrets in source, `.env.example` stays names-only |
| Sensitive data exposure | TLS in transit, Azure SQL encryption at rest, no secrets/credentials in logs or error responses |
| Insufficient logging/monitoring | Audit logging of import/sync and access-denied events, tenant-tagged, from day one (Observability, `high-level-design.md`) |
| Server-side request forgery / unsafe external calls | WMS sync calls target only the configured, read-only WMS endpoint; no user-controlled URLs are fetched server-side |
| Improper input validation | Import module validates and normalizes every row before persistence; malformed rows rejected per-row, not silently accepted |
