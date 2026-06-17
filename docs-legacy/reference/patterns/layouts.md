# Layout Patterns

## Import

```ts
import {
  SplitLayout,
  SplitPanelShell,
  InspectorLayout,
  SettingsShell,
  DashboardGrid,
  ListDetailLayout,
} from '@ingradient/ui/patterns'
```

## What It Covers

- multi-pane layouts
- dashboard grids
- master-detail layouts
- settings / inspector families

## Choosing The Right Pattern

- `SplitLayout`
  - sidebar + main + inspector
- `SplitPanelShell`
  - two-panel split
- `InspectorLayout`
  - main + inspector
- `SettingsShell`
  - menu + content
- `DashboardGrid`
  - widget grid
- `ListDetailLayout`
  - list + detail

## When To Use

- 여러 열 구조가 반복될 때
- settings / inspector / browser / dashboard 화면

## Do

- 레이아웃 문제는 먼저 pattern에서 찾는다
- 같은 화면군은 같은 layout family를 유지한다

## Don’t

- 페이지마다 custom grid template를 새로 만들지 않는다
