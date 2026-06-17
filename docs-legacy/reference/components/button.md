# Button

## Import

```ts
import { Button, IconButton } from '@ingradient/ui/components'
```

## What It Is

가장 기본적인 action trigger다. primary, secondary, accent, destructive, icon action을 공통 규칙으로 제공한다.

## When To Use

- 저장, 생성, 적용, 열기 같은 명확한 action
- toolbar나 dialog footer의 primary/secondary action
- icon-only control이 필요한 작은 action

## Main Props

- `variant?: 'solid' | 'secondary' | 'accent'`
- `size?: 'sm' | 'md' | 'lg'` — `--ig-control-height-sm/md/lg` 토큰 사용
- `tone?: 'default' | 'danger'` — `tone="danger"`는 빨간 배경 + 흰 텍스트
- `leadingIcon?: ReactNode`
- `trailingIcon?: ReactNode`
- `children: ReactNode`

## Variants

- `solid`
  - 기본 primary action
- `secondary`
  - 보조 action
- `accent`
  - 강조가 필요한 action
- `tone="danger"`
  - 삭제, 제거, 취소 불가 action 같은 destructive 흐름
  - Delete, Remove, Revoke 등의 action에 사용한다

## IconButton 레이아웃

`IconButton`은 `$iconOnly` 모드로 렌더링되어 정사각형 레이아웃이 자동 적용된다:
- `width = height` (size 토큰과 동일)
- `padding: 0`
- 아이콘이 중앙 정렬됨

소비자에서 `width`/`height`/`padding`을 override할 필요 없다.

## Do

- action hierarchy를 variant로 표현한다
- destructive action은 `tone="danger"`로 통일한다
- icon-only action은 `IconButton`을 쓴다

## Don’t

- 링크 역할을 버튼으로 대체하지 않는다
- feature마다 별도 red button shell을 만들지 않는다
