# Problem Discovery Business Decision

Project: 3D Warehouse Application
Decision date: 2026-09-22
Decision owner: Isuru Sampath
Role: Business Owner / Product Decision Maker for discovery refinement
Status: Approved for import validation, not final delivery approval

## 1. Source authority decision

The Confluence Problem Discovery page is the primary discovery source.

The business-owner response is a clarification source created to resolve gaps found during SkillBase validation. It does not replace the Confluence page. It clarifies MVP scope, phases, project invariants and open questions.

If the Confluence page and the business-owner response conflict:
1. The Confluence page owns the original problem statements and role/KPI discovery.
2. This business decision owns MVP scope clarification and phase boundaries.
3. Any remaining conflict must stay as an open question for Solution Discovery, not be silently resolved by Claude Code.

## 2. Attribution

The business-owner response should be treated as authored by:

Author: Isuru Sampath
Role: Business Owner / Product Decision Maker for discovery refinement
Date: 2026-09-22
Source type: Chat-based business clarification
Approval level: Discovery clarification only

This response should later be copied into Confluence or attached to the discovery record by a human. Until then, it is acceptable as local SkillBase evidence for continuing discovery validation.

## 3. MVP framing

The MVP is not a general chatbot project.

The MVP is a 3D Warehouse operational visibility and layout understanding application using WMS/layout data.

The system must help users:
- understand warehouse layout visually
- inspect warehouse objects and zones
- reduce manual layout and spreadsheet-based analysis
- identify visibility, capacity and operational issues earlier
- use a 2D fallback when 3D is unavailable or too heavy

## 4. In-scope for MVP

The following are in scope for Phase 1 MVP:

- Import warehouse layout/object data from structured files or scheduled/read-only source.
- Display warehouse objects in a 3D view.
- Provide 2D fallback with enough information for search, filter, object inspection and basic layout understanding.
- Search, filter and select warehouse objects.
- Show zones, object categories and object status if available in source data.
- Provide basic operational visibility dashboard.
- Support tenant isolation from the start.
- Treat WMS as read-only.
- Use Electron desktop with TypeScript as the frontend direction, subject to ADR confirmation.

## 5. Out of scope for MVP

The following are out of scope for Phase 1 MVP:

- Chatbot features.
- Writing updates back to WMS.
- True real-time tracking.
- Advanced AI assistant features.
- Advanced CAD/BIM import.
- Full role-based access workflow beyond the minimum access/isolation needed for MVP.
- Automated warehouse optimization.
- Production-grade predictive analytics.

## 6. High-priority page items decision

Order tracking:
- Not part of Phase 1 MVP unless available as read-only status data.
- Can be considered Phase 2.

Fast/slow-moving analysis:
- Not part of Phase 1 MVP.
- Candidate Phase 2 analytics feature.

Bottleneck detection:
- Phase 1 may show basic visual indicators if source data supports it.
- Automated bottleneck detection is Phase 2.

## 7. KPI clarification

Initial KPI targets are directional and will be refined during Solution Discovery.

Current accepted discovery KPIs:
- Reduce manual layout review effort by at least 50%.
- Reduce late issue detection time by at least 60%.
- Support at least 100,000 warehouse objects in Phase 1 performance testing.
- Target usable navigation at around 30 FPS on supported business machines.
- Reduce spreadsheet/manual planning errors by at least 40%.

Definitions:
- "Object" means one visual warehouse entity loaded into the viewer, such as rack, bin, pallet position, zone marker, aisle marker or operational item, depending on source data.
- "Supported machine" means an approved business laptop or workstation profile to be defined during HLD/performance planning.
- "Normal navigation" means pan, zoom, rotate, select and inspect without blocking the user.

Known KPI gaps:
- Exact baselines are not fully available yet.
- Sample files and current manual hours per role must be collected.
- These gaps are accepted as open questions for Solution Discovery and HLD, not blockers for discovery import.

## 8. Sync/source decision

Phase 1 may use either:
- structured file import, or
- scheduled read-only sync from WMS,

depending on access availability.

The system must not write to WMS.

Exact sync interval is not confirmed yet. It should be decided during Solution Discovery. For now, assume manual import or scheduled sync is enough for MVP.

## 9. Tenant and access model

Tenant isolation is mandatory from the start.

For Phase 1:
- every warehouse record must belong to a tenant
- user access must be tenant-scoped
- admin/security model can be minimal but must not bypass tenant isolation

Full role-based access and permission management can be expanded in Phase 2.

## 10. 2D fallback decision

The 2D fallback must be useful, not decorative.

For Phase 1 it must support:
- object list/table
- search and filter
- selected object details
- basic 2D layout/map if coordinate data exists
- ability to continue core inspection even when 3D cannot load

## 11. File format decision

Phase 1 accepted file formats:
- CSV
- XLSX

Required minimum fields:
- object id
- object type
- display name or code
- x position
- y position
- width
- depth
- zone or area

Optional fields:
- z position
- height
- status
- category
- tenant id
- warehouse id
- metadata fields

Units and coordinate system:
- Units and coordinate system are not finalized.
- During Solution Discovery, use sample data to decide whether the system should normalize units or require a standard template.

## 12. Approval position

This decision is enough to continue the Problem Discovery import validation.

It does not approve solution design, architecture, implementation or Jira story creation.

Human approval is still required before moving to Solution Discovery.