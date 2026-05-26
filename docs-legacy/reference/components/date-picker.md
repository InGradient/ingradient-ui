# DatePickerField

## Import

```ts
import { DatePickerField } from '@ingradient/ui/components'
```

## What It Is

날짜를 선택하는 커스텀 달력 컴포넌트. 네이티브 date input 대신 사용한다.

## When To Use

- 날짜 입력이 필요할 때
- From/To 범위, 만료일, 유효기간 등

## Main Props

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `value` | `string` | — | 선택된 날짜 값 |
| `onChange` | `(value: string) => void` | — | 날짜 변경 콜백 |
| `placeholder` | `string` | `'Select date'` | 플레이스홀더 텍스트 |
| `disabled` | `boolean` | `false` | 비활성 상태 |

## Do

- From/To 범위, 만료일, 유효기간 등 날짜 입력에 사용한다
- 네이티브 date input 대신 이 컴포넌트를 사용한다

## Don't

- 시간 선택이 필요한 경우 단독으로 사용하지 않는다
- 날짜가 아닌 일반 텍스트 입력에 사용하지 않는다
