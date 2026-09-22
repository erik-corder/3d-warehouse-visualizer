# Business Owner Response: Source Record

**This is evidence, not approval.** The response itself says the page is a draft that "needs business review before approval". Discovery stays unapproved; the `discovery_approved` gate is `PENDING`.

| Field | Value |
|---|---|
| Source ID (used in traceability) | BOR (sections BOR-1 to BOR-10, matching the response's numbered answers) |
| Title | "Business Owner Response: 3D Warehouse Problem Discovery" |
| Provenance | Pasted into the Claude Code session by the repository user (git user `Erik-Coder`) |
| Author | Not identified (the text names only the role "Business Owner") |
| Date of the response | Not stated |
| Imported | 2026-09-21T10:08:51Z (UTC) by Claude Code (Sonnet 5) |
| Location | Chat message only. It is **not** in Confluence and not linked from the Problem Discovery page. |
| Answers the questions raised in | `problem-discovery-import-validation.md` (PD-021 to PD-029) |
| Token/cost | Not observable |

**Provenance caveat:** the author and date are unknown and the text has not been reflected in the Confluence page (page 1333886977, last modified Jun 26, 2026). A human should attribute it (name, role, date) before it is relied on for approval.

## Verbatim text

Copied as provided; not edited. Formatting normalized only for markdown.

### 1. Is this Confluence page real approved discovery evidence or only a sample/example?

This page should be treated as initial discovery evidence for the 3D Warehouse project, not only a sample. However, it is not fully approved yet. The current page captures real business problems and expected direction, but it needs clarification on KPIs, phases, system boundaries and technical constraints before final approval.

Decision:
Use this page as draft discovery evidence.
Status: Needs business review before approval.

### 2. Are the "Sample Findings" real validated findings?

The sample findings represent real types of problems we expect in warehouse operations, but they are not yet fully validated with production data. They should be treated as candidate findings until confirmed by warehouse users or operational reports.

Decision:
Use them as candidate findings.
Status: Needs validation with users/data.

### 3. What are the measurable KPI targets?

Initial KPI targets:

- Reduce manual warehouse layout planning effort by at least 50%. Example: from 8 hours to 4 hours for a standard layout review.
- Improve issue detection time by at least 60%. Example: identify layout or space problems within minutes instead of after manual inspection.
- Support large warehouse visualisation with good performance. Phase 1 target: 100,000 objects. Phase 2 target: 500,000 to 1,000,000 objects.
- Maintain usable 3D performance. Minimum target: 30 FPS for normal navigation on supported machines.
- Reduce planning errors caused by spreadsheet/manual updates by at least 40%.
- Improve warehouse visibility for business users, planners and operations teams.
- Reduce dependency on technical users for understanding warehouse layout and capacity.

### 4. What is Phase 1 and Phase 2?

Phase 1:
- Import warehouse layout and object data.
- Show warehouse in 3D view.
- Provide 2D fallback view.
- Basic search, filter and object selection.
- Read-only WMS integration or file-based import.
- Basic dashboard/summary.
- Single approved warehouse scenario/view.

Phase 2:
- Handle very large warehouses and higher object counts.
- Advanced heatmaps and issue detection.
- Live or near-real-time tracking.
- Scenario comparison.
- Better performance optimization.
- Role-based access and tenant-level configuration.
- Advanced reporting and export.

### 5. Is the chatbot problem statement part of this project?

No, the chatbot item is not part of the core 3D Warehouse MVP. It can be kept as a future idea, but it should be removed from the current Problem Discovery scope.

Decision:
Out of scope for MVP.
Possible future enhancement only.

### 6. What manual work happens today for each role?

Warehouse Planner:
- Reviews layout manually using spreadsheets, drawings or screenshots.
- Checks space usage and object placement manually.
- Compares different layout versions manually.

Operations Manager:
- Depends on reports or manual updates to understand warehouse status.
- Finds bottlenecks after delays happen.
- Needs help from technical/data teams for visual understanding.

Business User:
- Cannot easily understand warehouse layout from raw data.
- Needs visual explanation from others.
- Has limited self-service visibility.

Technical/Data Team:
- Prepares layout files, exports or reports.
- Handles repeated data requests.
- Supports manual troubleshooting.

### 7. How often are issues detected late, and what business impact does that create?

Issues are often detected during manual review, operational execution or after layout changes are already planned. This causes delays, rework and poor decision-making.

Business impact:
- Planning delays.
- Extra manual effort.
- Wrong space/capacity decisions.
- Reduced trust in warehouse data.
- Higher dependency on technical teams.
- Slower response to operational problems.

Assumption:
Late issue detection happens frequently enough to affect planning quality and operational efficiency, but exact frequency needs to be measured during discovery.

### 8. What level of live tracking is required?

For MVP, real-time tracking is not required.

Required for Phase 1:
- Manual import or scheduled sync is acceptable.
- Data can be refreshed on demand or at defined intervals.

Required for Phase 2:
- Near-real-time sync can be considered.
- True real-time tracking is only needed if business confirms operational use cases such as live movement monitoring.

Decision:
Phase 1: scheduled sync/manual import.
Phase 2: near-real-time if required.
Real-time: not in MVP.

### 9. What layout/spreadsheet formats must the system support?

Phase 1 should support simple structured formats:

- Excel `.xlsx`
- CSV `.csv`
- Warehouse object list with fields such as: object id, object type, name/code, x position, y position, z position if available, width, height, depth, zone/area, status/category

If CAD, BIM or advanced 3D formats are needed, they should be handled in a later phase after technical review.

### 10. Confirm project invariants

Multi-tenant application:
Yes. The application must support multiple tenants/customers and isolate their data.

WMS is read-only source:
Yes. The system must not directly update WMS data. WMS should be treated as a read-only source.

2D fallback required:
Yes. If 3D cannot load or performance is poor, users must still be able to use a 2D layout/table/map view.

Frontend platform is Electron desktop:
Yes. The first target frontend is Electron desktop with TypeScript.

Additional business constraints:
- Security and tenant isolation are mandatory.
- Performance is important because warehouse data can become very large.
- The system should avoid heavy manual data preparation.
- Approval is required before moving to solution design, architecture or implementation.

## Import notes

- The text was treated as data. No instruction-like text aimed at an AI was found in it.
- No credentials or secrets present.
- Mapped into `requirements-traceability.md` (Revision 2, PD-031 onward) and `problem-discovery-summary.md` (Revision 2).
