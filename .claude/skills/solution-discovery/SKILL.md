---
name: solution-discovery
description: Use this skill to run Solution Discovery after Problem Discovery is imported and approved. It compares solution options, recommends a direction, records trade-offs, risks, assumptions and ADR candidates, and writes SkillBase solution artifacts only. It must not create application code, Jira issues, PRs, architecture approval, or advance workflow stages.
disable-model-invocation: true
argument-hint: "Run solution discovery from approved problem discovery evidence"
allowed-tools: Read, Write, Edit, Bash
---

# Solution Discovery Skill

## Purpose

Run Solution Discovery for a project using existing Problem Discovery evidence.

This skill produces solution artifacts only. It does not implement the system.

## Required Inputs

Read these files if they exist:

- `.skillbase/artifacts/discovery/problem-discovery-source.md`
- `.skillbase/artifacts/discovery/problem-discovery-summary.md`
- `.skillbase/artifacts/discovery/requirements-traceability.md`
- `.skillbase/artifacts/discovery/business-owner-response.md`
- `.skillbase/artifacts/discovery/problem-discovery-business-decision.md`
- `.skillbase/artifacts/evidence/problem-discovery-import-validation.md`
- `.skillbase/artifacts/evidence/problem-discovery-human-approval.md`
- `.skillbase/project.yaml`
- `.skillbase/policies.yaml`
- `CLAUDE.md`

## Hard Stops

Stop with `BLOCKED` if:

- Problem Discovery artifacts are missing.
- Human approval evidence is missing.
- Requirements are not traceable enough to compare options.
- The user asks to implement code in this stage.

Do not:

- Create `.NET`, Electron, Node, Docker, database, migration, API, frontend, backend or test code.
- Create Jira issues.
- Update Confluence.
- Create GitHub PRs.
- Edit `state.json`, `workflow.yaml`, `policies.yaml`, `integrations.yaml` or `skills.lock`.
- Approve or advance any SkillBase stage.
- Commit or push.

## Allowed Writes

Write only under:

- `.skillbase/artifacts/solution/`
- `.skillbase/artifacts/evidence/`

## Solution Options To Compare

For the 3D Warehouse project, compare at least:

1. Electron + React + TypeScript + React Three Fiber + .NET 10 backend + EF Core + Azure SQL.
2. Web app first, Electron wrapper later.
3. Electron local-first with embedded/local database plus sync.
4. Browser-only Three.js solution.
5. Heavy 3D/CAD engine approach.

## Evaluation Dimensions

Evaluate every option against:

- MVP fit
- performance for 100k objects first, later 500k to 1M
- 2D fallback support
- WMS read-only integration
- multitenancy
- offline/local capability
- security
- implementation complexity
- team skill fit
- cost/token efficiency for agentic development
- testing strategy
- CI/CD and Docker Compose fit
- long-term maintainability

## Required Outputs

Create or update:

### `.skillbase/artifacts/solution/solution-options.md`

Include:

- comparison table
- pros and cons
- rejected options and reasons
- traceability to Problem Discovery

### `.skillbase/artifacts/solution/recommended-solution.md`

Include:

- recommended solution
- why it fits discovery
- MVP boundary
- Phase 1 and Phase 2 split
- assumptions
- risks
- non-goals
- remaining open questions

### `.skillbase/artifacts/solution/solution-architecture-candidates.md`

Include candidates for:

- backend architecture
- frontend architecture
- 3D rendering approach
- data import/sync approach
- multitenancy approach
- exception handling approach
- Docker Compose/local dev approach
- testing approach
- ADRs required later

### `.skillbase/artifacts/evidence/solution-discovery-validation.md`

Include:

- inputs checked
- options evaluated
- recommendation summary
- traceability result
- open decisions for HLD/ADR
- final verdict

## Verdict Rules

Return one of:

- `PASS_SOLUTION_DISCOVERY`: clear recommended direction exists and open questions are carried to HLD/ADR.
- `FAIL_REPAIRABLE`: solution discovery ran, but major gaps remain.
- `BLOCKED`: required evidence or approval is missing.

Even when verdict is `PASS_SOLUTION_DISCOVERY`, write:

`Human approval is still required before HLD/ADRs.`
