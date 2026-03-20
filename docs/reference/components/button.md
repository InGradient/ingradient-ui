# Button

## Import

```ts
import { Button, IconButton } from '@ingradient/ui/components'
```

## What It Is

가장 기본적인 action trigger다. primary, secondary, accent, icon action을 공통 규칙으로 제공한다.

## When To Use

- 저장, 생성, 적용, 열기 같은 명확한 action
- toolbar나 dialog footer의 primary/secondary action
- icon-only control이 필요한 작은 action

## Main Props

- `variant?: 'solid' | 'secondary' | 'accent'`
- `size?: 'sm' | 'md' | 'lg'`
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

## Do

- action hierarchy를 variant로 표현한다
- icon-only action은 `IconButton`을 쓴다

## Don’t

- 링크 역할을 버튼으로 대체하지 않는다
- feature마다 별도 button shell을 만들지 않는다
