# Johans Onboarding Wizard — Overview

## What the system is

Johans Onboarding Wizard is a secure, multi-tenant, data-driven onboarding tool built to manage and document the 3–6 month onboarding journeys used by BRP Systems. The system models onboarding processes as data (wizard definitions), supports multiple languages and country-specific variations, and emphasizes security, traceability, and auditability.

## Who it is for

- Sales teams (handover and scoping)
- Project Managers running onboarding projects
- Customers participating in onboarding
- Internal BRP teams: Support, Expert Services, Customer Success Managers (CSM)

## Goals (v1)

- Provide a configurable, data-driven wizard engine that models onboarding flows as data rather than hard-coded UI flows.
- Support multi-tenancy so BRP can host multiple organizations and projects securely.
- Deliver clear handover artifacts for Sales and Project Managers.
- Offer basic multi-language support and country-specific behavior rules.
- Ensure auditability and role-based access control from day one.

## Explicit non-goals (v1)

- This release is not a full-featured CMS nor a general-purpose workflow automation engine.
- Not aiming for full enterprise compliance certification in v1—documentation and design will be ISO-minded and pragmatic but not a full audit package.
- No heavy analytics or ML-driven automation in v1; data export and simple reporting only.

## Documentation

This `/docs` directory is the single source of truth for architecture, security, domain language, and AI agent behavior. Update these documents first when making decisions that affect cross-cutting concerns.
