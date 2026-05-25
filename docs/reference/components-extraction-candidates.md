# patterns → components 추출 후보 (인라인 최소 단위)

작성일: 2026-05-25
재검증일: 2026-05-25 (Explore 에이전트 3 개 병렬 검증)
결정 확정일: 2026-05-25
방향 전환일: 2026-05-25 — **인라인 zero 목표** 채택
전수 재검증일: 2026-05-25 — patterns 499 개 styled 정의 카테고리별 스캔 (gap-check)
실행 시작일: 2026-05-25 — refactor/components-vs-patterns-audit 브랜치

---

# 🚀 진행 현황 (Single Source of Truth)

**새 대화에서 이어서 작업 시 이 섹션부터 읽으세요.**

## 현재 상태 (last update: 2026-05-25, Phase 2 + 3 + 1.7 batch 5 완료)

| 항목 | 값 |
|---|---|
| 브랜치 | `refactor/components-vs-patterns-audit` |
| 인라인 styled 정의 (시작) | 499 개 |
| 인라인 styled 정의 (현재) | **57 개** |
| 제거된 인라인 | **442 개 (89%)** |
| 마이그레이션된 patterns 파일 | ~100 개 |
| Phase 2 신규 컴포넌트 | **10 개 완료** (FloatingOverlay / TextButton / Textarea / CollapsibleSectionHeader / ColorInput / ResizeHandle / AspectRatioImage / OverlayLayer / MenuItem / DropZone) |
| Phase 3 도메인 wrapper | ✅ device-status-badge / project-type-tag (내부 styled → generic Badge) |
| Phase 4 특수 Table | 🔄 Card/Wrap → Box 만 (Table styled 는 자식 selector 때문에 유지) |
| TypeScript 통과 | ✅ 매 커밋 |

## 남은 ~60 인라인 styled 의 retention 사유

대부분 다음 이유로 정당한 유지:
- 자식 selector (`& th`, `& td`, `> *`, `${Wrap}:hover &` 등) — 약 25 개
- 동적 prop 으로 CSS 값 계산 (`grid-template-columns: repeat(${p.$count}, ...)` 등) — 약 15 개
- pseudo class (`:hover`, `:focus`, `:disabled`, `:last-child`) — 약 10 개
- @media query — 약 5 개
- styled-component mixin (`${surfaceCard}`) — 약 3 개
- 라이브러리 deep 스타일링 (`.rdp-root` DayPicker, backdrop-filter 등) — 약 2 개

## 다음 단계
- **Phase 5**: 시각 일관성 정리 — MenuItem 4 곳, DropZone 2 곳, TextButton hover 통일, device-status / project-type tone 색 통일
- 폴더 재구조 (features/ 이동) 은 별도 큰 작업으로 분리

## Phase 완료 상태

- ✅ **Phase 0**: Text primitive 6 props 확장 (`align`, `uppercase`, `letterSpacing`, `fontFamily`, `tabularNums`, `as`)
- ✅ **Phase 1.1**: DragHandle 승격 (`patterns/shells/widget-drag-handle` → `components/inputs/drag-handle`)
- ✅ **Phase 1.2**: ColorSwatch 교체 (3 곳)
- ✅ **Phase 1.3**: Checkbox 교체 (1 곳)
- ✅ **Phase 1.4**: Empty/Placeholder/Muted/Status → Text (15 곳)
- ✅ **Phase 1.5**: IconButton 교체 (8 곳)
- ✅ **Phase 1.6**: Heading 교체 (21 곳)
- 🔄 **Phase 1.7**: Layout glue → primitives (진행 중 — ~50 파일 남음)
- ✅ **Phase 2**: 신규 컴포넌트 추출 **완료 (10/10)**
  - ✅ FloatingOverlay (commit 06ed814) — class-hover-card / hover-preview / dataset-menu / image-context-menu (4 곳)
  - ✅ TextButton (commit 4eff321) — checkbox-group / gallery-toolbar / gallery-filter-panel(3) / image-detail-info-panel (6 사용)
  - ✅ Textarea (commit 00588ae) — comments-panel / devices-forms / project-settings-form (3 곳)
  - ✅ CollapsibleSectionHeader (commit b991bea) — comments-panel / image-detail-labelers-list (2 곳, 100% 중복 제거)
  - ✅ ColorInput (commit b7ee0f5) — color-input-row (1 곳)
  - ✅ ResizeHandle (commit 33d142b) — catalog-shell (left/right 2 곳)
  - ✅ AspectRatioImage (commit 33d142b) — image-grid-cell Media (1 곳, fundamental)
  - ✅ OverlayLayer (commit 33d142b) — image-grid-cell OverlayLayer (1 곳, fundamental)
  - ✅ MenuItem (commit f72df21) — dataset-menu / image-context-menu / sort-popover-trigger / dataset-selector-mobile (4 곳, 시각 표준화)
  - ✅ DropZone (commit 7736024) — upload-dropzone / reference-image-drop-zone (2 곳, variant: outlined | filled)
