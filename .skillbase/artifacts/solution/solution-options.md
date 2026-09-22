# Solution Options: 3D Warehouse Visualizer

Evidence basis: Problem Discovery Revisions 1-3 (`requirements-traceability.md`, PD-001 to PD-112), `problem-discovery-business-decision.md` (BDD), `.skillbase/project.yaml` invariants INV-001 to INV-003, POL-012 (modular monolith unless ADR). **Draft solution evidence, not an approved architecture.** No option here is selected as final; see `recommended-solution.md`.

## Options compared

1. **Electron + React + TypeScript + React Three Fiber + .NET 10 backend + EF Core + Azure SQL** (the `project.yaml` target direction, PD-064/PD-090 "subject to ADR confirmation")
2. **Web app first, Electron wrapper later**
3. **Electron local-first with embedded/local database plus sync**
4. **Browser-only Three.js solution** (no Electron)
5. **Heavy 3D/CAD engine approach** (e.g. a licensed CAD/BIM viewer engine or game engine such as Unreal/Unity embedded or streamed)

## Comparison table

| Dimension | 1. Electron+.NET target | 2. Web-first, Electron later | 3. Electron local-first + sync | 4. Browser-only Three.js | 5. Heavy 3D/CAD engine |
|---|---|---|---|---|---|
| MVP fit (PD-084-094) | Direct fit; matches stated direction and BDD Phase 1 scope | Fit, but adds a second packaging effort before/after MVP | Fit for offline use cases discovery does not request | Fit for the 3D/2D viewer itself; weaker for a desktop-distributed product | Overkill for stated Phase 1 scope |
| Performance 100k objects, later 500k-1M (PD-035, PD-036, PD-098) | Achievable with R3F instancing, LOD, culling; needs deliberate design | Same rendering stack, same techniques apply | Same rendering stack; sync adds complexity, not raw render performance | Same rendering stack, browser memory/tab limits are a real ceiling at the high end | Best raw large-scene performance, but the engine itself is unproven for this data model |
| 2D fallback (PD-043, PD-063, PD-075, PD-107, INV-003) | Native support via a second React view; shares data layer | Same | Same | Same | Requires building or bridging a separate UI stack; awkward fit |
| WMS read-only integration (PD-045, PD-062, PD-092, PD-103, INV-002) | .NET backend is a natural integration and normalization layer | Same, backend-independent of client packaging | Same backend option available | No natural backend tier unless one is added anyway | No change to this dimension; backend still needed separately |
| Multitenancy (PD-061, PD-074, PD-094, PD-105, PD-106, INV-001) | EF Core + Azure SQL supports row-level or schema-per-tenant; fail-closed enforceable server-side | Same | Same, plus local-store tenant leakage risk to manage | Same server-side options if a backend exists; nothing new here | Same; engine choice does not affect this |
| Offline/local capability | Not required by discovery; achievable later if needed | Not required; deferred to Phase 2+ if ever | Matches "offline" well, but nothing in discovery asks for it (see PD-091: no discovery-stated offline requirement) | Weakest; a browser tab is not persistent enough for real offline use | Not inherently offline either |
| Security (PD-065, PD-094, PD-105, INV-001, INV-002) | Standard: server-side auth, tenant isolation, read-only WMS boundary enforced in one place | Same | Same, plus local data-at-rest protection needed | Weaker: browser-only means data governance and tenant boundaries live client-side unless a backend is added regardless | Same as (1) for the backend; engine adds a new attack surface and licensing/compliance surface |
| Implementation complexity | Medium: two runtimes (Electron/React, .NET), one clear boundary | Medium-high: two client packaging efforts across time | High: sync/conflict logic on top of everything else | Lower for the viewer alone, but a backend is still needed for WMS/tenancy/security, so total complexity is similar to (1) with worse security | High: new engine to learn, integrate, license, and bridge to the rest of the stack |
| Team skill fit | Matches `project.yaml` target stack (.NET 10, React/TS, R3F/Three.js); assumed available given the target was already set as direction. Not independently confirmed by discovery — see open question below. | Same skill set, plus extra packaging-transition work | Same skills plus sync-engine expertise, not evidenced as available | React/TS/Three.js skills reusable; .NET skills underused if no backend | Requires CAD/game-engine expertise not evidenced anywhere in discovery |
| Cost/token efficiency for agentic development | Mainstream stack; large public corpus of patterns, well-suited to agentic scaffolding | Similar, plus one extra migration phase to design and validate twice | Sync logic is comparatively hard for an agent to get right and verify | Simpler surface area for the viewer; still needs a backend built in parallel, so no real savings once WMS/tenancy are counted | Least agent-friendly: niche APIs, licensing steps, and smaller public corpus increase token cost and risk |
| Testing strategy | Standard: xUnit/.NET, Vitest/RTL for React, Playwright for Electron/E2E | Same, but must be re-validated after the Electron wrapper is added | Same plus sync/conflict test matrix | Standard web testing tools; still needs backend test coverage | Engine-specific test tooling, often weaker automation support |
| CI/CD and Docker Compose fit | Good: .NET + SQL containerize cleanly; Electron build is a separate packaging step outside Compose | Good for the web phase; Electron packaging step added later, same as (1) eventually | Good for the backend; local-store/sync logic is harder to exercise in CI | Good for the web app; a backend must still be composed for WMS/tenancy | Poor: proprietary engines often resist standard container/CI workflows |
| Long-term maintainability | Matches the stated modular monolith direction (POL-012) and target stack; one boundary to reason about | Reasonable, at the cost of maintaining two client-shell configurations over time | Sync logic tends to accumulate edge-case debt | Reasonable for the viewer; backend still has to be maintained regardless, so no simplification is actually gained | Vendor/engine lock-in risk; harder to find future maintainers |

