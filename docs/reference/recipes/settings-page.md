# Recipe: Settings Page

## Use This When

- 좌측 메뉴와 우측 설정 본문 구조가 필요한 화면

## Recommended Building Blocks

- `AppShell`
- `SettingsShell`
- `SidebarSection`
- `FormSection`
- `FieldGroup`
- `FieldLabel`
- `Table`
- `Switch`
- `SelectField`
- `Button`

## Composition Order

1. `AppShell`과 `PageHeader` 구성
2. 본문에 `SettingsShell` 배치
3. 좌측에는 category navigation
4. 우측에는 `FormSection`, `FieldGroup`, 필요 시 `Table`
5. destructive or confirm flow는 `DialogShell`과 `Button tone="danger"`

## Related Docs

- [../patterns/settings-shell.md](../patterns/settings-shell.md)
- [../patterns/form-section.md](../patterns/form-section.md)
