# Problem Discovery: Summary

Source: Confluence "Problem Discovery" (page 1333886977, last modified Jun 26, 2026); see `problem-discovery-source.md`. Requirement IDs (PD-nnn) are in `requirements-traceability.md`.
**Evidence, not approval.** Content is quoted or tightly paraphrased. Items marked *(importer)* are gaps the importer noticed, not statements in the page.

## Headline finding

The page's own **§10 Recommended Decision** is to **continue problem discovery**, and to finish validating problems, baselines and success metrics **before** solution discovery, architecture, development planning or implementation. The page also frames itself as a "Real world example" with "Sample Findings". Both points bear on approval; see the validation report.

## Business problem (§1, §2, §5)

Warehouses rely on static WMS reports, spreadsheets and manual floor checks, so managers, inventory controllers and operations teams lack timely, consolidated, spatial visibility of inventory locations, storage capacity, and picking, packing and dispatch activity. Result: delayed decisions, poor product placement, slow bottleneck detection, fragmented reporting and time-consuming management analysis. (PD-001 to PD-007)

## Users and personas (§3)

| Role | Pain | Influence |
|---|---|---|
| Warehouse Manager | Limited operational visibility, delayed decisions | High |
| Inventory Controller | Hard to find empty locations, utilization, stock movement patterns | High |
| Operations Manager | No view of order progress and bottlenecks | High |
| Warehouse Staff (picking, packing, dispatch) | Little guidance on optimized locations and workflows | Medium |
| IT Team | Disconnected systems and reporting dependencies | Medium |
| Executive Management | Delayed access to operational insights and KPIs | High |

## Pain points (§2, §4, §5, §7)

- Inventory is hard to visualize spatially; slow inventory decisions.
- Empty and underutilized locations are hard to identify; poor space utilization.
- High-demand items may sit in inefficient locations; longer picking time.
- Limited visibility into picking, packing and dispatch status; delayed issue detection.
- Bottlenecks found only after they occur; reduced productivity.
- Management insight needs multiple reports and spreadsheets; delayed decisions.
- Fragmented information across the WMS, spreadsheets and other systems; inconsistent interpretation.

All seven priority problems in §7 are rated **High**: delayed operational visibility (fast/slow moving), limited optimization insights, manual report analysis, difficulty identifying inefficiencies, limited order tracking (pick, pack, dispatch), difficulty interpreting location and utilization data, lack of a visual warehouse overview.

## Business goals and success metrics (§8)

Baselines and targets are **not given** for any metric.

| Phase (per page) | Goal | KPI |
|---|---|---|
| Phase 1 | Improve inventory location accuracy | Inventory location accuracy rate |
| Phase 1 | Optimize warehouse space utilization | Warehouse space utilization rate |
| Phase 1 | Reduce time to identify empty or underutilized locations | Time to locate available storage capacity |
| Phase 1 and 2 | Reduce time spent generating and interpreting reports | Hours per week on manual report generation |
| Phase 1 and 2 | Eliminate redundant spreadsheet reconciliation | Number of manual spreadsheet reports replaced |
| Phase 2 | Reduce time to detect picking, packing, dispatch delays | Mean Time to Identify Bottleneck (MTIB) |
| Phase 2 | Improve order fulfillment cycle time | Order cycle time (pick-to-dispatch) |
| Phase 2 | Reduce reactive decisions | % proactive vs. reactive operational decisions |
| Phase 2 | Improve time-to-decision | Average time from issue identification to decision |

## Functional needs (implied)

The page has no explicit functional requirements section. These are drawn from the problem statements and priorities, and all need human review.
- A visual (spatial, 3D per §9) warehouse overview (PD-001, PD-009).
- Inventory location, utilization and capacity visibility, including empty and underutilized locations (PD-002).
- Fast-moving and slow-moving item visibility and placement insight (PD-003).
- Order progress visibility across pick, pack and dispatch (PD-004), and bottleneck detection (PD-005).
- Operational optimization insights (PD-006), described only vaguely.
- Less manual reporting and spreadsheet reconciliation; consolidated management insight (PD-007).
- Natural-language chatbot querying (PD-008), which appears once, in §5, and looks out of place.

## Non-functional needs

None explicitly stated. Implied only: timely, near-live operational data (PD-011), with the required latency undecided (PD-023), and trust in the 3D view (PD-016).

## Constraints (§9, §10)

- Solution decisions must not be finalized until priority problems, measurable outcomes and decision criteria are agreed; signed-off problem statements and metrics are entry criteria for the next phase (PD-018).
- Problem validation must finish before solution discovery, architecture, development planning or implementation (PD-019).
- Work is phased (Phase 1 and Phase 2) but the phases are not defined (PD-020).

## Assumptions and risks (§9)

- WMS can push item master, location, order and moving data through APIs (PD-014).
- Stakeholders can agree consistent definitions of key warehouse problems (PD-015).
- Users will understand and trust the 3D visualization (PD-016).
- Risk: incomplete or inconsistent data may limit problem sizing (PD-017).
- Risk: real-time data may be delayed or unavailable (PD-012).

