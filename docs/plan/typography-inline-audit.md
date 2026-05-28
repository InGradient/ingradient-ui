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
| 10 | (없음, mobile-specific 유지 가능) |
| 11 | `var(--ig-font-size-2xs)` |
| 12 | `var(--ig-font-size-xs)` |
| 13 | `var(--ig-font-size-sm)` |
| 14 | `var(--ig-font-size-md)` |
| 16 | `var(--ig-font-size-lg)` |
| 18 | `var(--ig-font-size-xl)` |
| 20 | `var(--ig-font-size-2xl)` |

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
| `navigation/mobile-bottom-toolbar.tsx` | 41 | `span { font-size: 10px }` | mobile small label — 10px 유지 (토큰 없음) | ⏸ |
| `inputs/textarea.tsx` | 13 | `font-size: 11px;` | `var(--ig-font-size-2xs)` | ⏳ |
| `data-display/table.styles.ts` | 31 | `font-size: 12px;` (`$mono` cell) | `var(--ig-font-size-xs)` | ⏳ |
| `feedback/toast.tsx` | 72 | `font-size: 16px;` | `var(--ig-font-size-lg)` | ⏳ |
| `inputs/date-range-picker.tsx` | 39, 43 | `font-size: 14px;` `font-size: 13px;` (DayPicker) | `var(--ig-font-size-md)`, `var(--ig-font-size-sm)` | ⏳ |
| `data-display/tag.tsx` | 14 | `font-size: 10px;` | tag 의 작은 라벨 — 유지 검토 | ⏸ |
| `overlays/help-tooltip.tsx` | 34 | `font-size: 12px;` (Bubble) | `var(--ig-font-size-xs)` | ⏳ |
| `feedback/state-chip.tsx` | 24 | `font-size: 10px;` | state chip 작은 라벨 — 유지 검토 | ⏸ |
| `feedback/group-count-badge.tsx` | 13 | `font-size: 11px;` | `var(--ig-font-size-2xs)` | ⏳ |
| `inputs/filter-chip-row.tsx` | 12 | `font-size: 13px;` | `var(--ig-font-size-sm)` | ⏳ |
| `inputs/mobile-dropdown.tsx` | 17 | `font-size: 15px;` | `var(--ig-font-size-md)` (14px) 또는 `lg` (16px) — 가까운 쪽 | ⏳ |
| `inputs/chip-tabs.tsx` | 11 | `font-size: 12px;` | `var(--ig-font-size-xs)` | ⏳ |
| `inputs/number-field.tsx` | 37 | `font-size: 10px;` | 작은 step 버튼 — 유지 검토 | ⏸ |

**유지 (⏸)**: 10px (토큰 없음, mobile/icon-specific 의도) — 5건. 추후 `--ig-font-size-3xs` 토큰 추가 검토.
**처리 (⏳)**: 8건 → 토큰화.

---

## Category A — styled wrapper 안 토큰 사용

토큰은 이미 사용 중. type scale 컴포넌트로 대체 가능한 경우만 정리 (단순 wrapper 가
type scale 과 정확히 일치하는 경우).

| 파일 | 정의 | 현재 | 권장 처리 | 완료 |
|---|---|---|---|---|
| `data-display/comment-thread.tsx` | Timestamp(L17), Author(L19), Body(L26) | styled.span: 2xs muted, xs primary | inline `<C1>` 또는 `<B3>` 활용 검토 | ⏸ |
| `data-display/info-row.tsx` | InfoRowLabel(L10), InfoRowValue(L18) | xs muted, sm primary | `<C1>` / `<B3>` 매핑 가능 | ⏳ |
| `data-display/option-row.tsx` | OptionLabel 등 | xs muted | `<C1>` | ⏳ |
| `data-display/tag-list-item.tsx` | text styled | sm primary | `<B3>` | ⏳ |
| `data-display/keyboard-shortcut-hint.tsx` | label | xs muted | `<C1>` | ⏳ |
| `feedback/step-indicator.tsx` | label styled | xs muted | `<C1>` | ⏳ |
| `feedback/status.tsx` | message text | sm muted | `<B3 tone="muted">` | ⏳ |
| `feedback/error-boundary.tsx` | FallbackTitle (h2) | xl + 600 | `<H4>` | ⏳ |
| `overlays/dialog-shell.tsx` | DialogDescription (p) | sm muted | `<B3 tone="muted">` | ⏳ |
| `overlays/modal-primitives.tsx` | ModalTitle (h2) | xl + 600 | `<H4>` | ⏳ |
| `overlays/two-column-dialog.tsx` | Title (h2) | xl + 600 | `<H4>` | ⏳ |

Category A 단순 case 만 ~11건. 나머지 styled.span 들은 specific layout/interaction
포함이라 type scale 로 단순 대체 불가능 — 유지.

---

## 작업 순서

1. **Phase 1: Category C 토큰화 (8건)** — hardcoded px → `var(--ig-font-size-*)`. 가장 단순, sed 가능. 1 commit.
2. **Phase 2: Category A 단순 wrapper → type scale (11건)** — `<H4>`, `<B3>`, `<C1>` 활용. 각 file 별 검토 필요. 3-4 commit (data-display / feedback / overlays).
3. **Phase 3: 검증 + 마무리** — TS check + build + visual review.

각 phase commit 후 본 audit 문서의 ✅ 갱신.

---

## 명시적 잔존 (⏸)

- 10px font-size 5건 (mobile-bottom-toolbar, tag, state-chip, number-field 등) — 토큰 없는 작은 element 라벨. 추후 `--ig-font-size-3xs` 토큰 도입 시 일괄 토큰화.
- comment-thread 의 Author/Body — styled.span 안에 특수 align/positioning 포함. type scale 단순 대체 부적절.
