# Security Model

This document records the v1 security assumptions, controls, and expectations for a multi-tenant onboarding wizard intended to be ISO-minded and pragmatic.

## Multi-tenant assumptions

- Tenants are organizations (customers) isolated within a single application instance.
- Data belonging to one tenant must not be accessible to users of another tenant except where explicit cross-tenant features are designed and authorized.
- Every record that is tenant-scoped must include a tenant identifier (conceptual: `organization_id`).

## Role-based access control (initial roles)

Start with a small, well-defined set of roles to cover the primary users:

- SystemAdmin — global, operational role for BRP administrators (manage platform-level settings).
- OrgAdmin — organization-level administrator (manage users, projects, and tenant settings).
- ProjectManager — manages a specific onboarding project, configures wizard instances and handovers.
- Sales — creates and scopes projects; limited to sales-related actions and handover creation.
- CustomerUser — end user from the customer side who completes steps and submits answers.
- Support/Expert — internal BRP support role with read or limited write access to assist customers.
- ReadOnly — auditors or observers with read-only access.

Principles:

- Implement least privilege and role separation of duties.
- Use coarse-grained roles mapped to fine-grained policies in RLS and server checks.

## RLS-first mindset

- Row-Level Security (RLS) is the primary mechanism to enforce tenant isolation and many authorization rules.
- Application code must assume RLS policies are the enforcement point for data access; do not replicate tenant checks in multiple places without reason.
- RLS policies should be explicit, tested, and cover both read and write paths.

## Auditability expectations

- Record an immutable audit trail for operations that change tenant or project state (create/update/delete wizard definitions, instance state transitions, user role changes).
- Minimal audit record: timestamp, actor (user id), actor role, action, target entity identifier, before/after snapshots or diffs, and an optional reason/note.
- Store audit records in a way that is queryable, exportable, and protected from casual modification (write-once semantics preferred where feasible).
- Retention and export: define retention policies and the ability to export audit logs for compliance requests.

## Data protection and infrastructure

- Encrypt data in transit (TLS) and rely on provider-managed encryption at rest for v1.
- Secrets (API keys, service credentials) must be stored in a secrets manager; never checked into source control.
- Limit service accounts and apply principle of least privilege for all external integrations.

## Incident and change control

- All access-provisioning and privilege changes should be auditable.
- Implement logging and alerting for suspicious cross-tenant access attempts and privilege escalations.

## ISO-aligned but pragmatic tone

- Design decisions should be informed by ISO security principles (confidentiality, integrity, availability) and good practices (least privilege, defense in depth) without attempting to claim full ISO certification in v1.
- Document controls and gaps so future compliance work has a clear roadmap.
