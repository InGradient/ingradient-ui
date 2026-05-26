# Checkbox & Switch

## Import

```ts
import { Checkbox, Switch } from '@ingradient/ui/components'
```

## What It Is

boolean setting과 opt-in 선택을 위한 compact control이다.

## Custom Visual

- Checkbox는 네이티브 input을 숨기고 accent color 체크 마크를 커스텀으로 렌더링한다
- Radio는 네이티브 input을 숨기고 커스텀 dot을 렌더링한다
- 두 컴포넌트 모두 `<input>` 자체는 visually hidden 상태로 접근성을 유지한다

## When To Use

- settings toggle
- 다중 선택 목록
- 켜짐/꺼짐 상태가 명확한 option

## Main Props

- `checked?`
- `defaultChecked?`
- `onChange?`
- `disabled?`
- `indeterminate?` — 부분 선택 상태 표시 (체크 대신 가로줄 아이콘)
- `label?` — 체크박스 옆에 표시할 라벨 텍스트
- `ref` — `React.forwardRef` 지원. DOM input에 직접 접근 가능

## Common Composition

- `FormSection + Checkbox`
- `SettingsShell + Switch`
- `DialogShell + Checkbox opt-in`

## Do

- 설정 토글은 `Switch`, 목록 선택은 `Checkbox`를 우선 쓴다
- 라벨로 상태 의미를 분명하게 쓴다

## Don’t

- 서로 배타적인 선택을 checkbox/switch로 처리하지 않는다

## Related Docs

- [text-field.md](./text-field.md)
- [../patterns/forms.md](../patterns/forms.md)
