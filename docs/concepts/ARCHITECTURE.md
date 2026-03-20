# Architecture

## Goal

이 저장소는 `packages/ui` 아래에 패키지를 두는 구조가 아니라, repo 루트 자체가 `@ingradient/ui` 패키지인 구조를 사용한다.

핵심 목표는 다음과 같다.

- 패키지 경계를 더 직관적으로 만들기
- `src/`를 단일 소스 오브 트루스로 고정하기
- `lib/`를 generated output으로만 유지하기
- 스타일 결정을 token layer로 끌어올리기
- public API는 유지하고 내부 구현만 세분화하기

## Root Package Shape

```text
ingradient-ui/
├─ package.json
├─ src/
│  ├─ index.ts
│  ├─ brand/
│  ├─ tokens/
│  │  ├─ foundations/
│  │  ├─ semantic/
│  │  ├─ recipes/
│  │  ├─ variants/
│  │  ├─ globals/
│  │  └─ index.ts
│  ├─ primitives/
│  ├─ components/
│  ├─ patterns/
│  └─ legacy/
├─ apps/design-showcase/
├─ docs/
└─ lib/
```

## Why Root Package

- 이 저장소는 publishable package가 사실상 하나뿐이다.
- `packages/ui`를 한 번 더 들어가는 비용보다, 루트가 곧 패키지인 구조가 더 단순하다.
- docs 앱은 하위 workspace로 두고, 패키지는 루트에서 바로 빌드하는 편이 현재 저장소 크기에 더 잘 맞는다.

## Source And Build Rule

- 사람이 수정하는 코드는 `src/`에만 둔다.
- `lib/`는 package build 결과물만 둔다.
- `package.json`의 `exports`는 `lib/`만 가리킨다.
- docs 앱은 개발 편의를 위해 `@ingradient/ui/*`를 루트 `src/`로 alias한다.
- `lib/tokens.css`는 `src/tokens`에서 자동 생성한다.

## Documentation Structure

사용자 문서와 유지보수 문서는 저장 위치를 분리한다.

- 사용자 문서
  - `apps/design-showcase/src/docs/*.ts(x)`
  - public API metadata source of truth
- 유지보수 문서
  - `docs/*.md`
  - 철학, 구조, 규칙, 워크플로우

showcase 문서 메타는 아래처럼 나눈다.

```text
apps/design-showcase/src/docs/
├─ types.ts
├─ foundations.tsx
├─ components.tsx
├─ patterns.tsx
└─ index.ts
```

이 구조를 쓰는 이유는 다음과 같다.

- demo 렌더링과 문서 메타를 분리할 수 있다.
- props, variants, do/don't, related 같은 사람이 써야 하는 설명을 명시적으로 관리할 수 있다.
- public API 추가 시 문서 누락 여부를 더 쉽게 발견할 수 있다.

## Token Architecture

스타일은 아래 4층으로 분리한다.

### `foundations/`

- raw color palette
- spacing scale
- radius scale
- typography scale
- shadow scale
- motion scale
- breakpoint, z-index

이 레이어는 TypeScript를 소스 오브 트루스로 사용한다.

### `semantic/`

- `surface.panel`
- `text.primary`
- `border.subtle`
- `action.primary`

즉, foundation을 실제 UI 의미로 다시 맵핑하는 층이다.

### `recipes/`

- `surfacePanel`
- `controlField`
- `buttonPrimary`
- `pageHeaderSurface`

styled-components에서 재사용하는 조합은 여기 둔다.

### `variants/`

- `StatusTone`
- alert tone map
- chart palette
- component variant map

컴포넌트 props와 직접 연결되는 선택지는 여기 둔다.

## Why TypeScript Tokens + Generated CSS

이 저장소는 token source를 CSS가 아니라 TypeScript에 둔다.

- token 이름과 구조를 타입으로 관리할 수 있다.
- semantic mapping과 variant map을 같은 언어로 관리할 수 있다.
- docs와 component code가 같은 token source를 직접 읽을 수 있다.

대신 실제 소비는 CSS 변수로 한다.

- build 시 `src/tokens`에서 `lib/tokens.css`를 자동 생성한다.
- `IngradientGlobalStyle`도 같은 token contract를 사용해 CSS 변수를 주입한다.
- 즉, source는 TS, runtime consumption은 CSS variables가 기본 모델이다.

## Token CSS Generation Flow

생성 흐름은 아래로 고정한다.

1. `src/tokens/foundations/**`
2. `src/tokens/semantic/**`
3. `src/tokens/globals/css-contract.ts`
4. `lib/tokens.js`
5. `lib/tokens.css`

상세 규칙:

- token source는 `src/tokens/**`에서만 수정한다.
- `css-contract.ts`는 TypeScript token을 CSS variable contract로 변환하는 단일 진입점이다.
- `build:package`에서 먼저 `tsup`이 `lib/tokens.js`를 만든다.
- 그 다음 `scripts/generate-tokens-css.mjs`가 `lib/tokens.js`를 import해서 `renderTokensCss()`를 실행한다.
- 최종 산출물은 `lib/tokens.css`이며, 수동 편집하지 않는다.

이 구조를 쓰는 이유는 다음과 같다.

- React/styled-components와 CSS-only 소비자가 같은 token contract를 공유할 수 있다.
- docs, component code, generated CSS가 같은 TypeScript source를 바라본다.
- token rename이나 semantic remap이 코드 레벨에서 추적 가능하다.

## Layer Responsibilities

### `primitives/`

- layout
- typography
- surface
- low-level wrapper

### `components/`

- inputs
- feedback
- data display
- navigation
- overlays
- charts, icons

### `patterns/`

- app/page shell
- layout pattern
- settings shell
- reusable composition blocks

### `legacy/`

- `Portal*` alias only
- 새 구현 금지
- 호환성 목적만 허용
- 루트 `@ingradient/ui`가 아니라 `@ingradient/ui/legacy`로만 연다

## Public Export Strategy

- `@ingradient/ui`
- `@ingradient/ui/tokens`
- `@ingradient/ui/primitives`
- `@ingradient/ui/components`
- `@ingradient/ui/patterns`
- `@ingradient/ui/brand`
- `@ingradient/ui/legacy`

내부 구현 경로 직접 import는 금지한다.
