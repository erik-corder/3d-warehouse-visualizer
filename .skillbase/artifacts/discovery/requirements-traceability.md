# Problem Discovery: Requirements Traceability

Source: Confluence "Problem Discovery" (page 1333886977, last modified Jun 26, 2026). See `problem-discovery-source.md`. Section numbers (§) refer to the page's headings.
**Evidence, not approval.** IDs are assigned once and must not be renumbered or reused; later versions carry them over.

Conventions
- **Type:** functional / non-functional / constraint / assumption / question, plus `goal` (added by the importer; the five requested types cannot classify measurable business goals).
- **Basis:** *stated* = the page says it; *implied* = derived by the importer from problem statements or priorities (page has no explicit requirements section); *importer gap* = not in the page.
- Risks from §9 are recorded as `assumption` with the prefix "Risk:". Confidence reflects how clearly the page supports the item.

| ID | Source § | Requirement / statement | Type | Basis | Confidence | Needs human review |
|---|---|---|---|---|---|---|
| PD-001 | §4, §7 | Provide a visual overview of the warehouse; inventory is currently hard to visualize spatially. Priority High ("Lack of visual warehouse overview"). | functional | implied | medium | yes |
| PD-002 | §3, §5, §7 | Give visibility of inventory locations, utilization and capacity, including identifying empty and underutilized locations. Priority High. | functional | implied | medium | yes |
| PD-003 | §4, §7 | Surface fast-moving and slow-moving items and inefficient product placement ("Delayed operational visibility (fast moving/slow moving)"; high-demand items in inefficient locations). | functional | implied | medium | yes |
| PD-004 | §4, §5, §7 | Give visibility of order fulfillment progress across picking, packing and dispatch. Priority High. | functional | implied | medium | yes |
| PD-005 | §4, §5, §8 | Detect fulfillment bottlenecks and delays earlier (measured by MTIB). Phase 2 per §8. | functional | implied | medium | yes |
| PD-006 | §7 | "Limited operational optimization insights" is a High priority problem; the page does not say what insights are needed. | functional | implied | low | yes |
| PD-007 | §1, §4, §5, §7, §8 | Reduce manual report analysis and spreadsheet reconciliation; provide consolidated management insight in place of multiple reports. | functional | implied | medium | yes |
| PD-008 | §5 (6th bullet) | "The chatbot should be capable of understanding user queries expressed in natural language and providing accurate, relevant responses based on the user's input." Appears only here, listed among problem statements. | functional | stated | low | yes |
| PD-009 | §9 | A 3D visualization view of the warehouse is assumed (see PD-016). The only place 3D is mentioned besides the page's sub-title. | functional | implied | medium | yes |
| PD-010 | §3 | Serve these roles: Warehouse Manager, Inventory Controller, Operations Manager, Warehouse Staff, IT Team, Executive Management (influence: High for Manager, Controller, Operations, Executive; Medium for Staff, IT). | functional | stated | high | no |
| PD-011 | §1, §5 | Operational information must be timely, consolidated and near-live rather than static reports. The latency level is not specified (see PD-023). | non-functional | implied | low | yes |
| PD-012 | §9 | Risk: real-time data may be delayed or unavailable. Validation: confirm API event frequency and data latency. | assumption | stated | high | yes |
| PD-013 | §8 | Phase 1 goals: improve inventory location accuracy (KPI: location accuracy rate); optimize space utilization (KPI: utilization rate); reduce time to identify empty or underutilized locations (KPI: time to locate available storage capacity). No baselines or targets. | goal | stated | high | yes |
| PD-014 | §9 | Assumption: the WMS can push item master, location, order and moving data through APIs. Validation: review WMS reports, spreadsheets, operational logs, stakeholder input. | assumption | stated | high | yes |
| PD-015 | §9 | Assumption: stakeholders can provide consistent definitions of key warehouse problems (visibility delays, utilization gaps, fulfillment bottlenecks). | assumption | stated | high | no |
| PD-016 | §9 | Assumption: users will understand and trust the 3D visualization view. Validation: prototype usability test. | assumption | stated | high | yes |
| PD-017 | §9 | Risk: incomplete or inconsistent data may limit the accuracy of problem sizing and impact assessment. Validation: data quality assessment. | assumption | stated | high | no |
| PD-018 | §9 | Solution decisions must not be finalized until priority problems, measurable outcomes and decision criteria are agreed; signed-off problem statements and success metrics are entry criteria for the next phase. | constraint | stated | high | yes |
| PD-019 | §10 | Continue problem discovery until priority problems, measurable business impact and success metrics are defined and agreed. Validation must complete before solution discovery, detailed architecture, development planning or implementation. | constraint | stated | high | yes |
| PD-020 | §8 | Work is split into "Phase 1" and "Phase 2" (e.g. manual reporting spans Phase 1 and 2). The phases are not defined elsewhere. | constraint | stated | medium | yes |
| PD-021 | §9 | Unknown: actual time each role spends on manual reporting, reconciliation and issue investigation. Method: time studies, interviews, workflow review. | question | stated | high | yes |
| PD-022 | §9 | Unknown: frequency and business impact of delayed issue detection across inventory, capacity and fulfillment. Method: analyze historical incidents, exceptions, missed SLAs, escalations. | question | stated | high | yes |
| PD-023 | §9 | Unknown: required level of live tracking (real-time, near-real-time or scheduled sync). "Confirm operational exception with the client". | question | stated | high | yes |
| PD-024 | §9 | Unknown: exact warehouse layout format and spreadsheet structure. Method: collect real sample warehouse layout files. | question | stated | high | yes |
| PD-025 | §8 | KPI baselines and targets are absent for all nine metrics. §10 lists the current baselines as still to be validated. | question | importer gap | high | yes |
| PD-026 | §8 | What scope belongs to Phase 1 versus Phase 2 is not defined. | question | importer gap | high | yes |
| PD-027 | §5 | Is the natural-language chatbot (PD-008) in scope, and is it a problem statement or a solution idea? | question | importer gap | high | yes |
| PD-028 | title, §2, §10 | The page is titled "Real world example" and uses "Sample Findings". Is it validated evidence for this project or an illustrative example? What is its approval status? | question | importer gap | high | yes |
| PD-029 | whole page | The page does not mention multi-tenancy, read-only WMS as source of truth, a complete 2D fallback, or the frontend platform direction. These project invariants and targets (INV-001 to INV-003, `project.yaml`) are neither confirmed nor contradicted. | question | importer gap | high | yes |
| PD-030 | §8 | Phase 1 and 2 goals: reduce time on manual reporting (KPI: hours/week); eliminate redundant spreadsheet reconciliation (KPI: manual reports replaced). Phase 2 goals: reduce time to detect delays (MTIB); improve pick-to-dispatch cycle time; more proactive vs. reactive decisions; shorter time-to-decision. No baselines or targets. | goal | stated | high | yes |