- ⏳ **Phase 3**: 도메인 wrapper refactor (device-status-badge, project-type-tag)
- ⏳ **Phase 4**: 특수 Table 분리 (HeatmapTable, StatsTable)
- ⏳ **Phase 5**: 시각 일치 정리

## 작업 패턴 (Phase 1.7)

### styled → primitives/components 매핑

| 인라인 패턴 | 교체 |
|---|---|
| `styled.div` flex column + gap | `<Stack gap={N}>` |
| `styled.div` flex row + gap | `<Inline gap={N} justify=... wrap=...>` |
| `styled.div` grid | `<Grid gap={N} columns="..." minItemWidth={N}>` |
| 일반 `styled.div` (padding/bg/border) | `<Box style={{...}}>` |
| `styled.section/aside/header/nav/main/ul/label` | 위 primitives 에 `as="..."` |
| `styled.h1~h4` | `<Text as="h*" size="..." weight={...}>` |
| `styled.p` (margin:0 텍스트) | `<Text as="p" tone="..." size="...">` |
| `styled.span` (단순 텍스트 스타일) | `<Text size tone weight>` |
| uppercase + letter-spacing 섹션 라벨 | `<Text uppercase letterSpacing="0.04em">` |
| monospace 텍스트 | `<Text fontFamily="mono">` |
| `styled.button` (icon-only) | `<IconButton variant="..." size="...">` |
| `styled.button` (icon + danger) | `<IconButton variant="secondary" tone="danger">` |
| 인라인 Empty/Placeholder | `<Text tone="muted" align="center" size="13px">` |
| 인라인 Muted | `<Text tone="muted">` |
| 인라인 native checkbox | 기존 `Checkbox` 컴포넌트 |
| 작은 색상 점 (8~10px) | `<ColorSwatch size="xs">` |

### styled 유지 조건 (인라인이 정당한 경우)

다음 CSS 기능이 필요하면 styled 유지:
- `:hover`, `:focus`, `:disabled`, `:active` 가상 클래스
- `:last-child`, `:first-of-type` 형제 선택자
- `::before`, `::after` 의사 요소
- 자식 selector (`img {}`, `> *`, `th, td`)
- `@media` 쿼리
- 동적 prop 으로 CSS 값 계산 (예: `grid-template-columns: repeat(${p.$count}, ...)`)
- styled-components mixin 적용 (`${surfaceCard}`)
- DayPicker 같은 라이브러리 deep 스타일링

## primitives API 위치

`src/primitives/index.ts` 에서 모두 export. 주요:

```ts
// 레이아웃
import { Box, Stack, Inline, Grid, Container } from '../../primitives'
// 타이포
import { Text, Heading } from '../../primitives'
```

### Box / Stack / Inline / Grid props
- `as?: ElementType` — semantic element (section/aside/ul/header 등)
- `gap?: Space` — gap (number 0-13)
- `align?: string` — align-items
- `justify?: string` — justify-content
- `wrap?: string` — flex-wrap
- (Grid) `columns?: string` — grid-template-columns
- (Grid) `minItemWidth?: string | number`
- `style?` — 나머지 CSS 인라인 style

### Text props (확장됨)
- `as?: ElementType` — p, span, h1~6, label, a, strong 등
- `tone?: 'default' | 'secondary' | 'muted' | 'soft' | 'accent' | 'success' | 'warning' | 'danger'`
- `size?: string` — CSS size 값 (px or var)
- `weight?: number` — font-weight
- `align?: 'left' | 'center' | 'right'`
- `uppercase?: boolean`
- `letterSpacing?: string`
- `fontFamily?: 'default' | 'mono'`
- `tabularNums?: boolean`
- 기본적으로 `margin: 0` 적용됨 (heading/p 와 호환)

## 검증 + 커밋 절차

매 batch (5-10 파일) 끝나면:
```bash
npx tsc --noEmit                       # 통과 확인
git add <files>
git commit -m "refactor(patterns): ..."  # 한국어, refactor 접두사
```

CLAUDE.md 규칙: 200 줄 미만 / 하드코딩 금지 / 한국어 커밋 / 기존 패턴 유지.

## 처리 완료된 파일 (참고 예시)

깨끗하게 마이그레이션된 파일 — 다른 파일 작업 시 패턴 참고:
- `src/patterns/shells/invitations-section.tsx` — Stack/Inline/Text + Table 컬럼 render 에 Text 활용
- `src/patterns/shells/dashboard-overview-panel.tsx` — Stack/Inline/Box/Text 합성 + Panel 유지
- `src/patterns/shells/storage-overview.tsx` — Grid + Box card 패턴
- `src/patterns/shells/devices-license-section.tsx` — 복잡한 InfoGrid 인라인 style + Stack/Inline
- `src/patterns/shells/project-settings-form.tsx` — 다수 Row + Label + Input + Textarea (focus 유지)
- `src/patterns/cards/stat-card.tsx` — uppercase letterSpacing Text 활용
- `src/patterns/shells/labeling-progress-bar.tsx` — ColorSwatch + dynamic Segment styled 유지 패턴
- `src/patterns/shells/image-detail-info-panel.tsx` — Stack 의 Section + DetailsToggle hover 유지
- `src/patterns/shells/image-detail-sidebar.tsx` — Stack as="aside" + last-child border 만 styled 유지
- `src/patterns/shells/delete-account-dialog.tsx` — Stack as="label" + 인라인 Button props
- `src/patterns/shells/project-permission-matrix.tsx` — sticky th/td 만 styled + 검색/스크롤 wrap 은 primitives
- `src/patterns/shells/comments-panel.tsx` — Composer textarea (focus-visible) 만 styled + 나머지는 primitives

