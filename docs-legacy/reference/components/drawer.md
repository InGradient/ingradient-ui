# Drawer

## Import

```ts
import { Drawer } from '@ingradient/ui/components'
```

## What It Is

보조 정보와 secondary workflow를 옆에서 여는 side sheet다.

## When To Use

- settings side panel
- filter panel
- supporting context
- mobile navigation fallback

## Main Props

- `open`
- `onClose?`
- `children`

## Common Composition

- `Drawer + FormSection`
- `Drawer + Filter controls`
- `MobileNavDrawer + Sidebar content`

## Do

- supporting context를 화면 흐름 옆에 둔다

## Don’t

- 짧은 confirm flow를 drawer로 대체하지 않는다

## Related Docs

- [dialog-shell.md](./dialog-shell.md)
- [menus-and-overlays.md](./menus-and-overlays.md)
