# Overlays

## Import

```ts
import {
  DialogShell,
  ConfirmDialog,
  Drawer,
  MenuPopover,
  HoverCard,
  TooltipBubble,
  SectionPanel,
  ActionBar,
} from '@ingradient/ui/components'
```

## What It Covers

- dialog
- drawer
- menu popover
- hover card
- tooltip
- overlay-adjacent support blocks

## When To Use

- 화면 위에 집중된 결정을 요구할 때
- supporting context를 옆에서 보여줄 때
- contextual action을 작게 띄울 때

## Choosing The Right Overlay

- `DialogShell`
  - confirm, short form
- `ConfirmDialog`
  - opinionated confirm flow
- `Drawer`
  - secondary side context
- `MenuPopover`
  - contextual actions
- `HoverCard`
  - richer hover context
- `TooltipBubble`
  - 짧은 설명

## Do

- 작은 contextual action은 menu/popover부터 고려한다
- supporting context는 drawer를 쓴다

## Don’t

- 긴 workflow를 작은 dialog에 넣지 않는다
- tooltip에 중요한 경고를 숨기지 않는다
