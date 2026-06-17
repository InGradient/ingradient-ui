# Dashboard Grid

## Import

```ts
import { DashboardGrid, Panel, PanelHeader, PanelTitle, PanelHint } from '@ingradient/ui/patterns'
```

## What It Is

metric card와 widget panel을 반응형 grid로 배치하는 dashboard layout이다.

## When To Use

- analytics dashboard
- operational summary
- status widget board

## Main Building Blocks

- `DashboardGrid`
- `Panel`
- `PanelHeader`
- `PanelTitle`
- `PanelHint`

## Common Composition

- `DashboardGrid + StatCard + charts`
- `Panel + Table`

## Do

- widget spacing rhythm을 grid 패턴에 맡긴다

## Don’t

- widget마다 다른 outer spacing을 주어 rhythm을 깨지 않는다

## Related Docs

- [../components/charts.md](../components/charts.md)
- [../components/workspace-blocks.md](../components/workspace-blocks.md)
