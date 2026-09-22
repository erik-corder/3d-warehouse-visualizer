---
name: story-lld
description: Use this skill after Story Crafting is approved to create senior-software-engineer low-level design for exactly one approved story at a time. It creates implementation-ready LLD, file impact map, test design, implementation plan, validation evidence, and can record approved story splits with child story outlines. It must not create application code, Jira issues, PRs, or advance workflow stages.
disable-model-invocation: true
argument-hint: "Create LLD for one approved story ID, e.g. 3DW-STORY-001"
allowed-tools: Read, Write, Edit, Bash
---

# Story LLD Skill

## Purpose

Create low-level design for exactly one approved story.

Act like a senior software engineer, practical architect and careful tech lead.

The output must make the story implementation-ready, but this skill must not write implementation code.

The design must support:

- small PRs
- clear implementation scope
- testability
- architecture alignment
- fail-closed multitenancy
- centralized exception handling
- clean frontend/backend boundaries
- human review

This skill can also record an explicitly approved split of a parent story into smaller child stories.

## Required User Input

The user must provide exactly one story ID.

Example:

```text
/story-lld 3DW-STORY-001
```

Return `BLOCKED` if:

- no story ID is provided
- more than one story ID is provided
- the story ID cannot be found
- the story is not approved for LLD

Exception:
If the user explicitly asks to record a split for one parent story, the provided story ID is the parent story ID.

## Required Inputs

Read these files if they exist:

- `.skillbase/artifacts/stories/story-map.md`
- `.skillbase/artifacts/stories/jira-ready-stories.md`
- `.skillbase/artifacts/stories/story-slicing-review.md`
- `.skillbase/artifacts/stories/child-story-outlines.md`
- `.skillbase/artifacts/evidence/story-crafting-validation.md`
- `.skillbase/artifacts/evidence/story-crafting-human-approval.md`
- `.skillbase/artifacts/architecture/high-level-design.md`
- `.skillbase/artifacts/architecture/c4-views.md`
- `.skillbase/artifacts/architecture/api-and-data-design.md`
- `.skillbase/artifacts/architecture/security-and-multitenancy-design.md`
- `.skillbase/artifacts/architecture/performance-and-3d-design.md`
- `.skillbase/artifacts/evidence/hld-adr-human-approval.md`
- `.skillbase/artifacts/standards/engineering-standards-sources.md`
- `.skillbase/artifacts/standards/frontend-typescript-standards.md`
- `.skillbase/artifacts/standards/frontend-architecture-standards.md`
- `.skillbase/artifacts/standards/linting-formatting-standards.md`
- `.skillbase/artifacts/standards/backend-dotnet-standards.md`
- `docs/adr/`
- `.skillbase/project.yaml`
- `.skillbase/policies.yaml`
- `.skillbase/state.json`
- `CLAUDE.md`
- `.skillbase/artifacts/lld/*/child-story-split.md`

Use read-only repository inspection if helpful:

```bash
git status --short
rg --files
```

Do not rely on assumptions if source artifacts already define the answer.

## Hard Stops

Return `BLOCKED` if:

- story crafting approval evidence is missing
- `stories_approved` is not approved in `.skillbase/state.json`
- architecture approval evidence is missing
- requested story ID is missing from all approved story sources:
  - `.skillbase/artifacts/stories/jira-ready-stories.md`
  - `.skillbase/artifacts/stories/child-story-outlines.md`
  - `.skillbase/artifacts/lld/*/child-story-split.md`
- story scope is too broad for one PR and no split has been approved
- required architecture evidence is missing
- user asks to implement code
- user asks to create Jira issues
- user asks to advance workflow stage

Do not:

- create implementation code
- create `.NET`, Electron, TypeScript, Docker, database, migration, API, frontend, backend or test code
- create Jira issues
- update Confluence
- create GitHub PRs
- edit `state.json`
- edit `workflow.yaml`
- edit `policies.yaml`
- edit `integrations.yaml`
- edit `skills.lock`
- approve or advance any SkillBase stage
- commit or push

