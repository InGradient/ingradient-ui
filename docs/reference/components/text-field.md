# Text Field

## Import

```ts
import {
  TextField,
  SearchField,
  TextareaField,
  NumberField,
  PasswordField,
} from '@ingradient/ui/components'
```

## What It Is

single-line, search, textarea, number, password 입력을 같은 control contract로 제공한다.

## When To Use

- 일반 폼 입력
- 검색 필드
- multiline 메모 입력
- 숫자 입력
- 비밀번호 입력

## Main Props

- `value?: string`
- `onChange?: (event) => void`
- `placeholder?: string`
- `disabled?: boolean`
- `rows?: number` for `TextareaField`

## Choose The Right Field

- `TextField`
  - 일반 문자열
- `SearchField`
  - 검색 입력
- `TextareaField`
  - 장문 입력
- `NumberField`
  - 숫자 입력
- `PasswordField`
  - 비밀번호 입력

## Do

- field 목적에 맞는 specialized wrapper를 쓴다
- 같은 control style을 재사용한다

## Don’t

- 화면마다 input border, radius, padding을 새로 만들지 않는다
