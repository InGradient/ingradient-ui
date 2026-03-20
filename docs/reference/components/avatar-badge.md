# Avatar & Badge

## Import

```ts
import { Avatar, Badge, Chip, StatusPill } from '@ingradient/ui/components'
```

## What It Is

identity, small metadata, semantic status를 compact하게 표현하는 display 묶음이다.

## When To Use

- user identity 표시
- 작은 상태나 메타 label
- dense operational screen의 짧은 tag

## Main Props

- `children?`
- `$tone?`
- `src?`
- `alt?`

## Common Composition

- `AssignmentRow + Chip`
- `Table cell + StatusPill`
- `Top bar + Avatar`

## Do

- semantic status는 `StatusPill`을 우선 쓴다
- 중립 metadata는 `Badge`나 `Chip`으로 표현한다

## Don’t

- 브랜드 표기를 Avatar로 대체하지 않는다

## Related Docs

- [../foundations.md](../foundations.md)
- [workspace-blocks.md](./workspace-blocks.md)
