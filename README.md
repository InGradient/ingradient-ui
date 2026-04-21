# Ingradient UI

Ingradient UI는 범용 디자인 시스템 본진이다. 이 저장소는 루트 패키지 자체가 `@ingradient/ui`이며, 제품 앱은 이 패키지를 소비만 한다.

## Quick Start

```bash
cd /home/june/workspace/projects/ingradient-ui
npm install
npm run storybook
```

- Storybook: `http://localhost:6006`
- smoke consumer: `npm run dev:smoke-consumer` 후 `http://localhost:3010`
- package build + docs build: `npm run build`
- package only: `npm run build:package`
- Storybook validation: `npm run validate:storybook`
- consumer smoke validation: `npm run validate:consumer-smoke`
- style literal check: `npm run check:style-literals`
- doc coverage check: `npm run check:doc-coverage`
- generated stylesheet: `lib/tokens.css`

## Repository Shape

```text
ingradient-ui/
├─ src/
├─ .storybook/
├─ stories/
├─ docs/
└─ lib/  # generated only
```

- `src`: `@ingradient/ui` source of truth
- `.storybook`, `stories`: Storybook configuration and executable docs
- `apps/storybook-smoke-consumer`: package 소비 smoke 검증 앱
- `docs`: 운영 기준 문서
- `lib`: 빌드 산출물

사용자-facing 포털은 Storybook을 우선하고, 유지보수 규칙은 `docs/`를 본다.

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

- foundations, semantic tokens, recipes, variants
- primitives
- components
- patterns
- brand assets
- 신규 프로젝트에서도 제품 의미 없이 바로 재사용 가능한 UI

## What This Repo Does Not Own

- dataset, annotation, export workflow
- camera, device, capture workflow
- project, member, class, training, model business flow
- router, API, query, mutation, permission

이런 것은 `ingradient-platform` 또는 `ingradient-edge`에 남긴다.

## Docs

- user-facing Storybook: `npm run storybook` 후 `http://localhost:6006`
- [Docs Index](./docs/README.md)
- [Philosophy](./docs/concepts/PHILOSOPHY.md)
- [Architecture](./docs/concepts/ARCHITECTURE.md)
- [Boundaries](./docs/concepts/BOUNDARIES.md)
- [Documentation Strategy](./docs/guides/DOCUMENTATION_STRATEGY.md)
- [Doc Writing Rules](./docs/guides/DOC_WRITING_RULES.md)
- [Change Guide](./docs/guides/CHANGE_GUIDE.md)
- [Storybook Guide](./docs/guides/STORYBOOK_GUIDE.md)
- [Workflow](./docs/guides/WORKFLOW.md)
- [File Rules](./docs/rules/FILE_RULES.md)
- [Reference Docs](./docs/reference/README.md)
- [Getting Started Reference](./docs/reference/getting-started.md)
- [Releases](./docs/releases/README.md)
- [Changelog](./CHANGELOG.md)

## Legacy Compatibility

- 새 코드는 루트 `@ingradient/ui`에서 범용 API만 사용한다.
- 구 `Portal*` alias가 꼭 필요하면 `@ingradient/ui/legacy`를 사용한다.
- `legacy`는 호환성 목적이며, 새 public API 표면으로 확장하지 않는다.
