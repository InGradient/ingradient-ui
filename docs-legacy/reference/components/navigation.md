# Navigation

## Import

```ts
import { Breadcrumbs, Pagination, Stepper, Tabs, VerticalTabs } from '@ingradient/ui/components'
```

## What It Covers

- `Breadcrumbs`
- `Pagination`
- `Stepper`
- `Tabs`
- `VerticalTabs`

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

### VerticalTabs

- settings 같은 좌측 rail 전환
- badge가 붙는 left navigation
- animated active highlight
- `radius="sm" | "md" | "lg"`로 rail의 모서리 강도를 조절
  - settings처럼 더 각진 rail은 `xs`

## Most Important Prop

- `items`
  - navigation 항목 목록
- `value`
  - 현재 active 값
- `onChange`
  - 사용자 선택 처리
- `radius`
  - settings rail은 `xs`
  - 일반 left navigation은 `md`

## Do

- 같은 화면 안에서는 동일한 navigation 패턴을 유지한다
- top-level tab은 `underline`을 우선 고려한다
- settings left rail은 `VerticalTabs`를 우선 고려한다
- settings left rail은 너무 둥글지 않게 `radius="xs"`부터 본다

## Don’t

- 같은 역할의 navigation을 화면마다 새로 구현하지 않는다
- settings 왼쪽 메뉴를 로컬 styled button 묶음으로 다시 만들지 않는다
