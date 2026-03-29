# Table

## Import

```ts
import { Table, DataGrid } from '@ingradient/ui/components'
```

## What It Is

단순 column/row 기반 목록, metadata table, 비교 표에 쓰는 기본 data-view component다.

## When To Use

- 템플릿 목록
- metadata 표
- 비교 표
- 단순 운영 리스트

## Main Props

- `columns: Array<{ key; header; render }>`
- `rows: T[]`

## Notes

- `Table`과 `DataGrid`는 현재 같은 구현을 공유한다
- 고급 grid framework가 아니라 표현 계층의 기본 시작점이다
- `table-layout: fixed`가 기본 적용된다 — 행 확장/축소 시 컬럼 너비가 흔들리지 않는다

## Do

- 표가 단순하면 먼저 `Table`로 시작한다
- 셀 표현은 `render(row)`에서 조합한다

## Don’t

- sorting, pinning, editing, virtualization 같은 복잡한 behavior를 바로 core table에 넣지 않는다
