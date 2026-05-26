---
title: Platform Catalog Storybook 재현 로드맵
purpose: platform-catalog-page-spec.md 의 ⚠️/❌ 항목을 phase 단위로 분할 실행하는 계획
audience: storybook story 작성자 / ingradient-ui contributor
date: 2026-05-14
status: 작성 중
reference: ./platform-catalog-page-spec.md
---

# Platform Catalog Storybook 재현 로드맵

[platform-catalog-page-spec.md](./platform-catalog-page-spec.md) 에서 정리한 미구현·차이 항목을 **한 번에 다 하지 않고** 단계별로 진행하기 위한 phase 분할 계획. 각 phase 끝에 typecheck + build + playwright probe 로 검증하고 사용자가 visual review 한 뒤 다음 phase 진행.

## Phase 의존 관계

```
Phase 1 (시각 polish + icons)
   └→ Phase 2 (우측 사이드바)
   └→ Phase 3 (Filter dropdown 8 섹션)
        └→ Phase 4 (Analysis Dashboard 8 위젯)
              └→ Phase 5 (Modal flow)
                   └→ Phase 6 (Upload flow)
                        └→ Phase 7 (Image detail viewer)
                             └→ Phase 8 (Context menu refinement)
                                  └→ Phase 9 (Mobile view)
                                       └→ Phase 10 (Polish / extras)
```

병렬 가능: 1↔2, 3↔4 (서로 독립), 7↔8 (서로 독립). 그 외 순차.

각 phase 의 추정 작업량 — S (small, 0.5일), M (medium, 1일), L (large, 2-3일).

---

## Phase 1 — Icon 도입 + 시각 polish [S] 🎯 가장 즉각적인 fidelity 개선

**목적**: platform 의 lucide-react 아이콘과 정확한 픽셀 detail 을 storybook 에 반영해 첫인상 차이를 거의 없앤다.

### 1-1. 신규 자산
- lucide-react 는 이미 dependency 에 있음 — 직접 import 가능
- `src/components/icons/catalog-icons.tsx` — gallery / catalog 페이지에서 쓰는 아이콘 13개 묶음 export (KebabIcon / GridIcon / TableIcon / StatsIcon / FilterIcon / SortIcon / ClosePanelIcon / MenuIcon / PlusIcon / TrashIcon / UploadIcon / ExportIcon / DownloadIcon)

### 1-2. 수정
- [DatasetListItem](../../src/patterns/shells/dataset-list-item.tsx) — `⋮` → `<MoreVertical size={18} />`
- [GalleryImageCard](../../src/patterns/shells/gallery-image-card.tsx) — kebab `<OptionButton>` 18x18 (현재 OK), `<MoreVertical size={14} />` icon
- [FilterPopoverTrigger](../../src/patterns/shells/filter-popover-trigger.tsx) — label 제거 옵션 (`labelHidden`), icon-only mode 지원. icon prop 으로 `<Filter />`
- [SortPopoverTrigger](../../src/patterns/shells/sort-popover-trigger.tsx) — 동일하게 icon-only mode + `<ArrowUpDown />`
- ModeSwitcher — option 에 `icon` 만 있고 label 은 hidden 가능하도록 옵션 추가 (그 외 `<LayoutGrid /> / <Table /> / <BarChart3 />`)
- [GalleryToolbar](../../src/patterns/shells/gallery-toolbar.tsx) — selection row 항상 표시 + ViewModeToggle 우측 marginLeft auto. selectionCount===0 일 때는 SelectionBar 의 좌측 text 만 "{total} images" 형태로
- [GalleryImagesTable](../../src/patterns/shells/gallery-images-table.tsx) — "Labeled" column 추가 (Yes/No)
- SyncStatusChip - `local_only` 텍스트 "Local" 확인
- SelectionActionBar 의 Delete button — 빨간 dim 스타일 `background: rgba(120,28,28,0.18); border: 1px solid rgba(224,92,92,0.45); color: var(--ig-color-danger);` (또는 새 `DangerOutlineButton` 컴포넌트)
- Catalog.stories.tsx — `<DeleteOutlineButton>` 사용으로 교체. ModeSwitcher 에 icon-only 옵션.