## Allowed Writes

Write only under:

```text
.skillbase/artifacts/lld/<story-id>/
.skillbase/artifacts/stories/child-story-outlines.md
.skillbase/artifacts/stories/story-slicing-review.md
.skillbase/artifacts/evidence/
```

Use lowercase folder names.

Example for `3DW-STORY-001`:

```text
.skillbase/artifacts/lld/3dw-story-001/
```

## Engineering Standards Rules

Every Story LLD must check project engineering standards.

Frontend LLD must mention:

- TypeScript strictness
- ESLint and Prettier expectations
- Electron + React project structure
- design system/component approach
- professional UI behavior
- naming conventions
- no Next.js-specific implementation

Backend LLD must mention:

- .NET coding guideline alignment
- controller/service/repository or approved architecture flow
- DTO and mapping approach
- EF Core code-first expectations
- database-level pagination/filtering/search when lists are involved
- centralized exception handling
- dependency injection
- OOP design
- tenant isolation
- readable code and maintainability

If a story touches frontend or backend and these standards are not addressed, return `FAIL_REPAIRABLE`.

## Senior Engineering Principles

Design for the smallest safe implementation.

Prefer:

- simple design
- clear boundaries
- boring technology
- explicit validation
- strong tenant isolation
- observable failures
- small file changes
- clean naming
- testable behavior
- easy rollback

Avoid:

- speculative abstractions
- future-phase work
- mixing refactor and feature delivery
- large framework changes
- broad architecture rewrites
- touching unrelated modules
- hiding open questions

## PR Size Guardrails

Estimate future implementation size.

Use:

- `XS`: expected 1-5 changed files
- `S`: expected 6-10 changed files
- `M`: expected 11-15 changed files
- `Too large`: expected more than 15 changed files

Return `FAIL_REPAIRABLE` if the design is too large and no split is approved.

If too large, propose a split before implementation.

## Story Split Decision Handling

If the requested story is too large for one PR, return `FAIL_REPAIRABLE` and propose a split.

If the user explicitly approves a split, create or update:

```text
.skillbase/artifacts/lld/<story-id>/story-split-decision.md
.skillbase/artifacts/stories/child-story-outlines.md
```

Also append a revision note to:

```text
.skillbase/artifacts/stories/story-slicing-review.md
```

Do not rewrite the entire original backlog unless explicitly requested.

The split decision must include:

- parent story ID
- reason for split
- approved child story IDs
- child story titles
- scope for each child story
- out-of-scope for each child story
- rule that parent story remains umbrella evidence only
- rule that each child story needs its own LLD
- rule that each child story should become a separate PR
- impact on existing stories
- backlog overlap notes

## Child Story Outline Handling

When a parent story is split, create Jira-ready child story outlines in:

```text
.skillbase/artifacts/stories/child-story-outlines.md
```

Each child story outline must include:

- child story ID
- parent story ID
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
- traceability to parent story, HLD, ADRs and standards
- estimated size: XS, S or M
- PR-size risk: low, medium or high
- implementation order
- requires LLD: yes
- requires separate PR: yes

Child stories must be small enough for one human-reviewable PR.

Do not create Jira issues.

## Required Outputs

Create or update these files.

### 1. `.skillbase/artifacts/lld/<story-id>/low-level-design.md`

Include:

- story ID
- story title
- story type
- source acceptance criteria
- summary
- scope
- out of scope
- assumptions
- dependencies
- affected architecture areas
- proposed design
- backend design, if applicable
- frontend design, if applicable
- data/model design, if applicable
- API contract design, if applicable
- UI behavior, if applicable
- multitenancy handling
- exception/error handling
- security considerations
- observability/logging considerations
- performance considerations
- edge cases
- implementation sequence
- rollback considerations
- open questions

### 2. `.skillbase/artifacts/lld/<story-id>/file-impact-map.md`

Include:

- expected files to create
- expected files to modify
- files explicitly not to touch
- expected backend impact
- expected frontend impact
- expected database impact
- migration expectation: yes/no
- Docker expectation: yes/no
- test files expected
- PR size estimate
- split recommendation if needed