## Notes

- **Table layout in §8:** the page's KPI table has misaligned cells (goals and KPIs shift columns in later rows). The pairs above follow the evident intent; confirm with the author.
- **Evidence in §6** (stakeholder discussions, process review, observations, WMS assessment, workshops, with confidence Medium to High) supports the problem statements in general but is not tied to individual items above.
- **Conflicts:** none found between the page and `.skillbase/project.yaml`. The page is silent on the invariants (PD-029). The Next.js versus Electron decision is not mentioned in the page. PD-014 says the WMS *pushes* data; the project treats Scale/WMS as read-only source of truth (INV-002). That is compatible, but the integration mechanism is not specified.

---

# Revision 2: Business Owner Response (source BOR)

Added 2026-09-21T10:08:51Z. Source: `business-owner-response.md` (author and date not identified; not yet in the Confluence page). Rows PD-001 to PD-030 above are unchanged; their new status is in the resolution table. New items continue from PD-031. "Source §" for new rows is `BOR-n`, the answer number in the response. Same conventions as above. Draft evidence, not approval.

## Resolution of earlier items

| ID | Status after BOR | Detail |
|---|---|---|
| PD-008, PD-027 | RESOLVED (scope) | Chatbot is out of scope for MVP; future idea only; to be removed from Problem Discovery scope (BOR-5, PD-055). The Confluence page still contains it. |
| PD-011, PD-012, PD-023 | RESOLVED, details open | No real-time in MVP; Phase 1 scheduled sync or manual import; Phase 2 near-real-time if required (BOR-8, PD-058). Sync intervals undefined (PD-073). |
| PD-020, PD-026 | RESOLVED, conflicts with page | Phases defined by BOR-4 (PD-041 to PD-054). They differ from the phase labels in the page's §8 (see PD-070). |
| PD-021 | PARTIAL | Manual work per role described qualitatively (BOR-6, PD-056). Hours per role still unquantified. |
| PD-022 | PARTIAL | Business impacts listed; frequency "needs to be measured" (BOR-7, PD-057). |
| PD-024 | PARTIAL | Phase 1 formats and fields given (BOR-9, PD-059). Sample files, units, coordinate system not provided (PD-076). |
| PD-025 | PARTIAL | Targets given (PD-033 to PD-038) but they differ from the page's nine KPIs; baselines mostly missing (PD-072). |
| PD-028 | RESOLVED | Treat page as draft discovery evidence and findings as candidates; needs business review and validation (BOR-1, BOR-2, PD-031, PD-032). Attribution of BOR still open (PD-069). |
| PD-029 | RESOLVED (invariants) | Multi-tenant, read-only WMS, 2D fallback, Electron desktop with TypeScript confirmed (BOR-10, PD-061 to PD-064). Other `project.yaml` targets not addressed (PD-077). |
| PD-010 | CHANGED | Response uses different roles (PD-056, PD-070). |
| PD-003, PD-004, PD-005, PD-007 | UNCLEAR | Not placed in any phase by BOR-4 (PD-071). |
| PD-014 | UNCHANGED | WMS is read-only (PD-062); "push via APIs" mechanism still unspecified (PD-045, PD-073). |
| PD-006, PD-009, PD-013, PD-015 to PD-019, PD-030 | UNCHANGED | Not addressed by BOR. PD-018 and PD-019 still apply and match PD-068. |

