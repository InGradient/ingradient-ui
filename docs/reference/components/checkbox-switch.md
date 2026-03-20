# Checkbox & Switch

## Import

```ts
import { Checkbox, Switch } from '@ingradient/ui/components'
```

## What It Is

boolean setting과 opt-in 선택을 위한 compact control이다.

## When To Use

- settings toggle
- 다중 선택 목록
- 켜짐/꺼짐 상태가 명확한 option

## Main Props

- `checked?`
- `defaultChecked?`
- `onChange?`
- `disabled?`

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
