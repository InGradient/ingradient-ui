# Typography inline / hardcoded audit

## Context

`Primitives/Typography` 에 H1~H4 / B1~B3 / C1 / L1 type scale 컴포넌트 추가
(commit 59898d8). 이제 components 중 primitives (Heading/Text/H1~L1) 안 거치고
inline style 또는 hardcoded px 로 텍스트를 그리는 곳을 type scale 로 정리.

빠짐 없이 진행하기 위한 audit 문서. 각 case 마다 권장 처리 + 진행 상황 추적.

---

## 분류 기준

- **Category B** — inline `style={{ fontSize, color }}` 로 raw text 박은 곳 (명백한 anti-pattern)
- **Category C** — styled-component 안 hardcoded `font-size: NNpx` (토큰 미사용)
- **Category A** — `styled.span\`font-size: var(--ig-font-size-xs); color: var(--ig-color-text-muted);\`` (토큰 OK, type scale 미활용)

### px → 토큰 매핑
| px | 토큰 |
|---|---|
| 10 | `var(--ig-font-size-3xs)` ← **신규 추가** |
| 11 | `var(--ig-font-size-2xs)` |
| 12 | `var(--ig-font-size-xs)` |
| 13 | `var(--ig-font-size-sm)` |
| 14 | `var(--ig-font-size-md)` |
| 15 | `var(--ig-font-size-lg)` |
| 16 | `var(--ig-font-size-xl)` |
| 18 | `var(--ig-font-size-2xl)` |
| 20 | `var(--ig-font-size-3xl)` |
| 24 | `var(--ig-font-size-4xl)` |
| 28 | `var(--ig-font-size-5xl)` |

### 토큰 → type scale 매핑
| 토큰 + 속성 | type scale |
|---|---|
| 5xl + 800 | `<H1>` |
| 4xl + 700 | `<H2>` |
| 2xl + 600 | `<H3>` |
| xl + 600 | `<H4>` |
| lg + 400 | `<B1>` |
| md + 400 | `<B2>` |
| sm + 400 | `<B3>` |
| xs + muted | `<C1>` |
| xs + 600 + uppercase + 0.06em | `<L1>` |

---

## Category B — inline anti-pattern

| 파일 | 라인 | 현재 코드 | 권장 처리 | 완료 |
|---|---|---|---|---|
| `navigation/breadcrumbs.tsx` | 13, 17 | `style={{ fontSize: 13, color: 'var(--ig-color-text-muted)' }}` | `<B3 tone="muted">` 또는 `<B3>` | ✅ commit 7624a08 |

Category B 진짜 inline 으로 raw text 박은 곳은 breadcrumbs 1건만. 다른 의심
케이스 (`mobile-shell`, `context-menu-with-submenus` 의 ICON_STYLE / CHEVRON_STYLE
등) 은 wrapper container 의 styling 이거나 작은 element 의 specific styling 으로
type scale 으로 직접 대체 부적절. 토큰은 이미 사용 중이라 유지.

---

## Category C — hardcoded px font-size

| 파일 | 라인 | 현재 | 권장 처리 | 완료 |
|---|---|---|---|---|
| `navigation/mobile-bottom-toolbar.tsx` | 41 | `span { font-size: 10px }` | `var(--ig-font-size-3xs)` | ✅ Phase 1 |
| `inputs/textarea.tsx` | 13 | `font-size: 11px;` | `var(--ig-font-size-2xs)` | ✅ Phase 1 |
| `data-display/table.styles.ts` | 31 | `font-size: 12px;` (`$mono` cell) | `var(--ig-font-size-xs)` | ✅ Phase 1 |
| `feedback/toast.tsx` | 72 | `font-size: 16px;` | `var(--ig-font-size-xl)` | ✅ Phase 1 |
| `inputs/date-range-picker.tsx` | 39, 43 | `font-size: 14px;` `font-size: 13px;` (DayPicker) | `var(--ig-font-size-md)`, `var(--ig-font-size-sm)` | ✅ Phase 1 |
| `data-display/tag.tsx` | 14 | `font-size: 10px;` | `var(--ig-font-size-3xs)` | ✅ Phase 1 |
| `overlays/help-tooltip.tsx` | 34 | `font-size: 12px;` (Bubble) | `var(--ig-font-size-xs)` | ✅ Phase 1 |
| `feedback/state-chip.tsx` | 24 | `font-size: 10px;` | `var(--ig-font-size-3xs)` | ✅ Phase 1 |
| `feedback/group-count-badge.tsx` | 13 | `font-size: 11px;` | `var(--ig-font-size-2xs)` | ✅ Phase 1 |
| `inputs/filter-chip-row.tsx` | 12 | `font-size: 13px;` | `var(--ig-font-size-sm)` | ✅ Phase 1 |
| `inputs/mobile-dropdown.tsx` | 17 | `font-size: 15px;` | `var(--ig-font-size-lg)` | ✅ Phase 1 |
| `inputs/chip-tabs.tsx` | 11 | `font-size: 12px;` | `var(--ig-font-size-xs)` | ✅ Phase 1 |
| `inputs/number-field.tsx` | 37 | `font-size: 10px;` | `var(--ig-font-size-3xs)` | ✅ Phase 1 |

