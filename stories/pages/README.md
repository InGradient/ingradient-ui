# Storybook Pages

제품 page package와 서비스별 snapshot을 fixture/runtime으로 실행하는 Storybook 문서다. 버전 디렉터리는 UI와 contract migration history를 보존한다.

- [`edge/0.0.1`](./edge/0.0.1/README.md) — Edge page snapshots and handoff contract
- `medical/0.0.1` — Auth, project picker, class workspace snapshots
- [`platform/0.0.1`](./platform/0.0.1/README.md) — six-area executable Platform contract
- [Platform migration evidence](./platform/0.0.1/MIGRATION.md)

Production composition은 `@ingradient/platform-pages` 또는 `@ingradient/edge-pages`가 소유한다. 이 폴더는 fixture/runtime, Controls, Actions, Interactions, accessibility, probe, visual review를 연결한다.

Historical context: [multi-service page plan](../../docs-legacy/plan/storybook-restructure-phase-6-multi-service.md).