### 1-3. 새 토큰 (필요 시)
- `--ig-color-danger-dim-bg` / `-border` — `rgba(120,28,28,0.18)` / `rgba(224,92,92,0.45)`

### 1-4. 검증
- playwright probe: Catalog story default scenario 에서
  - kebab 버튼이 SVG icon 로 렌더 (텍스트 `⋮` 0개)
  - Filter / Sort 버튼이 icon-only (텍스트 "Filter" "Sort" 0개)
  - Selection row 가 항상 보임 (selectionCount = 0 도)
  - ViewModeToggle 3 버튼 icon-only

---

## Phase 2 — 우측 사이드바 (Class & Members) [M]

**목적**: 3-column layout 의 우측 영역을 채워 platform 의 실제 화면 비율 / 정보 밀도 재현.

### 2-1. 신규 ingradient-ui pattern
- `src/patterns/shells/catalog-right-panel.tsx` — CatalogRightPanel (slots: `classSection`, `membersSection`)
- `src/patterns/shells/class-pool-list.tsx` — ClassPoolList (props: `classes`, `onRemove`, optional `onHover`). 각 row = `<ColorDot> + <ClassChipLabel> + <RemoveButton>`
- `src/patterns/shells/member-pool-list.tsx` — MemberPoolList (props: `members`, `onRemove`)
- `src/components/inputs/tag-list-search.tsx` 가 이미 있는지 확인 → 없으면 추가 (검색 input + 추천 dropdown + onSelect)

### 2-2. 수정
- CatalogShell — 이미 `rightSidebar` slot 있음. CatalogRightPanel 을 넣음
- Catalog.stories.tsx — useCatalogScene 에 `selectedClassIds`, `selectedMemberIds`, `dragOverClassId` state 추가. CatalogRightPanel 주입

### 2-3. 신규 scenario
- `right-empty-classes` — 우측 panel 의 class 비어있음
- `right-loading` — class loading
- `right-many-classes` — 많은 class chip
- `member-overflow` — 많은 member

### 2-4. Fixture
- `stories/fixtures/platform/0.0.1/catalog-classes.ts` — MockClass (id, name, color, count) 10개
- `stories/fixtures/platform/0.0.1/catalog-members.ts` — MockMember (id, name, role, avatar?) 6개

### 2-5. 검증
- Catalog default 시나리오에서 우측 사이드바가 320px 으로 렌더, Class 와 Members section 모두 보임
- ResizeHandle 우측에 drag 가능

---

## Phase 3 — Gallery Filter Dropdown 8 섹션 [M]

**목적**: FilterPopoverTrigger 의 mock label 을 실제 platform 의 8 섹션 구조로 교체.

### 3-1. 신규 ingradient-ui pattern
- `src/components/inputs/date-range-field.tsx` — DateRangeField (props: `from`, `to`, `onChange`. 2 개의 DatePickerField 가로 배치). 이미 DatePickerField 있음
- `src/patterns/shells/filter-section.tsx` — FilterSection (props: `title`, optional `actions`, `children`. 간단한 stack with label)
- `src/patterns/shells/filter-class-chip.tsx` — FilterClassChip (props: `checked`, `color?`, `label`, `onChange`. 체크박스 + 옵션 color swatch + label)
- `src/patterns/shells/filter-searchable-list.tsx` — FilterSearchableList (props: `placeholder`, `items`, `selectedIds`, `onToggle`, optional `renderItem`. SearchField + 스크롤 list)
- `src/patterns/shells/gallery-filter-panel.tsx` — GalleryFilterPanel (composed: 8 section). props 로 각 섹션 state 받음

### 3-2. 수정
- Catalog.stories.tsx 의 FilterPopoverTrigger `panel` prop 에 `<GalleryFilterPanel />` 주입
- Scene state 에 filterPanelState 추가 (mock — uploadDateFrom / Class selectedIds / Pattern selectedIds 등)

### 3-3. 새 scenario
- `filter-active` — 여러 필터가 선택된 상태 (active 색 표시)
- `filter-class-search-open` — class section 의 search field 에 텍스트 입력 / 매칭

