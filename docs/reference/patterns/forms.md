# Form Patterns

## Import

```ts
import { FormSection } from '@ingradient/ui/patterns'
```

## What It Is

title, helper copy, field group, primary action을 묶는 공용 form shell이다.

## When To Use

- settings section
- create form
- edit form
- auth-like grouped fields

## Main Structure

- title
- helper or description
- grouped fields
- action row

## Use With

- `TextField`
- `SelectField`
- `Checkbox`
- `Switch`
- `Button`

## Do

- 의미상 같이 저장되는 필드를 한 section에 묶는다

## Don’t

- field 하나마다 개별 card를 만들지 않는다
