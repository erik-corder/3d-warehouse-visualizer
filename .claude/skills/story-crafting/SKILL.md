---
name: story-crafting
description: Use this skill after HLD/ADRs are approved to create senior-BA-quality vertical user stories and small human-reviewable story slices. It produces Jira-ready story drafts with acceptance criteria, test cases, dependencies and PR-size guardrails. It avoids large stories, vague epics, implementation code, Jira creation, PRs, and workflow advancement.
disable-model-invocation: true
argument-hint: "Create small vertical stories from approved HLD and ADRs"
allowed-tools: Read, Write, Edit, Bash
---

# Story Crafting Skill

## Purpose

Create small, human-reviewable user stories from approved discovery, solution and architecture evidence.

Act like a senior Business Analyst and delivery-focused Tech Lead.

The goal is not to create many big stories. The goal is to create thin vertical slices that a developer can implement, test and raise as a small PR.

## Required Inputs

Read these files if they exist:

- `.skillbase/artifacts/discovery/problem-discovery-summary.md`
- `.skillbase/artifacts/discovery/requirements-traceability.md`
- `.skillbase/artifacts/solution/recommended-solution.md`
- `.skillbase/artifacts/solution/solution-architecture-candidates.md`
- `.skillbase/artifacts/architecture/high-level-design.md`
- `.skillbase/artifacts/architecture/api-and-data-design.md`
- `.skillbase/artifacts/architecture/security-and-multitenancy-design.md`
- `.skillbase/artifacts/architecture/performance-and-3d-design.md`
- `.skillbase/artifacts/evidence/hld-adr-human-approval.md`
- `.skillbase/artifacts/evidence/hld-adr-validation.md`
- `docs/adr/`
- `.skillbase/project.yaml`
- `.skillbase/policies.yaml`
- `.skillbase/state.json`
- `CLAUDE.md`

## Hard Stops

Return `BLOCKED` if:

- architecture approval evidence is missing
- HLD/ADR validation is not `PASS_HLD_ADR`
- requirements traceability is missing
- the user asks to create implementation code
- story scope cannot be traced to discovery/HLD/ADR evidence

Do not:

- create implementation code
- create .NET, Electron, Docker, database, migration, API, frontend, backend or test code
- create Jira issues directly
- update Confluence
- create GitHub PRs
- edit `state.json`, `workflow.yaml`, `policies.yaml`, `integrations.yaml` or `skills.lock`
- approve or advance any SkillBase stage
- commit or push

## Allowed Writes

Write only under:

- `.skillbase/artifacts/stories/`
- `.skillbase/artifacts/evidence/`

## Story Sizing Rules

Every story must be small enough for a human to review easily.

Default target:

- 1 story = 1 meaningful user-visible or testable outcome
- 1 story = 1 small PR
- preferred implementation time: 0.5 to 2 days
- maximum implementation time: 3 days
- avoid stories that touch frontend, backend, database, import pipeline and 3D engine all at once

If a story seems larger than 3 days, split it.

## Senior BA Slicing Rules

Prefer vertical slices that deliver observable value.

Good story examples:

- Import a minimal CSV warehouse object file and validate required columns.
- Display imported warehouse objects in a simple object list.
- Show selected object details from the imported dataset.
- Render a small warehouse object set in 3D using placeholder geometry.
- Provide 2D fallback table search when 3D is unavailable.

Bad story examples:

- Build complete import module.
- Build full 3D warehouse.
- Implement multitenancy.
- Create all APIs.
- Build frontend.
- Add backend architecture.

Use horizontal technical stories only when a vertical story is impossible without a foundation task.

Allowed horizontal stories must be small and enabling, such as:

- create solution skeleton
- add backend error contract baseline
- add tenant context middleware baseline
- add frontend linting and folder structure
- add Docker Compose local development skeleton

## Story Types

Classify each story as one of:

- `vertical-feature`
- `foundation-enabler`
- `technical-enabler`
- `spike`
- `test-enabler`
- `non-functional`

Do not create more than 20 stories in one run unless the user explicitly asks.

For MVP, prefer 8 to 15 well-sliced stories first.

## Required Output Files

Create or update:

### `.skillbase/artifacts/stories/story-map.md`

Include:

- MVP walking skeleton
- Phase 1 story map
- Phase 2 candidates
- story order
- dependency flow
- what is intentionally deferred

### `.skillbase/artifacts/stories/jira-ready-stories.md`

For each story include:

- story ID, e.g. `3DW-STORY-001`
- title
- type
- user story statement
- business value
- scope
- out of scope
- acceptance criteria in Given/When/Then format
- test cases
- dependencies
- UX notes if any
- API/data notes if any
- security/multitenancy notes if any
- performance notes if any
- traceability to PD IDs, HLD sections or ADRs
- estimated size: XS, S or M
- PR-size risk: low, medium or high
- split recommendation if risk is medium/high

### `.skillbase/artifacts/stories/story-slicing-review.md`

Include:

- stories that were split and why
- stories rejected as too large
- dependency risks
- suggested first 3 implementation stories
- stories that need UI mockup before implementation
- stories that need LLD before implementation
- stories that need spike before implementation

### `.skillbase/artifacts/evidence/story-crafting-validation.md`

Include:

- inputs checked
- story count
- traceability result
- oversized story check
- missing mockup/LLD/spike decisions
- final verdict

## Acceptance Criteria Rules

Acceptance criteria must be testable.

Use Given/When/Then.

Avoid vague criteria like:

- user friendly
- fast
- proper validation
- good UI
- scalable

Replace with measurable or observable criteria.

Example:

```text
Given a CSV file missing the object_id column
When the user imports the file
Then the import is rejected
And the user sees an error explaining that object_id is required
And no warehouse objects are stored
```
