# NumberField

중간 입력 상태를 draft string으로 유지하고, blur/Enter 시 clamp하는 숫자 입력.

## Import

```tsx
import { NumberField } from '@ingradient/ui/components'
```

## Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `value` | `number` | — | 현재 값 |
| `onChange` | `(v: number) => void` | — | 값 변경 |
| `min` | `number` | — | 최솟값 |
| `max` | `number` | — | 최댓값 |
| `step` | `number` | `1` | ArrowUp/Down 증감 단위 |
| `format` | `(v: number) => string` | — | 표시 형식 (예: `v => v + '%'`) |

## When to use

- 카메라 파라미터, 설정값 등 범위가 있는 숫자 입력
- 일반 `<input type="number">` 대신 draft → commit 패턴이 필요할 때