### 3-4. 검증
- FilterPopover 가 열렸을 때 8 섹션 모두 보임
- DateRangeField interactive (날짜 선택)
- FilterClassChip 체크 / 해제 가능
- FilterSearchableList 의 SearchField 입력 시 list filter

---

## Phase 4 — Analysis Dashboard 8 위젯 [M]

**목적**: Stats view 의 4 stat card → 8 위젯으로 확장.

### 4-1. 신규 ingradient-ui pattern
- 이미 `BarChartCard`, `LineChartCard`, `PieChartCard`, `ChartContainer`, `ChartLegend` 있음
- `src/patterns/shells/dashboard-widget.tsx` — DashboardWidget (props: `title`, `children`, optional `actions`)
- `src/patterns/shells/labeling-progress-bar.tsx` — LabelingProgressBar (Pending / Processed 양분 표시)
- `src/patterns/shells/dataset-distribution-heatmap.tsx` — DatasetDistributionHeatmap (dataset × class matrix)

### 4-2. 수정
- AnalysisDashboard pattern — slots 확장: `stats`, `widgets: { id, title, content }[]`, `gridLayout?: 'auto' | '2x4' | '3x3'`
- mock-stats.ts → mock-dashboard.ts — 8 위젯 mock 데이터
  - `data_collection`: { datasetName: 'd1', count: 1247 } 5개 → BarChartCard
  - `timeline`: { date: '2024-Q1', count: 200 } 12개 → LineChartCard
  - `labeling_status`: { labeled: 892, unlabeled: 321, error: 34 } → PieChartCard
  - `class_ratio`: { className, ratio } 5개 → PieChartCard
  - `labeling_by_person`: { uploader, count } 6개 → Table
  - `defects_by_source`: { source, count } 5개 → BarChartCard
  - `pending_processed`: { pending: 321, processed: 892 } → LabelingProgressBar
  - `dataset_distribution`: matrix → Heatmap

### 4-3. 새 scenario
- `stats-rich` — 8 위젯 다 표시
- `stats-empty` — 데이터 없을 때

### 4-4. 검증
- Stats view 진입 시 8 widget grid 표시
- 각 chart 가 mock 데이터로 그려짐

---

## Phase 5 — Modal flow [M-L]

**목적**: dataset 추가 / 복제 / 삭제 / drag-drop / export / upload-quality 다이얼로그 7개를 storybook 에서 시각 재현.

### 5-1. 신규 ingradient-ui pattern
- `src/patterns/shells/add-dataset-modal.tsx` — DialogShell 기반. 이름 입력 + TaskType select (4 옵션) + class 선택 (checkbox group)
- `src/patterns/shells/duplicate-dataset-modal.tsx` — DialogShell + 이름 input + "Copy labels too" checkbox
- `src/patterns/shells/drag-drop-decide-modal.tsx` — DialogShell + Move/Copy 2 옵션 radio + Confirm
- `src/patterns/shells/igp-export-modal.tsx` — DialogShell + 진행률 + 다운로드 링크 mock
- `src/patterns/shells/upload-quality-modal.tsx` — DialogShell + 4 quality option (High / Medium / Low / Lossless)
- ConfirmRemovalModal — 이미 ConfirmDialog 있음. wrapper 생략하고 직접 사용

### 5-2. 수정
- Catalog.stories.tsx — useCatalogScene 에 `addDatasetOpen`, `duplicateModal`, `dragDropDialog`, `igpExport`, `uploadQuality`, `pendingClassRemoval`, `pendingMemberRemoval` state 추가 (control 토글)
- DatasetListPanel `onAddDataset` → AddDatasetModal 열기
- DatasetMenu 의 Duplicate / Export / Delete → 각 modal 열기
- 우측 사이드바 RemoveButton → ConfirmRemovalModal 열기

### 5-3. 새 scenario
- `add-dataset-modal` — modal 열린 상태
- `duplicate-modal` — modal 열린 상태
- `confirm-class-removal`, `confirm-member-removal`, `confirm-dataset-delete`
- `drag-drop-decide-open`
- `igp-export-modal`
- `upload-quality-modal`