This is only a map. Do not create the implementation files.

### 3. `.skillbase/artifacts/lld/<story-id>/test-design.md`

Include:

- unit tests
- integration tests
- API tests if applicable
- frontend/component tests if applicable
- manual QA checklist
- tenant isolation tests if applicable
- error handling tests
- regression risks
- expected validation commands for later implementation

### 4. `.skillbase/artifacts/lld/<story-id>/implementation-plan.md`

Include:

- implementation steps
- recommended order
- checkpoints
- validation commands expected later
- definition of done
- evidence to capture during implementation
- PR description outline

### 5. `.skillbase/artifacts/evidence/<story-id>-lld-validation.md`

Include:

- timestamp
- story ID
- inputs checked
- story found: yes/no
- traceability result
- architecture alignment
- standards alignment
- PR size assessment
- testability assessment
- blockers
- final verdict

### 6. Optional: `.skillbase/artifacts/lld/<story-id>/story-split-decision.md`

Create this only when the story is too large and the user has explicitly approved a split.

Include the approved split and child-story scope.

If this file is created, the validation file must say the parent story is no longer implementation-ready as one PR.

### 7. Optional: `.skillbase/artifacts/stories/child-story-outlines.md`

Create or update this only when a parent story is split.

This file must contain Jira-ready child story outlines, but it must not create Jira issues.

## Backend Design Rules

If backend is involved:

- follow .NET 10 direction
- follow modular monolith direction
- keep domain/application/infrastructure concerns clear
- use EF Core code-first direction
- avoid generic repository abstraction if architecture rejects it
- include repository/data-access approach only where architecture approves it
- design validation explicitly
- design cancellation token flow where relevant
- use centralized exception handling
- return consistent API error responses
- keep tenant filtering fail-closed
- do not design write-back to WMS unless approved
- use dependency injection
- use OOP principles where they improve clarity

## Frontend Design Rules

If frontend is involved:

- follow Electron + React + TypeScript direction
- use strict TypeScript thinking
- use small components
- follow atomic/design-system structure only where useful
- separate UI state, server state and rendering state
- include loading, empty and error states
- include accessibility notes
- use ESLint and Prettier expectations
- do not introduce unapproved state libraries
- do not use Next.js-specific architecture

## API Design Rules

If API design is needed:

Include:

- route
- method
- request shape
- response shape
- validation rules
- error response behavior
- tenant context behavior
- authorization note
- pagination/filter/search if needed

Do not create controller, DTO or endpoint code.

## Data Design Rules

If data/model design is needed:

Include:

- conceptual entity changes
- fields
- required/optional rules
- indexes if needed
- tenant ID requirement
- EF Core notes
- migration expectation

Do not create entity classes or migrations.

## 3D Design Rules

If 3D rendering is involved:

- keep the slice minimal
- prefer placeholder geometry early
- state object count target for this story
- preserve 2D fallback
- isolate 3D failure from core UI
- do not attempt 100k/1M performance unless the story is the performance spike

## Multitenancy Rules

Every data-touching story must explain:

- how tenant context is obtained
- how missing tenant context fails closed
- how data is filtered by tenant
- what test proves cross-tenant data is blocked

If this is missing, return `FAIL_REPAIRABLE`.

## Story Lookup Rules

For original approved stories, read:

````text
.skillbase/artifacts/stories/jira-ready-stories.md

## Verdict Rules

Return one of:

- `PASS_STORY_LLD`: one-story LLD is implementation-ready and PR size is manageable.
- `FAIL_REPAIRABLE`: LLD was created but is too broad, weakly testable, weakly traceable or needs splitting.
- `FAIL_REPAIRABLE_SPLIT_RECORDED`: original story is too large, user approved the split, child story outlines were created, and the next action is to run LLD for the first child story.
- `BLOCKED`: approval, story ID, story source, architecture evidence or required input is missing.

Even when verdict is `PASS_STORY_LLD`, write:

```text
Human approval is still required before implementation planning or coding.
````
