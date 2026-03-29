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
| `parse` | `(s: string) => number` | — | 커스텀 파서 함수. format과 쌍으로 사용 |

## Visual Spinner Buttons

- 네이티브 `<input type="number">` 스피너는 CSS로 숨긴다
- 대신 커스텀 +/- 버튼을 필드 양쪽에 표시한다
- 버튼 클릭 시 `step` 단위로 값이 증감한다

## When to use

- 카메라 파라미터, 설정값 등 범위가 있는 숫자 입력
- 일반 `<input type="number">` 대신 draft → commit 패턴이 필요할 때