## 남은 파일 우선순위 (~50 개)

### 큰 파일 (복잡)
- `mobile-nav-shell.tsx` (306 줄, drawer + nav layouts)
- `comments-panel.tsx` (composer + thread + textarea)
- `catalog-shell.tsx`, `catalog-mobile-shell.tsx`

### 갤러리 / 이미지
- `gallery-image-card.tsx`, `gallery-mobile-toolbar.tsx`
- `gallery-images-table.tsx`, `gallery-toolbar.tsx`
- `gallery-filter-panel.tsx`, `gallery-detail-modal.tsx`
- `gallery-export-*.tsx` 시리즈 (4 파일)
- `gallery-delete-dialog.tsx`, `gallery-dataset-transfer-dialog.tsx`
- `class-lightbox.tsx`, `image-context-menu.tsx`

### Analysis widget 시리즈
- `analysis-class-ratio-widget.tsx`
- `analysis-data-collection-widget.tsx`
- `analysis-labeling-by-person-widget.tsx`
- `analysis-labeling-status-widget.tsx`
- `analysis-pending-processed-widget.tsx`
- `analysis-timeline-widget.tsx`
- `analysis-dashboard.tsx` (이미 처리됨)

### Image detail / labeling
- `image-detail-sidebar.tsx`, `image-detail-info-panel.tsx`
- `image-detail-class-list.tsx`, `image-detail-labelers-list.tsx`
- `image-inspector-canvas.tsx`
- `labeling-canvas.tsx`, `annotation-toolbar.tsx`
- `bbox-navigation.tsx` (이미 처리됨)
- `canvas-overlays.tsx`

### Class / Dataset
- `class-info-sidebar.tsx` (이미 처리됨), `class-images-panel.tsx`
- `class-hover-card.tsx`, `add-class-dialog.tsx`
- `add-dataset-modal.tsx`, `duplicate-dataset-modal.tsx`
- `dataset-list-item.tsx`, `dataset-menu.tsx`, `dataset-filter-chip-row.tsx`
- `dataset-selector-mobile.tsx`, `dataset-distribution-heatmap.tsx`

### Filter / Sort
- `filter-popover-trigger.tsx`, `filter-searchable-list.tsx`
- `sort-popover-trigger.tsx`, `filter-class-chip.tsx`

### 기타
- `password-change-dialog.tsx`, `delete-account-dialog.tsx`
- `device-detail-dialog.tsx`, `upload-quality-modal.tsx`
- `drag-drop-decide-modal.tsx`, `igp-export-modal.tsx` (이미 처리됨)
- `model-mapping-select.tsx` (이미 처리됨)
- `media-dialog-shell.tsx`, `sidebar-shell.tsx`
- `mobile-nav-shell.tsx`, `navigation.tsx`
- `org-settings-tab.tsx` (이미 처리됨)
- `project-members-list.tsx`, `project-member-row.tsx`
- `project-permission-matrix.tsx`, `project-resolution-card.tsx`
- `permission-help-tooltip.tsx`
- `color-input-row.tsx`, `reference-image-drop-zone.tsx`
- `auto-save-status.tsx` (이미 처리됨)

### Page / Charts / Cards / Gallery / Annotation
- `patterns/page/page-shell.tsx` — **public API exports, 신중하게 처리**
- `patterns/page/page-primary-header.tsx`
- `patterns/charts/{bar,line,pie}-chart-card.tsx`
- `patterns/gallery/{image-grid,image-grid-cell,virtualized-image-grid}.tsx`
- `patterns/annotation/{annotation-overlay,drawing-layer}.tsx`
- `patterns/layouts/layouts.tsx` — **public API exports, 그대로 유지 추천**

## 빠른 시작 (새 대화)

1. 이 문서 (`docs/reference/components-extraction-candidates.md`) 의 "진행 현황" 섹션 읽기
2. `git log refactor/components-vs-patterns-audit ^main --oneline | head -20` 으로 최근 커밋 확인
3. `grep -rEh "^const [A-Z][a-zA-Z0-9_]+ ?= ?styled" src/patterns --include="*.tsx" -l | grep -v "stories\|test"` 로 남은 파일 목록
4. 위 "남은 파일 우선순위" 에서 처리할 파일 선택 (큰 파일은 후순위, 작은 파일부터)
5. 위 "작업 패턴" + "처리 완료된 파일" 참고하여 패턴 적용
6. 5-10 파일마다 `npx tsc --noEmit` → `git commit`
7. 작업 후 이 문서의 진행 현황 섹션 업데이트 (인라인 카운트, Phase 상태)

