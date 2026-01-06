# Architecture — High Level

## System overview

The system is a web application (Next.js + TypeScript) with a backend persistence layer (Supabase/Postgres) and an authentication layer. The application exposes a UI for several user roles and a server-side domain layer that evaluates and executes wizard definitions stored as data.

## Major logical modules

- UI (Next.js App Router)
  - Presentation components, localized string rendering, client-side state management for single-step interactions.

- API / Server Layer
  - Server-side functions and API routes that validate requests, enforce RBAC and tenancy boundaries, and orchestrate domain operations.

- Domain Logic (Wizard Engine)
  - Interpreter for wizard definitions (steps, conditional logic, validation rules).
  - Responsible for step progression, business rules, and lifecycle transitions.

- Persistence (Supabase/Postgres)
  - Stores tenant data, wizard definitions, wizard instances, audit events, and localized content.
  - Row-Level Security (RLS) is applied to enforce tenant isolation.

- Integrations
  - Authentication (Supabase Auth), optional third-party integrations (email, file storage), and export connectors.

## Data-driven wizard principle

Wizard behavior is defined by structured data (wizard definitions) rather than hard-coded control flow. A wizard definition includes:

- Steps and step ordering
- Questions (fields) with types and validation
- Conditional logic and branching rules
- Labels and localized content keys

The engine interprets definitions at runtime; this enables non-developers to evolve flows with data changes and simplifies per-country and per-tenant customization.

## Separation of concerns

- UI: purely responsible for rendering and user interaction, localization display, and collecting answers.
- Domain logic: authoritative source of business rules and step progression; lives server-side and is exercised by API endpoints.
- Persistence: responsible for durable storage, tenancy enforcement, audit records, and backups.

Keep the three layers decoupled so changes to wizard definitions do not require UI code changes and domain rules remain testable and auditable.

## Operational considerations

- Prefer server-side evaluation for sensitive decisions and validations.
- Use caching for frequently-read, read-only definition data while ensuring cache invalidation on updates.
- Design APIs to be idempotent where possible to support client retries.