### 5-4. 검증
- 각 modal scenario 가 playwright probe 통과
- ConfirmDialog 동작 (취소 / 확인)

---

## Phase 6 — Upload flow [M]

**목적**: UploadDropzone wrapper 통합 + Upload Quality Modal 연동.

### 6-1. 수정
- `UploadDropzone` 이미 ui 에 있음. CatalogShell 의 center 영역을 감싸도록 Catalog story 에서 wrapping
- toolbar 의 Upload 버튼 클릭 → fake file picker → UploadQualityModal open
- drag-over 시 grid 영역 전체에 overlay (현재 grid 안만)
- toolbar 상단에 upload progress bar 추가 (`uploadProgress` 가 0~100 일 때)

### 6-2. 새 scenario
- `upload-in-progress` — toolbar 에 진행률 30% bar
- `upload-quality-shown` — UploadQualityModal 열림
- `drag-over-full` — 전체 화면 drag-over overlay

### 6-3. 검증
- drag-over 시 grid 가 아니라 center 영역 전체에 overlay
- toolbar 의 진행률 bar 가 0~100% 시각 렌더

---

## Phase 7 — Image Detail Modal 확장 [M]

**목적**: GalleryDetailModal 안에 platform 의 실제 콘텐츠 (annotation viewer / comments / class info) 슬롯 추가.

### 7-1. 신규 ingradient-ui pattern
- `src/patterns/shells/image-detail-viewer.tsx` — ImageDetailViewer (props: `image`, `annotations: ReactNode (slot)`, optional `commentsSlot`, `classSlot`). 좌측 큰 thumbnail + 우측 meta panel
- `src/patterns/shells/annotation-viewer.tsx` — AnnotationViewer (mock — annotation overlay 위에 bounding box / mask preview)
- `src/patterns/shells/comments-panel.tsx` — CommentsPanel (mock — comment list + reply input)
- `src/patterns/shells/image-class-tags.tsx` — ImageClassTags (this image 의 class 태그들)

### 7-2. 수정
- GalleryDetailModal — children slot 으로 `<ImageDetailViewer>` 받음
- mock 데이터 (annotations / comments / class tags) 추가

### 7-3. 새 scenario
- `detail-with-annotations` — annotation viewer 가 보이는 상태
- `detail-with-comments` — comments panel 표시
- `detail-multi-class` — 여러 class tag

---

## Phase 8 — Image context menu 정교화 [S]

**목적**: 5 generic action → platform 의 정확한 구조 (Copy To 서브메뉴 / Cut+Paste / Archive toggle).

### 8-1. 신규 ingradient-ui pattern
- DatasetMenu / GalleryImageMenu — submenu 지원 추가 (action 에 `subActions: DatasetMenuAction[]` 옵션). hover 시 우측에 펼쳐짐.
- ImageMenu 의 새 action types:
  - `copyTo` — sub-menu 로 dataset list (각 dataset 한 줄)
  - `cut` — clipboard 에 담음 (mock)
  - `paste` — clipboard 가 있을 때만 활성
  - `archive` / `unarchive` — 상태 토글
  - `delete` — danger

### 8-2. 수정
- DatasetMenu pattern — `subActions` 지원
- GalleryImageMenu pattern — 새 action 구조

### 8-3. 새 scenario
- `image-menu-submenu` — Copy To submenu 열린 상태
- `image-menu-archived` — archive 옵션 표시 (이미 archived 면 unarchive 로)

---

## Phase 9 — Mobile view [M]

**목적**: CatalogMobileView 의 시각 재현 — sidebar 없이 dataset selector dropdown + 하단 sticky toolbar.

### 9-1. 신규 ingradient-ui pattern
- `src/patterns/shells/catalog-mobile-shell.tsx` — CatalogMobileShell (slots: `topBar` (dataset selector), `body`, `bottomToolbar`)
- `src/patterns/shells/dataset-selector-mobile.tsx` — DatasetSelectorMobile (dropdown trigger + list)
- `src/patterns/shells/gallery-mobile-toolbar.tsx` — GalleryMobileToolbar (60px sticky, 5 icon button: View / Filter / Sort / Export / Upload)

