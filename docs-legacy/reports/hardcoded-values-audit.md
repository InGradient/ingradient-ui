# ingradient-ui Hardcoded Values & Layout Audit

> Generated: 2026-03-28
> Updated: 2026-03-28 — Phase 1~3 수정 완료

---

## Status

| Category | Before | After | Status |
|----------|--------|-------|--------|
| Spacing (padding/gap/margin) | 60+ hardcoded px | 0 | FIXED |
| Font-size | 16+ hardcoded px | 0 | FIXED |
| Border-radius | 12+ hardcoded px | 0 | FIXED |
| Colors | 15+ hardcoded | 3 fixed, 12 kept (gradient/canvas) | PARTIAL |
| Z-index | 5+ inconsistent | 0 (3 tokens added) | FIXED |
| Fixed dimensions | 10+ | 유지 (toggle/badge 등 의도적) | REVIEWED |

### Remaining (intentionally kept)
- `tokens/recipes/buttons.ts` — danger gradient colors (`#7f1d1d`, `#8f2f2f` 등): gradient 계산 내부라 토큰화 어려움
- `components/data-display/drawing-layer.tsx` — canvas overlay colors: 컨텍스트별 고정 색상 필요
- CSS variable fallback 값 (`var(--ig-color-*, #1e1e2e)`) — 정상 패턴

---

## Original Findings (reference)

---

## HIGH: Hardcoded Colors

Raw hex/rgba 대신 `var(--ig-color-*)` 토큰을 사용해야 합니다.

| File | Line | Value | Should Use |
|------|------|-------|-----------|
| `components/data-display/comment-thread.tsx` | 69 | `#fff` | `var(--ig-color-text-on-accent)` |
| `components/data-display/drawing-layer.tsx` | 39-40 | `rgba(255,255,255,0.3)` | crosshair 전용 토큰 |
| `components/data-display/drawing-layer.tsx` | 51-52 | `rgba(74,158,255,0.15)`, `#4a9eff` | `var(--ig-color-accent)` 계열 |
| `components/data-display/drawing-layer.tsx` | 61 | `'#4a9eff'` (fallback) | `var(--ig-color-accent)` |
| `components/data-display/drawing-layer.tsx` | 100, 119 | `#fff` | `var(--ig-color-text-primary)` |
| `components/inputs/mode-switcher.tsx` | 19 | `#fff` | `var(--ig-color-text-on-accent)` |
| `components/inputs/upload-dropzone.tsx` | 13 | `rgba(74,158,255,0.06)` | `var(--ig-color-accent-tint)` |
| `tokens/recipes/buttons.ts` | 75-76 | `#7f1d1d`, `#8f2f2f`, `#fff4f4` | danger 토큰 |
| `tokens/recipes/buttons.ts` | 86 | `rgba(127,29,29,0.32)` | danger shadow 토큰 |
| `tokens/recipes/buttons.ts` | 110 | `#ffe1e1` | danger hover text 토큰 |
| `components/inputs/mention-textarea.tsx` | 25 | `#1e1e2e` (fallback) | 토큰 정의 필요 |
| `components/data-display/tag-list-panel.tsx` | 32 | `#1e1e2e` (fallback) | 토큰 정의 필요 |
| `components/overlays/settings-dialog.tsx` | 44 | `rgba(255,255,255,0.02)` (fallback) | `--ig-color-surface-panel` 토큰 정의 필요 |

---

## HIGH: Fixed Layout Dimensions

고정 크기 대신 유연한 값(`max-width`, `max-height`)을 사용해야 합니다.

| File | Line | Value | Issue |
|------|------|-------|-------|
| `components/overlays/settings-dialog.tsx` | 7-8 | `width: 820px`, `maxHeight` | width도 max-width로 변경 고려 |
| `components/overlays/settings-dialog.tsx` | 43 | `width: 190px` (sidebar) | 모바일에서 접힘/숨김 처리 없음 |
| `patterns/shells/navigation.tsx` | 16 | `280px` (default sidebar) | 모바일 대응 없음 |

---

## HIGH: Missing Flex Constraints

`flex: 1` + `overflow` 조합 시 `min-height: 0` / `min-width: 0` 필수.

| File | Line | Issue |
|------|------|-------|
| `components/overlays/settings-dialog.tsx` | Body | `min-height: 0` 추가됨 (수정 완료) |
| `patterns/layouts/layouts.tsx` | 전반 | flex column 내 overflow 영역 점검 필요 |

---

## MEDIUM: Hardcoded Spacing (padding, margin, gap)

`var(--ig-space-*)` 토큰 사용 필요. 가장 빈도가 높은 문제.