**완료 (✅)**: 13건 전부 토큰화 — Phase 1 (commit pending).

---

## Category A — styled wrapper 안 토큰 사용

토큰은 이미 사용 중. type scale 컴포넌트로 대체 가능한 경우만 정리 (단순 wrapper 가
type scale 과 정확히 일치하는 경우).

| 파일 | 정의 | 현재 | 권장 처리 | 완료 |
|---|---|---|---|---|
| `data-display/comment-thread.tsx` | Timestamp(L17), Author(L19), Body(L26) | styled.span: 2xs muted, xs primary | inline `<C1>` 또는 `<B3>` 활용 검토 | ⏸ |
| `data-display/info-row.tsx` | InfoRowLabel(L10), InfoRowValue(L18) | xs+600+min-width 80, sm+flex | weight 600 + layout 포함 — type scale 미일치 | ⏸ 유지 |
| `data-display/option-row.tsx` | TextStack(L27), Secondary(L35), Action(L40) | sm+flex, xs muted, xs+nowrap | flex layout 포함 | ⏸ 유지 |
| `data-display/tag-list-item.tsx` | Count(L30) | 2xs soft | type scale 매핑 없음 (soft tone + 2xs) | ⏸ 유지 |
| `data-display/keyboard-shortcut-hint.tsx` | Wrap, Key | kbd element + flex | element/layout 다름 | ⏸ 유지 |
| `feedback/step-indicator.tsx` | label | xs muted | flex/state 같이 포함 | ⏸ 유지 |
| `feedback/status.tsx` | SmallText(L6) | xs muted + word-break | word-break 추가 | ⏸ 유지 |
| `feedback/error-boundary.tsx` | FallbackTitle (L31) | h2 + lg + default | weight default + lg — H4(xl+600) 매핑 X | ⏸ 유지 |
| `overlays/dialog-shell.tsx` | DialogDescription (L18) | p + sm + muted + line-height | **B3 as="p" tone="muted"** | ✅ Phase 2 |
| `overlays/modal-primitives.tsx` | ModalTitle (L45) | h2 + 3xl + 700 | 3xl + 700 — type scale 매핑 없음 | ⏸ 유지 |
| `overlays/two-column-dialog.tsx` | Title (L28) | h2 + xl + 600 | **H4** | ✅ Phase 2 |

**처리 결과**: 11건 중 2건만 type scale 으로 단순 대체 가능. 나머지 9건은 styled-component
가 font-size + color 외에 layout property (flex, min-width, white-space, gap, word-break)
또는 다른 element (kbd) 또는 type scale 에 없는 size/weight 조합 (lg default, 3xl 700)
을 가져 단순 대체 부적절. **토큰은 이미 사용 중**이라 design system 차원에서 OK 한 상태로 잔존.

---

## 작업 순서

1. **Phase 1: Category C 토큰화 (8건)** — hardcoded px → `var(--ig-font-size-*)`. 가장 단순, sed 가능. 1 commit.
2. **Phase 2: Category A 단순 wrapper → type scale (11건)** — `<H4>`, `<B3>`, `<C1>` 활용. 각 file 별 검토 필요. 3-4 commit (data-display / feedback / overlays).
3. **Phase 3: 검증 + 마무리** — TS check + build + visual review.

