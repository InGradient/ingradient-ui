# Storybook Fixtures

Storybook-only mock data와 deterministic UX scenario를 서비스/버전별로 관리한다. Production package는 이 폴더를 import하지 않는다.

- `edge/0.0.1` — devices, datasets, logs, settings, statistics, workspace fixtures
- `medical/0.0.1` — case/class data와 medical preset
- [`platform/0.0.1`](./platform/0.0.1/README.md) — Auth, Catalog, Class Management, Create Project, Dashboard, Settings scenarios

Fixture registry는 점진적 typed access를 제공하며 explicit fixture import도 허용한다. Runtime reset은 반복 play와 static iframe 실행에서 동일한 시작 상태를 만들어야 한다.

Historical context: [multi-service fixture plan](../../docs-legacy/plan/storybook-restructure-phase-6-multi-service.md).