### padding

| File | Line | Value | Token |
|------|------|-------|-------|
| `components/charts/chart-container.tsx` | 9 | `18px` | `var(--ig-space-5)` |
| `components/overlays/dialog-shell.tsx` | 9 | `20px 22px 22px` | `var(--ig-space-6)` 계열 |
| `patterns/shells/navigation.tsx` | 8 | `16px` | `var(--ig-space-4)` |
| `patterns/shells/navigation.tsx` | 20, 53 | `18px 16px` | `var(--ig-space-5) var(--ig-space-4)` |
| `patterns/shells/navigation.tsx` | 41 | `14px 18px` | `var(--ig-space-4) var(--ig-space-5)` |
| `patterns/page/page-shell.tsx` | 16, 59, 74, 123 | 다수 | 토큰 통일 필요 |
| `components/charts/chart-tooltip.tsx` | 7 | `10px 12px` | `var(--ig-space-3) var(--ig-space-3)` |
| `components/overlays/settings-dialog.tsx` | 21, 46 | `16px 24px`, `12px 0` | 토큰 사용 |

### gap

| File | Lines | Values | Token |
|------|-------|--------|-------|
| `components/charts/chart-container.tsx` | 12, 19, 26 | `14px`, `12px`, `4px` | `--ig-space-4`, `--ig-space-3`, `--ig-space-1` |
| `patterns/shells/navigation.tsx` | 11, 23, 29, 36, 45, 56 | `8-16px` | `--ig-space-2` ~ `--ig-space-4` |
| `patterns/page/page-shell.tsx` | 24, 31, 56, 60, 79, 104, 124 | `6-18px` | `--ig-space-1` ~ `--ig-space-5` |
| `components/charts/chart-legend.tsx` | 6, 12 | `10px 14px`, `8px` | `--ig-space-3`, `--ig-space-2` |
| `components/charts/chart-tooltip.tsx` | 22 | `10px` | `--ig-space-3` |
| `components/data-display/layout.tsx` | 10 | `14px` | `--ig-space-4` |
| `components/data-display/stat-card.tsx` | 12 | `8px` | `--ig-space-2` |
| `components/data-display/progress-block.tsx` | 13 | `10px` | `--ig-space-3` |
| `components/data-display/assignment-row.tsx` | 12, 19 | `12px`, `4px` | `--ig-space-3`, `--ig-space-1` |
| `patterns/layouts/layouts.tsx` | 13+ | `16px` | `--ig-space-4` |

### margin

| File | Line | Value | Token |
|------|------|-------|-------|
| `components/charts/chart-tooltip.tsx` | 12, 27 | `8px`, `6px` | `--ig-space-2` |

---

## MEDIUM: Hardcoded Font Sizes

`var(--ig-font-size-*)` 토큰 사용 필요.

| File | Line | Value | Token |
|------|------|-------|-------|
| `components/charts/chart-container.tsx` | 31 | `15px` | `--ig-font-size-md` |
| `components/charts/chart-container.tsx` | 38 | `12px` | `--ig-font-size-xs` |
| `patterns/page/page-shell.tsx` | 37 | `24px` | `--ig-font-size-3xl` |
| `patterns/page/page-shell.tsx` | 42 | `20px` | `--ig-font-size-xl` |
| `patterns/page/page-shell.tsx` | 48 | `13px` | `--ig-font-size-sm` |
| `patterns/page/page-shell.tsx` | 84 | `15px` | `--ig-font-size-md` |
| `patterns/page/page-shell.tsx` | 89 | `12px` | `--ig-font-size-xs` |
| `patterns/page/page-shell.tsx` | 95 | `16px` | `--ig-font-size-lg` |
| `components/data-display/stat-card.tsx` | 16, 23, 30 | `12px`, `28px`, `13px` | `--ig-font-size-xs`, `--ig-font-size-3xl`, `--ig-font-size-sm` |
| `components/overlays/dialog-shell.tsx` | 17 | `13px` | `--ig-font-size-sm` |
| `components/charts/chart-legend.tsx` | 14 | `12px` | `--ig-font-size-xs` |
| `components/charts/chart-tooltip.tsx` | 13, 23 | `12px` | `--ig-font-size-xs` |
| `components/icons/icon-gallery.tsx` | 34 | `12px` | `--ig-font-size-xs` |
| `components/feedback/notification-badge.tsx` | 26 | `10px` | `--ig-font-size-2xs` |
| `components/navigation/vertical-tabs.styles.ts` | 103 | `10px` | `--ig-font-size-2xs` |
| `components/shared/button-root.tsx` | 19 | `13px`, `14px`, `15px` | `--ig-font-size-sm`, `--ig-font-size-md` |

