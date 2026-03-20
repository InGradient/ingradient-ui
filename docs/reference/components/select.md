# Select

## Import

```ts
import { SelectField, DropdownSelect } from '@ingradient/ui/components'
```

## What It Is

native-compatible select와 custom dropdown select를 같은 디자인 언어로 제공한다.

## When To Use

- 선택지가 정해져 있을 때
- compact choice input이 필요할 때
- toolbar/filter/settings에서 option 선택이 필요할 때

## Choose The Right One

### `SelectField`

- form compatibility가 필요할 때
- native select semantics를 유지하고 싶을 때

### `DropdownSelect`

- richer option label과 설명이 필요할 때
- custom overlay menu가 더 적합할 때

## Main Props

### `SelectField`

- `children`
- `value?`
- `defaultValue?`
- `onChange?`
- `disabled?`

### `DropdownSelect`

- `value`
- `options`
- `onChange`
- `disabled?`

## Do

- form submit과 native compatibility가 필요하면 `SelectField`를 쓴다
- 설명이 있는 option은 `DropdownSelect`를 쓴다

## Don’t

- autocomplete가 필요한 큰 목록을 단순 select로 처리하지 않는다
