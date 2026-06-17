# Workflow

## Core Principle

디자인 변경은 제품 앱이 아니라 `ingradient-ui`에서 먼저 시작한다.
그리고 사용자-facing 검토는 Storybook을 기준으로 한다.

## Change Flow

1. foundation, semantic, recipe, variant 중 어디가 바뀌는지 먼저 결정한다.
2. `src/`에서 해당 layer를 수정한다.
3. Storybook에서 시각적으로 확인한다.
4. package build를 돌려 `lib/` 산출물, `lib/tokens.css`, types를 확인한다.
5. 필요한 story / MDX / reference 문서를 같이 갱신한다.
6. 이후 제품 앱이 버전 업데이트 또는 local link로 반영한다.

## Storybook Flow

새 public surface를 추가하거나 바꿀 때는 아래 순서를 기본으로 한다.

1. source와 public API를 정리한다.
2. 필요한 JSDoc를 보강한다.
3. `Playground` story를 추가한다.
4. `Review` story로 핵심 상태를 묶는다.
5. 필요한 경우 `Scenario` 또는 `Page` story를 추가한다.
6. mock/provider 또는 MSW를 연결한다.
7. play/a11y/visual 영향이 있으면 같이 검증한다.
8. `docs/reference/**`와 관련 guide를 동기화한다.

원칙:

- Storybook 반영 없는 public export는 미완성으로 본다.
- Storybook은 문서이면서 테스트 entrypoint다.
- retired showcase app 대신 Storybook만 유지한다.
- PR과 release 검증에는 `npm run test-storybook`과 `npm run build:storybook`가 포함된다.

## Token Build Flow

`tokens.css`는 아래 순서로 생성된다.

1. `src/tokens/foundations/**`와 `src/tokens/semantic/**`를 수정한다.
2. `src/tokens/globals/css-contract.ts`가 token 값을 CSS 변수 문자열로 조합한다.
3. `npm run build:package`가 `tsup --config tsup.config.ts`를 실행해 `lib/tokens.js`를 만든다.
4. 같은 스크립트에서 `node scripts/generate-tokens-css.mjs`가 실행된다.
5. 이 스크립트가 `lib/tokens.js`의 `renderTokensCss()`를 읽어 `lib/tokens.css`를 쓴다.

중요한 규칙:

- `lib/tokens.css`는 직접 수정하지 않는다.
- CSS 변수를 바꾸고 싶으면 `src/tokens/**` 또는 `css-contract.ts`를 수정한다.
- React 환경과 CSS-only 환경은 같은 생성 결과를 공유해야 한다.

## Docs Sync Rule

아래 변경은 항상 문서와 같이 간다.

- 사용자 문서 구조/작성 기준 변경 -> `DOCUMENTATION_STRATEGY.md`, `DOC_WRITING_RULES.md`
- 구조 변경 -> `docs/concepts/ARCHITECTURE.md`
- 파일 규칙 변경 -> `docs/rules/FILE_RULES.md`
- 경계 기준 변경 -> `docs/concepts/BOUNDARIES.md`
- 운영 원칙 변경 -> `docs/concepts/PHILOSOPHY.md`, `README.md`

새 public export를 추가하거나 public prop contract를 바꾸면 아래도 같이 본다.

1. 관련 Storybook story
2. 필요한 Storybook MDX
3. 관련 maintainer 문서
4. `docs/reference/**`
5. `docs/reference/coverage-matrix.md`
6. `npm run check:doc-coverage`

Storybook 운영 기준이 바뀌면 아래도 같이 본다.

- `docs/plan/storybook-adoption-plan.md`
- `docs/guides/STORYBOOK_GUIDE.md`
- 필요한 경우 `docs/README.md`

## Local Development

개발 중에는 root package를 로컬 파일 의존으로 연결한다.

예시:

```json
{
  "dependencies": {
    "@ingradient/ui": "file:../ingradient-ui"
  }
}
```

## Release Mode

운영 반영은 private registry에 publish된 semver 버전을 기준으로 한다.

예시:

```json
{
  "dependencies": {
    "@ingradient/ui": "^0.0.1"
  }
}
```

원칙:

- development는 live-linked
- release는 versioned

## Storybook Verification

최소한 아래는 본다.

- story가 올바른 그룹에 노출되는지
- `Playground`, `Review`, `Scenario`, `Page` 역할이 섞이지 않았는지
- loading / empty / error / disabled가 실제로 구분되는지
- theme / viewport / role / density 변경이 반영되는지
- Autodocs와 JSDoc 설명이 충돌하지 않는지
- `npm run test-storybook`이 통과하는지
- `npm run build:storybook`이 통과하는지
- `npm run test:visual`이 통과하는지
- `npm run build:smoke-consumer`가 통과하는지

필요하면 추가로 본다.

- play function
- accessibility 검사
- visual regression
- consumer smoke app 검증

## CSS Consumer Rule

React/styled-components 환경에서는 `IngradientGlobalStyle`를 우선한다.

CSS-only 또는 비-React 환경에서는 `@ingradient/ui/tokens.css`를 직접 import한다.

중요한 점은 둘 다 같은 TypeScript token source에서 나온다는 점이다.

## App Rule

제품 앱에서는 아래를 우선한다.

- raw style보다 공용 조립
- 제품 의미 없는 것은 먼저 `@ingradient/ui` 검토
- business logic는 앱에 유지
