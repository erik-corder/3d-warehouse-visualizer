# ADR-0002: Choose Electron + React + TypeScript for the Frontend

## Status

Proposed. Not yet approved (`architecture_approved` gate is `PENDING`).

## Context

`.skillbase/project.yaml` states Electron + React + TypeScript as the target frontend direction. The business owner reconfirmed this explicitly: "The first target frontend is Electron desktop with TypeScript" (`business-owner-response.md`, BOR-10), and the subsequent business decision restated it as "Electron desktop with TypeScript as the frontend direction, subject to ADR confirmation" (`problem-discovery-business-decision.md` §4, traceability PD-064/PD-090). Solution Discovery compared this against a web-first sequencing, a local-first-with-sync client, a browser-only client, and a heavy CAD/game-engine client, and recommended Electron + React + TypeScript (`solution-options.md`, `recommended-solution.md`).

## Decision

Adopt **Electron (desktop shell) + React + TypeScript (renderer)** as the Phase 1 frontend platform, with React Three Fiber/Three.js for the 3D view and a parallel React 2D fallback view sharing the same data layer.

## Consequences

- Distribution is a desktop installable, not a browser URL; this matches the stated business direction but means packaging/update mechanics (auto-update, code signing) become implementation-planning concerns.
- The 2D fallback and 3D view can share one React codebase and one data-fetching layer, reducing the risk of the two views diverging (INV-003).
- Team skill fit in Electron/React/TypeScript/React Three Fiber is assumed, not independently confirmed by any discovery source beyond the frontend platform choice itself — flagged as an open item in `recommended-solution.md`.
- Rejects: web-first-then-Electron (redundant resequencing toward the same destination), local-first-with-sync (solves an offline requirement discovery never raised), browser-only (conflicts with the stated direction and does not reduce total system complexity once a backend is added anyway), and a heavy CAD/game engine (solves for CAD/BIM fidelity explicitly out of scope per PD-091).

## Alternatives considered

See `.skillbase/artifacts/solution/solution-options.md` for the full five-option comparison table and rejection reasons; not repeated here to avoid duplicating that document (POL-009).
