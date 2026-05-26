# Tooltip

## Import

```ts
import { TooltipBubble } from '@ingradient/ui/components'
```

## What It Is

dense UI에서 짧은 설명과 context hint를 주는 compact overlay다.

## When To Use

- icon-only control 설명
- 잘린 텍스트 보조 설명
- 짧은 usage hint

## Main Props

- `children`
- `position?`

## Common Composition

- `IconButton + TooltipBubble`
- `Status icon + TooltipBubble`

## Do

- 짧고 즉시성 있는 설명에만 쓴다

## Don’t

- 긴 문단이나 중요한 경고를 tooltip에 숨기지 않는다

## Related Docs

- [menus-and-overlays.md](./menus-and-overlays.md)
