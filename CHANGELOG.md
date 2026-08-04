# Changelog

이 저장소의 상세 릴리즈 노트는 `docs-legacy/releases/`에서 관리한다.

## Unreleased

### Changed

- Platform `0.0.1`의 Auth, Dataset Catalog, Class Management, Create Project, Settings Modal, Dashboard 문서를 purpose group 기반 executable contract로 통합했다.
- page-level JSX와 controlled prop contract를 `@ingradient/platform-pages`에 두고, operational stories는 fixture/runtime adapter로 축소했다.
- Controls, explicit Actions, named workflows, blocking accessibility, static production probes, canonical visual IDs를 같은 story contract에 연결했다.
- generic `Table<T>`가 `id` 없는 row를 지원하도록 `getRowKey` contract를 추가하고, Platform page consumers의 DTS build를 보존했다.
- Dashboard keyboard reorder, all-hidden hook order, Auth inline-link 식별, Settings/Class Management landmark·heading·contrast 문제를 회귀 테스트로 고정했다.
- 완료된 UI plan/audit를 `docs-legacy`로 이동하고, stale folder README를 service-level index로 통합했으며, UI 규칙의 workflow/audit 절차를 focused guide로 분리했다.

### Verification

- Unit: 57 files / 220 tests
- Historical Storybook MCP delivery checkpoint: 213 files / 493 tests passed
- Current repository rerun: 202/213 files and 482/493 tests passed; 11 accessibility failures remain outside Platform `0.0.1`
- Static Platform probes: 89/89
- Package/DTS and static Storybook builds passed

Delivery: [`c197991`](https://github.com/InGradient/ingradient-ui/commit/c197991c54916af6d1ad91f31a9d0029f4485b3d), merged to `main` by [`81786cf`](https://github.com/InGradient/ingradient-ui/commit/81786cffe141c29769ef0a1f5cdd1160ba336bd6).

## Versions

- [0.0.1](./docs-legacy/releases/0.0.1.md)
