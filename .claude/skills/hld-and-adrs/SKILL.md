---
name: hld-and-adrs
description: Use this skill after Solution Discovery is approved to create High Level Design and Architecture Decision Records using industry-standard architecture practices. It produces HLD, C4-style architecture views, API/data/security/deployment design, ADRs, risks and validation evidence. It must not create application code, Jira issues, PRs, or advance workflow stages.
disable-model-invocation: true
argument-hint: "Create HLD and ADRs from approved problem and solution discovery"
allowed-tools: Read, Write, Edit, Bash
---

# HLD and ADRs Skill

## Purpose

Create High Level Design and Architecture Decision Records from approved discovery and solution evidence.

This skill is for architecture documentation only. It must not implement code.

## Standards To Follow

Use these architecture practices:

- C4 model thinking: System Context, Container, Component where useful.
- ADR format: Context, Decision, Status, Consequences, Alternatives.
- OWASP secure design principles.
- Twelve-Factor style configuration where applicable.
- Cloud-native local development principles.
- API-first design with stable contracts.
- Fail-closed multitenancy.
- Observability-first backend design.
- Performance-budget thinking for 3D rendering.

Do not over-document. Prefer clear, reviewable design decisions.

## Required Inputs

Read these files if they exist:

- `.skillbase/artifacts/discovery/problem-discovery-summary.md`
- `.skillbase/artifacts/discovery/requirements-traceability.md`
- `.skillbase/artifacts/evidence/problem-discovery-human-approval.md`
- `.skillbase/artifacts/solution/solution-options.md`
- `.skillbase/artifacts/solution/recommended-solution.md`
- `.skillbase/artifacts/solution/solution-architecture-candidates.md`
- `.skillbase/artifacts/evidence/solution-discovery-validation.md`
- `.skillbase/artifacts/evidence/solution-discovery-human-approval.md`
- `.skillbase/project.yaml`
- `.skillbase/policies.yaml`
- `.skillbase/state.json`
- `CLAUDE.md`

## Hard Stops

Return `BLOCKED` if:

- Problem Discovery approval is missing.
- Solution Discovery approval is missing.
- Solution Discovery verdict is not `PASS_SOLUTION_DISCOVERY`.
- The user asks to create implementation code in this stage.
- The approved solution direction is missing or unclear.

Do not:

- Create .NET, Electron, TypeScript, Docker, database, migration, API, frontend, backend or test code.
- Create Jira issues.
- Update Confluence.
- Create GitHub PRs.
- Edit `state.json`, `workflow.yaml`, `policies.yaml`, `integrations.yaml` or `skills.lock`.
- Approve or advance any SkillBase stage.
- Commit or push.

## Allowed Writes

Write only under:

- `.skillbase/artifacts/architecture/`
- `.skillbase/artifacts/evidence/`
- `docs/adr/`

## Required HLD Outputs

Create or update:

### `.skillbase/artifacts/architecture/high-level-design.md`

Include:

- executive summary
- problem and solution traceability
- MVP scope
- non-goals
- architecture principles
- system context
- container architecture
- major runtime flows
- module boundaries
- backend architecture
- frontend architecture
- 3D rendering architecture
- data import/sync architecture
- multitenancy architecture
- security architecture
- exception handling architecture
- observability architecture
- local development and Docker Compose architecture
- CI/CD overview
- test strategy overview
- performance strategy
- open questions
- risks and mitigations

### `.skillbase/artifacts/architecture/c4-views.md`

Use Mermaid where useful.

Include:

- System Context view
- Container view
- Key Component view
- Deployment/local development view
- Data flow view

Keep diagrams compact and readable.

### `.skillbase/artifacts/architecture/api-and-data-design.md`

Include:

- API style recommendation
- major API groups
- request/response conventions
- error response format
- pagination/filtering/search conventions
- tenant context handling
- import model
- core conceptual entities
- EF Core/code-first guidance
- migration strategy
- Azure SQL guidance

Do not create actual API code or entity classes.

### `.skillbase/artifacts/architecture/security-and-multitenancy-design.md`

Include:

- tenant isolation model
- tenant context source
- fail-closed rules
- authorization approach
- read-only WMS boundary
- secrets/configuration approach
- audit logging
- data protection concerns
- OWASP risks and mitigations

### `.skillbase/artifacts/architecture/performance-and-3d-design.md`

Include:

- 100k object target strategy
- 500k to 1M object future strategy
- React Three Fiber guidance
- Three.js instancing strategy
- LOD/culling strategy
- worker/threading considerations
- 2D fallback behavior
- performance budgets
- profiling plan
- test data requirements

## Required ADRs

Create ADRs under `docs/adr/`.

Use this filename pattern:

```text
docs/adr/0001-record-architecture-baseline.md
docs/adr/0002-choose-electron-react-typescript.md
docs/adr/0003-choose-dotnet-efcore-azure-sql.md
```
