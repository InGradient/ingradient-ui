# Workflow

## Core Principle

디자인 변경은 제품 앱이 아니라 `ingradient-ui`에서 먼저 시작한다.

## Change Flow

1. foundation, semantic, recipe, variant 중 어디가 바뀌는지 먼저 결정한다.
2. `src/`에서 해당 layer를 수정한다.
3. docs app에서 시각적으로 확인한다.
4. package build를 돌려 `lib/` 산출물, `lib/tokens.css`, types를 확인한다.
5. 이후 제품 앱이 버전 업데이트 또는 local link로 반영한다.

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

- 구조 변경 -> `ARCHITECTURE.md`
- 파일 규칙 변경 -> `FILE_RULES.md`
- 경계 기준 변경 -> `BOUNDARIES.md`
- 운영 원칙 변경 -> `PHILOSOPHY.md`, `README.md`

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
    "@ingradient/ui": "^0.1.0"
  }
}
```

원칙:

- development는 live-linked
- release는 versioned

## CSS Consumer Rule

React/styled-components 환경에서는 `IngradientGlobalStyle`를 우선한다.

CSS-only 또는 비-React 환경에서는 `@ingradient/ui/tokens.css`를 직접 import한다.

중요한 점은 둘 다 같은 TypeScript token source에서 나온다는 점이다.

## App Rule

제품 앱에서는 아래를 우선한다.

- raw style보다 공용 조립
- 제품 의미 없는 것은 먼저 `@ingradient/ui` 검토
- business logic는 앱에 유지
