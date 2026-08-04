# pages/platform/0.0.1

Storybook stories for 6 Platform product areas — **Auth / Create Project / Class Management / Dataset Catalog / Settings Modal / Dashboard**. Auth contains separate Login and Signup views.

## Architecture

Page-level JSX has been extracted to `@ingradient/platform-pages` (workspace package at [`packages/platform-pages/`](../../../../packages/platform-pages/)). Stories here are **thin orchestrators**:

- Each `*.stories.tsx` imports the corresponding view from `@ingradient/platform-pages` and renders it with mock props.
- Mock state hooks (`use-*-scene.ts`) live alongside each story for scenario state.
- Prop builders (`build-*-view-props.tsx`) convert scene state + fixtures into view props.

The same view is imported by `ingradient-platform` (Phase 7 of the extraction roadmap) with real hook results — see [`docs/plan/platform-pages-usage.md`](../../../../docs/plan/platform-pages-usage.md).

## File layout

```
0.0.1/
├─ auth/                          # Auth stories + shared controlled runtime
│  ├─ Login.stories.tsx           # Login / Workspace (1 story)
│  ├─ LoginStates.stories.tsx     # Login / System States (4)
│  ├─ LoginWorkflows.stories.tsx  # Login / Workflows (1)
│  ├─ Signup.stories.tsx          # Signup / Workspace (1 story)
│  ├─ SignupStates.stories.tsx    # Signup / System States (2)
│  ├─ SignupWorkflows.stories.tsx # Signup / Workflows (1)
│  ├─ auth-story-actions.ts       # 12 explicit Login/Signup Action callbacks
│  ├─ auth-story-config.ts        # scoped Controls, a11y, handoff
│  ├─ auth-story-plays.ts         # sign-in/account-creation workflows
│  └─ auth-story-runtime.tsx      # deterministic controlled form state
├─ Catalog.stories.tsx            # Dataset Catalog / Workspace (10 stories)
├─ CatalogStates.stories.tsx      # System States (7)
├─ CatalogInteractions.stories.tsx # Interactions (6)
├─ CatalogAnalytics.stories.tsx   # Analytics (2)
├─ CatalogInspector.stories.tsx   # Image Inspector (1)
├─ CatalogDatasetDetails.stories.tsx # Dataset Details (3)
├─ CatalogWorkflows.stories.tsx   # Workflows (6)
├─ CatalogResponsive.stories.tsx  # Responsive (5)
├─ ClassManage.stories.tsx        # Class Management / Workspace (4 stories)
├─ ClassManageStates.stories.tsx  # System States (9)
├─ ClassManageInteractions.stories.tsx # Interactions (3)
├─ ClassManageReference.stories.tsx # Reference Image (4)
├─ ClassManageWorkflows.stories.tsx # Workflows (2)
├─ ClassManageInspector.stories.tsx # Image Inspector (1)
├─ ClassManageMapping.stories.tsx # Model Mapping (1)
├─ CreateProject.stories.tsx      # Create Project / Workspace (1 story)
├─ CreateProjectStates.stories.tsx # System States (2)
├─ CreateProjectWorkflows.stories.tsx # Workflows (2)
├─ Dashboard.stories.tsx          # Dashboard / Workspace (1 story)
├─ DashboardStates.stories.tsx    # System States (5)
├─ DashboardInteractions.stories.tsx # Interactions (4)
├─ DashboardLayouts.stories.tsx   # Layouts (2)
├─ DashboardLayoutStudies.stories.tsx # Layout Studies (2)
├─ DashboardIntegrations.stories.tsx # Integrations (2)
├─ SettingsModal.stories.tsx      # Settings Modal / General (2 stories)
├─ SettingsModalAccount.stories.tsx # Account (8)
├─ SettingsModalProject.stories.tsx # Project (7)
├─ SettingsModalEdge.stories.tsx  # Edge (7)
├─ SettingsModalOrganization.stories.tsx # Organization (3)
├─ SettingsModalDevices.stories.tsx # Devices (3)
├─ SettingsModalStorage.stories.tsx # Storage (3)
├─ catalog/                       # Catalog story helpers
│  ├─ use-catalog-scene.ts        # scene state hook
│  ├─ catalog-scene-selectors.ts   # local search / filter / sort result adapter
│  ├─ catalog-story-plays.ts       # focused interaction contracts
│  ├─ catalog-story-runtime.tsx    # shared Controls, Actions, handoff, responsive adapter
│  ├─ build-view-props.tsx        # props converter
│  ├─ build-overlays.ts           # overlays sub-builder
│  ├─ build-stats-content.tsx     # stats slot JSX
│  ├─ mock-dashboard.ts           # chart mock data
│  └─ mock-detail.ts              # detail modal mock data
├─ class/                         # Class Management story helpers
│  ├─ use-class-manage-scene.ts   # deterministic controlled state
│  ├─ class-manage-story-plays.ts # named interaction contracts
│  └─ class-manage-story-runtime.tsx # shared Controls, Actions, and handoff
├─ create-project/                # Create Project story helpers
│  ├─ create-project-story-actions.ts # shared Action contract
│  ├─ create-project-story-plays.ts # creation/cancel interaction contracts
│  └─ create-project-story-runtime.tsx # controlled form, Controls, a11y, handoff
├─ dashboard/                     # Dashboard story helpers
│  ├─ use-dashboard-scene.ts      # deterministic preferences/date state
│  ├─ build-widgets.tsx           # fixture-backed widget composition
│  ├─ dashboard-story-actions.ts  # shared Action contract
│  ├─ dashboard-story-config.ts   # scoped Controls, a11y, handoff
│  ├─ dashboard-story-runtime.tsx # controlled DashboardView adapter
│  ├─ dashboard-story-plays.ts    # named workflow contracts
│  └─ dashboard-layout-studies.tsx # isolated non-production layout studies
└─ settings/                      # SettingsModal story helpers
   ├─ use-settings-modal-scene.ts # deterministic controlled state
   ├─ use-edge-tab-state.ts       # Edge work/export selection state
   ├─ settings-modal-story-actions.ts # shared Action contract
   ├─ settings-modal-story-plays.ts # named interaction contracts
   ├─ settings-modal-story-runtime.tsx # shared Controls, Actions, a11y, handoff
   ├─ build-view-props.tsx        # General/Account/Project props + instrumentation
   ├─ build-admin-props.tsx       # Organization/Devices props + instrumentation
   ├─ build-edge-slots.tsx        # Edge slot composition + instrumentation
   └─ build-storage-slots.tsx     # Storage analytics slots
```

