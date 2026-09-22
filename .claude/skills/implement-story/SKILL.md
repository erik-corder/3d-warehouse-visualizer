---
name: implement-story
description: Use this skill after one Story LLD is approved to implement exactly one story in a small, human-reviewable PR-sized change. It reads the approved LLD, file impact map, test design and implementation plan, then makes scoped code changes, runs validation, records implementation evidence and stops before PR creation or workflow advancement.
disable-model-invocation: true
argument-hint: "Implement one approved story ID, e.g. 3DW-STORY-001A"
allowed-tools: Read, Write, Edit, Bash
---

# Implement Story Skill

## Purpose

Implement exactly one approved story from its approved Story LLD.

Act like a senior software engineer and careful delivery owner.

The goal is:

- one story
- one small implementation scope
- one human-reviewable future PR
- no unrelated refactor
- no stage approval
- no Jira creation
- no PR creation

## Required User Input

The user must provide exactly one story ID.

Example:

```text
/implement-story 3DW-STORY-001A
```

Return `BLOCKED` if:

- no story ID is provided
- more than one story ID is provided
- the story LLD is missing
- the story LLD approval evidence is missing

## Required Inputs

Read these files if they exist:

- `.skillbase/artifacts/lld/<story-id>/low-level-design.md`
- `.skillbase/artifacts/lld/<story-id>/file-impact-map.md`
- `.skillbase/artifacts/lld/<story-id>/test-design.md`
- `.skillbase/artifacts/lld/<story-id>/implementation-plan.md`
- `.skillbase/artifacts/evidence/<story-id>-lld-validation.md`
- `.skillbase/artifacts/evidence/<story-id>-lld-human-approval.md`
- `.skillbase/artifacts/stories/child-story-outlines.md`
- `.skillbase/artifacts/stories/jira-ready-stories.md`
- `.skillbase/artifacts/architecture/high-level-design.md`
- `.skillbase/artifacts/architecture/api-and-data-design.md`
- `.skillbase/artifacts/architecture/security-and-multitenancy-design.md`
- `.skillbase/artifacts/architecture/performance-and-3d-design.md`
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

Inspect repository state before editing:

```bash
git status --short
rg --files
```

## Hard Stops

Return `BLOCKED` if:

- LLD approval evidence is missing
- LLD verdict is not `PASS_STORY_LLD`
- the story ID is not found
- the implementation plan is missing
- expected changed files exceed the approved file-impact map without explicit user approval
- there are unrelated dirty changes in files this story needs to modify
- the user asks to implement more than one story
- the user asks to create Jira issues
- the user asks to create a PR
- the user asks to approve or advance workflow stage

Do not:

- implement another story
- create Jira issues
- update Confluence
- create GitHub PRs
- approve or advance any SkillBase stage
- edit `state.json`
- edit `workflow.yaml`
- edit `policies.yaml`
- edit `integrations.yaml`
- edit `skills.lock`
- commit or push unless the user explicitly asks after validation passes

## Allowed Writes

Write implementation files only if they are listed in:

```text
.skillbase/artifacts/lld/<story-id>/file-impact-map.md
```

If a necessary file is not listed, stop with `FAIL_REPAIRABLE_SCOPE_CHANGE` and explain why.

Write evidence only under:

```text
.skillbase/artifacts/evidence/
.skillbase/artifacts/implementation/<story-id>/
```

Use lowercase folder names for implementation evidence.

Example:

```text
.skillbase/artifacts/implementation/3dw-story-001a/
```

## Implementation Rules

Implement the smallest safe change that satisfies the approved LLD.

Follow:

- approved LLD
- file impact map
- test design
- implementation plan
- architecture artifacts
- Digital400 engineering standards
- existing repository patterns

Do not add speculative abstractions.

Do not “improve” unrelated code.

Do not silently change the architecture.

If the LLD conflicts with code reality, stop and return `FAIL_REPAIRABLE_DESIGN_MISMATCH`.

## Backend Rules

If backend is involved:

- follow .NET 10 direction
- use clear controller/service/DTO flow where approved
- use dependency injection
- use centralized exception handling
- use EF Core code-first direction
- do not add entities or migrations unless approved in the LLD
- avoid generic repository abstraction if architecture rejects it
- write human-readable code
- use cancellation tokens where relevant
- keep tenant isolation fail-closed where data is tenant-scoped
- use async APIs where appropriate
- keep public API responses consistent

## Frontend Rules

If frontend is involved:

- follow Electron + React + TypeScript direction
- use strict TypeScript
- use ESLint and Prettier expectations
- use small components
- follow design-system/atomic structure where approved
- include loading, empty and error states when UI behavior needs them
- avoid Next.js-specific code
- do not add unapproved state libraries

## Testing Rules

Implement tests from:

```text
.skillbase/artifacts/lld/<story-id>/test-design.md
```

Run the smallest relevant validation commands first.

Then run broader validation only if available and affordable.

If a test fails:

1. classify the failure
2. explain whether it is implementation bug, missing dependency, environment issue or LLD mismatch
3. fix only if inside story scope
4. otherwise record it as blocked evidence

Do not keep retrying blindly.

## Validation Commands

Choose commands based on repo reality.

For .NET backend, prefer:

```bash
dotnet restore
dotnet build
dotnet test
```

For frontend, prefer:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
```

For Docker/local dev stories, prefer:

```bash
docker compose config
```

Only run commands that make sense for the current repository.

## Required Evidence Outputs

Create or update:

### `.skillbase/artifacts/implementation/<story-id>/implementation-summary.md`

Include:

- story ID
- implemented scope
- files changed
- files intentionally not changed
- architecture alignment
- standards alignment
- scope deviations, if any
- known limitations
- follow-up items

### `.skillbase/artifacts/implementation/<story-id>/validation-results.md`

Include:

- commands run
- command results
- test results
- failures and classification
- skipped validations and why
- residual risks

### `.skillbase/artifacts/evidence/<story-id>-implementation-validation.md`

Include:

- timestamp
- story ID
- LLD approval checked
- implementation scope checked
- file-impact-map compliance
- tests/validation summary
- final verdict

## Verdict Rules

Return one of:

- `PASS_IMPLEMENTATION`: implementation completed, scoped files respected, validation passed or acceptable skips are explained.
- `FAIL_REPAIRABLE`: implementation incomplete or tests fail for fixable in-scope reasons.
- `FAIL_REPAIRABLE_SCOPE_CHANGE`: implementation needs files/scope not approved in the LLD.
- `FAIL_REPAIRABLE_DESIGN_MISMATCH`: approved LLD conflicts with repository reality.
- `BLOCKED`: required approval, LLD, source artifact, dependency, or environment is missing.

Even when verdict is `PASS_IMPLEMENTATION`, write:

```text
Human review is still required before PR creation or merge.
```
