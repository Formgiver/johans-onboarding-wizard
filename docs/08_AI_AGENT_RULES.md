# AI Agent Rules — Mandatory Operational Guidance

Agents and automation that operate in this repository must follow these rules. Treat this file as the first mandatory read before executing or proposing changes.

## Mandatory reading order for agents

1. `08_AI_AGENT_RULES.md` (this document) — required reading for agent behavior and output discipline.
2. `00_OVERVIEW.md` — project goals and scope.
3. `01_ARCHITECTURE.md` — system boundaries and separation of concerns.
4. `02_SECURITY_MODEL.md` — security expectations and constraints.
5. `03_DOMAIN_MODEL.md` — canonical domain language and lifecycle.
6. `04_NAMING_CONVENTIONS.md` — naming rules and terminology.
7. `05_I18N_AND_LOCALE.md` — localization strategy.
8. `TODO.md` — living task list and discipline rules.

Follow the reading order before making or suggesting substantive changes.

## Rules for TODO discipline

- All new tasks must be added to `TODO.md` and reflected in the project-managed todo list (use the repository's tracking tool when available).
- Tasks in `TODO.md` should be concise and actionable with a single owner where possible.
- Do not mark a task complete without updating `TODO.md`, the tracking tool, and adding a short changelog entry describing why it was closed.

## Rules for output discipline

- Outputs must be scoped and traceable: every non-trivial change must include a short rationale and the minimal set of affected artifacts.
- Agents must not modify production configuration or secrets.
- When producing code or docs, include only the requested artifacts; do not add unrelated changes.
- When proposing design changes, include the minimal impact analysis: affected modules, data, security considerations, and migration notes.

## Safety & scope control rules

- Agents must never execute destructive commands without explicit human approval.
- Agents must avoid exposing or leaking secrets, PII, or tenant data in outputs.
- Agents must validate assumptions before acting on them; when assumptions are uncertain, flag them and request human confirmation.

## Context persistence rule

- Agents must never "lose" project context. Maintain the canonical documents in `/docs` as the authoritative context source and reference them in every plan or change proposal.
- If an agent cannot find information in `/docs`, it must raise a task in `TODO.md` to clarify rather than guessing.

## Interaction with humans

- When uncertain about scope or potential impact, present concise options with trade-offs and ask for explicit human direction.
- Do not perform non-trivial repository modifications (code or infra) without a human reviewer and an associated task in `TODO.md`.

## Example checklist for agent actions

- Read mandatory documents in order.
- Add or update `TODO.md` if work is planned.
- Produce minimal, scoped artifacts (docs or code) as requested.
- Request human review for any changes that touch security, tenancy, or data migration.

Following these rules keeps work auditable, safe, and aligned with the project's single source of truth in `/docs`.
