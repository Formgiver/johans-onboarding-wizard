# Naming Conventions

This page defines simple, consistent naming conventions for files, database artifacts, enums, and canonical terminology. The goal is clarity and predictability across the codebase and persistence layer.

## General principles

- One term = one meaning. Use the canonical terminology list in this document.
- Prefer clarity over clever abbreviations.
- Keep names stable; renaming is allowed only when the domain model or requirements change.

## Files

- UI components (React/TSX): `PascalCase` for component filenames and exported component names (e.g., `ProjectSummary.tsx`).
- Page/routes: `kebab-case` for file-system routes (when using filesystem routing), matching URL paths (e.g., `project-overview/page.tsx`).
- Utility modules: `kebab-case` or `camelCase` (choose one consistently per folder). Prefer `kebab-case` for filenames.

## Database tables (conceptual)

- Use plural, snake_case for table names: `organizations`, `projects`, `wizard_definitions`, `wizard_instances`, `audit_events`.
- Table names should reflect the canonical entity name.

## Columns (conceptual)

- Use snake_case for column names: `organization_id`, `created_at`, `updated_by`.
- Foreign keys: use `{entity}_id` pattern (e.g., `project_id`).

## Enums

- TypeScript/Runtime enums: `PascalCase` for enum type names and `PascalCase` for enum members used in code.
- Database enum labels: `SCREAMING_SNAKE_CASE` when stored as text in Postgres, or match the application enum mapping explicitly.

Examples:
- TypeScript: `enum WizardState { Draft, Active, Completed, Archived }`
- DB enum: `'DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'`

## Canonical terminology (one term = one meaning)

- Organization: the tenant (customer) using the system.
- Project: an onboarding engagement within an Organization.
- WizardDefinition: a versioned data object that defines steps, questions, and rules.
- WizardInstance: a runtime instantiation of a WizardDefinition for a Project.
- Step: a logical stage of a wizard.
- Question / Field: atomic data capture element within a Step.
- Answer / Response: the stored value submitted for a Question.
- AuditEvent: immutable record of change or important lifecycle events.

Follow these conventions consistently across code and persistence artifacts to reduce cognitive load and simplify cross-team communication.