---

## 목적
`src/patterns/*` 내부의 **인라인 styled-component / sub-component 를 가능한 모두 제거**한다. 패턴 파일 통째 이동이 아니라, 패턴 안에 흩어진 인라인 부품들을:
1. primitives 로 흡수 (레이아웃)
2. 기존 components 로 흡수 (시각 근접)
3. 신규 컴포넌트로 추출 (매칭 자산 없음)
4. 도메인 wrapper 는 내부 refactor

시각 변경이 발생하는 항목은 **마이그레이션 후 일괄 디자인 정리**한다 (지금 단계에서 시각 일치 신경 안 씀).

---

## 전수 검증 결과 (499 styled 정의)

카테고리별 분포:
- `styled.div` 236 / `styled.span` 78 / `styled.button` 27 / `styled.p` 26
- `styled.h*` 21 / `styled.section` 8 / `styled.label` 10 / `styled.aside` 12
- `styled.ul/li` 12 / `styled.table/td/th` 16 / `styled.img` 7
- `styled.textarea` 3 / `styled.input` 2 / `styled.svg` 2 / `styled.a` 2
- 나머지 (header/nav/main/hr/strong) 8

**핵심 발견 — Text primitive 확장 필수**: 현재 `Text` 는 `tone/size/weight` 만 지원. 마이그레이션 위해 다음 props 추가 필요:
- `align?: 'left' | 'center' | 'right'` — 35+ 곳에서 textAlign 사용
- `uppercase?: boolean` + `letterSpacing?: string` — 8+ 곳 (StatLabel, FilterLabel, SectionHeader 등)
- `fontFamily?: 'mono'` — 2-3 곳 (join code, hex 값)
- `tabularNums?: boolean` — 5+ 곳 (counter, count, numeric 정렬)

이 확장 없으면 zero-inline 목표 달성 불가. **Phase 0 으로 우선 처리**.

## 매칭 우선순위

### 1순위: 레이아웃 글루 → primitives 사용
이미 `src/primitives/layout/` 에 다음이 존재:
- `Stack` — flex column + gap
- `Inline` — flex row + gap (wrap)
- `Grid` — grid + auto-fit
- `Box` — 기본 styled div
- `Container` — max-width wrapper

| 인라인 패턴 | 교체 |
|---|---|
| `styled.div` flex column | `<Stack gap={...}>` |
| `styled.div` flex row | `<Inline gap={...}>` |
| `styled.div` grid | `<Grid>` |
| 단순 padding/bg/border 박스 | `<Box ...>` |

→ 패턴 파일들의 `Wrap`/`Body`/`Header`/`Row`/`Toolbar`/`Panel`/`Section`/`RowGrid` 등 대부분 흡수.

### 2순위: 기존 components 흡수 (시각 근접 허용)
시각이 정확히 일치하지 않아도 가까운 기존 컴포넌트로 흡수. 마이그레이션 완료 후 디자인 정리 단계에서 한꺼번에 시각 일치 작업.

### 3순위: 신규 컴포넌트 추출
2 순위로 흡수 불가능한 것만 신규 추출. **목표: 가능한 적게**.

### 4순위: 도메인 wrapper 는 내부 refactor
도메인 결합 wrapper (device-status-badge, project-type-tag) 는 wrapper 자체는 유지하되, 내부 styled span 을 generic Badge/Tag 사용으로 교체.

---

## A. 기존 components/primitives 로 직접 교체

### A1. ✅ IconButton 교체 (8 곳)
| 위치 | 인라인 이름 |
|---|---|
| `shells/mobile-nav-shell.tsx:25` | `HamburgerBtn` |
| `shells/mobile-nav-shell.tsx:110` | `CloseBtn` |
| `shells/class-lightbox.tsx:52` | `CloseBtn` |
| `shells/bbox-navigation.tsx:11` | `ArrowBtn` |
| `shells/expand-sidebar-btn.tsx:4` | `Btn` |
| `shells/dataset-list-panel.tsx:57` | `CollapseBtn` |
| `shells/class-pool-list.tsx:50` | `RemoveBtn` (`tone="danger"` 사용) |
| `shells/member-pool-list.tsx:47` | `RemoveBtn` |
| `shells/gallery-image-card.tsx:49` | `OptionButton` (18x18 icon-only) |

`IconButton` 의 `tone: 'default' | 'danger'` 이미 존재 — 추가 작업 없음.

### A2. ✅ ColorSwatch 교체 (3 곳)
| 위치 | 인라인 이름 | 교체 |
|---|---|---|
| `shells/class-pool-list.tsx:27` | `ColorDot` (10px) | `<ColorSwatch size="xs" $shape="circle">` |
| `shells/add-dataset-modal.tsx:33` | `ColorDot` (10px) | 동일 |
| `shells/labeling-progress-bar.tsx:39` | `Dot` (8px) | 동일 |

