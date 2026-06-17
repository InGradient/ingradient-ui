# Icons

## Import

```ts
import { IconGallery, icons } from '@ingradient/ui/components'
```

## What It Is

navigation, status, media, workspace action에 쓰는 curated icon registry다.

## When To Use

- 새 icon이 필요할 때
- 기존 action language를 유지하고 싶을 때
- Storybook에서 icon 후보를 확인할 때

## Main Building Blocks

- `icons`
  - registry map
- `IconGallery`
  - 문서용 preview

## Common Composition

- `Button + icon`
- `IconButton + icon`
- `Navigation item + icon`

## Do

- 새 화면도 registry icon부터 검토한다

## Don’t

- 같은 의미의 icon을 여러 스타일로 중복 추가하지 않는다

## Related Docs

- [button.md](./button.md)
- [navigation.md](./navigation.md)
