# Recipe: Table Page

## Use This When

- 목록 중심 관리 화면을 가장 빠르게 만들고 싶을 때

## Recommended Building Blocks

- `AppShell`
- `PageHeader`
- `Toolbar` or `FilterBar`
- `Table`
- `DialogShell`
- `Button`

## Composition Order

1. `AppShell`로 페이지 프레임 구성
2. `PageHeader`에 제목과 primary action 배치
3. `Toolbar`에 search/filter/action 배치
4. 본문에 `Table` 배치
5. 생성/편집 action은 `DialogShell`로 연결

## Related Docs

- [../patterns/app-shell.md](../patterns/app-shell.md)
- [../patterns/toolbar.md](../patterns/toolbar.md)
- [../components/table.md](../components/table.md)