### A3. ✅ Badge / Tag / Chip 교체 (4 곳, 시각 근접 허용)
| 위치 | 인라인 이름 | 교체 | 시각 영향 |
|---|---|---|---|
| `shells/mobile-nav-shell.tsx:169` | `Badge` | `<Badge $tone="danger">` | 거의 동일 |
| `shells/source-breakdown-widget.tsx:38` | `Chip` | `<Tag $bg="surface-raised" $color="text-muted">` | 시각 통일 (radius/font 변경) |
| `shells/chip-group.tsx:11` | `MoreChip` ("+N more") | `<Badge $tone="neutral">+{n} more</Badge>` | bg 톤 변경 |
| `shells/canvas-overlays.tsx:112` | `HiResPill` | `<Badge>` + `<Spinner>` 합성 또는 Badge `$tone="overlay"` 추가 | canvas-overlay bg → badge bg |

### A4. ✅ Checkbox 교체 (1 곳)
`shells/dashboard-customize-popover.tsx:38` 인라인 native checkbox → 기존 `components/inputs/toggles.tsx` Checkbox.

### A5. ✅ Empty / Placeholder → Text (8 곳)
모두 `<Text tone="muted" align="center">` 로 교체:
- `shells/invitations-tab.tsx:17` `Empty`
- `shells/org-members-tab.tsx:20` `Empty`
- `shells/join-codes-section.tsx:34` `Empty`
- `shells/invitations-section.tsx:57` `Empty`
- `shells/comments-panel.tsx:51` `Empty`
- `shells/class-list-sidebar.tsx:33` `Placeholder`
- `shells/project-member-invite.tsx:35` `Placeholder`
- `shells/devices-license-section.tsx:72` `Placeholder`

### A6. ✅ Muted span → Text (3 곳)
- `shells/join-codes-section.tsx:41` `Muted`
- `shells/org-members-tab.tsx:27` `Muted`
- `shells/invitations-section.tsx:64` `Muted`

→ 모두 `<Text tone="muted">`.

### A7. ✅ Status text → Text (3 곳)
| 위치 | 인라인 이름 | 교체 |
|---|---|---|
| `shells/reference-image-section.tsx:44` | `Status` | `<Text size="12px" tone="accent">` |
| `shells/invitations-section.tsx:68` | `StatusText` | 조건 톤 helper + `<Text tone={...}>` |
| `shells/igp-export-modal.tsx:28` | `StatusLine` | `<Inline gap>` + `<Text>` |

### A8. ✅ Link → `<a>` + Text 또는 TextButton with `as="a"` (1 곳)
- `shells/igp-export-modal.tsx:36` `Link` → TextButton 추출 후 `as="a"` 사용 또는 즉시 `<Text as="a" tone="accent">`

### A9. ✅ 레이아웃 글루 → primitives (광범위, ~50+ 곳)
모든 패턴 파일에서 다음 패턴 발견 시 primitives 로 교체:
- `Wrap`, `Body`, `Container` styled div → `<Stack>` / `<Box>`
- `Row`, `Inline` styled div → `<Inline>`
- `Header`, `Footer`, `Toolbar`, `Panel`, `Section` styled div → `<Stack>` / `<Inline>` / `<Box>`
- `Grid`, `RowGrid` styled div → `<Grid>`

각 패턴 파일별로 1:1 교체. 패턴 파일 자체 크기 감소.

---

## B. 신규 컴포넌트 추출

### B1. ★ TextButton (5 곳)
경로: `components/inputs/text-button.tsx`
props: `tone: 'accent' | 'muted'`, `size`, leading/trailing icon slot, `as` (link 호환)

| 위치 | 인라인 이름 |
|---|---|
| `shells/checkbox-group.tsx:22` | `HeaderBtn` |
| `shells/gallery-toolbar.tsx:60` | `SelectAllLink` |
| `shells/gallery-filter-panel.tsx:31` | `ResetBtn` |
| `shells/image-detail-info-panel.tsx:21` | `DetailsToggle` |
| (A8 igp-export-modal `Link` 도 흡수 가능) | |

### B2. ★ MenuItem (4 곳)
경로: `components/overlays/menu-item.tsx`
props: `tone: 'default' | 'danger'`, `size: 'sm' | 'md'`, `active?: boolean`, `disabled?: boolean`, leading icon slot

| 위치 | 인라인 이름 |
|---|---|
| `shells/image-context-menu.tsx:19` | `Item` |
| `shells/dataset-menu.tsx:24` | `Item` |
| `shells/sort-popover-trigger.tsx:14` | `Option` |
| `shells/dataset-selector-mobile.tsx:53` | `Option` |

기존 `ContextMenuButton` 은 그대로 유지 (block 형식 단순 메뉴 호환용).

### B3. ★ DragHandle (1 곳, rename 승격)
`patterns/shells/widget-drag-handle.tsx` → `components/inputs/drag-handle.tsx`
위젯 결합 코드 0. 이름에서 `widget-` 제거.

