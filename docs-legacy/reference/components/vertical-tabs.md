# Vertical Tabs

## Import

```ts
import { VerticalTabs } from '@ingradient/ui/components'
```

## What It Is

settings, permissions, left-rail section switching에 쓰는 generic vertical tab navigation이다.

## When To Use

- settings 왼쪽 메뉴
- permission/category 전환 rail
- dense tool panel의 section switching

## Main Props

- `items: Array<{ value; label; badge?; icon?; disabled? }>`
- `value: string`
- `onChange: (value: string) => void`
- `radius?: 'xs' | 'sm' | 'md' | 'lg'`
  - `xs`: 예전 settings처럼 더 각진 left rail
  - `sm`: compact한 settings 또는 utility rail
  - `md`: 일반적인 문서형 vertical navigation 기본값
  - `lg`: 더 부드러운 utility panel이나 wide inspector nav

## Common Composition

- `SettingsShell + VerticalTabs + SectionPanel`
- `Dialog body + VerticalTabs + FormSection`

## Do

- 좌측 section switching은 VerticalTabs로 통일한다
- badge나 disabled 상태는 item 단위로 준다
- settings left rail은 먼저 `radius="xs"`를 검토한다

## Don't

- product-wide main sidebar를 VerticalTabs로 대체하지 않는다
- 화면마다 다른 vertical tab animation을 다시 만들지 않는다
- settings rail에 과하게 둥근 radius를 기본처럼 쓰지 않는다

## Related Docs

- [navigation.md](./navigation.md)
- [../patterns/settings-shell.md](../patterns/settings-shell.md)
