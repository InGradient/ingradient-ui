# simon PR 디자인 재적용 구현 계획서

> **Status — archived historical implementation plan.** 이 문서는 PR 재적용 당시의 base와 충돌 판단을 보존한다. 현재 repository/package contract는 [`README.md`](../../README.md), [`DESIGN.md`](../../DESIGN.md), [`@ingradient/platform-pages`](../../packages/platform-pages/README.md)를 따른다.

simon(`simonkang76`)의 PR #2 + #3 디자인 변경을 현재 `refactor/domain-extraction` 브랜치에 재적용하기 위한 계획.

## 배경

- 두 PR(#2 `test-init→main`, #3은 #2에 포함)과 현재 브랜치는 **같은 base `9e7648d`(=main)** 에서 분기.
- 현재 브랜치는 (a) 도메인 추출로 파일 대거 이동, (b) 하드코딩 값 → 디자인 토큰 치환을 수행.
- 직접 merge 시 **48개 파일 충돌**. → 기계적 머지가 아니라 **의미 기반 재적용**으로 진행.

## 지배 원칙

1. **결과는 simon 버전과 완전히 동일해야 한다 (최우선).** 값이 충돌하면 **항상 simon 값이 우선**한다(현재 토큰화 값보다).
2. **simon 동일을 위해 컴포넌트 기본 파라미터(default prop) 수정·코드 제거를 허용**한다. 현재 구조가 simon과 다르면 현재 구조를 simon에 맞춰 바꾼다(현재 동작 보존보다 simon 일치가 우선).
3. **가능한 한 낮은 레이어**에 적용한다: `primitives` > `components` > `patterns`/`pages`. simon이 패턴에 인라인으로 넣었어도 공유 가능한 스타일은 **컴포넌트/프리미티브로 내린다**.
4. 간격/색은 **반드시 현재 토큰 스케일로 환산**한다 (아래 "간격 스케일" 참고).

## 간격 스케일 (비선형 — 환산 주의)

| 토큰 | px | | 토큰 | px |
|---|---|---|---|---|
| `--ig-space-1` | 4 | | `--ig-space-5` | **12** |
| `--ig-space-2` | 6 | | `--ig-space-6` | **14** |
| `--ig-space-3` | 8 | | `--ig-space-7` | 16 |
| `--ig-space-4` | **10** | | `--ig-space-8` | 18 |

> ⚠️ simon의 raw `12px` → `--ig-space-5` (space-3 아님). raw `14px` → `--ig-space-6`. raw `10px` → `--ig-space-4`.

---

## Phase 1 — PRIMITIVES (토대, 가장 먼저)

위 레이어가 모두 이걸 전제로 하므로 **반드시 선행**. simon이 이미 작성해둬 대부분 클린.

### 1-1. 신규 recipe 파일 (그대로 복사)
- [ ] `src/primitives/recipes/states.ts` — `stateTitleText`(text-primary·`size-sm`13px·600), `stateDescriptionText`(text-muted·`size-xs`·lh1.5), `stateCenteredLayout`(flex:1·중앙정렬)
- [ ] `src/primitives/styles/states.ts` — re-export
- [ ] `src/primitives/recipes/calendars.ts` — `calendarNavigation`, `calendarDayStates` (`.rdp-*` 규칙)
- [ ] `src/primitives/styles/calendars.ts` — re-export

### 1-2. 신규 토큰 (`src/tokens/globals/token-css-variables.ts`)
- [ ] `--ig-color-state-title` = `theme.colors.textPrimary`
- [ ] `--ig-color-state-description` = `theme.colors.textMuted`
- [ ] `--ig-color-chart-separator` = `isLight ? 'rgba(255,255,255,0.82)' : 'rgba(10,14,20,0.62)'`
- [ ] `--ig-font-size-state-title` = `typographyScale.sizeSm`
- [ ] `--ig-font-size-state-description` = `typographyScale.sizeXs`
- [ ] `--ig-font-weight-state-title` = `'600'`
- [ ] `--ig-line-height-state-description` = `'1.5'`
- ⚠️ 이 파일은 본인도 토큰화로 수정 → 충돌 가능하나 simon 변경은 전부 "추가"라 수동 병합 용이.

### 1-3. 버튼 disabled 스타일 (`src/primitives/recipes/buttons.ts`)
- [ ] 공통 `buttonDisabled` css 추출, 5개 버튼 recipe의 `&:disabled` 블록을 `${buttonDisabled}`로 치환
- [ ] 값 변경: `border-style: dashed` **제거**, `opacity 0.5→0.52`, `transform:none`·`box-shadow:none`·`border:1px solid var(--ig-color-border-subtle)`·`background:var(--ig-color-surface-muted)`·`color:var(--ig-color-text-soft)`

### 1-4. index export
- [ ] `recipes/index.ts` — `calendars`, `states` 추가
- [ ] `primitives/index.ts` — `styles/calendars`, `styles/states` 추가

---

## Phase 2 — COMPONENTS

### 2-1. Charts (`src/components/charts/types.ts` + `src/patterns/charts/*`)
- [ ] `types.ts`: `chartAxisTick` 상수 추가 (`fill:--ig-color-text-soft, fontSize:10, fontWeight:500`). **이 파일은 안 옮겨짐** (`src/components/charts/types.ts`).
- [ ] `pie-chart-card.tsx`(현 `src/patterns/charts/`): `separator?:'none'|'subtle'`(기본 subtle) prop, `paddingAngle 3→0`, `<Cell>`에 `stroke=var(--ig-color-chart-separator)`·`strokeWidth=1.5`, Tooltip `cursor={{fill:'var(--ig-color-surface-interactive)'}}`
- [ ] `line-chart-card.tsx`: 모든 축 `tick={chartAxisTick}`, Tooltip `cursor={{stroke:'var(--ig-color-border-subtle)'}}` (import에 `chartAxisTick` 추가)
- [ ] `bar-chart-card.tsx`: 모든 축 `tick={chartAxisTick}`, Tooltip `cursor={{fill:'var(--ig-color-surface-interactive)'}}`
- [ ] `chart-container.tsx`: head 요소에 `data-ig-chart-head` 속성. ⚠️ **현재 head는 `Inline` 프리미티브** → `<Inline data-ig-chart-head>`로. 이 속성은 `analysis-widget-shell`이 `[data-ig-chart-head]`로 소비하므로 **제거 금지**.

### 2-2. Table (`src/components/data-display/table.tsx`)
- [ ] `TableColumn`에 `width?: string|number` 추가
- [ ] 모든 `Th`/`Td`에 `style={{ width: col.width }}` 병합. ⚠️ 현재 Th/Td는 `$numeric/$mono/$muted` prop과 footer(`Tfoot`) 경로가 추가됨 → **현재 호출부**(footer 포함)에 병합.

### 2-3. image-card 선택 스타일 🔽 push-down (`src/components/data-display/image-card.tsx`)
- [ ] 선택 링을 `::after`로: `border: 2px solid var(--ig-color-accent)`, base border 투명, **`box-shadow` 링 제거**
- [ ] archived: `filter: grayscale(1)`
- ⚠️ 현재 image-card는 *옛 스타일*(border 2px selected-border + box-shadow 0 0 0 3px ring) 보유 → 교체.

### 2-4. Sync chip (`src/components/feedback/sync-status-chip.tsx`)
- [ ] `collapseUntilHover?: boolean` prop 추가 — 미호버 시 20px 점으로 collapse, 호버/포커스 시 펼침 (`max-width` 트랜지션, `[data-sync-chip-hover-scope]` 스코프 셀렉터 포함)

### 2-5. 상태 텍스트 소비 (state primitive)
- [ ] `feedback/empty-state.tsx`: Wrap에 `stateCenteredLayout`, Title `stateTitleText`, Description `stateDescriptionText`
- [ ] `feedback/status.tsx`: `EmptyStateText`에 `stateTitleText`

### 2-6. media-overlay (`src/components/feedback/media-overlay.tsx`)
- [ ] archived 배경: 빗금(repeating-linear-gradient) **제거** → `background: rgba(0,0,0,0.36)`
- [ ] Label: `font-size 2xs`, `font-weight 500`

### 2-7. date-picker (`src/components/inputs/`)
- [ ] `date-picker.styles.ts`: **인라인 `.rdp-*` 블록 통째 삭제** → `Popover`에 `${calendarNavigation} ${calendarDayStates}`. ⚠️ 본인이 simon이 삭제한 그 라인을 *같은 자리에서 토큰화*함 → 블록 삭제로 해결, 위치/컨테이너 스타일은 현재 것 유지.
- [ ] `date-picker.tsx`: `<DayPicker navLayout="around">` (recipe의 absolute prev/next 셀렉터 전제)

### 2-8. 기타 inputs
- [ ] `dropdown-shared.tsx`: z-index `var(--ig-z-popover)` → `calc(var(--ig-z-modal) + 10)`
- [ ] `filter-popover-trigger.tsx`: `createPortal(body)`, z-index `z-context-menu→z-tooltip`, Panel `max-width:min(420px,…)`·`overflow:visible`, 스크롤 리스너, `PANEL_GAP` 상수

### 2-9. Checkbox 재사용 🔽 push-down
손수 만든 `<input type=checkbox>`+label → 기존 `<Checkbox label=…>` (label은 ReactNode 허용)
- [ ] `dashboard-customize-popover.tsx`, `permission-matrix.stories.tsx`
- [ ] edge-tab: `DeflectometryOptions.tsx`, `ExportTabUI.tsx`(JSX label `UserEmailNote` 포함), `WorkOptionsTabUI.tsx`
- [ ] `edge-tab/edge.styles.ts`: `CheckItem` `styled.label`→`div`(flex/align만) — Checkbox가 자체 label 렌더하므로 함께 변경

---

## Phase 3 — PATTERNS / PAGES (본질적으로 로컬)

### 3-1. ⭐ `--ig-catalog-divider-color` 메커니즘 (현재 브랜치에 부재)
catalog 구분선을 `border-strong` 톤으로 통일. **신규 도입**.
- [ ] `CatalogView.styles.ts` `Page` 루트 + `ClassManageView.styles.ts` `Page` 루트에 `--ig-catalog-divider-color: var(--ig-color-border-strong)` 정의
- [ ] 아래 구분선 색을 `var(--ig-catalog-divider-color, var(--ig-color-border-subtle))`로 재타겟 (현재 `border-subtle`로 토큰화돼 **직접 충돌**):
  - `CatalogView.styles.ts`(MobileBottomSheet border-top 등), `catalog/dataset-list-panel.tsx`(L13/19/25), `catalog/gallery/gallery-toolbar.tsx`(L8/35), `class-manage/class-list-sidebar.tsx`, `CatalogRightSidebar`

### 3-2. 버튼 variant (디자인 값, 클린 적용)
- [ ] Catalog Upload(`CatalogToolbarRow.tsx`): `accent→solid`
- [ ] Dashboard Save PDF(`DashboardView.tsx` + `dashboard-header.stories.tsx`): `secondary→solid`
- [ ] date-range Apply: `secondary→solid`; Reset `size sm`
- [ ] dataset/class "Add" 버튼: `accent→solid` (+ `class-list-sidebar` "Add class"→"Add")

### 3-3. 활성 메뉴(케밥) 강조 — 반복 패턴
`openMenuId`/`menuOpen` prop → blue-tint 행 배경 + accent 테두리 MenuButton. 현재 리팩터가 전부 제거 → 재구현.
- [ ] `catalog/dataset-list-item.tsx`: `menuOpen` prop, 활성 행(blue-tint-12 bg, `inset -2px 0 0 accent`, hover blue-tint-14), 활성 MenuButton(accent border/bg/color)
- [ ] `catalog/dataset-list-panel.tsx` + `CatalogBody.tsx` + `catalog/types.ts`: `openMenuId` 전달/타입
- [ ] `catalog/gallery/gallery-images-table.tsx`: `openMenuId` → 활성 MenuButton

### 3-4. 레이아웃/표면 (디자인 값)
- [ ] `gallery-filter-panel.tsx`: 폭 `var(--ig-popup-md)`(320)→**380px** + `max-width:100%`·`overflow-x:hidden`·`scrollbar-gutter:stable`
- [ ] `gallery-images-table.tsx`: 고정 컬럼 너비(select/menu 44, thumb 84, name 280, dataset 180, sequence 140, pattern 104, sync 116, created 124, labeled 84) + `TableText`(table min-width:1200px, font-size sm)
- [ ] `media-dialog-shell.styles.ts`: Content `surface-canvas→surface-raised`+border+`shadow-floating`+`isolation:isolate`(md에서 border 제거), Main `bg-canvas`, 신규 `MediaDialogTopRight`, Sidebar `surface-panel→surface-raised`. ⚠️ 현재 `calc(100vh - var(--ig-layout-topbar))` 토큰은 유지. (이 변경이 `image-detail-sidebar` surface-raised도 충족)
- [ ] `media-dialog-shell.tsx`: `topRight` prop + 슬롯 (gallery-detail-modal의 close/actions 라우팅 전제)
- [ ] `gallery-detail-modal.tsx`: `topRight` 소비, 썸네일 bg `surface-muted→bg-canvas`·radius 제거
- [ ] `analysis-widget-shell.tsx`: `$hasActions` prop → `--ig-analysis-widget-action-space` calc + `[data-ig-chart-head]` padding-right; Actions offset. ⚠️ 현재 inline-style `Box`라 descendant 셀렉터 불가 → **`styled.div` 복원 필요**. 값: 아래 "결정 필요" 참고.
- [ ] `dashboard/DashboardView.styles.ts`: `Page`에 `height:100vh`
- [ ] `CatalogView.styles.ts` GridWrap: 패딩 `0 space-7 space-7` → **`space-7` 전체**(top 패딩 추가) + min-height
- [ ] `CatalogBody.tsx`: `EmptyStateWrap`(grid place-items center, min-h 320)
- [ ] image grid gap 기본값: `image-grid.tsx`·`virtualized-image-grid.tsx`·`image-grid.stories.tsx`에서 simon `12px` → **`--ig-space-5`**(=12px). raw 12 금지.

### 3-5. 상태 텍스트 정규화 (~12곳, state primitive 소비)
현재 리팩터가 placeholder를 `<Text tone="muted|soft" size="sm|md">`로 흩어놓음 → simon 기준 **primary·13px·600**과 톤·크기 불일치. 각 소비처를 `stateTitleText`/`stateCenteredLayout`로 정규화:
- [ ] `dashboard-overview-panel`(+loading에 Spinner), `devices-license-section`, `invitations-section`, `invitations-tab`, `join-codes-section`, `org-members-tab`, `org-settings-tab`, `project-member-invite`, `project-members-list`, `analysis-section.styles`, `SettingsModalView.styles`, `CatalogView.styles`(RightSideLoadingText)

---

## 함정 요약

| 위치 | 함정 | 해결 |
|---|---|---|
| `date-picker.styles.ts` | simon이 삭제한 라인을 본인이 같은 자리서 토큰화 | 블록 삭제 → recipe 소비 |
| image grid gap | simon `12` → `var(--ig-space-${gap})` 보간 시 `--ig-space-12`(과대) | `--ig-space-5`(=12px) |
| `analysis-widget` Actions offset | simon `space-4`(10px) vs 현재 `space-6`(14px) | **결정 필요** (아래) |
| `gallery-filter-panel` | `--ig-popup-md`(320) | 380px |

## 방침에 따른 처리 (모두 simon 동일 = 확정)

지배 원칙 1·2에 따라 이전의 "결정 필요" 항목은 다음과 같이 확정 처리한다:

1. **analysis-widget Actions offset**: **simon=10px(`--ig-space-4`) 채택** (현재 14px 버림).
2. **`CatalogOverlays.tsx` `hideDefaultClose` 제거**: simon대로 **제거**. detail-modal `topRight` 재작업과 함께 적용.
3. **구조적 분기 2건 — simon 구조를 채택**(현재 동작은 버림). 결과가 simon과 동일해지도록 현재 컴포넌트를 재작성/추가:
   - `CatalogGridView.tsx`: simon의 `GalleryImageGrid` 패턴을 **이식**(현재 `ImageCard`+`SyncStatusChip` 경로를 simon 구조로 대체).
   - `ClassManageBody.tsx`: simon의 `CatalogShell`/`ClassManageImageGrid`/`flush` 구조를 **이식**(현재 `BodyRow`+`AnnotationOverlay` 대체). `ALERT_STYLE: margin space-7` 포함.
   - ⚠️ 이 2건은 신규 컴포넌트(`GalleryImageGrid`, `ClassManageImageGrid`, `flush` variant 등) 이식이 필요해 **공수가 가장 큼** → 마지막 Phase에서 시각 비교로 검증.

## 검증 (Phase별 끝에)
- 각 Phase 후 Storybook으로 시각 비교 (simon 버전 대비).
- 우선 비교 대상: 빈/로딩 상태 텍스트, catalog 구분선 톤, date-picker, sync chip collapse, image-card 선택 링, 버튼 disabled/variant.

## 비적용/보류
- `docs/reference/*.md` 5개: 문서. 코드 적용 후 일괄 반영.
- stories 다수: 해당 컴포넌트/패턴 적용 후 함께.