각 phase commit 후 본 audit 문서의 ✅ 갱신.

---

## 명시적 잔존 (⏸)

- comment-thread 의 Author/Body — styled.span 안에 특수 align/positioning 포함. type scale 단순 대체 부적절.

## 갱신 기록

- `--ig-font-size-3xs` (10px) 토큰 신규 추가 (commit pending) — 10px 4건 (mobile-bottom-toolbar, tag, state-chip, number-field) 모두 토큰화 가능해짐.

---

## Category D — inline style 객체의 hardcoded fontSize (Phase 3 추가 발견)

Phase 1+2 후 components 전수 inline scan 으로 추가 발견된 3건. inline `style={{...}}` 객체
안에 `fontSize: NN` 숫자 박힌 케이스 — Category C 의 inline 버전.

| 파일 | 라인 | 현재 | 권장 처리 | 완료 |
|---|---|---|---|---|
| `navigation/mobile-nav-shell.tsx` | 131 | `fontSize: 11` (BADGE_STYLE) | `'var(--ig-font-size-2xs)'` | ✅ Phase 3 |
| `inputs/date-range-picker.tsx` | 21 | `fontSize: 12` (PRESET_BTN_STYLE) | `'var(--ig-font-size-xs)'` | ✅ Phase 3 |
| `overlays/help-tooltip.tsx` | 19 | `fontSize: 10` (ICON_STYLE) | `'var(--ig-font-size-3xs)'` | ✅ Phase 3 |

이로써 components 안 hardcoded font-size 0 (styled-component 안 + inline style 객체 안 모두).

---

## Category P — patterns 영역 audit (Phase 4)

components 와 동일 패턴으로 patterns/ 전수 scan.

| 파일 | 라인 | Category | 현재 | 권장 처리 | 완료 |
|---|---|---|---|---|---|
| `navigation/sidebar-shell.styles.ts` | 77 | C (styled) | `font-size: 13px` | `var(--ig-font-size-sm)` | ✅ Phase 4 |
| `annotation/canvas-coord-readout.tsx` | 7 | C (styled) | `font-size: 12px` | `var(--ig-font-size-xs)` | ✅ Phase 4 |
| `forms/settings-hint.tsx` | 6 | C (styled) | `font-size: 13px` | `var(--ig-font-size-sm)` | ✅ Phase 4 |
| `forms/settings-row.tsx` | 8 | D (inline obj) | `fontSize: 14` | `'var(--ig-font-size-md)'` | ✅ Phase 4 |
| `forms/color-input-row.tsx` | 7 | D (inline obj) | `fontSize: 12` | `'var(--ig-font-size-xs)'` | ✅ Phase 4 |

Category B (inline raw text): **0건** — patterns 는 깨끗.
Category A (styled wrapper 토큰 사용): page-shell.tsx 1 파일에 다수 styled element 존재.
대부분 layout/element 다르므로 단순 type scale 대체 부적합. 토큰 이미 사용 — OK.

**결과: patterns 안 hardcoded font-size 0** (styled + inline 모두).

---

## Category S — spacing 토큰 audit (Phase 5)

font-size 와 동일 audit 를 spacing (padding/margin/gap) 에 적용.

### spacing tokens
| 토큰 | px |
|---|---|
| --ig-space-0 | 0 |
| --ig-space-1 | 4 |
| --ig-space-2 | 6 |
| --ig-space-3 | 8 |
| --ig-space-4 | 10 |
| --ig-space-5 | 12 |
| --ig-space-6 | 14 |
| --ig-space-7 | 16 |
| --ig-space-8 | 18 |
| --ig-space-9 | 20 |
| --ig-space-10 | 22 |
| --ig-space-11 | 24 |
| --ig-space-12 | 28 |
| --ig-space-13 | 32 |

(1-3px 작은 값 토큰 없음 — 매핑 불가)

### 처리 가능 inline (✅ Phase 5)

