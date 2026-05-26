# Form Section

## Import

```ts
import { FormSection, FieldGroup, FieldLabel, FieldHint } from '@ingradient/ui/patterns'
```

## What It Is

title, helper copy, field group, primary action을 담는 공용 form shell이다.

## When To Use

- create form
- settings form
- editor form
- auth-like grouped fields

## Main Building Blocks

- `FormSection`
- `FieldGroup`
- `FieldLabel`
- `FieldHint`

## Common Composition

- `FormSection + FieldGroup + FieldLabel + TextField + Button`
- `DialogShell + FormSection`

## Do

- 의미상 같이 저장되는 field를 한 section에 묶는다
- labeled field는 `FieldGroup`과 `FieldLabel`로 통일한다

## Don’t

- field 하나마다 개별 panel을 만들지 않는다
- label, hint, spacing을 화면마다 새로 만들지 않는다

## Related Docs

- [forms.md](./forms.md)
- [../components/text-field.md](../components/text-field.md)