## Conventions

- **Story file must stay < 200 lines.** Helper logic goes into the helper folder.
- **No direct UI pattern composition in operational stories.** Workspace, state, interaction, layout, and integration stories render the view from `@ingradient/platform-pages`. The user-approved Dashboard `Layout Studies` group is the explicit exception: each non-production alternative is isolated in a helper and composes only package-owned page components.
- **Fixture imports are story-only.** Views in `@ingradient/platform-pages` never import from `stories/fixtures/`.
- **Auth stories are purpose-grouped.** Login and Signup each use Workspace, System States, and Workflows. The 10 non-redundant stories preserve request, failure, permission, overflow, and validation states while adding executable sign-in and account-creation contracts.
- **Auth controls are executable contracts.** Package-owned `LoginView` and `SignupView` report 12 explicit field, preference, submit, and navigation Actions. The approved inline auth links retain their color and add an underline so every Auth story can use blocking accessibility.
- **Catalog controls are executable contracts.** Search, filter, sort, visible-image selection, delete, and mobile sheets must update scene state and have focused Storybook interaction coverage.
- **Catalog stories are purpose-grouped.** The single product page is documented as 40 non-redundant stories under Workspace, System States, Interactions, Analytics, Image Inspector, Dataset Details, Workflows, and Responsive.
- **Class Management stories are purpose-grouped.** Its 24 stories cover Workspace, System States, Interactions, Reference Image, Workflows, Image Inspector, and Model Mapping without hiding distinct states behind a generic showcase.
- **Class Management controls are executable contracts.** Class, dataset, image, reference, lifecycle, and mapping changes update deterministic scene state and report explicit Action payloads.
- **Create Project stories are purpose-grouped.** Its 5 stories cover Workspace, System States, and Workflows. Former static Filled/Validation exports are represented by executable creation and cancellation flows without losing submission or server-error states.
- **Create Project controls are executable contracts.** Field, project-type, image-upload, submit, and cancel callbacks update deterministic form state and report 7 explicit Action payloads.
- **Settings Modal stories are purpose-grouped.** Its 33 stories cover General, Account, Project, Edge, Organization, Devices, and Storage; exact duplicates and reproducible static states are represented by executable workflows instead of parallel exports.
- **Settings controls are executable contracts.** Preferences, password validation, project grouping/permissions, Edge export selection, invitation search, device management, and storage report requests update deterministic state and report explicit Action payloads.
- **Dashboard stories are purpose-grouped.** Its 16 stories cover Workspace, System States, Interactions, Layouts, Layout Studies, and Integrations. The exact default-layout duplicate and reproducible open/subset/applied states are absorbed into canonical stories or executable workflows.
- **Dashboard controls are executable contracts.** Widget visibility, deterministic date range, PDF/widget export, layout reset, pointer drag, and direct arrow-key reorder callbacks preserve controlled state and report 10 explicit Action payloads. Compact Masonry and Sectioned Grid remain discoverable as isolated studies, not production defaults.
- **Addon panels are part of the contract.** Controls expose only scenarios relevant to the selected group; callback args are explicit Action spies; representative flows use named Interaction steps; all six Platform product areas opt into blocking a11y checks.
- **Canonical review IDs are stable downstream contracts.** Auth uses `pages-platform-0-0-1-auth-login-workspace--overview` and `pages-platform-0-0-1-auth-signup-workspace--overview`; Create Project uses `pages-platform-0-0-1-create-project-workspace--overview`; Dashboard uses `pages-platform-0-0-1-dashboard-workspace--overview`. Probes, visual targets, handoff metadata, and external reports must migrate with these IDs.
- **Catalog responsive props are discriminated.** Mobile builders must provide mobile state, omit desktop-only sidebar/stats props, and normalize `stats` to a supported `grid | table` mode.
- **Class Management does not claim a mobile workspace.** The source contract defines a three-column desktop workspace; use the collapsed layout at constrained laptop/tablet widths and narrow status stories until a mobile shell is designed.

## Probes

Playwright smoke probes for each page live in [`tests/probes/`](../../../../tests/probes/). They verify each scenario renders without console errors.

```bash
node tests/probes/create-project.mjs   # 5 grouped stories
node tests/probes/auth.mjs             # 10 grouped stories + 2 responsive checks
node tests/probes/class-manage.mjs     # 16 scenarios
node tests/probes/catalog.mjs          # 22 scenarios
node tests/probes/settings-modal.mjs   # 18 scenarios
node tests/probes/dashboard.mjs        # 16 grouped stories
```

The six probes cover 89 cases in total.

## Related docs

- [MIGRATION.md](./MIGRATION.md) — source/target code comparison, API adapters, coverage, and verification contract
- [platform-pages-package-plan.md](../../../../docs/plan/platform-pages-package-plan.md) — high-level architecture
- [platform-pages-extraction-roadmap.md](../../../../docs/plan/platform-pages-extraction-roadmap.md) — phase-by-phase execution plan
- [platform-pages-usage.md](../../../../docs/plan/platform-pages-usage.md) — consumer guide (ingradient-platform side)
