# Empty & Loading

## Import

```ts
import { EmptyState, LoadingState } from '@ingradient/ui/components'
import { stateCenteredLayout, stateDescriptionText, stateTitleText } from '@ingradient/ui/primitives'
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

## State Text Recipes

- `stateTitleText`
  - empty / loading 상태의 대표 문구에 사용한다
  - `--ig-font-size-state-title`, `--ig-font-weight-state-title`, `--ig-color-state-title`
- `stateDescriptionText`
  - 대표 문구 아래의 보조 설명에 사용한다
  - `--ig-font-size-state-description`, `--ig-line-height-state-description`, `--ig-color-state-description`
- `stateCenteredLayout`
  - 영역 전체를 대체하는 empty / loading 상태를 가로·세로 중앙에 배치한다

페이지별로 상태 문구의 font size와 color를 다시 선언하지 않는다.

## Do

- 빈 상태 이유와 다음 행동을 같이 제공한다

## Don’t

- 이유 없는 blank state를 남기지 않는다

## Related Docs

- [alert.md](./alert.md)
- [progress.md](./progress.md)