| 파일 | 라인 | 현재 | 처리 | 완료 |
|---|---|---|---|---|
| `navigation/stepper.tsx` | 11 | `gap: 12` | `'var(--ig-space-5)'` | ✅ Phase 5 |
| `navigation/stepper.tsx` | 13 | `gap: 8` | `'var(--ig-space-3)'` | ✅ Phase 5 |
| `navigation/pagination.tsx` | 14 | `gap: 6` | `'var(--ig-space-2)'` | ✅ Phase 5 |
| `patterns/charts/chart-container.tsx` | 23 | `gap: 10` | `'var(--ig-space-4)'` | ✅ Phase 5 |

### 잔여 (1-3px — 토큰 없음, ⏸)

| 파일 | 라인 | 현재 | 비고 |
|---|---|---|---|
| `components/data-display/option-row.tsx` | 30 | `gap: 2px` | 작은 spacing, 토큰 없음 |
| `components/navigation/mobile-bottom-toolbar.tsx` | 27 | `gap: 3px` | 작은 spacing |
| `components/data-display/keyboard-shortcut-hint.tsx` | 6, 15 | `gap: 2px`, `padding: 0 3px` | 작은 spacing |
| `components/feedback/toast.tsx` | 61, 74 | `padding: 2px var(--ig-space-3)`, `padding: 0 2px` | mixed (2px) |
| `components/inputs/color-input.tsx` | 7 | `padding: 2px` | 작은 spacing |
| `components/data-display/tag.tsx` | 12 | `padding: 1px var(--ig-space-2)` | 1px |
| `components/inputs/drag-handle.tsx` | 28 | `gap: 2px` | 작은 spacing |
| `components/inputs/toolbar-shell.styles.ts` | 107 | `margin: 2px 0` | 2px |
| `components/navigation/mobile-nav-shell.tsx` | 92 | `gap: 2` (SECTION_STYLE) | 작은 spacing |
| `components/overlays/context-menu-with-submenus.tsx` | 16 | `gap: 2` (MENU_STYLE) | 작은 spacing |

**Phase 5 결과**: 매핑 가능한 4건 토큰화 완료. 잔여 ~10건은 1-3px 의 작은 spacing 으로
현재 토큰 scale (최소 4px = space-1) 에 매핑 없음. 별도 결정 필요:

**사용자 결정: 1-3px 토큰 추가**.

### Phase 6 — 1-3px 토큰 신규 + 잔여 토큰화 (✅)

신규 토큰 (`spacingScale` 0 과 1 사이에 추가):
- `--ig-space-1px` = 1px (hairline)
- `--ig-space-2px` = 2px
- `--ig-space-3px` = 3px

`tokens.stories` 의 Spacing 타일에도 3개 추가.

토큰화 완료 (10건):
| 파일 | 처리 |
|---|---|
| `data-display/option-row.tsx` | `gap: 2px` → space-2px |
| `navigation/mobile-bottom-toolbar.tsx` | `gap: 3px` → space-3px |
| `data-display/keyboard-shortcut-hint.tsx` | `gap: 2px`, `padding 0 3px` → 2px/3px |
| `feedback/toast.tsx` | `padding: 2px ...` → space-2px |
| `inputs/color-input.tsx` | `padding: 2px` → space-2px |
| `data-display/tag.tsx` | `padding: 1px ...` → space-1px |
| `inputs/drag-handle.tsx` | `gap: 2px` → space-2px |
| `inputs/toolbar-shell.styles.ts` | `margin: 2px 0` → space-2px |
| `navigation/mobile-nav-shell.tsx` (SECTION_STYLE) | inline `gap: 2` → space-2px |
| `overlays/context-menu-with-submenus.tsx` (MENU_STYLE) | inline `gap: 2` → space-2px |
| `patterns/filters/sort-popover-trigger.tsx` | inline `gap: 2` → space-2px |

**최종 결과: components + patterns 모두 hardcoded font-size, spacing 0** —
typography + spacing 완전 토큰화.

---

## Category P2 — position offset audit (Phase 7)

inline `top/right/bottom/left` raw number 도 spacing 의 일종. 추가 확인.

| 파일 | 라인 | 처리 |
|---|---|---|
| `patterns/annotation/image-inspector-canvas.tsx` | 35-36 | `top: 8, right: 16` → space-3, space-7 ✅ |
| `components/inputs/input-adornment.tsx` | 9 | `top: 1px; bottom: 1px` → space-1px ✅ |