### B4. ★ Textarea (3 곳)
경로: `components/inputs/textarea.tsx`
props: `variant: 'default' | 'monospace'`, size/minHeight, 표준 textarea props

| 위치 | 인라인 이름 |
|---|---|
| `shells/devices-forms.tsx:52` | `TokenText` (monospace, 72px) |
| `shells/comments-panel.tsx:63` | `Textarea` (default, 60px) |
| `shells/project-settings-form.tsx:44` | `Textarea` (default, 80px) |

### B5. ★ ColorInput (1 곳)
경로: `components/inputs/color-input.tsx`
`<input type="color">` + webkit overrides wrapping.
- `shells/color-input-row.tsx:10` `NativeColor`

(1 곳만이지만 native input 은 generic 으로 추출하는 게 깨끗 — primitives 로 흡수 불가)

### B6. ⚠️ CollapsibleSectionHeader (2 곳, 후순위)
경로: `components/data-display/collapsible-section-header.tsx`
uppercase title + chevron + onClick toggle.

| 위치 | 인라인 이름 |
|---|---|
| `shells/image-detail-labelers-list.tsx:12` | `Header` (button) |
| `shells/comments-panel.tsx:16` | `Header` (button) |

코드 100% 중복 (24줄 CSS 일치).

### B7. ⚠️ Badge `$tone="overlay"` variant 확장
HiResPill (canvas-overlays) 흡수용. 시각 변경 받아들이면 생략 가능 — 그 경우 기존 Badge `$tone="neutral"` 사용.

### B11. ★ ResizeHandle (1 곳, fundamental 추출)
경로: `components/inputs/resize-handle.tsx`
- 8px 그랩 핸들 + `::after` pseudo 로 좁은 시각 strip (넓은 hit area 와 분리)
- props: `orientation: 'vertical' | 'horizontal'` (col-resize / row-resize)
- 흡수: `patterns/shells/catalog-shell.tsx:20` `Handle`

### B12. ★ AspectRatioImage (1 곳, fundamental 추출)
경로: `components/data-display/aspect-ratio-image.tsx`
- 고정 aspect-ratio 박스 + gradient fallback bg + 자식 `<img>` object-fit
- props: `ratio?: '1/1' | '16/9' | '4/3'`, `src`, `fallback?: gradient | color`
- 흡수: `patterns/gallery/image-grid-cell.tsx:6` `Media`
- 미래 catalog/dashboard/preview 어디서나 썸네일

### B13. ★ OverlayLayer (1 곳, fundamental 추출)
경로: `components/data-display/overlay-layer.tsx`
- `position: absolute; inset: 0; pointer-events: none` + 자식 `> * { pointer-events: auto }`
- 단순 wrapper. props: `anchor?: 'fill' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`
- 흡수: `patterns/gallery/image-grid-cell.tsx:24` `OverlayLayer`
- 미래 어디서나 이미지/카드 위 배지 슬롯

### B10. ★ DropZone (1 → 다중 사용 예정)
경로: `components/inputs/drop-zone.tsx`
시각 (active 상태 border/bg) + drop 이벤트 패스스루 + `hasContent` 모드 (콘텐츠 있을 때 슬림 변형).
- `shells/reference-image-drop-zone.tsx:4` `Zone` 흡수
- 기존 `upload-dropzone.tsx` 도 이걸 사용하도록 refactor

### B8. ★ FloatingOverlay (4+ 곳) — 전수 검증에서 발견
경로: `components/overlays/floating-overlay.tsx`
fixed position + 동적 top/left + 공통 surface 스타일 (border/shadow/radius/z-index/bg). positioning 계산은 caller 가 prop 으로 전달.

| 위치 | 인라인 이름 |
|---|---|
| `shells/class-hover-card.tsx:9` | `Card` |
| `shells/hover-preview.tsx:14` | `Floating` |
| `shells/dataset-menu.tsx:11` | `Menu` |
| `shells/image-context-menu.tsx:7` | (inline) |

각각 positioning 로직은 다르지만 표면 스타일은 동일. 공통 스타일만 흡수.

### B9. ⚠️ Text primitive 확장 (B 가 아니라 primitive 작업이지만 명시)
신규 컴포넌트는 아니지만 **마이그레이션 prereq**. 위 "전수 검증 결과" 섹션의 4 가지 props 추가.

---

## C. 도메인 wrapper 내부 refactor

이 두 파일은 wrapper 자체는 유지 (도메인 결합), 단 내부 styled span 을 generic Badge/Tag 사용으로 교체:

### C1. `shells/device-status-badge.tsx` 내부 refactor
- 현재: 6 device 톤 → 자체 styled span + `status-running/failed/warning` 색
- 변경: 6 device 톤 → Badge 톤 매핑 함수 + `<Badge $tone={mapped}>`
- 시각 변경: status-* 토큰 → badge-* 토큰 (마이그레이션 후 정리)

### C2. `shells/project-type-tag.tsx` 내부 refactor
- 현재: 2 project type 톤 → 자체 styled span
- 변경: `<Tag $bg={mapped} $color={mapped}>` 사용

