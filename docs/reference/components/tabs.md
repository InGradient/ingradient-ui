# Tabs

## Import

```ts
import { Tabs } from '@ingradient/ui/components'
```

## What It Is

상위 전환, segmented control, underline tab을 공통 animation과 tone으로 제공하는 navigation component다.

## When To Use

- top-level section switching
- card 내부의 compact segmented content
- settings나 detail view의 sub-section 전환

## Main Props

- `items: Array<{ value: string; label: string }>`
- `value: string`
- `onChange: (value: string) => void`
- `variant?: 'pill' | 'underline'`

## Variants

- `pill`
  - compact segmented control
- `underline`
  - top-level tab navigation

## Notes

- active highlight는 위치와 폭이 부드럽게 이동한다
- underline variant는 상위 탭 이동에 기본 사용한다

## Do

- 같은 탭군에는 같은 variant를 유지한다
- 상위 탭은 `underline`을 기본으로 고려한다

## Don’t

- 화면마다 별도 탭 animation을 다시 구현하지 않는다
