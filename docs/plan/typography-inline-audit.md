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
