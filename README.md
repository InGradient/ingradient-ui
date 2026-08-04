# Ingradient UI

Ingradient UI는 범용 디자인 시스템과 제품 view contract의 본진이다. 루트 패키지는 `@ingradient/ui`이고, sibling workspace인 `@ingradient/platform-pages`와 `@ingradient/edge-pages`가 controlled product composition을 제공한다. 제품 앱은 이 package들을 소비하면서 router, services, store, permission을 소유한다.

## Quick Start

```bash
cd ingradient-ui
npm install
npm run storybook
```

- Storybook: `http://localhost:6006`
- Storybook MCP: `http://localhost:6006/mcp`
- smoke consumer: `npm run dev:smoke-consumer` 후 `http://localhost:3010`
- package build + docs build: `npm run build`
- package only: `npm run build:package`
- Storybook validation: `npm run validate:storybook`
- unit tests: `npm test`
- Storybook browser tests: `npm run test-storybook`
- consumer smoke validation: `npm run validate:consumer-smoke`
- style literal check: `npm run check:style-literals`
- doc coverage check: `npm run check:doc-coverage`
- generated stylesheet: `lib/tokens.css`

## Repository Shape

```text
ingradient-ui/
├─ src/
├─ packages/
│  ├─ platform-pages/
│  └─ edge-pages/
├─ .storybook/
├─ stories/
├─ apps/
├─ tests/probes/
├─ docs/
├─ docs-legacy/
└─ lib/  # generated only
```

- `src`: `@ingradient/ui` source of truth
- `packages/platform-pages`: API/store와 분리된 Platform 제품 view와 controlled prop contract
- `packages/edge-pages`: Edge 제품 view와 controlled prop contract
- `.storybook`, `stories`: Storybook configuration and executable docs
- `apps/storybook-smoke-consumer`: package 소비 smoke 검증 앱
- `docs`: 새 문서 체계
- `docs-legacy`: 이전 문서 아카이브
- `lib`: 빌드 산출물

사용자-facing 포털은 Storybook을 우선하고, 새 운영 기준은 `docs/`에서 다시 쌓는다. 이전 문서는 `docs-legacy/`에 보존한다.

## Token Source Strategy

- 토큰의 소스 오브 트루스는 `src/tokens/`의 TypeScript다.
- 빌드 시 같은 소스에서 `lib/tokens.css`를 자동 생성한다.
- React/styled-components 환경은 `IngradientGlobalStyle`를 기본으로 쓰고, CSS-only 환경은 `@ingradient/ui/tokens.css`를 직접 import한다.

### How `tokens.css` Is Generated

1. foundation, semantic token은 `src/tokens/`에서 TypeScript로 관리한다.
2. `src/tokens/globals/css-contract.ts`가 이 값을 CSS 변수 문자열로 변환한다.
3. `npm run build:package`가 `tsup`으로 `lib/tokens.js`를 만든다.
4. 그 다음 `scripts/generate-tokens-css.mjs`가 `lib/tokens.js`의 `renderTokensCss()`를 읽어 `lib/tokens.css`를 생성한다.

즉, 직접 수정하는 파일은 `src/tokens/**`이고, `lib/tokens.css`는 항상 generated output이다.

## What This Repo Owns

- `@ingradient/ui`: foundations, semantic tokens, primitives, components, patterns, brand assets
- `@ingradient/platform-pages`: Platform 제품 의미를 가진 controlled view composition
- `@ingradient/edge-pages`: Edge 제품 의미를 가진 controlled view composition
- Storybook scenario/runtime, Actions, named workflows, accessibility, production probe, visual target로 구성된 executable documentation

## What This Repo Does Not Own

- router와 URL 정책
- API/query/mutation 구현
- global store와 server cache
- 인증 세션 및 permission 판정
- 실제 제품 데이터 fetching/persistence

제품 page package는 받은 값과 callback만으로 화면을 구성한다. 실제 앱인 `ingradient-platform`과 `ingradient-edge`가 router, API, store, permission을 소유하고 package view에 controlled props를 공급한다.

## Platform Storybook Contract

Platform `0.0.1`은 6개 제품 영역을 purpose group과 실행 가능한 interaction contract로 문서화한다.

| Product area | Stories | Purpose groups | Canonical review ID |
|---|---:|---:|---|
| Auth | 10 | 6 | `pages-platform-0-0-1-auth-login-workspace--overview` / `pages-platform-0-0-1-auth-signup-workspace--overview` |
| Dataset Catalog | 40 | 8 | `pages-platform-0-0-1-dataset-catalog-workspace--overview` |
| Class Management | 24 | 7 | `pages-platform-0-0-1-class-management-workspace--overview` |
| Create Project | 5 | 3 | `pages-platform-0-0-1-create-project-workspace--overview` |
| Settings Modal | 33 | 7 | `pages-platform-0-0-1-settings-modal-general--preferences` |
| Dashboard | 16 | 6 | `pages-platform-0-0-1-dashboard-workspace--overview` |

- [Platform Pages Package](./packages/platform-pages/README.md)
- [Platform Story Contract](./stories/pages/platform/0.0.1/README.md)
- [Platform Migration and Verification Evidence](./stories/pages/platform/0.0.1/MIGRATION.md)

Visual snapshots are platform-specific. Checked-in baselines use `chromium-linux`; macOS/Darwin captures may verify rendering locally but must not replace Linux baselines.

## Docs

- user-facing Storybook: `npm run storybook` 후 `http://localhost:6006`
- [Docs Index](./docs/README.md)
- [Design Contract](./DESIGN.md)
- [Platform Pages Package](./packages/platform-pages/README.md)
- [Platform Story Contract](./stories/pages/platform/0.0.1/README.md)
- [Components Vs Patterns](./docs/reference/components-vs-patterns.md)
- [Reference Docs](./docs/reference/README.md)
- [Legacy Docs Index](./docs-legacy/README.md)
- [Legacy Philosophy](./docs-legacy/concepts/PHILOSOPHY.md)
- [Legacy Architecture](./docs-legacy/concepts/ARCHITECTURE.md)
- [Legacy Boundaries](./docs-legacy/concepts/BOUNDARIES.md)
- [Legacy Documentation Strategy](./docs-legacy/guides/DOCUMENTATION_STRATEGY.md)
- [Legacy Storybook Guide](./docs-legacy/guides/STORYBOOK_GUIDE.md)
- [Legacy File Rules](./docs-legacy/rules/FILE_RULES.md)
- [Legacy Reference Docs](./docs-legacy/reference/README.md)
- [Legacy Releases](./docs-legacy/releases/README.md)
- [Changelog](./CHANGELOG.md)

## Legacy Compatibility

- 새 코드는 루트 `@ingradient/ui`에서 범용 API만 사용한다.
- 구 `Portal*` alias가 꼭 필요하면 `@ingradient/ui/legacy`를 사용한다.
- `legacy`는 호환성 목적이며, 새 public API 표면으로 확장하지 않는다.
