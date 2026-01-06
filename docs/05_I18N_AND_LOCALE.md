# I18n and Locale — v1 Strategy

This document outlines the initial language and locale approach for the onboarding wizard, focusing on forward compatibility and clear ownership of translatable content.

## Language strategy (v1)

- Primary language: English (en).
- Support additional languages by shipping translation bundles as data (translation keys and localized strings).
- Use BCP 47 language tags for locale identifiers (e.g., `en`, `nb-NO`).
- Implement a fallback chain: specific locale → language → default (`en`).

## Country-specific behavior rules

- Country-specific rules are driven by a `CountryProfile` data object that controls:
  - Required fields or documents
  - Legal disclaimers and localized help text
  - Date, time, and number formatting preferences
- Wizard definitions should reference `CountryProfile` keys rather than hard-coding country logic inside the UI.

## Content ownership: data vs UI strings

- Data-owned content (editable by product administrators or customers):
  - Wizard definitions (steps, questions, help text, validation messages attached to definition keys)
  - CountryProfile content and per-tenant overrides
  - Handover artifacts and project-specific instructions

- Code-owned UI strings (managed in repository):
  - Navigation labels, framework-level messages, developer-facing error text

- Rule: editable content must be treated as data and localized via translation keys; UI-only strings live in the repo and are translated by engineering processes.

## Implementation notes and forward-compatible choices

- Use translation keys consistently across UI and data (e.g., `wizard.step.customer_info.title`).
- Avoid embedding HTML or complex markup in translation strings; prefer structured content or markup-safe interpolation.
- Support pluralization and gender-aware translations via a library that understands ICU message syntax.
- Store localized content in a way that can be updated without code deploys (e.g., via persistence as data with appropriate guardrails and review workflows).
- Date/time/number formatting should rely on locale-aware formatting libraries on the client and server.

## Testing and QA

- Verify fallback behavior when translations are missing.
- Test country-specific flows using representative `CountryProfile` fixtures.
- Include localization checks in the acceptance criteria for wizard changes that add or modify translatable keys.