## Open questions

From the page (§9 "Unknown", validation methods given there):
- Time each role spends on manual reporting, reconciliation and issue investigation (PD-021).
- Frequency and business impact of delayed issue detection (PD-022).
- Required level of live tracking: real-time, near-real-time or scheduled sync (PD-023).
- Exact warehouse layout format and spreadsheet structure; sample layout files needed (PD-024).

*(importer)* Gaps the page does not address:
- KPI baselines and targets (PD-025).
- Definition of Phase 1 and Phase 2 scope (PD-026).
- Whether the chatbot is in scope (PD-027).
- Whether the page is validated project evidence or an illustrative example, and its sign-off status (PD-028).
- The project invariants (multi-tenancy, read-only WMS as source of truth, complete 2D fallback) and frontend platform direction are not mentioned (PD-029). This is a gap, not a contradiction.

## Out-of-scope items

**None stated.** §10 says no solution approach should be discussed or selected yet. That is a process constraint (PD-019), not a scope exclusion.

---

# Revision 2: Business Owner Response

Added 2026-09-21T10:08:51Z. Source: `business-owner-response.md` (source BOR; author and date not identified; not in Confluence). Item IDs are in the "Revision 2" section of `requirements-traceability.md`. Where this section and the sections above differ, both positions are kept; see Conflicts. **Evidence, not approval.**

## Status of the evidence (PD-031, PD-032)

The page is **draft discovery evidence**, not merely a sample, and **not yet approved**: it needs business review. Its findings are **candidate findings**, not validated with production data. This answers open question PD-028.

## Framing shift (PD-070)

The response describes the project as warehouse **layout planning and visualization** (large-scale 3D/2D layout, spreadsheet import) for planners, operations managers, business users and the technical/data team. The page frames it as **operational visibility from WMS data**, for six other roles. The response does not say it replaces the page. A human must say which is authoritative.

## Goals and KPI targets (PD-033 to PD-040)

- Reduce manual layout planning effort by at least 50% (example: 8 h to 4 h for a standard layout review).
- Improve issue detection time by at least 60% (problems found within minutes instead of after manual inspection).
- Reduce planning errors from spreadsheet/manual updates by at least 40%.
- Improve visibility for business users, planners and operations teams; reduce dependency on technical users (no metric).
- Performance: 100,000 objects in Phase 1; 500,000 to 1,000,000 in Phase 2; at least 30 FPS for normal navigation on supported machines (PD-035 to PD-037).

Baselines and definitions are mostly missing (PD-072). These targets differ from the page's nine KPIs.

## Phases (PD-041 to PD-054)

- **Phase 1:** import layout and object data; 3D view; 2D fallback view; basic search, filter, selection; read-only WMS integration or file-based import; basic dashboard/summary; single approved warehouse scenario/view.
- **Phase 2:** very large warehouses; advanced heatmaps and issue detection; live or near-real-time tracking; scenario comparison; performance optimization; role-based access and tenant-level configuration; advanced reporting and export.

## Live tracking (PD-058)

Not real-time in MVP. Phase 1: manual import or scheduled sync (on demand or at defined intervals). Phase 2: near-real-time if required; true real-time only if the business confirms use cases such as live movement monitoring.

## Data formats (PD-059, PD-060)

Phase 1: `.xlsx` and `.csv` object lists (id, type, name/code, x, y, optional z, width, height, depth, zone/area, status/category). CAD, BIM and advanced 3D formats: later phase, after technical review.

## Roles and manual work today (PD-056)

Warehouse Planner (manual layout, space and version comparison), Operations Manager (reports, bottlenecks found late), Business User (cannot read raw layout data), Technical/Data Team (prepares files and reports, repeated requests). Not quantified.

## Impact of late detection (PD-057)

Planning delays, extra manual effort, wrong space and capacity decisions, reduced trust in data, dependence on technical teams, slower operational response. Frequency to be measured.

## Constraints confirmed (PD-061 to PD-068)

Multi-tenant with data isolation; WMS read-only source; 2D fallback required; Electron desktop with TypeScript as the first frontend target (business position; ADR still needed); security and tenant isolation mandatory; performance matters; avoid heavy manual data preparation; approval required before solution design, architecture or implementation.

## Out of scope (PD-055, PD-060)

- Chatbot: out of MVP, possible future enhancement, to be removed from current Problem Discovery scope.
- CAD, BIM and advanced 3D formats in Phase 1.
- True real-time tracking in MVP.

## Conflicts and open questions after Revision 2

