# @ingradient/platform-pages

`@ingradient/platform-pages` owns controlled React views and product-domain UI composition for Ingradient Platform. It is a sibling package of `@ingradient/ui`: reusable visual building blocks stay in the root package, while Platform-specific page structure and terminology live here.

## Public areas

The package root exports seven areas:

- `auth` — `LoginView`, `SignupView`, and controlled form contracts
- `catalog` — responsive `CatalogView` and its public prop/data/state types
- `class-manage` — class workspace, reference, mapping, and inspector composition
- `create-project` — controlled project-creation form view
- `dashboard` — dashboard view, widget layout, and integration sections
- `image-detail` — Platform image-detail panels shared by page composition
- `settings-modal` — General, Account, Project, Edge, Organization, Devices, and Storage composition

Consumers import from the package root:

```tsx
import {
  CatalogView,
  DashboardView,
  LoginView,
  SettingsModalView,
  SignupView,
} from '@ingradient/platform-pages'
```

Domain-owned implementation rows, dialogs, toolbars, sidebars, and gallery internals are not automatically public. Export only the view and the controlled data/state types a consumer needs to construct its props.

## Ownership boundary

This package owns:

- Platform-specific view composition and copy
- controlled value/state props
- user-event callbacks
- product-domain layout and responsive shells
- stable accessibility and automation attributes

This package does not own:

- router or URL policy
- API/query/mutation implementations
- global store or server cache
- authentication session and permission decisions
- Storybook fixtures or scenario state

The consuming application resolves product data and policy, then passes values and callbacks into these views.

## Layer and dependency rules

```text
@ingradient/ui tokens + primitives + components + patterns
  → @ingradient/platform-pages controlled product views
  → consumer application router, services, and state
```

- Never import `stories/**` or fixture modules from this package.
- Do not import `@ingradient/edge-pages`; the two page packages share only `@ingradient/ui`.
- Keep package root exports intentional. Internal cross-domain implementations may use relative imports until a stable public boundary is designed.
- Preserve existing `data-ig-component`, `data-ig-layer`, and other automation hooks when refactoring.

## Storybook contract

Operational stories are thin adapters around package views. Fixtures and deterministic runtimes live under [`stories/pages/platform/0.0.1`](../../stories/pages/platform/0.0.1/README.md), where six product areas currently expose 128 stories across 37 purpose groups.

Every public page contract should keep these layers synchronized:

1. controlled package view and public types
2. scenario fixture and deterministic reset behavior
3. scoped Controls and explicit Actions
4. named Interaction workflow where behavior is meaningful
5. blocking accessibility for the Platform page stories
6. static production probe and canonical visual target
7. README, migration mapping, and downstream story IDs

Canonical entries and detailed counts are maintained in the [Platform Story Contract](../../stories/pages/platform/0.0.1/README.md). Migration mappings and evidence are in [MIGRATION.md](../../stories/pages/platform/0.0.1/MIGRATION.md).

## Validation

From the repository root:

```bash
npx tsc --noEmit
npm run test:unit
npm run build:package
npm run build:storybook
```

For affected UI, also run focused Storybook MCP tests and the relevant script under `tests/probes/`. Visual snapshots use Linux baselines; never approve a Darwin capture as a substitute.

## Focused boundary notes

- [Catalog public/responsive boundary](./src/catalog/README.md)
- [Design contract](../../DESIGN.md)
- [Components vs patterns](../../docs/reference/components-vs-patterns.md)