## New items

| ID | Source § | Requirement / statement | Type | Basis | Confidence | Needs human review |
|---|---|---|---|---|---|---|
| PD-031 | BOR-1 | The Problem Discovery page is draft discovery evidence for this project, not only a sample. Status: needs business review before approval; needs clarification on KPIs, phases, system boundaries and technical constraints. | constraint | stated | high | yes |
| PD-032 | BOR-2 | The "Sample Findings" are candidate findings, real types of problems expected but not validated with production data. Need confirmation by warehouse users or operational reports. | assumption | stated | high | yes |
| PD-033 | BOR-3 | Reduce manual warehouse layout planning effort by at least 50% (example: 8 hours to 4 hours for a standard layout review). | goal | stated | medium | yes |
| PD-034 | BOR-3 | Improve issue detection time by at least 60% (example: identify layout or space problems within minutes instead of after manual inspection). | goal | stated | medium | yes |
| PD-035 | BOR-3 | Phase 1: support large warehouse visualisation with good performance at 100,000 objects. | non-functional | stated | medium | yes |
| PD-036 | BOR-3 | Phase 2: support 500,000 to 1,000,000 objects. | non-functional | stated | medium | yes |
| PD-037 | BOR-3 | Minimum 30 FPS for normal navigation on supported machines. | non-functional | stated | medium | yes |
| PD-038 | BOR-3 | Reduce planning errors caused by spreadsheet/manual updates by at least 40%. | goal | stated | medium | yes |
| PD-039 | BOR-3 | Improve warehouse visibility for business users, planners and operations teams (no metric). | goal | stated | medium | yes |
| PD-040 | BOR-3 | Reduce dependency on technical users for understanding warehouse layout and capacity (no metric). | goal | stated | medium | yes |
| PD-041 | BOR-4 P1 | Phase 1: import warehouse layout and object data. | functional | stated | high | no |
| PD-042 | BOR-4 P1 | Phase 1: show the warehouse in a 3D view. | functional | stated | high | no |
| PD-043 | BOR-4 P1 | Phase 1: provide a 2D fallback view (see PD-063). | functional | stated | high | no |
| PD-044 | BOR-4 P1 | Phase 1: basic search, filter and object selection. | functional | stated | high | no |
| PD-045 | BOR-4 P1 | Phase 1: read-only WMS integration **or** file-based import. The choice is not made. | functional | stated | medium | yes |
| PD-046 | BOR-4 P1 | Phase 1: basic dashboard/summary. Contents not defined. | functional | stated | medium | yes |
| PD-047 | BOR-4 P1 | Phase 1: a single approved warehouse scenario/view. "Approved" and "scenario" not defined. | functional | stated | medium | yes |
| PD-048 | BOR-4 P2 | Phase 2: handle very large warehouses and higher object counts (see PD-036). | non-functional | stated | high | no |
| PD-049 | BOR-4 P2 | Phase 2: advanced heatmaps and issue detection. | functional | stated | medium | yes |
| PD-050 | BOR-4 P2 | Phase 2: live or near-real-time tracking (see PD-058). | functional | stated | medium | yes |
| PD-051 | BOR-4 P2 | Phase 2: scenario comparison. | functional | stated | high | no |
| PD-052 | BOR-4 P2 | Phase 2: better performance optimization. | non-functional | stated | medium | yes |
| PD-053 | BOR-4 P2 | Phase 2: role-based access and tenant-level configuration. | functional | stated | medium | yes |
| PD-054 | BOR-4 P2 | Phase 2: advanced reporting and export. | functional | stated | high | no |
| PD-055 | BOR-5 | Exclusion: the chatbot is out of scope for MVP; possible future enhancement only; remove from current Problem Discovery scope. | constraint | stated | high | no |
| PD-056 | BOR-6 | Current manual work. Warehouse Planner: manual layout review (spreadsheets, drawings, screenshots), manual space and placement checks, manual comparison of layout versions. Operations Manager: relies on reports or manual updates, finds bottlenecks after delays, needs technical help for visual understanding. Business User: cannot easily understand layout from raw data, needs visual explanation, limited self-service. Technical/Data Team: prepares layout files, exports and reports, handles repeated requests, manual troubleshooting. | functional | stated | high | yes |
| PD-057 | BOR-7 | Issues are often found late (during manual review, execution, or after layout changes are planned), causing planning delays, extra manual effort, wrong space/capacity decisions, reduced trust in data, dependence on technical teams and slower response. Assumption: frequency is high enough to matter; exact frequency to be measured. | assumption | stated | medium | yes |
| PD-058 | BOR-8 | Live tracking: real-time not required for MVP. Phase 1: manual import or scheduled sync; refresh on demand or at defined intervals. Phase 2: near-real-time if required; true real-time only if business confirms use cases such as live movement monitoring. | constraint | stated | high | no |
| PD-059 | BOR-9 | Phase 1 input formats: Excel `.xlsx` and CSV `.csv` with an object list; fields such as object id, object type, name/code, x, y, z (if available), width, height, depth, zone/area, status/category. | functional | stated | high | yes |
| PD-060 | BOR-9 | Exclusion: CAD, BIM and advanced 3D formats are for a later phase, after technical review. | constraint | stated | high | no |
| PD-061 | BOR-10 | Multi-tenant application: support multiple tenants/customers and isolate their data (INV-001). | constraint | stated | high | no |
| PD-062 | BOR-10 | WMS is a read-only source: the system must not directly update WMS data (INV-002). | constraint | stated | high | no |
| PD-063 | BOR-10 | 2D fallback is required: if 3D cannot load or performance is poor, users can still use a 2D layout, table or map view (INV-003). | constraint | stated | high | yes |
| PD-064 | BOR-10 | The first target frontend is Electron desktop with TypeScript. Recorded as the business position only; the technical decision still needs an ADR at the architecture stage. | constraint | stated | high | yes |
| PD-065 | BOR-10 | Security and tenant isolation are mandatory. | non-functional | stated | high | no |
| PD-066 | BOR-10 | Performance is important because warehouse data can become very large. | non-functional | stated | high | no |
| PD-067 | BOR-10 | Avoid heavy manual data preparation. | non-functional | stated | medium | yes |
| PD-068 | BOR-10 | Approval is required before moving to solution design, architecture or implementation. | constraint | stated | high | no |
| PD-069 | BOR (whole) | Who gave this response, on what date, and can it be recorded in the Confluence page or another approved source? Currently chat-only and unattributed. | question | importer gap | high | yes |
| PD-070 | BOR vs page | The response and the page frame the project differently. Page: operational visibility from WMS data, roles Warehouse Manager, Inventory Controller, Operations Manager, Warehouse Staff, IT Team, Executive Management; nine KPIs on location accuracy, utilization, reporting hours, MTIB, cycle time, decision time. Response: layout planning and visualization, roles Warehouse Planner, Operations Manager, Business User, Technical/Data Team; KPIs on planning effort, issue detection, object counts, FPS, planning errors. Which set is authoritative, and should the page be updated? | question | importer gap | high | yes |
| PD-071 | page §7 vs BOR-4 | Order tracking (pick, pack, dispatch), fast/slow-moving analysis, bottleneck detection and management reporting are High priorities in the page (PD-003 to PD-005, PD-007) but appear in neither phase list except as "advanced issue detection" and "reporting". In scope or not? | question | importer gap | high | yes |
| PD-072 | BOR-3 | KPI baselines and definitions: only one example baseline (8 h to 4 h). Missing for issue detection time and planning errors; "standard layout review", "minutes", "supported machines", "normal navigation" and what counts as an "object" (rack, bin, pallet, SKU?) are undefined. | question | importer gap | high | yes |
| PD-073 | BOR-4, BOR-8 | Phase 1: defined sync intervals, and whether the source is WMS integration or file import (or both). How would the WMS data reach the system, given the page's "WMS can push via APIs" assumption (PD-014)? | question | importer gap | high | yes |
| PD-074 | BOR-4, BOR-10 | Tenant isolation is mandatory, yet role-based access and tenant-level configuration are Phase 2. What is the Phase 1 tenant and user access model? | question | importer gap | high | yes |
| PD-075 | BOR-4, BOR-10 | The 2D fallback is a Phase 1 item and must be "complete" per the project invariant, but the response only says "2D layout/table/map view". What feature parity with 3D is required? | question | importer gap | high | yes |
| PD-076 | BOR-9 | File format details still open: units, coordinate system and origin, allowed values for status/category, hierarchy of zones, multiple sheets, and real sample files (PD-024). | question | importer gap | high | yes |
| PD-077 | BOR-1, BOR-10 | The response mentions "technical constraints" needing clarification but gives only the Electron and TypeScript decision. `project.yaml` targets (.NET 10 LTS, React, React Three Fiber/Three.js, Azure SQL, EF Core 10 code-first, modular monolith) are not covered. Not contradicted; still direction only. | question | importer gap | high | yes |
| PD-078 | BOR-7 | Frequency of late issue detection and actual hours per role are still unmeasured (PD-021, PD-022 remain open). | question | importer gap | high | yes |

