# ADR-0003: Choose .NET 10 + EF Core 10 Code-First + Azure SQL for the Backend

## Status

Proposed. Not yet approved (`architecture_approved` gate is `PENDING`).

## Context

`.skillbase/project.yaml` states .NET 10 LTS, EF Core 10 code-first and Azure SQL as the target backend direction, and a modular monolith architecture unless an approved ADR changes it (POL-012). Unlike the frontend platform (ADR-0002), no discovery source independently reconfirmed this specific backend stack — the business owner's answers addressed frontend platform, MVP scope, phases, KPIs, tenancy, sync, 2D fallback and file formats, but not the backend language/ORM/database explicitly (tracked as open item PD-077 in `requirements-traceability.md` and `recommended-solution.md`). Solution Discovery nonetheless carried this stack forward as part of the recommended option, since no alternative backend was evaluated against it and no discovery evidence argues against it.

## Decision

Adopt **.NET 10 LTS** for the backend API and background worker, **EF Core 10 code-first** for data access and migrations, and **Azure SQL** as the database, organized as a **modular monolith** (Import, Sync, Warehouse Objects, Tenancy, Dashboard modules within one deployable), with row-level multitenancy enforced via EF Core global query filters.

## Consequences

- Keeps one deployable backend and one database technology to operate, consistent with POL-012 and the "modular monolith unless an approved ADR changes it" rule.
- EF Core global query filters become the structural mechanism for fail-closed multitenancy (INV-001); this is a load-bearing architectural choice, not an implementation detail, and is documented in `security-and-multitenancy-design.md`.
- Migration discipline (controlled, reviewed schema changes; destructive migrations require explicit human approval per POL-006) applies from the first migration onward.
- Because this stack was not independently reconfirmed by the business owner the way the frontend was, this ADR itself is the point at which that reconfirmation should happen — approving this ADR is the mechanism for that sign-off, not a substitute for it. A human approver should treat this explicitly, not assume it was already covered by the frontend confirmation.
- If a future need (e.g. proven scale limits, team composition change) argues against this stack, that requires its own ADR superseding this one; nothing here is self-reinforcing beyond the normal weight of an approved ADR.

## Alternatives considered

Solution Discovery's five-option comparison (`solution-options.md`) varied the *frontend/packaging* dimension (Electron vs. web vs. local-first vs. heavy engine); it did not vary the backend stack independently, since no discovery source proposed an alternative backend. No backend alternative (e.g. Node.js, Java, a different ORM or database) was evaluated in this round. If desired, evaluating backend alternatives explicitly would require a dedicated comparison, not assumed here.
