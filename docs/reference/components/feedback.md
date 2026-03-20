# Feedback

## Import

```ts
import {
  Alert,
  EmptyState,
  LoadingState,
  ProgressBar,
  ProgressBlock,
  Skeleton,
  Badge,
  Chip,
  StatusPill,
} from '@ingradient/ui/components'
```

## What It Covers

- message feedback
- loading state
- empty state
- progress state
- small metadata and status indicators

## When To Use

- 작업 결과를 알려줄 때
- 비어 있는 상태를 설명할 때
- 로딩 중인 이유를 보여줄 때
- 상태 tone을 짧게 붙일 때

## Choosing The Right Component

- `Alert`
  - semantic message banner
- `EmptyState`
  - 데이터가 없을 때
- `LoadingState`
  - 비동기 준비 중일 때
- `ProgressBar` / `ProgressBlock`
  - 진행 상황 표시
- `Skeleton`
  - 실제 콘텐츠 자리 placeholder
- `Badge` / `Chip` / `StatusPill`
  - 작은 상태 또는 메타 정보

## Do

- empty state에는 다음 행동을 같이 준다
- loading과 error를 분리한다

## Don’t

- 모든 상태를 progress 하나로 합치지 않는다
- critical warning을 작은 chip으로 축소하지 않는다