## Conflicts (Revision 2)

- **CF-1 (page vs BOR): project framing, roles and KPIs differ** (PD-070). The BOR does not say it replaces the page. Both positions recorded; a human decides.
- **CF-2 (page vs BOR): chatbot.** The page lists it as a problem statement (PD-008); the BOR removes it from scope (PD-055). BOR position is more recent in this session, but the page has not been updated.
- **CF-3 (page vs BOR): phases.** Page §8 phases (Phase 1: location and capacity; Phase 1 and 2: reporting; Phase 2: bottlenecks and decisions) differ from BOR-4.
- **Frontend platform:** the earlier Next.js versus Electron question is not mentioned in either source. BOR-10 states Electron desktop as the first target (PD-064). This is not a resolution; it is a stated business position and is recorded for the ADR (POL-012 and the HLD_AND_ADRS stage).
- No contradiction with INV-001 to INV-003 (PD-061 to PD-063 confirm them).

---

# Revision 3: Problem Discovery Business Decision (source BDD)

Added 2026-09-22T08:41:29Z. Source: `problem-discovery-business-decision.md`. Decision owner: Isuru Sampath, Business Owner / Product Decision Maker for discovery refinement, decision date 2026-09-22, status "Approved for import validation, not final delivery approval". All earlier PD IDs are unchanged; new items continue from PD-079. "Source §" gives the BDD section number. Same conventions as Revisions 1 and 2. **Evidence of a business decision, not stage approval** — §12 of the source states this explicitly.