---

## MEDIUM: Hardcoded Border-Radius

`var(--ig-radius-*)` 토큰 사용 필요.

| File | Line | Value | Token |
|------|------|-------|-------|
| `components/charts/chart-container.tsx` | 8 | `22px` | `--ig-radius-xl` |
| `patterns/shells/navigation.tsx` | 7 | `20px` | `--ig-radius-lg` |
| `patterns/shells/navigation.tsx` | 19 | `24px` | `--ig-radius-xl` |
| `components/charts/chart-tooltip.tsx` | 6 | `14px` | `--ig-radius-md` |
| `components/data-display/layout.tsx` | 6 | `20px` | `--ig-radius-lg` |
| `components/data-display/progress-block.tsx` | 9 | `18px` | `--ig-radius-lg` |
| `components/data-display/stat-card.tsx` | 8 | `20px` | `--ig-radius-lg` |
| `components/data-display/assignment-row.tsx` | 8 | `18px` | `--ig-radius-lg` |
| `patterns/page/page-shell.tsx` | 66, 107 | `20px`, `16px` | `--ig-radius-lg`, `--ig-radius-md` |
| `components/icons/icon-gallery.tsx` | 13, 25 | `16px`, `14px` | `--ig-radius-md` |
| `tokens/globals/global-style.tsx` | 44 | `999px` | `--ig-radius-pill` |
| `components/charts/chart-legend.tsx` | 20 | `999px` | `--ig-radius-pill` |

---

## MEDIUM: Hardcoded Dimensions (width, height, min-*)

일부는 의도적 (toggle, badge 등)이지만 토큰화하면 일관성 확보.

| File | Line | Element | Value |
|------|------|---------|-------|
| `components/inputs/toggles.tsx` | 15-16, 28-29 | Switch track/thumb | `40x24`, `18x18` |
| `components/feedback/notification-badge.tsx` | 17-18 | Badge | `18x18` |
| `components/data-display/image-viewer-toolbar.tsx` | 14-15 | Toolbar button | `32x32` |
| `components/icons/icon-gallery.tsx` | 23-24 | Icon preview | `44x44` |
| `components/inputs/search-field.tsx` | 33-34 | Clear icon | `20x20` |
| `components/overlays/tooltip.tsx` | 14-15 | Tooltip | `max-width: 260px`, `min-width: 160px` |
| `components/overlays/context-menu.tsx` | 17, 53 | Menu | `min-width: 120-140px` |
| `components/overlays/popovers.tsx` | 14-36 | Popovers | `180-320px` 범위 |
| `components/feedback/empty-state.tsx` | 29 | Empty state | `max-width: 320px` |
| `components/data-display/tag-list-panel.tsx` | 30 | Dropdown | `max-height: 200px` |
| `components/feedback/progress.tsx` | 5 | Progress bar | `height: 8px` |
| `components/navigation/vertical-tabs.styles.ts` | 49, 97-98 | Tab item, badge | `min-height: 44px`, `18x18` |

---

## LOW: Z-Index Inconsistency

| File | Line | Value | Should Use |
|------|------|-------|-----------|
| `components/overlays/tooltip.tsx` | 10 | `9999` | `--ig-z-tooltip` |
| `components/overlays/context-menu.tsx` | 8, 16, 52 | `100`, `101`, `102` | `--ig-z-context-menu` |
| `components/inputs/mention-textarea.tsx` | 29 | `10` | `--ig-z-dropdown` |
| `components/data-display/tag-list-panel.tsx` | 29 | `10` | `--ig-z-dropdown` |

---

## Recommendations

### Phase 1: 토큰 정의 보강
1. 누락된 color 토큰 추가: `--ig-color-text-on-accent`, `--ig-color-surface-panel`, `--ig-color-accent-tint`
2. z-index 토큰 추가: `--ig-z-dropdown`, `--ig-z-context-menu`, `--ig-z-tooltip`
3. danger button 전용 color 토큰 정리 (hardcoded hex 제거)

### Phase 2: spacing/font-size/border-radius 토큰 적용
- 빈도 높은 패턴부터: `12px` → `--ig-space-3`, `16px` → `--ig-space-4`
- font-size: `12px` → `--ig-font-size-xs`, `13px` → `--ig-font-size-sm`
- border-radius: `20px` → `--ig-radius-lg`, `14-16px` → `--ig-radius-md`

### Phase 3: 레이아웃 유연성
- 고정 width/height → max-width/max-height
- flex column + overflow 조합에 `min-height: 0` 필수
- 모바일 대응: sidebar 접힘, spacing 축소