### 9-2. 수정
- Catalog story 의 viewport 가 mobile 일 때 CatalogShell 대신 CatalogMobileShell 사용
- useCatalogScene 에 `mobileDatasetDropdownOpen` state

### 9-3. 새 scenario
- `mobile-default` (viewport mobile)
- `mobile-dataset-dropdown-open`
- `mobile-bottom-filter`

---

## Phase 10 — Polish / Extras [S]

**목적**: 자잘한 마지막 차이.

### 10-1. 항목
- `CollapseBtn` — DatasetListPanel header 에 X 버튼 (사이드바 collapse)
- `ExpandBtn` — Toolbar 의 `leftOfSelectionCount` slot. 사이드바 collapse 된 상태에서 메뉴 icon
- HoverPreview `transform: scale(1.06)` 정확 적용
- ArchivedOverlay — 단순 dim 대신 SVG hatch pattern (DIM_FILL `rgba(0,0,0,0.3)` + STRIPE `rgba(0,0,0,0.5)` 2px)
- DragOverlay 배경 색 `rgba(0,0,0,0.6)` + border `3px dashed rgba(255,255,255,0.4)`
- CatalogShell 의 좌·우 사이드바 width localStorage 저장 (`useCatalogPanelResize` 등가 hook)
- Tag / DatasetListItem 의 정확 padding / SelectAllRow 간격

### 10-2. 수정
- DatasetListPanel — header 우측에 CollapseBtn 추가
- GalleryToolbar — `leftOfSelectionCount` slot prop 추가
- Catalog story — sidebarCollapsed 시 toolbar 에 ExpandBtn 주입
- MediaOverlay — `variant: 'archived'` 시 SVG hatched pattern 사용 (별도 sub-component)

---

## Cross-cutting: 매 phase 마다 함께 진행

각 phase 끝에서 다음 항상 확인:
1. **Typecheck** — `npx tsc --noEmit`
2. **Build** — `npm run build:storybook`
3. **Playwright probe** — 그 phase 의 신규 / 변경 scenario URL 200 OK + 핵심 element 존재
4. **Visual diff** — 사용자가 platform 의 실제 catalog 화면과 storybook default scenario 를 좌우 비교

## 신규 file 누적 추정

| Phase | 신규 ui pattern/component | 신규 fixture | 신규 scenario | 작업량 |
|---|---|---|---|---|
| 1 | 1 icon barrel + 1 styled DeleteOutline | — | 0 (기존 scenario 시각만 변경) | S |
| 2 | 4 (RightPanel + ClassPoolList + MemberPoolList + TagListSearch) | 2 (classes + members) | 4 | M |
| 3 | 5 (DateRangeField + FilterSection + FilterClassChip + FilterSearchableList + GalleryFilterPanel) | — | 2 | M |
| 4 | 3 (DashboardWidget + LabelingProgressBar + DatasetDistributionHeatmap) | 1 (dashboard data) | 2 | M |
| 5 | 5 (AddDataset + Duplicate + DragDropDecide + IgpExport + UploadQuality modal) | — | 7 | M-L |
| 6 | 0 (UploadDropzone wrap 재활용) | — | 3 | M |
| 7 | 4 (ImageDetailViewer + AnnotationViewer + CommentsPanel + ImageClassTags) | 1 (annotations + comments) | 3 | M |
| 8 | DatasetMenu / GalleryImageMenu 수정 (submenu) | — | 2 | S |
| 9 | 3 (CatalogMobileShell + DatasetSelectorMobile + GalleryMobileToolbar) | — | 3 | M |
| 10 | 0 (기존 수정) | — | (refinement) | S |
| **합계** | **25 신규 pattern/component** | 4 신규 fixture | 26 신규 scenario | 약 10-14일 |

---

## 실행 시 권고

- 각 phase 시작 전 plan 문서에 작업 일정 / 담당 / 완료 체크리스트 추가
- phase 끝마다 commit (예: "feat(ui): platform-catalog phase 1 — icons + visual polish")
- phase 5 이후로 모달 수가 많아지므로 visual regression playwright snapshot 도 고려

---

## 변경 이력

- 2026-05-14 — 초안 작성. 10 phase 로 분할.