- **Conflicts:** CF-1 framing, roles and KPIs (page vs response); CF-2 chatbot; CF-3 phase definitions. See the traceability file.
- **Open:** attribution and Confluence update of the response (PD-069); scope of order tracking, fast/slow-moving analysis and bottleneck detection (PD-071); KPI baselines and definitions (PD-072); sync intervals and WMS vs file source (PD-073); Phase 1 tenant/access model (PD-074); 2D fallback parity (PD-075); file format details and samples (PD-076); technical targets beyond Electron and TypeScript (PD-077); unmeasured frequency and hours (PD-078).

*(All of the above were carried forward and either resolved or explicitly accepted as non-blocking open items by Revision 3 below.)*

---

# Revision 3: Problem Discovery Business Decision

Added 2026-09-22T08:41:29Z. Source: `problem-discovery-business-decision.md` (source BDD). Decision owner: Isuru Sampath, Business Owner / Product Decision Maker for discovery refinement, dated 2026-09-22. Status per the source: "Approved for import validation, not final delivery approval." Item IDs PD-079 to PD-112 are in the Revision 3 section of `requirements-traceability.md`. **This is a business decision closing most open discovery questions for import purposes. It is not stage approval — see the Result and Human approval statement in the accompanying evidence report.**

## Source authority (PD-079, PD-080)

The Confluence page owns the original problem statements and role/KPI discovery. The business decision (and the business-owner response it ratifies) owns MVP scope clarification and phase boundaries. Any remaining conflict between them stays an open question for Solution Discovery, not silently resolved by the importer. This settles the Revision 2 framing conflicts (CF-1 to CF-3) by precedence, not by rewriting the page.

## Attribution of the business-owner response (PD-082, PD-083)

The BOR (Revision 2) is now attributed: author Isuru Sampath, role Business Owner / Product Decision Maker for discovery refinement, dated 2026-09-22, source type chat-based business clarification, approval level discovery clarification only. It is accepted as local SkillBase evidence pending a human copying it into Confluence or the discovery record.

## MVP framing (PD-084 to PD-089)

The MVP is a 3D Warehouse **operational visibility and layout-understanding** application using WMS/layout data — explicitly not a general chatbot project. It must help users understand layout visually, inspect objects and zones, reduce manual spreadsheet analysis, identify issues earlier, and fall back to 2D when 3D is unavailable or too heavy.

## Phase 1 MVP scope (PD-092 to PD-094, PD-105 to PD-110)

Import layout/object data from structured files or a scheduled read-only source; 3D view; 2D fallback sufficient for search, filter, object inspection and layout understanding; search/filter/select; zones, categories and status where available; a basic dashboard; tenant isolation from the start; WMS read-only; Electron desktop with TypeScript as the frontend direction, subject to ADR confirmation (PD-090). Accepted file formats: CSV, XLSX, with minimum fields (object id, type, name/code, x, y, width, depth, zone/area) and optional fields (z, height, status, category, tenant id, warehouse id, metadata).

## Out of scope for MVP (PD-091)

Chatbot features; writing updates back to WMS; true real-time tracking; advanced AI assistant features; advanced CAD/BIM import; full role-based access beyond the Phase 1 minimum; automated warehouse optimization; production-grade predictive analytics.

## High-priority page items, resolved (PD-095 to PD-097)

- Order tracking: Phase 1 only if available as read-only status data, else a Phase 2 candidate.
- Fast/slow-moving analysis: Phase 2 candidate, not Phase 1.
- Bottleneck detection: Phase 1 may show basic visual indicators if source data supports it; automated detection is Phase 2.

## KPIs, defined terms and accepted gaps (PD-098 to PD-102)

Directional KPIs, to be refined in Solution Discovery: reduce manual layout review effort ≥50%; reduce late issue detection time ≥60%; support ≥100,000 objects in Phase 1 performance testing; target ~30 FPS on supported machines for normal navigation; reduce spreadsheet/manual planning errors ≥40%. "Object", "supported machine" and "normal navigation" are now defined. Exact baselines, sample files and manual hours per role are still missing, and the decision **explicitly accepts this as an open question for Solution Discovery and HLD, not a blocker for discovery import.**

## Sync/source, tenancy and 2D fallback (PD-103, PD-104, PD-105 to PD-107)

Phase 1 may use file import or scheduled read-only WMS sync depending on access; the system must never write to WMS; the exact sync interval is deferred to Solution Discovery. Tenant isolation is mandatory from the start for Phase 1 (every record tenant-scoped, minimal but non-bypassable admin/security model); full role-based access expands in Phase 2. The 2D fallback must be functional, not decorative: object list/table, search/filter, object detail, a basic 2D map if coordinates exist, and continued core inspection when 3D fails.

## Still open, carried into Solution Discovery (not blockers per BDD §7, §12)

Exact KPI baselines and sample data (PD-102); units and coordinate-system normalization (PD-111); sync interval (PD-104); technical stack targets beyond Electron/TypeScript, i.e. .NET 10 LTS, React, R3F/Three.js, Azure SQL, EF Core 10 (PD-077, unchanged); "supported machine" profile definition, to be set during HLD/performance planning (PD-100).