`inset: 0`, `top: 0`, `left: 0` 등 0 값은 토큰 의미 없음 — 유지.

---

## Category B-Width — border-width audit (Phase 8)

신규 토큰 (`src/tokens/core/borders.ts` 추가):
- `--ig-border-1px` = 1px (hairline default)
- `--ig-border-2px` = 2px (selected / focus outline)
- `--ig-border-3px` = 3px (strong highlight)

`tokens.stories` 에 BorderWidthTile + 새 섹션 추가.

토큰화 완료 (63건 일괄):
- `border: 1px solid` (36건) + `border-bottom/top/right/left: 1px solid` (22건) → `var(--ig-border-1px)`
- `border: 2px solid` (2건), `border: 2px dashed` (1건) → `var(--ig-border-2px)`
- `border-left: 3px solid` (2건) → `var(--ig-border-3px)`
- `outline: 2px solid` (4건) → `var(--ig-border-2px)`

## Category Color — color 토큰 audit (Phase 9)

raw rgba / hex literal 전수 조사 후 토큰화. 9건 모두 처리.

신규 palette 항목 (`src/tokens/core/colors.ts` 추가):
- `white10` = `rgba(255, 255, 255, 0.10)` (light: `rgba(15, 18, 25, 0.09)`)
- `white24` = `rgba(255, 255, 255, 0.24)` (light: `rgba(15, 18, 25, 0.18)`)

신규 semantic 토큰 (`token-css-variables.ts` 추가):
- `--ig-color-overlay-soft` = `rgba(0, 0, 0, 0.3)`
- `--ig-color-overlay-mid` = `rgba(0, 0, 0, 0.5)`
- `--ig-color-white-10` / `--ig-color-white-24` (palette alias)
- `--ig-color-slate-tint-18` = `palette.borderStrong` (rgba(148,163,184,0.18))
- `--ig-color-surface-dropdown-mobile-top/-bottom` (light/dark 변형 — mobile-dropdown gradient stops)
- `--ig-color-surface-calendar-top/-bottom` (light/dark — date-range-picker calendar gradient)
- `--ig-color-svg-stroke-on-overlay` = `#ffffff` (annotation canvas SVG stroke)
- `--ig-color-pie-slice-label` = `#eef4ff` (dark) / `#0f1219` (light)

토큰화 완료 (9건):
| # | 위치 | 원본 | → |
|---|---|---|---|
| 1 | image-card FOOTER_STYLE gradient | `rgba(0,0,0,0.55)` | `var(--ig-color-overlay-strong)` |
| 2 | progress shimmer baseline (×2) | `rgba(255,255,255,0.06)` | `var(--ig-color-white-06)` |
| 3 | progress shimmer peak | `rgba(255,255,255,0.24)` | `var(--ig-color-white-24)` |
| 4 | media-overlay archived stripe | `rgba(0,0,0,0.5)` | `var(--ig-color-overlay-mid)` |
| 5 | media-overlay archived base | `rgba(0,0,0,0.3)` | `var(--ig-color-overlay-soft)` |
| 6 | mobile-dropdown trigger border | `rgba(255,255,255,0.10)` | `var(--ig-color-white-10)` |
| 7 | mobile-dropdown panel gradient + border | `rgba(18,24,34,0.98)→rgba(10,14,20,0.98)`, `rgba(148,163,184,0.18)` | `var(--ig-color-surface-dropdown-mobile-top/-bottom)`, `var(--ig-color-slate-tint-18)` |
| 8 | date-range-picker calendar gradient | `rgba(17,23,32,0.96)→rgba(10,14,20,0.96)` | `var(--ig-color-surface-calendar-top/-bottom)` |
| 9 | drawing-layer SVG selected stroke (×2) | `'#fff'` | `var(--ig-color-svg-stroke-on-overlay)` via `style` (SVG presentation attr 은 var() 미지원) |
| 10 | pie-slice-label SVG text fill | `'#eef4ff'` + `rgba(238,244,255,0.86)` | `var(--ig-color-pie-slice-label)` + `fill-opacity: 0.86` |

