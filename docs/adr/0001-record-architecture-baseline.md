# ADR-0001: Record Architecture Baseline

## Status

Proposed. Not yet approved (`architecture_approved` gate is `PENDING` in `.skillbase/state.json`).

## Context

Problem Discovery (`discovery_approved`) and Solution Discovery (`solution_approved`) are approved, per the recorded human approvals in `.skillbase/artifacts/evidence/problem-discovery-human-approval.md` and `.skillbase/artifacts/evidence/solution-discovery-human-approval.md`. This ADR records the resulting High-Level Design as the architecture baseline for the 3D Warehouse Visualizer, so later ADRs (0002, 0003, and any future ones) have a fixed point to reference and diff against.

## Decision

Adopt the design in `.skillbase/artifacts/architecture/high-level-design.md`, `c4-views.md`, `api-and-data-design.md`, `security-and-multitenancy-design.md`, and `performance-and-3d-design.md` as the Phase 1 architecture baseline: a modular monolith (per POL-012), API-first, fail-closed multitenant, with a 3D primary view and a fully functional 2D fallback (INV-003), read-only WMS integration (INV-002), and mandatory tenant isolation from the start (INV-001).

## Consequences

- Future architecture changes (e.g. splitting the monolith into services) require their own ADR, per POL-012.
- The five HLD documents become the reference point for Story LLD and Implementation Plan stages.
- Open questions listed in `high-level-design.md` (supported-machine profile, KPI baselines, sync interval, units/coordinate normalization, independent backend-stack reconfirmation) remain open and are not resolved by adopting this baseline; they are tracked for HLD follow-up or implementation planning.
- This ADR does not itself grant the `architecture_approved` gate; a human must still approve it through SkillBase.

## Alternatives considered

Not applicable — this ADR records the baseline rather than choosing between options; the option comparison itself was done in Solution Discovery (`.skillbase/artifacts/solution/solution-options.md`).
