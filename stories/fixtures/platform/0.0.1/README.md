# fixtures/platform/0.0.1

Platform `0.0.1`의 deterministic mock data와 UX scenario를 제공한다.

## Fixture areas

- Auth: Login/Signup request, validation, submitting, error, permission, long-content states
- Dataset Catalog: datasets, classes, images, members, responsive and workflow scenarios
- Class Management: classes, datasets, images, reference/mapping scenarios
- Create Project: form, submitting, error, workflow states
- Dashboard: analysis, Edge integration, layout/state scenarios
- Settings Modal: Account, Project, Edge, Organization, Devices, Storage

## Rules

- Fixtures are story-only data. `packages/platform-pages` must never import this directory.
- Scenario reset must be deterministic so repeated play functions and direct static iframe runs start from the same state.
- Product copy and IDs may be literal fixture content; visual design values still use tokens in production code.
- A fixture state is documented by a purpose-grouped story or an executable workflow, not necessarily a separate static export.
- The typed registry is available for gradual adoption. Stories may also use explicit fixture imports where that keeps domain dependencies clear.

## Related docs

- [Platform Story Contract](../../../../stories/pages/platform/0.0.1/README.md)
- [Platform Migration and Verification](../../../../stories/pages/platform/0.0.1/MIGRATION.md)
- [Historical Phase 2 Plan](../../../../docs-legacy/plan/storybook-restructure-phase-2-platform-pages.md)