## Category Z-Index — z-index 토큰 audit (Phase 11)

raw `z-index: <number>` 전수 조사. 16건 토큰화 (z-index:0 default 1건은 유지).

신규 토큰 (`src/tokens/core/z-index.ts` 확장):
- `base` (1) — 같은 stacking context 내 살짝 위
- `raised` (2) — hover lift / scale
- `capture` (5) — annotation capture layer
- `sticky` (10) — sticky table header, bottom toolbar, resize-handle
- `header` (20) — help-tooltip 등 작은 floating
- `overlay` (24) — date-range-picker calendar 등 mid-range
- `mobileNavBackdrop` (110), `mobileNav` (120), `mobileMenu` (200) — mobile drawer + mobile dropdown 컨텍스트
- 기존 dropdown(100) / popover(500) / contextMenu(1000) / drawer(1100) / modal(1200) / tooltip(9999) 유지

토큰화 완료 (16건): tabs(1)/vertical-tabs(1) → base, hover-preview(2) → raised, labeling-canvas(5) → capture, mobile-bottom-toolbar(10)/table.styles(10)/resize-handle(10) → sticky, help-tooltip(20) → header, date-range-picker(24) → overlay, filter-popover(100)/mobile-nav-shell(100) → dropdown, mobile-nav-shell(110/120) → mobile-nav-backdrop / mobile-nav, mobile-dropdown(200) → mobile-menu, media-dialog-shell(1) → base.

`tokens.stories` 에 Z-Index 섹션 + ZIndexTile.

## Category Motion — motion 토큰 audit (Phase 12)

raw `transition: <duration>` + `animation: <duration>` 전수 조사. 18건 토큰화 (cubic-bezier 1건은 의도 유지).

신규 토큰 (`src/tokens/core/motion.ts` 확장):
- `slow` ('0.36s ease') — page-level transition / slide drawer
- `spinner` ('0.7s') / `shimmer` ('1s') / `skeleton` ('1.3s') — keyframes duration 전용

Transition 반올림 (3-tier fast/normal/slow):
- `120ms / 0.14s / 0.15s / 160ms / 0.16s` → `var(--ig-motion-fast)` (10건)
- `0.2s / 0.22s / 0.25s` → `var(--ig-motion-normal)` (5건)
- `0.28s cubic-bezier(0.4,0,0.2,1)` (mobile-nav-shell drawer) → raw 유지 + 주석 (Material standard ease, slow tier 의 단순 ease 와 다른 곡선)

Animation 전용 토큰:
- spinner / progress shimmer / skeleton → `var(--ig-motion-spinner|shimmer|skeleton)`
- media-overlay fadeIn 160ms → `var(--ig-motion-fast)`
- toast slideIn/Out 200ms → `var(--ig-motion-normal)`

`tokens.stories` 에 Motion 섹션 + MotionTile (token duration 마다 막대가 좌우 이동하는 데모).

## 전체 audit 최종 결과

| 카테고리 | 처리 | 잔여 |
|---|---|---|
| Typography hardcoded font-size (components, patterns) | 24건 | **0** |
| Spacing hardcoded (padding/margin/gap, components, patterns) | 14건 + 토큰 신규 3 | **0** |
| Position offset (top/right/bottom/left) | 2건 | **0** |
| Border width / outline | 63건 + 토큰 신규 3 | **0** |
| Color (raw rgba / hex literal) | 9건 + palette 신규 2 + semantic 신규 9 | **0** |
| Z-index | 16건 + 토큰 신규 9 | **0** (z-index:0 default 만) |
| Motion (transition + animation) | 18건 + 토큰 신규 4 | **0** (cubic-bezier 1건 의도 유지) |
| 죽은 코드 | breadcrumbs + dead color token 4 + patterns/shared/surfaces ✓ | — |
| Type scale 대체 | 2건 (H4, B3) | — |
| Primitives stories | Layout / Surfaces / SVG 추가 | — |

`@ingradient/ui` 의 components + patterns + primitives 안 hardcoded magic number **완전히 0** —
typography + spacing + position + border-width + color + z-index + motion 모두 토큰만 사용.
