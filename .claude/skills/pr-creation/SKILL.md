---
name: pr-creation
description: Use this skill after one story implementation has PASS_IMPLEMENTATION to prepare and optionally create a GitHub pull request for that single story. It verifies implementation evidence, checks git status, prepares a PR title/body with validation results and scope notes, and can create a PR only when explicitly authorized. It must not merge, approve, deploy, or advance workflow stages.
disable-model-invocation: true
argument-hint: "Prepare or create PR for one implemented story ID, e.g. 3DW-STORY-001A"
allowed-tools: Read, Write, Edit, Bash
---

# PR Creation Skill

## Purpose

Prepare and optionally create a GitHub pull request for exactly one implemented story.

Act like a senior engineer preparing a clean handoff for human review.

The goal is:

- one story
- one branch
- one PR
- clear evidence
- clear tests
- clear scope
- no merge
- no stage advancement

## Required User Input

The user must provide exactly one story ID.

Example:

```text
/pr-creation 3DW-STORY-001A
```

Return `BLOCKED` if:

- no story ID is provided
- more than one story ID is provided
- implementation evidence is missing
- implementation verdict is not `PASS_IMPLEMENTATION`

## Required Inputs

Read these files if they exist:

- `.skillbase/artifacts/lld/<story-id>/low-level-design.md`
- `.skillbase/artifacts/lld/<story-id>/file-impact-map.md`
- `.skillbase/artifacts/lld/<story-id>/test-design.md`
- `.skillbase/artifacts/lld/<story-id>/implementation-plan.md`
- `.skillbase/artifacts/evidence/<story-id>-lld-human-approval.md`
- `.skillbase/artifacts/implementation/<story-id>/implementation-summary.md`
- `.skillbase/artifacts/implementation/<story-id>/validation-results.md`
- `.skillbase/artifacts/evidence/<story-id>-implementation-validation.md`
- `.skillbase/artifacts/evidence/<story-id>-scope-change-approval.md` if it exists
- `.skillbase/artifacts/stories/child-story-outlines.md`
- `.skillbase/artifacts/stories/jira-ready-stories.md`
- `.skillbase/project.yaml`
- `.skillbase/policies.yaml`
- `.skillbase/state.json`
- `CLAUDE.md`

Inspect repository state:

```bash
git status --short
git branch --show-current
git remote -v
git log --oneline -5
```

## Hard Stops

Return `BLOCKED` if:

- story implementation verdict is not `PASS_IMPLEMENTATION`
- working tree includes unrelated changes that are not part of the story
- tests/validation are missing and no acceptable reason is recorded
- branch is `main` or protected base branch
- git remote is missing
- user asks to merge PR
- user asks to approve PR
- user asks to deploy
- user asks to advance SkillBase workflow stage

Do not:

- merge a PR
- approve a PR
- deploy
- edit `state.json`
- edit `workflow.yaml`
- edit `policies.yaml`
- edit `integrations.yaml`
- edit `skills.lock`
- create Jira issues
- update Confluence
- advance any SkillBase stage
- force push
- push to `main`

## Allowed Writes

This skill may write evidence under:

```text
.skillbase/artifacts/evidence/
.skillbase/artifacts/pr/<story-id>/
```

Use lowercase folder names for PR evidence.

Example:

```text
.skillbase/artifacts/pr/3dw-story-001a/
```

This skill may create or update:

```text
.skillbase/artifacts/pr/<story-id>/pr-title.md
.skillbase/artifacts/pr/<story-id>/pr-body.md
.skillbase/artifacts/pr/<story-id>/pr-validation.md
.skillbase/artifacts/evidence/<story-id>-pr-validation.md
```

Do not change implementation code unless explicitly instructed to repair a PR-blocking documentation issue.

## Branch Rules

Expected branch naming:

```text
story/<story-id-kebab>-short-title
```

Example:

```text
story/3dw-story-001a-backend-skeleton
```

If current branch is not suitable, return `FAIL_REPAIRABLE_BRANCH` with the recommended branch name.

Do not switch branch automatically unless the user explicitly asks.

