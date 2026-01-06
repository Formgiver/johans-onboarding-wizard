# Domain Model — Concepts and Entities

This document captures the canonical domain entities, their meanings, and the primary onboarding lifecycle. This is conceptual only and intentionally not a database schema.

## Canonical domain entities

- Organization
  - A tenant representing a BRP customer. Contains tenant-wide settings, country profile, and users.

- Project
  - A discrete onboarding engagement for an `Organization`. Projects group wizard instances, timeline, and handover artifacts.

- WizardDefinition
  - A reusable, versioned definition that describes a wizard: steps, questions, validation rules, conditional logic, and localized content keys.

- WizardInstance
  - A runtime instance of a `WizardDefinition` created for a specific `Project`. Stores answers, progress, and state transitions.

- Step
  - A logical unit within a wizard (e.g., "Customer Info", "Integration Setup"). Steps can be linear or conditional.

- Question (Field)
  - An atomic data capture element inside a step (type, label key, validation rules, optional/required, allowed answers).

- Answer (Response)
  - A stored response to a `Question` on a specific `WizardInstance`. Includes metadata (who submitted, when).

- User
  - A human actor with a role and membership to one or more `Organization`s.

- Role
  - Authorization role assigned to a `User` scoped by `Organization` and/or `Project`.

- AuditEvent
  - Immutable record of changes and important lifecycle events (who, what, when, why).

- CountryProfile
  - Configuration for country-specific rules, required fields, legal disclaimers, or document requirements.

- Attachment
  - File artifacts uploaded in the context of a wizard step or handover.

## Primary onboarding lifecycle (conceptual)

1. Organization onboarding: create `Organization`, configure `CountryProfile` and tenant settings.
2. Project creation: `OrgAdmin` or `Sales` creates a `Project` to represent an onboarding engagement.
3. Wizard selection or creation: choose or author a `WizardDefinition` relevant to the project scope.
4. WizardInstance creation: instantiate the definition for the `Project`, set initial assignees and timelines.
5. Execution: `CustomerUser`s and internal users complete `Steps`, submit `Answers`, and progress the instance.
6. Verification & Handover: `ProjectManager` validates completed work, compiles handover artifacts, and marks the instance as complete.
7. Support & Maintenance: `Support` may reopen or reference the completed instance for ongoing operations.
8. Archive: completed projects and instances are archived according to retention policies.

## Notes

- Versioning: `WizardDefinition`s are versioned so past `WizardInstance`s remain stable and auditable.
- Immutability: `AuditEvent`s should capture changes so that intent and rationale are traceable.
- Country and tenant overrides: `WizardDefinition`s can reference `CountryProfile` and `Organization`-level overrides to support localization and legal differences.
