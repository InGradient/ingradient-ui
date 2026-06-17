# Progress & Skeleton

## Import

```ts
import { ProgressBar, ProgressBlock, Skeleton } from '@ingradient/ui/components'
```

## What It Is

로딩 placeholder와 진행 상태를 같은 시각 언어로 보여주는 feedback set이다.

## When To Use

- loading placeholder
- download or processing progress
- long-running task status

## Main Props

- `value?`
- `label?`
- `height?`
- `width?`

## Common Composition

- `Panel + ProgressBlock`
- `Table row + ProgressBar`
- `LoadingState + Skeleton`

## Do

- 설명이 필요한 진행은 `ProgressBlock`을 쓴다
- 자리를 유지해야 하는 loading에는 `Skeleton`을 쓴다

## Don’t

- 실패 상태를 progress로 감추지 않는다

## Related Docs

- [feedback.md](./feedback.md)
- [alert.md](./alert.md)
