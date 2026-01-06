# TODO — Living Task List

> This file is the living TODO list. Every item should be actionable and link back to design docs or tasks where appropriate. All items below are unchecked by design.

## Foundation

- [x] Minimal auth flow
- [x] RLS proof via My Projects list
- [ ] Finalize `WizardDefinition` versioning strategy and migration plan.
- [ ] Define audit retention and export requirements.
- [ ] Create developer onboarding checklist for working with `/docs` and RLS policies.

## Supabase

- [ ] Draft Supabase schema proposals (conceptual only) for `wizard_definitions` and `wizard_instances`.
- [ ] Define initial RLS policies for tenant isolation.
- [ ] Create backup and restore operational playbook for v1.

## Wizard engine

- [x] Wizard engine – data model (wizards, wizard_steps, wizard_instances, wizard_step_inputs)
- [ ] Author minimal interpreter spec for `WizardDefinition` (steps, conditions, validations).
- [ ] Define process for authoring and reviewing wizard data (who may edit definitions).
- [ ] Create test fixtures for common wizard flows and country profiles.

## Handover

- [x] Sales handover – data model (sales_handovers, sales_handover_items, sales_handover_wizard_map)
- [ ] Draft handover artifact checklist for Sales → Project Managers.
- [ ] Define export formats for completed wizard instances (PDF, CSV, JSON).
- [ ] Specify access controls for archived handovers and support lookups.

---

(Keep this file small and actionable. Add new items here and update the project-managed todo list accordingly.)