## Pros and cons

### 1. Electron + React + TypeScript + React Three Fiber + .NET 10 backend + EF Core + Azure SQL
- **Pros:** Matches the stated `project.yaml` target direction and the BDD's Phase 1 scope almost line for line; one clear client/server boundary supports read-only WMS integration, multitenancy and the 2D fallback without extra layers; mainstream, well-documented stack keeps agentic development and future hiring practical.
- **Cons:** Team skill fit is assumed, not confirmed by any discovery source (open question); performance at 500k-1,000,000 objects still needs a deliberate rendering strategy (instancing, LOD, culling) that discovery does not specify.

### 2. Web app first, Electron wrapper later
- **Pros:** Faster to demo in a browser during Solution Discovery/HLD; same rendering and backend code as option 1, so it is not really a different architecture, only a different sequencing.
- **Cons:** Adds a second packaging and validation pass (web, then Electron) with no discovery-stated reason to sequence it that way; the project's explicit frontend target is Electron (PD-064, PD-090), so this delays rather than changes the destination.

### 3. Electron local-first with embedded/local database plus sync
- **Pros:** Would suit true offline use, if that were required.
- **Cons:** Discovery explicitly does not require offline capability or real-time sync (PD-091 lists "true real-time tracking" as out of scope; nothing asks for offline-first); sync/conflict logic is the highest-complexity, least agent-friendly part of any option here, for a requirement nobody asked for.

### 4. Browser-only Three.js solution (no Electron)
- **Pros:** Simplest client for the 3D/2D viewer alone; reuses the same React/TS/Three.js skills as option 1.
- **Cons:** Directly conflicts with the stated Electron desktop direction (PD-064, PD-090, `project.yaml`); still needs a backend for WMS integration, tenancy and security, so it does not actually reduce total system complexity, only changes where the client runs.

### 5. Heavy 3D/CAD engine approach
- **Pros:** Likely the strongest raw performance ceiling for very large scenes.
- **Cons:** No discovery source asks for CAD/BIM-level fidelity; PD-091 explicitly places "advanced CAD/BIM import" out of scope for MVP; introduces licensing, integration and skill-fit risk with no offsetting discovery-stated need; worst fit for CI/CD, Docker Compose and agentic development.

## Rejected options and reasons

| Option | Rejected because |
|---|---|
| 2. Web-first, Electron later | Resequences toward the same destination as option 1 with no discovery-stated benefit; adds a redundant packaging phase. |
| 3. Electron local-first + sync | Solves a requirement (offline-first, sync) that discovery explicitly does not raise, while adding the highest complexity and risk of the five options. |
| 4. Browser-only Three.js | Conflicts with the explicit Electron desktop direction (PD-064, PD-090) and does not reduce overall system complexity once a backend is added for WMS/tenancy/security. |
| 5. Heavy 3D/CAD engine | Solves for CAD/BIM fidelity that PD-091 places out of scope; worst fit for cost/token efficiency, CI/CD and team skill fit; no discovery evidence supports the added risk. |

## Traceability to Problem Discovery

- Frontend direction: PD-064, PD-090 (Electron + TypeScript, "subject to ADR confirmation").
- Backend/data direction: `project.yaml` targets (.NET 10 LTS, EF Core 10 code-first, Azure SQL) — not contradicted by any discovery source, but also not independently confirmed by the business owner beyond the frontend; carried forward as an open item (see `recommended-solution.md`).
- Phase 1 scope: PD-092 to PD-094, PD-107 to PD-110.
- Performance targets: PD-035 to PD-037, PD-098.
- Multitenancy and WMS read-only: PD-061, PD-062, PD-074, PD-094, PD-105, PD-106, INV-001, INV-002.
- 2D fallback: PD-043, PD-063, PD-075, PD-107, INV-003.
- Explicit out-of-scope items ruling out options 3 and 5: PD-091.
