# Sidebar Shell

## Import

```ts
import {
  AppSidebar,
  SidebarSection,
  SidebarFooter,
  SidebarNav,
  TopBar,
  MobileNavDrawer,
} from '@ingradient/ui/patterns'
```

## What It Is

desktop sidebar와 mobile drawer를 같은 공용 구조로 제공하는 navigation shell family다.

## When To Use

- product-wide navigation
- workspace section navigation
- mobile navigation fallback

## Main Building Blocks

- `AppSidebar`
- `SidebarSection`
- `SidebarFooter`
- `SidebarNav`
- `TopBar`
- `MobileNavDrawer`

## Common Composition

- `AppShell + AppSidebar + PageContent`
- `TopBar + MobileNavDrawer`

## Do

- desktop과 mobile을 같은 shell family로 유지한다

## Don’t

- 각 앱이 별도 drawer animation을 다시 만들지 않는다

## Related Docs

- [app-shell.md](./app-shell.md)
- [layouts.md](./layouts.md)
