# Domain Model — Concepts and Entities

This document captures the canonical domain entities, their meanings, and the primary onboarding lifecycle. This is conceptual only and intentionally not a database schema.

## Canonical domain entities

- Organization
  - A tenant representing a BRP customer. Contains tenant-wide settings, country profile, and users.

- Project
  - A discrete onboarding engagement for an `Organization`. Projects group wizard instances, timeline, and handover artifacts.

- WizardDefinition
  - A reusable, versioned definition that describes a wizard: steps, questions, validation rules, conditional logic, and localized content keys.
  - Each step now has a `step_type` (text, textarea, select, checkbox, country_specific) and optional `config` for type-specific settings.

- WizardInstance
  - A runtime instance of a `WizardDefinition` created for a specific `Project`. Stores answers, progress, and state transitions.
  - Tracks progress automatically: `progress_percent`, `completed_steps_count`, `total_required_steps`.
  - Status includes: DRAFT, ACTIVE, WAITING_ON_CUSTOMER, COMPLETED, ARCHIVED.

- Step
  - A logical unit within a wizard (e.g., "Customer Info", "Integration Setup"). Steps can be linear or conditional.
  - Now supports structured input types beyond free-form JSON.

- StepType (NEW)
  - Enumeration of supported input types:
    - `text`: Single-line text input
    - `textarea`: Multi-line text input
    - `select`: Dropdown selection from predefined options
    - `checkbox`: Boolean yes/no confirmation
    - `country_specific`: Conditional field shown only for specific countries

- Question (Field)
  - An atomic data capture element inside a step (type, label key, validation rules, optional/required, allowed answers).

- Answer (Response)
  - A stored response to a `Question` on a specific `WizardInstance`. Includes metadata (who submitted, when).

- SalesHandover (NEW)
  - A structured handover snapshot from Sales to PM, containing items sold and triggering wizard activation.
  - Status: DRAFT, CONFIRMED, ARCHIVED.

- SalesHandoverItem (NEW)
  - Individual key-value pairs representing sales selections (e.g., acquirer=elavon).

- SalesHandoverWizardMap (NEW)
  - Declarative mapping between sales selections and wizards to activate.

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
3. Sales handover: `Sales` creates a `SalesHandover`, adds items (acquirer, payment gateway, etc.), and confirms it.
4. Automatic wizard activation: When handover is confirmed, system creates `WizardInstance`s based on `SalesHandoverWizardMap`.
5. Wizard execution: `CustomerUser`s and internal users complete structured `Steps`, submit `Answers`, and progress updates automatically.
6. Progress tracking: System calculates completion percentage and updates status (DRAFT → ACTIVE → COMPLETED).
7. Output generation: System generates Customer Summary and PM/Zendesk Draft from wizard inputs (derived, not persisted).
8. Verification & Handover: `ProjectManager` validates completed work, uses generated summaries for handover.
9. Support & Maintenance: `Support` may reopen or reference the completed instance for ongoing operations.
10. Archive: completed projects and instances are archived according to retention policies.

## Notes

- Versioning: `WizardDefinition`s are versioned so past `WizardInstance`s remain stable and auditable.
- Immutability: `AuditEvent`s should capture changes so that intent and rationale are traceable.
- Country and tenant overrides: `WizardDefinition`s can reference `CountryProfile` and `Organization`-level overrides to support localization and legal differences.
- Automatic progress: Progress is calculated automatically via database trigger when step inputs are saved.
- Output summaries: Customer and PM summaries are generated on-demand from wizard data, not stored separately.
