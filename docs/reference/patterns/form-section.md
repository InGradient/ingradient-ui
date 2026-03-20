# Form Section

## Import

```ts
import { FormSection } from '@ingradient/ui/patterns'
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

## Common Composition

- `FormSection + TextField + SelectField + Button`
- `DialogShell + FormSection`

## Do

- 의미상 같이 저장되는 field를 한 section에 묶는다

## Don’t

- field 하나마다 개별 panel을 만들지 않는다

## Related Docs

- [forms.md](./forms.md)
- [../components/text-field.md](../components/text-field.md)
