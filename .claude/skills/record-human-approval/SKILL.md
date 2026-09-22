---
name: record-human-approval
description: Use this skill to record a human approval decision for a SkillBase gate after the human explicitly states approval. It creates approval evidence files and, only when explicitly authorized, updates state.json gate status. It must not decide approvals, approve on behalf of a human, create code, or advance workflow stages.
disable-model-invocation: true
argument-hint: "Record explicit human approval for a named gate"
allowed-tools: Read, Write, Edit, Bash
---

# Record Human Approval Skill

## Purpose

Record an explicit human approval decision for a SkillBase gate.

This skill does not decide whether something should be approved. It only records a decision already made by a human.

## Required Human Input

The user must provide:

- gate name
- decision: APPROVED or REJECTED
- approver name
- approver role
- date
- approval scope
- evidence file to create

If any field is missing, return `BLOCKED`.

## Hard Stops

Do not:

- approve anything without explicit human decision text
- advance `current_stage`
- mark a stage completed
- create implementation code
- create Jira issues
- update Confluence
- create PRs
- commit or push

## Allowed Writes

Normally write only under:

- `.skillbase/artifacts/evidence/`

Only edit `.skillbase/state.json` if the human explicitly authorizes this exact gate update in the prompt.

Do not edit:

- `.skillbase/workflow.yaml`
- `.skillbase/policies.yaml`
- `.skillbase/integrations.yaml`
- `.skillbase/skills.lock`

## Approval Evidence Format

Create the requested evidence file with:

- project
- gate
- decision
- approver
- role
- date
- approval scope
- not-approved scope
- source artifacts reviewed
- statement that the approval is human-provided
- statement that Claude did not make the approval decision

## Optional State Update

If explicitly authorized, update `.skillbase/state.json` only as follows:

- set the named gate to the decision value
- append one approval record to `approvals`
- do not change `current_stage`
- do not mark any stage complete
- do not change unrelated gates

If `.claude/settings.json` blocks editing `state.json`, return `BLOCKED` and tell the user to edit it manually or use SkillBase outside Claude Code.

## Verdict Rules

Return:

- `APPROVAL_RECORDED` when evidence file is created.
- `APPROVAL_RECORDED_STATE_BLOCKED` when evidence is created but state.json cannot be edited.
- `BLOCKED` when explicit human approval fields are missing.
