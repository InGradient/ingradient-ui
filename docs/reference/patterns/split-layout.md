# Split Layout

## Import

```ts
import { SplitLayout, SplitPanelShell, InspectorLayout } from '@ingradient/ui/patterns'
```

## What It Is

sidebar, main, inspector를 조합하는 multi-pane layout family다.

## When To Use

- browser-like workspace
- catalog-like layout
- inspector-heavy operational screen

## Main Building Blocks

- `SplitLayout`
- `SplitPanelShell`
- `InspectorLayout`

## Common Composition

- `SplitLayout + SidebarNav + ImageGrid + SectionPanel`
- `InspectorLayout + Table + detail panel`

## Do

- 열 구조가 반복되면 split family를 사용한다

## Don’t

- 페이지마다 custom grid template를 다시 만들지 않는다

## Related Docs

- [layouts.md](./layouts.md)
- [../components/image-grid.md](../components/image-grid.md)
