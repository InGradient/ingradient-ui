# Empty & Loading

## Import

```ts
import { EmptyState, LoadingState } from '@ingradient/ui/components'
```

## What It Is

비어 있음과 loading 상태를 설명 가능한 surface로 만드는 fallback component다.

## When To Use

- 아직 데이터가 없을 때
- 비동기 로딩 중일 때
- 빈 화면에 다음 행동을 안내해야 할 때

## Main Props

- `title?`
- `description?`
- `actions?`

## Common Composition

- `PageContent + EmptyState`
- `Panel + LoadingState`
- `Table area + EmptyState`

## Do

- 빈 상태 이유와 다음 행동을 같이 제공한다

## Don’t

- 이유 없는 blank state를 남기지 않는다

## Related Docs

- [alert.md](./alert.md)
- [progress.md](./progress.md)
