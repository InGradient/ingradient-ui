# Settings & Inspector Shells

## Import

```ts
import { SettingsShell, InspectorLayout, SplitPanelShell } from '@ingradient/ui/patterns'
import { VerticalTabs } from '@ingradient/ui/components'
```

## What It Is

settings menu + content, main + inspector를 표현하는 multi-pane shell family다.

## When To Use

- settings 화면
- permission 편집
- detail inspector
- split workspace

## Main Building Blocks

- `SettingsShell`
- `InspectorLayout`
- `SplitPanelShell`
- `VerticalTabs`

## Common Composition

- `SettingsShell + VerticalTabs + FormSection`
- `InspectorLayout + Table + SectionPanel`

## Do

- settings와 inspector를 같은 family로 통일한다
- settings 왼쪽 메뉴는 `VerticalTabs`와 조합한다

## Don’t

- 단순 리스트 화면까지 settings shell로 일반화하지 않는다
- settings left nav를 페이지마다 로컬 button 묶음으로 다시 만들지 않는다

## Related Docs

- [layouts.md](./layouts.md)
- [forms.md](./forms.md)
