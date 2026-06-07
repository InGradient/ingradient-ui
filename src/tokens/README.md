# Tokens Layer

이 폴더는 디자인 값의 source of truth 를 가진다. 상위 문서 § 3 의 7-카테고리 구조를 따른다.

## Layers

- `core/` (19 카테고리)
  - raw 절대값:
    - **Color**: `colors.ts` (foundationColors 다크/라이트), `chart-colors.ts` (Recharts palette)
    - **Spacing**: `spacing.ts` (1px/2px/3px/-1px/-2px/-4 + 1Plus(5)/2Plus(7) + 1~13 scale + hoverLiftY)
    - **Typography**: `typography.ts` (fontFamily + 11-tier size + 5-tier weight + 7-tier letter-spacing + 6-tier line-height)
    - **Radius**: `radius.ts`
    - **Shadow**: `shadows.ts` (dark + light)
    - **Border**: `borders.ts` (1px/2px/3px)
    - **Effects**: `effects.ts` (blur 2xs/xs/sm/md/lg/xl)
    - **Motion**: `motion.ts` (15+ tier — fastest/swift/fast/normal/slow + spinner/shimmer/progress/skeleton/sync-spin/mobile-nav)
    - **Z-index**: `z-index.ts` (hidden ~ tooltip, 25+ tier)
    - **Breakpoints**: `breakpoints.ts` (sm/smPlus/md/lg/xl + media helpers)
    - **Opacity**: `opacity.ts` (hidden ~ near, 11 tier)
    - **Layout**: `layout.ts` — 일반 (pageMaxWidth/topbar/sidebarHeader/sidebarCollapse/panelMinHeight/loadingPanelHeight/shadowYOffset/shadowBlur/formLabelCol/formLabelColWide) + domain (capture-bar/-grid/histogram-*/datasetCard-*/log-*)
    - **Control sizes**: `control-sizes.ts` (xs/xsPlus/sm/smPlus/md/midPlus/midPlusTall/lg/xl/2xl/2xlWide/3xl/3xlPlus, 13 tier)
    - **Popup sizes**: `popup-sizes.ts` (3xs ~ 4xl + 3xsPlus(96)/2xsNarrow(120)/2xsPlus/xsNarrow(190)/xsTight(210)/xsPlus(240)/smNarrow(260)/mdNarrow(300)/lgPlus(440)/2xlNarrow/2xlWide/3xlNarrow/3xlMid/3xlWide/4xlNarrow + listMin(200)/filterPanel(380), popupSizes + popupSizeNumbers 변형)
    - **Icon sizes**: `icon-sizes.ts` (sub/2xs/xs/xsPlus/sm/smPlus/md/lg/xl/2xl/3xl + iconSizeNumbers 변형 + svgStrokeWidths)
    - **Chart heights**: `chart-heights.ts` (sm/smPlus/md/lg/xl/xlPlus/2xl/3xl)
    - **Scales**: `scales.ts` (transformScale press/drag/hoverLift + aspectRatios square/landscape/wide/ultra-wide/portrait)

- `semantic/`
  - 의미 기반 토큰 — `IngradientTheme` interface (`types.ts`) + `states/` (status / alerts / charts 상태별 색)
  - **Semantic alias 카테고리** (Phase 79/86):
    - State interaction: `selection-bg`, `focus-bg-soft`, `accent-soft-surface[-hover]`, `active-bg`
    - Danger states: `danger-bg-soft/-bg/-bg-hover/-bg-strong`, `danger-overlay[-hover]`, `danger-button-bg/-border`
    - Success states: `success-bg-soft/-bg`
    - Warning state: `warning-bg`

- `modes/`
  - light / dark — `ingradientThemeDark`, `ingradientThemeLight` + `themes` aliases
  - Light variant 분기: 100+ color 토큰 (Phase 78 — overlay/capture/red/green/amber/coral/slate/project-tag/blue-tint/blue-strong 전부)

- `brands/`
  - 고객사별 accent override — `default` / `finemtech` (orange) / `samsung` (deep blue)
  - 의도된 좁은 scope: accent / accent-strong / accent-soft / accent-ring 4개만 변경

- `density/`
  - 정보 밀도 — `comfortable` (medical 기본) / `compact` (platform/edge 기본) / `ultra-dense` (대시보드)
  - control-height-sm/md/lg 3 tier override (특수 tier 는 component-specific dimension 유지)

- `presets/`
  - Theme + Brand + Density 조합 snapshot — `compose.ts` + `edge` / `medical` / `platform` 별 default

- `globals/`
  - 런타임 메커니즘 — CSS 변수 생성 (`token-css-variables.ts` — 444 정의), Theme Provider, Global Style

- `recipes.ts` *(backward-compat alias)*
  - `../primitives/recipes` re-export. 새 코드는 `@ingradient/ui/primitives` 에서 직접 import 권장.

## Rule Of Thumb

- raw value면 `core/`
- 의미 기반 이름이면 `semantic/` (또는 mode 별이면 `modes/`)
- CSS mixin (styled-components recipe) 이면 `src/primitives/recipes/`
- Theme + Brand + Density 조합 snapshot 이면 `presets/`

## Token consumption patterns

- **CSS context (styled-components / inline `style` string)** — `var(--ig-XXX)` 형태
- **JSX numeric prop** (`<Icon size={N} />`, `height={N}`) — `iconSizeNumbers.X` / `chartHeights.X` / `popupSizeNumbers.X` TS const
- **SVG attribute** (`strokeWidth` / `fill` / `viewBox`) — CSS var 불가, `svgStrokeWidths.X` / `chartColors.X` TS const
- **Recharts color prop** — `chartColors.blue/purple/teal/...` (palette 11종)

## Storybook

- `src/tokens/tokens.stories.tsx` — 711줄, 카테고리별 tile visualization
- `stories/foundations/token-overview.stories.tsx` — 366줄, Object.entries 자동 iterate (16 카테고리)

## Important

- 직접 수정하는 곳은 `src/tokens/**`
- `lib/tokens.css` 는 generated output 이다 (`scripts/generate-tokens-css.mjs`)
- public API `@ingradient/ui/tokens` 의 surface 는 유지 — 내부 폴더 rename 은 외부에 영향 없음
- raw 색/픽셀 직접 사용 금지: `var(--ig-...)` 또는 TS const 만 — Phase 60→88 sweep 완료 (코드 안 raw px 0, raw rgba 0)
