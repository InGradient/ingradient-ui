---
title: Phase 4 — light mode 도입 계획
date: 2026-05-10
scope: ingradient-ui (foundation) + ingradient-platform / ingradient-edge (consumer toggle)
status: planning — 사용자 review 필요
parent: docs/MASTER-PLAN.md
---

# Phase 4 — Light Mode 도입

> Phase 0~3.5 의 dark-only design system 위에 light theme 을 token swap 으로 추가. cross-app 자동 반영.

## 1. 현재 구조 (참고)

```
foundations/colors.ts       — slate950/blue500 등 raw 색상 (단일 set)
semantic/theme.ts           — ingradientTheme = portalDark.
                              colors.textPrimary = foundationColors.textPrimary 같이 매핑
globals/token-css-variables.ts — tokenCssVariables map = '--ig-color-text-primary': theme.colors.textPrimary 로 빌드
globals/css-contract.ts     — :root { ... } CSS 출력
globals/global-style.tsx    — color-scheme: dark + 기본 body 색
globals/theme-provider.tsx  — styled-components ThemeProvider wrap. 단일 theme prop 받음 (default ingradientTheme)
```

**관찰**: 이미 semantic 분리가 잘 되어있음. light mode 추가 = `portalLight` theme 정의 + 선택 메커니즘만.

## 2. 핵심 결정 (사용자 confirm 필요)

### D-2.1 Theme 전환 메커니즘

| 옵션 | 메커니즘 | 장점 | 단점 |
|---|---|---|---|
| **A (권장)** | `data-theme="light\|dark"` HTML attr + CSS `:root[data-theme=...]` selector | React re-render 없이 CSS swap. 가벼움. ThemeProvider 는 attr 만 설정 + styled-components theme object 전달 | CSS string 두 set 출력 (~+150 줄 in style tag) |
| B | React Context + theme prop 전달, CSS var 매번 ThemeProvider 안에서 다시 출력 | 단순 | StyleProvider 마다 CSS 다시 inject — perf 비용 |
| C | CSS `@media (prefers-color-scheme: light)` 만 활용 (attr 없음) | OS 설정 자동 따름 | 사용자 toggle 불가능 |

→ 옵션 A 채택 권장. C 의 prefers-color-scheme 도 보조로 사용 가능 (toggle 안 했을 때 OS 따름).

### D-2.2 default theme

- **dark 유지** (현 상태). Light 는 명시적 opt-in (`<IngradientThemeProvider theme="light">` 또는 `data-theme="light"`).
- 근거: 모든 cross-app 의 시각적 안정성. 갑자기 OS 따라 light 로 바뀌면 사용자 confused.

### D-2.3 light 색 정의 — 단계적 접근

**Tier 1 (본 PR)**: light theme **shape 만 정의** + 합리적 시작 값. 디자이너 review 미반영.

기본 매핑 (dark → light):
- `slate950 (#0f1115)` (canvas) → `#ffffff`
- `slate900 (#111821)` (raised) → `#f7f9fb`
- `slate860 (rgba(12,15,20,0.8))` (panel) → `rgba(255,255,255,0.85)`
- `slate840` (muted) → `rgba(247,249,251,0.92)`
- `textPrimary #edf2f7` (light text on dark) → `#0f1219` (dark text on light)
- `textSecondary #d7deea` → `#384155`
- `textMuted #98a2b3` → `#5e6776`
- `textSoft #7e8fa3` → `#7a8492` (PR-D4b 기준 lift 유지)
- `accent #4d88ff` → `#3a73e6` (light bg 위 contrast 충족, PR-D4b 정신 일관)
- `accent-soft-surface (blueTint12)` → `rgba(58, 115, 230, 0.12)` (낮은 alpha tint 유지)

**Tier 2 (별도 PR, 디자이너 review 후)**: 미세 조정 + 새 token 필요 시 추가.

### D-2.4 Storybook integration

- `@storybook/preview` 의 `globalTypes` 에 `theme` toolbar 추가 (dark/light 토글)
- `decorators` 가 `data-theme` attr 적용
- 모든 story 가 양 theme 에서 시각 검증 가능

### D-2.5 cross-app 영향

- **platform/edge**: ui 의 theme 자동 반영. 각 app 의 IngradientThemeProvider 가 default 'dark' 면 변화 없음. 사용자 toggle UI 추가는 **각 app 의 별도 결정** (본 PR scope X).
- 모든 hard-coded `var(--ig-color-...)` 사용처 — 자동 light 반영. `var()` 가 아닌 hard-coded 색이 있다면 light 대응 X (PR-D4b 의 textSoft tint 처럼 token 화 필수).

### D-2.6 deferred — 본 PR 안 포함하지 않음

