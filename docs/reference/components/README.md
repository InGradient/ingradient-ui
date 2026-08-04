# Components Reference

`src/components`는 `@ingradient/ui/components`의 현재 구현과 public barrel을 가진다. 이 문서는 개별 파일의 고정 inventory가 아니라 유지해야 할 layer contract와 탐색 경로를 설명한다.

## Contract

A component is a generic UI building block:

- 제품 문맥 없이 독립적으로 import할 수 있다.
- props, state, size, tone, variant가 public contract의 중심이다.
- API, router, global store, permission, persistence를 알지 않는다.
- 제품 row/dialog/page state shape를 알게 되면 page package boundary를 검토한다.

## Current source areas

- [`charts`](../../../src/components/charts/) — chart labels, legends, tooltips, responsive helpers
- [`data-display`](../../../src/components/data-display/) — cards, tables, selectable rows/cells, information and layout units
- [`feedback`](../../../src/components/feedback/) — alert, badge, progress, spinner, status feedback
- [`inputs`](../../../src/components/inputs/) — form controls and field-level interaction
- [`navigation`](../../../src/components/navigation/) — generic tabs and navigation controls
- [`overlays`](../../../src/components/overlays/) — dialog, popover, tooltip, and overlay primitives
- [`icons`](../../../src/components/icons/) — package icon registry

The public source barrel is [`src/components/index.ts`](../../../src/components/index.ts). A file's existence does not make it public; update the barrel deliberately.

## Representative current components

- [`Table<T>`](../../../src/components/data-display/table.tsx) — generic rows, optional `getRowKey`, drag/reorder contract
- [`SelectableListItem`](../../../src/components/data-display/selectable-list-item.tsx) — generic selected-row semantics
- [`GridContainer`](../../../src/components/data-display/grid-container.tsx) — generic responsive grid
- [`DialogShell`](../../../src/components/overlays/dialog-shell.tsx) — labelled generic dialog structure
- [`KeyboardShortcutHint`](../../../src/components/data-display/keyboard-shortcut-hint.tsx) — keyboard affordance display

## Boundary with patterns and pages

```text
components → patterns → platform-pages / edge-pages → consumer apps
```

- Reusable composition/rhythm belongs in `src/patterns`.
- Platform/Edge terminology and domain state belong in the corresponding page package.
- Storybook page stories consume page views; they do not move product composition back into components.

See [Components Vs Patterns](../components-vs-patterns.md), [`src/components/README.md`](../../../src/components/README.md), and the [`@ingradient/platform-pages` contract](../../../packages/platform-pages/README.md).

## Documentation and validation

- Component stories document meaningful variants and states near the source.
- Unit tests protect behavior and accessibility semantics.
- Public export changes require Storybook/doc coverage updates.
- Product integration behavior is validated in the Platform/Edge page contracts rather than duplicated here.
