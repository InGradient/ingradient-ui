# Design Tokens

## 목적

`ingradient-ui`의 styling system은 CSS literal을 흩뿌리는 대신 TypeScript token source를 기준으로 foundation, semantic, recipe, variant를 나눠 관리하는 데 목적이 있다.

## token layer

- `foundations`
- `semantic`
- `recipes`
- `variants`

## 각 레이어의 역할

- `foundations`
  - raw color, spacing, radius, typography, shadow, motion, breakpoint, z-index
- `semantic`
  - UI 의미로 foundation을 재매핑
- `recipes`
  - 여러 컴포넌트가 공유하는 CSS 조합
- `variants`
  - component prop 선택지와 직접 연결되는 선택지

## source of truth

- 사람이 수정하는 token source는 `src/tokens/**`
- runtime 소비는 CSS variable contract
- build 결과로 `lib/tokens.css`를 생성

## 운영 규칙

- `lib/tokens.css`는 직접 수정하지 않는다.
- 새 raw value를 바로 component에 넣기 전에 token layer로 올릴 수 있는지 먼저 판단한다.
- token rename은 export surface와 소비 앱 영향이 크므로 릴리즈 노트에 기록한다.

## 관련 문서

- `../architecture.md`
- `/home/june/workspace/projects/ingradient-ui/docs/concepts/ARCHITECTURE.md`
