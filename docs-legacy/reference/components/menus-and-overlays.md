# Menus & Overlays

## Import

```ts
import {
  MenuPopover,
  HoverCard,
  SectionPanel,
  ActionBar,
  ModalBackdrop,
  CompactModalCard,
} from '@ingradient/ui/components'
```

## What It Is

full dialog보다 작은 overlay와 supporting block을 조합하는 문서다.

## When To Use

- contextual actions
- hover detail
- compact supporting panel
- small modal primitives

## Main Building Blocks

- `MenuPopover`
- `HoverCard`
- `SectionPanel`
- `ActionBar`
- `CompactModalCard`

## Common Composition

- `ActionBar + MenuPopover`
- `ImageGrid item + HoverCard`
- `CompactModalCard + Button actions`

## Do

- 작은 interaction은 menu/popover부터 고려한다

## Don’t

- 작은 contextual action을 매번 full dialog로 만들지 않는다

## Related Docs

- [dialog-shell.md](./dialog-shell.md)
- [drawer.md](./drawer.md)