## Resolution of earlier items

| ID | Status after BDD | Detail |
|---|---|---|
| PD-069 | RESOLVED | BOR attributed: author Isuru Sampath, role Business Owner / Product Decision Maker for discovery refinement, dated 2026-09-22, source type chat-based business clarification, approval level discovery clarification only (BDD §2). Still not copied into Confluence; BDD §2 says a human should do that later, and it is accepted as local SkillBase evidence meanwhile. |
| PD-070 | RESOLVED | Source-authority order set: Confluence page owns original problem statements and role/KPI discovery; the business decision owns MVP scope and phase boundaries; any remaining conflict stays an open question for Solution Discovery, not silently resolved (BDD §1, PD-079 to PD-081). |
| CF-1, CF-2, CF-3 | RESOLVED (by precedence, not by rewriting the page) | Same authority order applies. The chatbot is confirmed out of scope (BDD §5, PD-091). Phases are restated under this authority (BDD §4, §5, §6). |
| PD-071 | RESOLVED | Order tracking: Phase 1 only if read-only status data is available, else Phase 2 candidate. Fast/slow-moving analysis: Phase 2 candidate, not Phase 1. Bottleneck detection: Phase 1 may show basic visual indicators if source data supports it; automated detection is Phase 2 (BDD §6, PD-095 to PD-097). |
| PD-072 | PARTIAL, accepted as open for later stages | "Object", "supported machine" and "normal navigation" now defined (BDD §7, PD-101 to PD-103). Exact KPI baselines still not available; BDD §7 explicitly accepts this gap as an open question for Solution Discovery and HLD, not a discovery blocker (PD-104). |
| PD-073 | PARTIAL, accepted as open | Phase 1 may use structured file import or scheduled read-only WMS sync, depending on access availability; system must not write to WMS; exact sync interval left to Solution Discovery, manual import or scheduled sync assumed sufficient for MVP (BDD §8, PD-105 to PD-107). |
| PD-074 | RESOLVED for Phase 1 | Tenant isolation mandatory from the start: every warehouse record belongs to a tenant, user access is tenant-scoped, admin/security model may be minimal but must not bypass isolation. Full role-based access expands in Phase 2 (BDD §9, PD-108 to PD-110). |
| PD-075 | RESOLVED for Phase 1 | 2D fallback must be useful, not decorative: object list/table, search and filter, selected object details, basic 2D layout/map if coordinate data exists, and continued core inspection when 3D cannot load (BDD §10, PD-111). |
| PD-076 | PARTIAL, accepted as open | Accepted formats CSV and XLSX; minimum required fields and optional fields listed (BDD §11, PD-112 to PD-113). Units and coordinate system still not finalized; deferred to Solution Discovery using sample data (PD-114). Sample files themselves still not supplied. |
| PD-077 | PARTIAL | Electron desktop with TypeScript restated as the frontend direction, explicitly "subject to ADR confirmation" (BDD §4, PD-090). Other `project.yaml` technical targets (.NET 10 LTS, React, R3F/Three.js, Azure SQL, EF Core 10) still not addressed; unchanged. |
| PD-078 | PARTIAL, accepted as open | BDD §7 explicitly defers exact baselines and manual-hours measurement to Solution Discovery and HLD, and states this is accepted as an open question, not a blocker (PD-104). |
| PD-008, PD-027, PD-055 | CONFIRMED | Chatbot out of scope for MVP; may return as a future idea (BDD §5, PD-091). |
| PD-045, PD-050, PD-058 | CONFIRMED, refined | Sync/source decision restates BOR-8 with the added "depending on access availability" and "assume manual import or scheduled sync is enough for MVP" (BDD §8). |