## Commit Rules

If the user asks this skill to commit:

- stage only files for this story
- do not stage unrelated changes
- use a story-scoped commit message

Commit message format:

```text
feat: implement backend skeleton for 3DW-STORY-001A
```

If the user does not explicitly ask to commit, do not commit.

## Push Rules

If the user asks this skill to push:

- push only the current story branch
- never force push
- never push to `main`

If the user does not explicitly ask to push, do not push.

## PR Creation Rules

Default behavior is PR preparation only.

Create a GitHub PR only if the user explicitly says:

```text
Create the PR
```

or equivalent explicit approval.

If creating a PR:

- use GitHub CLI if available
- base branch should be `main` unless repo policy says otherwise
- title must include story ID
- body must include evidence and validation results
- do not enable auto-merge
- do not merge

If GitHub CLI is missing or unauthenticated, return `BLOCKED_GITHUB`.

## Required PR Title

Use this format:

```text
3DW-STORY-001A: Implement backend solution skeleton
```

Adjust title based on story.

## Required PR Body Sections

Create a PR body with:

```markdown
## Summary

## Story

## Scope

## Out of Scope

## Files Changed

## Validation

## Evidence

## Scope Changes

## Risks / Follow-ups

## Human Review Checklist
```

### Summary

Briefly explain what changed.

### Story

Include:

- story ID
- story title
- story type
- link/path to LLD evidence

### Scope

List implemented scope.

### Out of Scope

List what was intentionally not done.

### Files Changed

Group by:

- backend
- frontend
- tests
- documentation/evidence
- tooling/config

### Validation

Include commands and results.

Example:

```text
dotnet build: passed
dotnet test: passed, 3/3
manual curl /health: passed
```

### Evidence

Reference local evidence paths:

- implementation summary
- validation results
- implementation validation
- scope-change approval if any

### Scope Changes

Mention approved scope changes only.

If none, write:

```text
No scope changes.
```

### Risks / Follow-ups

Include known risks.

For 3DW-STORY-001A, if applicable, mention:

```text
Template dependency Microsoft.OpenApi 2.0.0 has known advisory NU1903 / GHSA-v5pm-xwqc-g5wc. Not fixed in this story because OpenAPI tooling was outside approved scope.
```

### Human Review Checklist

Include:

```markdown
- [ ] Story scope matches approved LLD
- [ ] No unrelated files included
- [ ] Tests pass
- [ ] Scope-change approval reviewed, if applicable
- [ ] Security/package advisory follow-up considered
- [ ] No workflow stage is advanced by this PR
```

## Required Evidence Outputs

Create or update:

### `.skillbase/artifacts/pr/<story-id>/pr-title.md`

Contains final PR title.

### `.skillbase/artifacts/pr/<story-id>/pr-body.md`

Contains final PR body.

### `.skillbase/artifacts/pr/<story-id>/pr-validation.md`

Include:

- branch checked
- git status summary
- implementation verdict checked
- validation results checked
- unrelated changes check
- PR readiness result
- whether PR was created
- PR URL if created

### `.skillbase/artifacts/evidence/<story-id>-pr-validation.md`

Include:

- timestamp
- story ID
- final verdict
- PR title
- branch
- files considered
- validation summary
- blockers
- PR URL if created

## Verdict Rules

Return one of:

- `PASS_PR_READY`: PR title/body/evidence prepared, implementation ready for human PR creation.
- `PASS_PR_CREATED`: PR created successfully and human review is required.
- `FAIL_REPAIRABLE_BRANCH`: branch name or branch state needs repair.
- `FAIL_REPAIRABLE_UNRELATED_CHANGES`: unrelated working tree changes must be separated.
- `FAIL_REPAIRABLE_PR_BODY`: PR body/evidence incomplete.
- `BLOCKED`: required implementation evidence, git remote, validation, or approval is missing.
- `BLOCKED_GITHUB`: GitHub CLI/tooling/auth is missing or not ready.

Even when verdict is `PASS_PR_CREATED`, write:

```text
Human review is required before merge.
```
