# ingradient-ui Architecture

## 내부 구조 개요

`ingradient-ui`는 루트 패키지 자체가 `@ingradient/ui`인 구조를 사용한다.

```text
ingradient-ui/
├─ src/
├─ apps/design-showcase/
├─ docs/
└─ lib/
```

## Source of Truth 규칙

- 사람이 수정하는 코드는 `src/`에 둔다
- `lib/`는 generated output만 둔다
- package exports는 `lib/`를 가리킨다
- docs app은 개발 편의를 위해 root `src/` alias를 사용할 수 있다

## 레이어 구성

### tokens

- foundations
- semantic
- recipes
- variants

### primitives

- layout
- typography
- surface
- low-level wrapper

### components

- inputs
- feedback
- data display
- navigation
- overlays

### patterns

- app shell
- layout pattern
- settings shell
- reusable composition blocks

### brand and legacy

- brand assets
- 호환성 목적의 legacy alias

## token source 전략

- token source는 TypeScript가 SoT다
- build 시 `lib/tokens.css`를 생성한다
- docs와 component code가 같은 token source를 바라본다

## boundary 원칙

판단 기준:

- 새 프로젝트에서 제품 의미 없이 바로 쓸 수 있으면 `@ingradient/ui`
- 아니면 consuming app에 남긴다

즉:

- generic button, table, tabs, shell은 UI package
- dataset export, training flow, camera recovery는 앱 소유

## 확장 포인트

- public API coverage 강화
- pattern contract 명확화
- docs coverage와 release process 고도화

