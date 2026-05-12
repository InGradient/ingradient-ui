# Tokens Layer

이 폴더는 디자인 값의 source of truth 를 가진다. 상위 문서 § 3 의 7-카테고리 구조를 따른다.

## Layers

- `core/`
  - raw 절대값 (color palette, spacing, typography, radius, shadow, breakpoint, z-index, motion, control-sizes)
- `semantic/`
  - 의미 기반 토큰 — `IngradientTheme` interface (`types.ts`) + `states/` (status / alerts / charts 상태별 색)
- `modes/`
  - light / dark — `ingradientThemeDark`, `ingradientThemeLight` + `themes` aliases
- `themes/` *(placeholder)*
  - 분위기 단위 — industrial / medical (Phase 4 에서 채움)
- `brands/` *(placeholder)*
  - 고객사별 override — default / finemtech / samsung (Phase 4 에서 채움)
- `density/` *(placeholder)*
  - 정보 밀도 — comfortable / compact / ultra-dense (Phase 4 에서 채움)
- `globals/`
  - 런타임 메커니즘 — CSS 변수 생성 (`token-css-variables`), Theme Provider, Global Style
- `recipes.ts` *(backward-compat alias)*
  - `../primitives/recipes` re-export. 새 코드는 `@ingradient/ui/primitives` 에서 직접 import 권장.

## Rule Of Thumb

- raw value면 `core/`
- 의미 기반 이름이면 `semantic/` (또는 mode 별이면 `modes/`)
- CSS mixin (styled-components recipe) 이면 `src/primitives/recipes/`
- Theme + Brand + Density 조합 snapshot 이면 `presets/` (Phase 4)

## Important

- 직접 수정하는 곳은 `src/tokens/**`
- `lib/tokens.css` 는 generated output이다 (`scripts/generate-tokens-css.mjs`)
- public API `@ingradient/ui/tokens` 의 surface 는 유지 — 내부 폴더 rename 은 외부에 영향 없음