(추후 features/ 폴더 재구조 시점에 두 파일 모두 `features/devices/`, `features/project/` 로 이동.)

---

## D. 인라인 유지 (불가피한 경우만)

전수 검증 결과 zero-inline 거의 달성 가능. 다음만 예외:

### D1. ~~❌ Canvas/annotation 전용 SVG~~ → 흡수 (정정)
`styled.svg` 2 곳 (`annotation-overlay.tsx:45` `Layer`, `class-lightbox.tsx:44` `Overlay`) 모두 단순 absolute + inset:0 + pointer-events:none. **인라인 `<svg style={{}}>` 로 교체** — Phase 1 A9 와 함께 처리.

### D2. ~~❌ dnd-kit 가상화 row~~ → 흡수 가능 (정정)
`patterns/gallery/virtualized-image-grid.tsx` — TanStack Virtual (`@tanstack/react-virtual`) 사용. (이전 doc 에서 dnd-kit 으로 잘못 표기.) `RowWrap` 의 동적 `top` 값은 `<Grid style={{ position: 'absolute', top: virtualRow.start }} ref={virtualizer.measureElement}>` 로 흡수 가능. **primitives Grid 가 ref forwardRef 만 지원하면 전환 가능**. 같은 파일의 `Scroll`/`Inner`/`LoadMoreHint` 도 Box/Text 로 흡수.

→ **인라인 잔존에서 제거**. Phase 1 A9 레이아웃 흡수 작업 시 같이 처리. 단, primitives Grid/Box 의 forwardRef 지원 여부 확인 필요.

### D3. ~~⚠️ Panel resize handle~~ → 신규 컴포넌트 추출 (정정)
`patterns/shells/catalog-shell.tsx:20` `Handle` — fundamental 한 atomic 빌딩블록이라 `components/inputs/resize-handle.tsx` 로 추출. → **B11. ResizeHandle**.

### D4. ⚠️ 특수 Table (2-3 곳)
기존 `components/data-display/table.tsx` 가 columns-render API 고정이라 다음은 불가:
- `shells/dataset-distribution-heatmap.tsx` — heatmap 셀 (`$intensity` prop)
- `shells/storage-stats-table.tsx` — footer row + 인라인 th/td 스타일
- (devices-table 은 호환 가능)

**선택지:**
- **A. Table 확장** — cell-level className/style callbacks 지원 추가
- **B. 도메인 wrapper 로 분리** — `HeatmapTable`, `StatsTable` 같은 features/ 컴포넌트로

→ **B 권장** — heatmap / footer 는 도메인 특이성. 일반 Table 더 복잡하게 만들지 말고 features 영역에서 처리.

### D5. ~~⚠️ 이미지 셀 inset 오버레이~~ → 신규 컴포넌트 2 개 추출 (정정)
`patterns/gallery/image-grid-cell.tsx` 의 `Media` (자식 img selector), `OverlayLayer` (pointer-events 트릭) 둘 다 fundamental 빌딩블록.
- `Media` → **B12. AspectRatioImage**
- `OverlayLayer` → **B13. OverlayLayer**
- `TopRightLayer`/`Footer` 는 일반 layout 흡수 (Inline/Stack)

### D6. ~~⚠️ DropZone 상태 머신~~ → 신규 컴포넌트 추출 (정정)
`shells/reference-image-drop-zone.tsx:4` `Zone` — 기존 `components/inputs/upload-dropzone.tsx` 와 미묘하게 다름 (file 드롭 vs imageId 드롭). **Universal `DropZone` 추출 추천**:

```
components/inputs/
├── drop-zone.tsx           ← 신규: 시각 + active 상태 + drop 이벤트만
└── upload-dropzone.tsx     ← DropZone + file input 합성 (refactor)
```

- `DropZone` (universal): 시각/active/drop 이벤트 패스스루. `onDragEnter/Over/Leave/Drop` 만 노출. 데이터 해석은 caller.
- `UploadDropzone` (refactor): DropZone + HiddenInput file 합성
- `reference-image-drop-zone`: DropZone 사용 + dataTransfer 에서 imageId 파싱

→ **B10. DropZone (신규 추가)**. 미래 다른 도메인 drag-drop (annotation, asset 등) 도 동일 컴포넌트 사용 가능.

---

## 신규 컴포넌트 최종 리스트

| 항목 | 사용처 | 우선순위 |
|---|---|---|
| ⚙️ **Text primitive 확장** (align/uppercase/letterSpacing/fontFamily/tabular) | 80+ 곳 prereq | 🟢 Phase 0 |
| **DragHandle** | 1 (rename 승격) | 🟢 |
| **FloatingOverlay** | 4 곳 | 🟢 신규 추가 |
| **TextButton** | 5 곳 (+ Link 1 곳 흡수 가능) | 🟡 |
| **MenuItem** | 4 곳 | 🟡 |
| **Textarea** | 3 곳 | 🟡 |
| **ColorInput** | 1 곳 | 🟡 |
| **CollapsibleSectionHeader** | 2 곳 | 🟡 후순위 |
| **DropZone** | 1 (+ upload-dropzone refactor) | 🟡 |
| **ResizeHandle** | 1 (fundamental) | 🟡 |
| **AspectRatioImage** | 1 (fundamental) | 🟡 |
| **OverlayLayer** | 1 (fundamental) | 🟡 |
| (선택) **Badge `$tone="overlay"`** | 1 곳 | 🟡 작은 확장 |