- gradient/radial 색 (bgRadialA, bgRadialB) — light 에서는 dark 와 다른 시각이 자연. Tier 2.
- shadow scale (현 dark 가정) — light 에서 더 약한 shadow 필요. Tier 2.
- chart palette — 현 dark 가정 (saturated bright). light 에서는 muted 적합. Tier 2.

## 3. 구현 step

### Step 1 — foundation light 색 추가
`foundations/colors.ts` 에 `foundationColorsLight` 신규 export. dark 와 동일 key shape.

### Step 2 — semantic theme 분리
`semantic/theme.ts`:
```ts
export const ingradientThemeDark: IngradientTheme = { name: 'portalDark', ... } // 기존
export const ingradientThemeLight: IngradientTheme = { name: 'portalLight', ... } // 신규
export const themes = { dark: ingradientThemeDark, light: ingradientThemeLight }
export const ingradientTheme = ingradientThemeDark // backward compat
```

### Step 3 — CSS var 출력 양 theme
`globals/token-css-variables.ts`:
- `buildTokenCssVariables(theme)` 함수 export
- dark/light 둘 다 호출 → 각각 CSS string

`globals/css-contract.ts`:
```css
:root,
:root[data-theme='dark'] {
  ${dark vars}
}
:root[data-theme='light'] {
  ${light vars}
}
```

### Step 4 — ThemeProvider 확장
```ts
<IngradientThemeProvider mode="light"> // attr 'light' 적용 + styled-components theme 도 light
```
- `mode?: 'dark' | 'light' = 'dark'` prop
- useEffect 로 `document.documentElement.dataset.theme = mode`

### Step 5 — global-style 의 color-scheme 동적
```css
:root[data-theme='light'] { color-scheme: light; }
```

### Step 6 — Storybook globalTypes + decorator
- `theme` toolbar 추가
- decorator 로 `data-theme` 적용

### Step 7 — 양 theme 시각 회귀 검증
- 33+ stories 양 mode 시각 확인 (수동)
- a11y test 양 mode 통과 확인 (vitest storybook 자동)

### Step 8 — docs 갱신
- MASTER-PLAN.md § 4.4 Phase 4 갱신
- 새 D-record 추가

## 4. 위험 / trade-off

- **a11y 회귀**: light theme 의 contrast 가 dark 와 다름. PR-D4 의 violation 이 light 에서 다시 발생 가능. axe-core 가 양 mode 검증 → fix 거리 발생 가능 (Tier 2)
- **hard-coded 색 발견**: cross-app 에서 raw rgba/hex 잔여 있으면 light 미반영 → 발견 시 token 화 거리
- **gradient/shadow Tier 2 deferred**: 본 PR 의 light mode 는 80% 완성도. 시각적 미완 부분 사용자 인지 필요
- **storybook 양 mode 빌드 크기**: storybook bundle 살짝 증가 (~5-10kb)

## 5. 예상 영향 / 줄수

| 변경 | 줄수 |
|---|---|
| foundations/colors.ts | +30 (light palette) |
| semantic/theme.ts | +35 (light theme) |
| globals/token-css-variables.ts | +20 (build 함수화) |
| globals/css-contract.ts | +10 (selector wrapping) |
| globals/theme-provider.tsx | +15 (mode prop) |
| globals/global-style.tsx | +5 (color-scheme dynamic) |
| .storybook/preview.tsx | +20 (toolbar + decorator) |
| **합계** | **~135 줄** |

## 6. 검증 절차

1. typecheck pass (양 theme)
2. ui storybook 102 tests (dark mode 기존 통과)
3. ui storybook 양 mode toggle 시각 확인 (수동, 33 stories)
4. ui storybook a11y 양 mode 통과 (자동 — Tier 2 fix 거리 발견 가능)
5. cross-app dev server (platform/edge): default dark 유지 동작 확인
6. cross-app 시각 회귀: 명시적 light 적용 안 했으니 변화 없어야 함

## 7. 후속 거리 (Tier 2, 별도 PR)

- gradient/radial 색 light 변형
- shadow scale light 변형
- chart palette light 변형
- light mode a11y violation fix
- 새 token (warning-soft 등) 도입 결정
- platform/edge user toggle UI (각 app 결정)

---

## 8. 사용자 confirm 거리

| 결정 | 권장 | 다른 옵션 |
|---|---|---|
| 전환 메커니즘 | A: `data-theme` attr | B: Context, C: prefers-color-scheme only |
| default | dark 유지 | light, OS 따름 |
| Tier 1 색 mapping | 기본 flip + PR-D4b 정신 일관 | 디자이너 review 후 |
| Tier 2 deferred | gradient/shadow/chart 별도 PR | 한 번에 다 |
