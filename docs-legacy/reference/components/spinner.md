# Spinner

## Import

```ts
import { Spinner } from '@ingradient/ui/components'
```

## What It Is

단일 CSS 회전 인디케이터로 진행 중임을 나타내는 최소 로딩 표시 컴포넌트다.

## When To Use

- 버튼 내부에서 submit/save 중임을 나타낼 때
- inline 비동기 action이 처리 중일 때
- Skeleton이나 ProgressBar를 쓰기에 너무 좁은 소형 로딩 영역

## Main Props

- `size?: 'sm' | 'md' | 'lg'` — 지름 (sm=14px, md=18px, lg=24px). 기본값 `md`
- `tone?: 'accent' | 'white' | 'muted'` — 색상 (accent=브랜드, white=text-primary, muted=text-soft). 기본값 `accent`
- `aria-label?: string` — 스크린리더 설명. 기본값 `'Loading'`

## Common Composition

- `Button + Spinner` — 버튼 레이블 앞에 배치
- `Inline + Spinner + Text` — 인라인 상태 표시

## Do

- 버튼 로딩에는 sm 또는 md를 쓴다
- aria-label에 "Saving changes"처럼 구체적인 설명을 넣으면 접근성이 높아진다

## Don't

- 전체 페이지 로딩 fallback을 Spinner 하나로 처리하지 않는다 (LoadingState 사용)
- progress 값이 있는 작업에 Spinner를 쓰지 않는다 (ProgressBar 사용)

## Related Docs

- [progress.md](./progress.md)
- [feedback.md](./feedback.md)
- [empty-loading.md](./empty-loading.md)
