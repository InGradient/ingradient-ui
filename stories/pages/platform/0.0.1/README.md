# pages/platform/0.0.1

Storybook stories for the 5 platform pages — **CreateProject / ClassManage / Catalog / SettingsModal / Dashboard** — plus 2 auth pages (Login / Signup).

## Architecture

Page-level JSX has been extracted to `@ingradient/platform-pages` (workspace package at [`packages/platform-pages/`](../../../../packages/platform-pages/)). Stories here are **thin orchestrators**:

- Each `*.stories.tsx` imports the corresponding view from `@ingradient/platform-pages` and renders it with mock props.
- Mock state hooks (`use-*-scene.ts`) live alongside each story for scenario state.
- Prop builders (`build-*-view-props.tsx`) convert scene state + fixtures into view props.

The same view is imported by `ingradient-platform` (Phase 7 of the extraction roadmap) with real hook results — see [`docs/plan/platform-pages-usage.md`](../../../../docs/plan/platform-pages-usage.md).

## File layout

```
0.0.1/
├─ auth/                          # Login / Signup stories (in own folder)
├─ Catalog.stories.tsx            # imports CatalogView
├─ ClassManage.stories.tsx        # imports ClassManageView
├─ CreateProject.stories.tsx      # imports CreateProjectView
├─ Dashboard.stories.tsx          # imports DashboardView
├─ SettingsModal.stories.tsx      # imports SettingsModalView
├─ catalog/                       # Catalog story helpers
│  ├─ use-catalog-scene.ts        # scene state hook
│  ├─ build-view-props.tsx        # props converter
│  ├─ build-overlays.ts           # overlays sub-builder
│  ├─ build-stats-content.tsx     # stats slot JSX
│  ├─ mock-dashboard.ts           # chart mock data
│  └─ mock-detail.ts              # detail modal mock data
├─ class/                         # ClassManage story helpers
│  └─ use-class-manage-scene.ts
├─ dashboard/                     # Dashboard story helpers
│  ├─ use-dashboard-scene.ts
│  └─ build-widgets.tsx
└─ settings/                      # SettingsModal story helpers
   ├─ use-settings-modal-scene.ts
   ├─ build-view-props.tsx
   ├─ build-admin-props.tsx
   └─ build-storage-slots.tsx
```

## Conventions

- **Story file must stay < 200 lines.** Helper logic goes into the helper folder.
- **No direct UI pattern composition in stories.** Stories must only render the view from `@ingradient/platform-pages` — verified by Phase 6 grep (see [phase-6 spec](../../../../docs/plan/platform-pages-phase-6-spec.md)).
- **Fixture imports are story-only.** Views in `@ingradient/platform-pages` never import from `stories/fixtures/`.

## Probes

Playwright smoke probes for each page live in [`tests/probes/`](../../../../tests/probes/). They verify each scenario renders without console errors.

```bash
node tests/probes/create-project.mjs   # 5 scenarios
node tests/probes/class-manage.mjs     # 7 scenarios
node tests/probes/catalog.mjs          # 18 scenarios
node tests/probes/settings-modal.mjs   # 18 scenarios
node tests/probes/dashboard.mjs        # 8 scenarios
```

## Related docs

- [MIGRATION.md](./MIGRATION.md) — source/target code comparison, API adapters, coverage, and verification contract
- [platform-pages-package-plan.md](../../../../docs/plan/platform-pages-package-plan.md) — high-level architecture
- [platform-pages-extraction-roadmap.md](../../../../docs/plan/platform-pages-extraction-roadmap.md) — phase-by-phase execution plan
- [platform-pages-usage.md](../../../../docs/plan/platform-pages-usage.md) — consumer guide (ingradient-platform side)