## New items

| ID | Source § | Requirement / statement | Type | Basis | Confidence | Needs human review |
|---|---|---|---|---|---|---|
| PD-079 | BDD §1 | Source-authority order: (1) the Confluence page owns original problem statements and role/KPI discovery; (2) this business decision owns MVP scope clarification and phase boundaries; (3) any remaining conflict stays an open question for Solution Discovery and must not be silently resolved by Claude Code. | constraint | stated | high | no |
| PD-080 | BDD §1 | The business-owner response (BOR) is a clarification source created to resolve gaps found during SkillBase validation. It does not replace the Confluence page. | constraint | stated | high | no |
| PD-081 | BDD (whole), §12 | This document's status is "Approved for import validation, not final delivery approval". It does not approve solution design, architecture, implementation or Jira story creation. Human approval is still required before Solution Discovery. | constraint | stated | high | no |
| PD-082 | BDD §2 | BOR attribution: author Isuru Sampath, role Business Owner / Product Decision Maker for discovery refinement, date 2026-09-22, source type chat-based business clarification, approval level discovery clarification only. | assumption | stated | high | yes |
| PD-083 | BDD §2 | The response should later be copied into Confluence or attached to the discovery record by a human; until then it is accepted as local SkillBase evidence for continuing discovery validation. | constraint | stated | high | yes |
| PD-084 | BDD §3 | The MVP is not a general chatbot project. It is a 3D Warehouse operational visibility and layout-understanding application using WMS/layout data. | constraint | stated | high | no |
| PD-085 | BDD §3 | The system must help users understand warehouse layout visually. | functional | stated | high | no |
| PD-086 | BDD §3 | The system must help users inspect warehouse objects and zones. | functional | stated | high | no |
| PD-087 | BDD §3 | The system must help reduce manual layout and spreadsheet-based analysis. | functional | stated | high | no |
| PD-088 | BDD §3 | The system must help identify visibility, capacity and operational issues earlier. | functional | stated | medium | yes |
| PD-089 | BDD §3, §10 | The system must provide a 2D fallback when 3D is unavailable or too heavy. | non-functional | stated | high | no |
| PD-090 | BDD §4 | Frontend direction: Electron desktop with TypeScript, subject to ADR confirmation. | constraint | stated | high | yes |
| PD-091 | BDD §5 | Out of scope for MVP: chatbot features; writing updates back to WMS; true real-time tracking; advanced AI assistant features; advanced CAD/BIM import; full role-based access workflow beyond the minimum needed for MVP; automated warehouse optimization; production-grade predictive analytics. | constraint | stated | high | no |
| PD-092 | BDD §4 | In-scope Phase 1: import layout/object data from structured files or a scheduled read-only source. | functional | stated | high | no |
| PD-093 | BDD §4 | In-scope Phase 1: display warehouse objects in a 3D view; 2D fallback with enough information for search, filter, object inspection and basic layout understanding; search, filter and select objects; show zones, object categories and status if available; basic operational visibility dashboard. | functional | stated | high | no |
| PD-094 | BDD §4 | In-scope Phase 1: tenant isolation from the start; WMS treated as read-only. | constraint | stated | high | no |
| PD-095 | BDD §6 | Order tracking: not part of Phase 1 MVP unless available as read-only status data; can be considered for Phase 2. | constraint | stated | high | no |
| PD-096 | BDD §6 | Fast/slow-moving analysis: not part of Phase 1 MVP; candidate Phase 2 analytics feature. | constraint | stated | high | no |
| PD-097 | BDD §6 | Bottleneck detection: Phase 1 may show basic visual indicators if source data supports it; automated bottleneck detection is Phase 2. | functional | stated | medium | yes |
| PD-098 | BDD §7 | Accepted discovery KPIs: reduce manual layout review effort by at least 50%; reduce late issue detection time by at least 60%; support at least 100,000 warehouse objects in Phase 1 performance testing; target usable navigation at around 30 FPS on supported business machines; reduce spreadsheet/manual planning errors by at least 40%. Stated as directional, to be refined during Solution Discovery. | goal | stated | medium | yes |
| PD-099 | BDD §7 | "Object" means one visual warehouse entity loaded into the viewer (rack, bin, pallet position, zone marker, aisle marker or operational item), depending on source data. | assumption | stated | medium | yes |
| PD-100 | BDD §7 | "Supported machine" means an approved business laptop or workstation profile, to be defined during HLD/performance planning. | question | stated | medium | yes |
| PD-101 | BDD §7 | "Normal navigation" means pan, zoom, rotate, select and inspect without blocking the user. | non-functional | stated | medium | yes |
| PD-102 | BDD §7 | Exact KPI baselines are not fully available; sample files and current manual hours per role must still be collected. Accepted as open questions for Solution Discovery and HLD, explicitly not a blocker for discovery import. | question | stated | high | yes |
| PD-103 | BDD §8 | Phase 1 source: structured file import or scheduled read-only sync from WMS, depending on access availability. The system must not write to WMS. | constraint | stated | high | no |
| PD-104 | BDD §8 | Exact sync interval not confirmed; to be decided during Solution Discovery. Assume manual import or scheduled sync is enough for MVP. | question | stated | medium | yes |
| PD-105 | BDD §9 | Phase 1: every warehouse record must belong to a tenant; user access must be tenant-scoped; admin/security model may be minimal but must not bypass tenant isolation. | constraint | stated | high | no |
| PD-106 | BDD §9 | Full role-based access and permission management can be expanded in Phase 2. | constraint | stated | high | no |
| PD-107 | BDD §10 | 2D fallback for Phase 1 must support: object list/table; search and filter; selected object details; basic 2D layout/map if coordinate data exists; ability to continue core inspection when 3D cannot load. | functional | stated | high | no |
| PD-108 | BDD §11 | Phase 1 accepted file formats: CSV, XLSX. | functional | stated | high | no |
| PD-109 | BDD §11 | Required minimum fields: object id, object type, display name or code, x position, y position, width, depth, zone or area. | functional | stated | high | no |
| PD-110 | BDD §11 | Optional fields: z position, height, status, category, tenant id, warehouse id, metadata fields. | functional | stated | high | no |
| PD-111 | BDD §11 | Units and coordinate system are not finalized; during Solution Discovery, use sample data to decide whether to normalize units or require a standard template. | question | stated | high | yes |
| PD-112 | BDD §12 | This decision is enough to continue the Problem Discovery import validation. It does not approve solution design, architecture, implementation or Jira story creation. Human approval is still required before moving to Solution Discovery. | constraint | stated | high | no |

## Conflicts (Revision 3)

- **CF-1, CF-2, CF-3 status: RESOLVED BY PRECEDENCE, not by content rewrite.** The BDD does not edit the Confluence page or claim its content is wrong; it sets an authority order (PD-079) so that the page's original problem statements and role/KPI discovery stand, while the BDD and BOR govern MVP scope and phase boundaries. Where the page's High-priority items (order tracking, fast/slow-moving analysis, bottleneck detection) are not fully in Phase 1, PD-095 to PD-097 record the resolution as a scoping decision, not a denial that the page's problem exists.
- **No new conflicts introduced.** PD-090 (Electron/TypeScript) remains a business position pending ADR, consistent with Revision 2 (PD-064); this is unchanged, not a new conflict.
- **Remaining open items are explicitly accepted as non-blocking for discovery import** by BDD §7 and §12 (PD-102, PD-104, PD-111): exact KPI baselines, sample files, manual hours per role, sync interval, and units/coordinate system. They must still be resolved in Solution Discovery and HLD.
