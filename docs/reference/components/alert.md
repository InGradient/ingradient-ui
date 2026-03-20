# Alert

## Import

```ts
import { Alert } from '@ingradient/ui/components'
```

## What It Is

success, warning, info, danger 같은 semantic feedback banner다.

## When To Use

- 작업 결과 통지
- 주의가 필요한 상태 설명
- inline message

## Main Props

- `tone?`
- `title?`
- `children`

## Common Composition

- `FormSection + Alert`
- `DialogShell + Alert`
- `PageContent + Alert`

## Do

- 메시지 의미에 맞는 semantic tone을 선택한다

## Don’t

- 긴 가이드를 alert 하나에 다 넣지 않는다

## Related Docs

- [empty-loading.md](./empty-loading.md)
- [progress.md](./progress.md)
