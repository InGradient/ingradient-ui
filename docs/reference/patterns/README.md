# Patterns Reference

`src/patterns` contains reusable composition, shell, and UX rhythm built from primitives and components. This document replaces the former per-file inventory, which became stale after product-domain extraction.

## Contract

A pattern:

- combines generic components into a reusable structure or workflow rhythm;
- exposes slots and controlled callbacks rather than product services;
- remains reusable without knowing Platform/Edge-specific entities;
- does not own API, router, global store, permission, or persistence.

## Current source areas

- [`annotation`](../../../src/patterns/annotation/) — drawing and image-inspection composition
- [`cards`](../../../src/patterns/cards/) — composed metric/card structures
- [`charts`](../../../src/patterns/charts/) — chart card and container composition
- [`comment`](../../../src/patterns/comment/) — reusable comment flow composition
- [`dialogs`](../../../src/patterns/dialogs/) — reusable media/data dialog composition
- [`filters`](../../../src/patterns/filters/) — filtering and sorting flows
- [`forms`](../../../src/patterns/forms/) — grouped form and settings composition
- [`gallery`](../../../src/patterns/gallery/) — generic image-grid composition
- [`layouts`](../../../src/patterns/layouts/) — reusable layout rhythm
- [`navigation`](../../../src/patterns/navigation/) — shell/sidebar composition
- [`page`](../../../src/patterns/page/) — generic page shell and primary header
- [`status`](../../../src/patterns/status/) — reusable status composition

The public source barrel is [`src/patterns/index.ts`](../../../src/patterns/index.ts). Keep exports intentional and avoid re-exporting product-owned wrappers.

## Representative current patterns

- [`PageShell`](../../../src/patterns/page/page-shell.tsx)
- [`PagePrimaryHeader`](../../../src/patterns/page/page-primary-header.tsx)
- [`SidebarShell`](../../../src/patterns/navigation/sidebar-shell.tsx)
- [`ImageGrid`](../../../src/patterns/gallery/image-grid.tsx)
- [`ChartContainer`](../../../src/patterns/charts/chart-container.tsx)
- [`MediaDialogShell`](../../../src/patterns/dialogs/media-dialog-shell.tsx)

## Product-domain extraction

Product-owned composition such as Catalog datasets/gallery controls, Class Management sidebars, Dashboard product widgets, Settings sections, and Auth forms belongs in `@ingradient/platform-pages`. Equivalent Edge composition belongs in `@ingradient/edge-pages`.

```text
tokens → primitives → components → patterns
  → platform-pages / edge-pages
  → consumer application state and services
```

Do not restore removed `src/patterns/shells/*` paths merely to match a historical inventory. Use current package exports and consult the dated audit ledger only for decision history.

See [Components Vs Patterns](../components-vs-patterns.md), [`src/patterns/README.md`](../../../src/patterns/README.md), and the [`@ingradient/platform-pages` contract](../../../packages/platform-pages/README.md).

## Storybook and validation

- Pattern stories show reusable composition and meaningful state combinations.
- Operational Platform page stories render package-owned views with fixtures/runtime.
- A pattern export change should update its stories and active docs.
- A page contract change should migrate Controls, Actions, workflows, probes, visual IDs, and migration docs together.
