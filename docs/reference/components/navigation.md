# Navigation

## Import

```ts
import { Breadcrumbs, Pagination, Stepper, Tabs } from '@ingradient/ui/components'
```

## What It Covers

- `Breadcrumbs`
- `Pagination`
- `Stepper`
- `Tabs`

## When To Use

- 위치 경로를 보여주고 싶을 때
- 긴 목록을 페이지 단위로 나눌 때
- multi-step flow 진행 상태를 보여줄 때
- 상위/하위 섹션 전환이 필요할 때

## Choosing The Right Component

### Breadcrumbs

- 현재 위치 경로 표시
- hierarchy가 있는 정보 구조

### Pagination

- 페이지 번호 이동
- 많은 row/card를 분할해 보여줄 때

### Stepper

- 순차적인 단계 흐름
- 완료/현재/대기 상태 구분

### Tabs

- 같은 레벨의 전환
- `pill` 또는 `underline`

## Most Important Prop

- `items`
  - navigation 항목 목록
- `value`
  - 현재 active 값
- `onChange`
  - 사용자 선택 처리

## Do

- 같은 화면 안에서는 동일한 navigation 패턴을 유지한다
- top-level tab은 `underline`을 우선 고려한다

## Don’t

- 같은 역할의 navigation을 화면마다 새로 구현하지 않는다
