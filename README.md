# 3D Warehouse

Digital400 3D warehouse visualizer. Governed by SkillBase; executed with Claude Code.

**Status:** governance foundation only. Stage `PROBLEM_DISCOVERY_IMPORT`, not started. No application code exists, and none may be generated until the discovery, solution and architecture gates are approved.

## Layout
| Path | Purpose |
|---|---|
| `.skillbase/` | Process authority: project, workflow, policies, integrations, skill lock, state, artifacts |
| `.claude/` | Claude Code settings and skills |
| `docs/adr/` | Architecture decision records |
| `CLAUDE.md` | Concise rules for Claude Code sessions |

## Direction (not yet approved)
.NET 10 LTS backend, Electron + React + TypeScript frontend, React Three Fiber + Three.js, Azure SQL with EF Core 10 code-first, modular monolith. Multi-tenant (fail closed), Scale/WMS read-only, complete 2D fallback.

## Workflow
Discovery, solution, architecture and story planning each need validated artifacts and human approval. One Jira story maps to one branch and one pull request. No direct pushes to `main`.