**신규 컴포넌트 11 개 + Text primitive 확장 + Badge variant 확장 1.**

---

## 실행 순서 권장

### Phase 0: 의존성 (prereq)
0. **Text primitive 확장** — `align`, `uppercase`, `letterSpacing`, `fontFamily`, `tabularNums` props 추가. Phase 1 이후 작업의 80+ 곳이 이걸 사용.

### Phase 1: 안전한 정리 (시각 변경 없음 또는 최소)
1. **B3 DragHandle 승격** — `widget-drag-handle.tsx` → `components/inputs/drag-handle.tsx`
2. **A1 IconButton 교체** — 9 곳
3. **A2 ColorSwatch 교체** — 3 곳
4. **A4 Checkbox 교체** — 1 곳
5. **A5/A6 Empty/Placeholder/Muted → Text** — 11 곳
6. **A7 Heading 교체** — 21 곳 `styled.h*` → `<Heading level={...}>`
7. **A9 레이아웃 글루 → primitives** — 광범위 (~150+ 곳, 패턴 파일별로). `styled.div` 236 의 대부분 + `styled.section/aside/header/nav/main/ul/li/label` 등 흡수

### Phase 2: 시각 근접 흡수 (마이그레이션, 정리는 나중)
7. **A3 Badge/Tag/Chip 교체** — 4 곳
8. **A7 Status text → Text** — 3 곳
9. **A8 Link → Text(as="a")** — 1 곳 (또는 TextButton 추출 후)

### Phase 3: 신규 컴포넌트 추출
10. **B8 FloatingOverlay** + 4 곳 교체
11. **B1 TextButton** + 5-6 곳 교체
12. **B2 MenuItem** + 4 곳 교체
13. **B4 Textarea** + 3 곳 교체
14. **B5 ColorInput** + 1 곳 교체
15. **B10 DropZone** + reference-image-drop-zone 교체 + UploadDropzone refactor
16. **B11 ResizeHandle** + catalog-shell 교체
17. **B12 AspectRatioImage** + image-grid-cell Media 교체
18. **B13 OverlayLayer** + image-grid-cell OverlayLayer 교체
19. **B6 CollapsibleSectionHeader** + 2 곳 교체 (후순위)

### Phase 4: 도메인 wrapper refactor
16. **C1 device-status-badge** 내부 → Badge 사용
17. **C2 project-type-tag** 내부 → Tag 사용
18. **D4 특수 Table** → `HeatmapTable`, `StatsTable` features 컴포넌트로 분리

### Phase 5: 시각 일치 정리 (마이그레이션 완료 후)
19. 시각 변경 발생한 곳들 일괄 디자인 정리 (HiResPill, MoreChip, source-breakdown Chip, device-status-badge 색, project-type-tag 색 등)

---

## 수치 요약 (전수 검증 후)

| 작업 | 작업량 |
|---|---|
| ⚙️ Text primitive 확장 (prereq) | 5 props 추가 |
| 🟢 기존 components 교체 (시각 변경 거의 없음) | ~25 곳 |
| 🟢 primitives 로 교체 (레이아웃) | ~150+ 곳 (`styled.div/section/aside/ul/li/label/header/nav/main` 등) |
| 🟢 Text/Heading primitive 교체 | ~70+ 곳 (`styled.span/p/h*/strong`) |
| 🟡 기존 components 교체 (시각 근접) | ~10 곳 |
| 🟡 신규 컴포넌트 추출 | 7 개 + ~20 곳 교체 |
| 🟡 도메인 wrapper 내부 refactor | 2 곳 + 특수 Table 2-3 곳 |
| 🔴 인라인 유지 | **0 곳** ✨ |

**총 인라인 정의 499 개 중 499 제거 / 신규 컴포넌트 11 개 + primitives 확장.**

## 인라인 잔존 — **없음**

이전 "유지" 분류였던 모든 케이스를 fundamental 컴포넌트로 추출:
- TanStack Virtual `RowWrap` — primitives Box/Grid 흡수
- SVG roots 2 곳 — 인라인 `<svg style={{}}>` 흡수
- `reference-image-drop-zone Zone` — Universal **DropZone** 추출 (B10)
- `catalog-shell Handle` — **ResizeHandle** 추출 (B11)
- `image-grid-cell Media` — **AspectRatioImage** 추출 (B12)
- `image-grid-cell OverlayLayer` — **OverlayLayer** 추출 (B13)
- `image-grid-cell TopRightLayer/Footer` — primitives 흡수
