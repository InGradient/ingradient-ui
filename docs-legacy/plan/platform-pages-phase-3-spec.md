---
title: Phase 3 — Catalog 추출
purpose: storybook 의 CatalogScene JSX 를 @ingradient/platform-pages/catalog 로 추출. desktop / mobile 동시 지원. 50+ scenario story 를 view import 기반으로 rewrite
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-phase-2-spec.md
  - ./platform-pages-phase-2-5-spec.md
---

# Phase 3 — Catalog 추출

> Roadmap: [platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md) § Phase 3
>
> Phase 2.5 후속. view 는 이제 `packages/platform-pages/src/catalog/` 에 작성.

---

## 1. 목적

storybook 의 `CatalogScene` (662 줄 + scene hook 189 줄 + 50+ scenario) 를 `@ingradient/platform-pages/catalog` 의 `CatalogView` 로 추출. desktop + mobile 분기까지 포함.

성공 후 ingradient-platform 의 `CatalogPage.tsx` 가 view 를 import 하고 hook → props 만 주입하면 동작.

---

## 2. 핵심 구조 분석

storybook 의 `CatalogScene` 은 다음 5개 레이어:

| 레이어 | 내용 | 이미 ui 에 있는 patterns |
|---|---|---|
| **Outer shell** | `PageTopBar` (desktop) 또는 `CatalogMobileShell` (mobile). dragOverFull overlay | PageTopBar, CatalogShell, CatalogMobileShell |
| **Left sidebar** | DatasetListPanel (desktop) / DatasetSelectorMobile (mobile) | DatasetListPanel, DatasetSelectorMobile |
| **Toolbar** | search / filter popover / sort popover / view mode / actions / selection row (desktop) / GalleryMobileToolbar (mobile) | GalleryToolbar, FilterPopoverTrigger, SortPopoverTrigger, GalleryMobileToolbar, ExpandSidebarBtn, ModeSwitcher |
| **Body** | 분기: permissionDenied / error / loading / empty / grid / table / stats | GalleryImageCard, HoverPreview, GalleryImagesTable, AnalysisDashboard, DashboardWidget, EmptyState, Spinner, Alert |
| **Right sidebar** | CatalogRightPanel + Class section + Members section | CatalogRightPanel, ClassPoolList, MemberPoolList, TagListSearch |
| **Overlays** | 10개 modal/menu | GalleryImageMenu, DatasetMenu, GalleryDetailModal, AddDatasetModal, DuplicateDatasetModal, DragDropDecideModal, IgpExportModal, UploadQualityModal, ConfirmDialog (x3) |

UI 부품은 모두 이미 patterns 에 있음. view 는 composition + 상태 분기 + props pass-through.

---

## 3. View 분할 — 11 file

```
packages/platform-pages/src/catalog/
├─ CatalogView.tsx              — top entry (isMobile 으로 desktop/mobile 선택)
├─ CatalogDesktopView.tsx       — desktop 레이아웃 (PageTopBar + CatalogShell + dragOverFull)
├─ CatalogMobileView.tsx        — mobile 레이아웃 (CatalogMobileShell + bottom sheet)
├─ CatalogToolbarRow.tsx        — GalleryToolbar 의 search/filter/sort/view/actions 조립
├─ CatalogBody.tsx              — 상태 분기 + grid/table/stats 선택
├─ CatalogGridView.tsx          — GalleryImageCard map + HoverPreview
├─ CatalogRightSidebar.tsx      — CatalogRightPanel + Class section + Members section
├─ CatalogOverlays.tsx          — 10개 modal/menu 묶음
├─ CatalogView.styles.ts        — DangerDimButton + dragOver overlay 등
├─ types.ts                     — 도메인 type + Props group
└─ index.ts                     — barrel
```

각 파일 ≤ 200 줄 목표.

---

## 4. Props 그룹핑 — 9 group

플랫 80+ props 는 호출부 가독성 0. **9 group** 으로 묶음 (scene hook 출력 단위 + 데이터 단위 + overlay 단위와 매칭).

```ts
export interface CatalogViewProps {
  // 1) 레이아웃 모드
  isMobile?: boolean

  // 2) 상단 / 상태
  page: {
    title: string                  // "Catalog"
    subtitle: string
    projectName?: string | null
    permissionDenied?: boolean
    error?: string | null
    noProject?: boolean
    dragOverFull?: boolean
    dragOverGrid?: boolean
  }

  // 3) 좌측 — Dataset list
  datasets: CatalogDatasetsPaneProps

  // 4) 가운데 — Toolbar
  toolbar: CatalogToolbarPaneProps

  // 5) 가운데 — Body / Images
  images: CatalogImagesPaneProps

  // 6) 우측 — Class / Members
  rightSidebar: CatalogRightSidebarPaneProps | null   // 모바일이면 null

  // 7) Mobile 전용
  mobile?: CatalogMobilePaneProps                     // isMobile 일 때만 사용

  // 8) Stats view 콘텐츠 — viewMode='stats' 시 body 가 렌더
  statsContent?: ReactNode                            // caller 가 AnalysisDashboard 등 조립

  // 9) Detail modal 콘텐츠 — open 시 body 안에 렌더
  detailContent?: ReactNode

  // 10) 모든 overlay
  overlays: CatalogOverlaysProps
}
```

각 group 의 세부:

```ts
export interface CatalogDatasetsPaneProps {
  datasets: CatalogDataset[]
  selectedIds: Set<string>
  currentId?: string
  loading?: boolean
  noProject?: boolean
  dragOverDatasetId?: string
  sidebarCollapsed?: boolean
  onSelectAll: (checked: boolean) => void
  onToggleSelect: (id: string, checked: boolean) => void
  onSelectCurrent: (id: string) => void
  onAddDataset: () => void
  onOpenDatasetMenu: (id: string, el: HTMLElement) => void
  onCollapse: () => void
  onExpand: () => void
}

export interface CatalogToolbarPaneProps {
  viewMode: 'grid' | 'table' | 'stats'
  onChangeViewMode: (mode: 'grid' | 'table' | 'stats') => void
  searchValue: string
  onSearchChange: (value: string) => void
  filterState: GalleryFilterPanelState
  onFilterChange: (state: GalleryFilterPanelState) => void
  onFilterReset: () => void
  hasActiveFilter: boolean
  filterDefaultOpen?: boolean
  sortValue: string
  sortOptions: Array<{ value: string; label: string }>
  onSortChange: (value: string) => void
  sortDefaultOpen?: boolean
  classes: CatalogClass[]
  members: CatalogMember[]
  patternItems?: Array<{ id: string; label: string }>
  // selection row
  totalCount: number
  loadedCount: number
  selectionCount: number
  allSelected: boolean
  uploadProgress?: number
  onToggleSelectAll: (checked: boolean) => void
  onDelete: () => void
  // actions
  onExport: () => void
  onUpload: () => void
}

export interface CatalogImagesPaneProps {
  images: CatalogImage[]
  selectedImageIds: Set<string>
  loading?: boolean
  hoverImageId?: string
  datasetNameById: Record<string, string>
  onToggleSelect: (id: string, checked: boolean) => void
  onOpenDetail: (id: string) => void
  onOpenMenu: (id: string, el: HTMLElement) => void
  onHover?: (id: string | undefined) => void
}

export interface CatalogRightSidebarPaneProps {
  classesLoading?: boolean
  membersLoading?: boolean
  connectedClasses: CatalogClass[]
  candidateClasses: Array<{ id: string; color: string; label: string }>
  members: CatalogMember[]
  onAddClass: (id: string) => void
  onRemoveClass: (id: string) => void
  onRemoveMember: (id: string) => void
}

export interface CatalogMobilePaneProps {
  datasetSelectorOpen: boolean
  onSetDatasetSelectorOpen: (open: boolean) => void
  bottomSheet: 'filter' | 'sort' | null
  onSetBottomSheet: (sheet: 'filter' | 'sort' | null) => void
}

export interface CatalogOverlaysProps {
  imageMenu: {
    anchorEl: HTMLElement | null
    datasets: CatalogDataset[]
    clipboardHasImages?: boolean
    archived?: boolean
    defaultOpenSubmenuKey?: 'copy-to' | 'move-to'
    onClose: () => void
    onAction?: (key: string) => void   // openLabeling/copyTo/moveTo/cut/paste/archive/unarchive/delete
  }
  datasetMenu: {
    anchorEl: HTMLElement | null
    onClose: () => void
    onAction: (key: 'rename' | 'duplicate' | 'export' | 'delete') => void
  }
  detail: {
    image: CatalogImage | null
    open: boolean
    onClose: () => void
  }
  addDataset: { open: boolean; onClose: () => void; onSubmit: () => void; classes: CatalogClass[] }
  duplicateDataset: { datasetId?: string; defaultName: string; onClose: () => void; onSubmit: () => void }
  dragDrop: { open: boolean; sourceDatasetName: string; targetDatasetName: string; itemCount: number; onClose: () => void; onConfirm: () => void }
  igpExport: { open: boolean; phase: 'preparing' | 'compressing' | 'ready' | 'error'; progress: number; downloadUrl?: string; filename: string; onClose: () => void }
  uploadQuality: { open: boolean; fileCount: number; onClose: () => void; onConfirm: () => void }
  pendingClassRemoval: { className: string | undefined; onCancel: () => void; onConfirm: () => void }
  pendingMemberRemoval: { open: boolean; onCancel: () => void; onConfirm: () => void }
  pendingDatasetDeletion: { datasetName: string | undefined; onCancel: () => void; onConfirm: () => void }
}
```

---

## 5. 도메인 type

```ts
export type CatalogViewMode = 'grid' | 'table' | 'stats'

export interface CatalogDataset {
  id: string
  name: string
  task_type?: string
}

export interface CatalogImage {
  id: string
  name: string
  thumb_url: string
  width?: number
  height?: number
  size_bytes?: number
  uploader?: string
  created_at?: string
  dataset_id?: string
  sequence_id?: string | null
  sequence_step?: number
  pattern_label?: string | null
  sync_state?: 'synced' | 'uploading' | 'failed'
  archived?: boolean
  processing?: boolean
}

export interface CatalogClass {
  id: string
  name: string
  color: string
}

export interface CatalogMember {
  id: string
  name: string
  avatar_url?: string
}
```

Fixtures 의 `CatalogScene` 와 type alias 일치. fixture import 금지.

---

## 6. 변경 파일

### 6.1 신규 11 file (위 §3)

### 6.2 수정 (2 file)

- `packages/platform-pages/src/index.ts` — `export * from './catalog'` 추가
- `stories/pages/platform/0.0.1/Catalog.stories.tsx` — JSX 모두 view 호출로 교체. scene hook 결과를 9 group props 로 packing. ≤ 250 줄 목표 (현재 662)

### 6.3 건드리지 않음

- `stories/fixtures/platform/0.0.1/catalog-*.ts` (datasets, images, scenarios)
- `stories/pages/platform/0.0.1/catalog/` 안의 scene hook, mock-dashboard, mock-detail, mock-stats
- 모든 ui pattern / component
- ingradient-platform 의 catalog 관련 파일

---

## 7. Stats view 처리

`viewMode === 'stats'` 시 story 는 `<AnalysisDashboard widgets={[8개 widget]} />` 를 직접 조립 (story 의 line 466-547).

view 가 이걸 다 받기는 너무 props 가 많음. **slot 접근**:

- View 의 `statsContent: ReactNode` prop 으로 받음
- Story 가 `<AnalysisDashboard ... />` JSX 를 직접 작성해 prop 으로 전달
- platform 이 향후 자체 stats 데이터를 wire 할 때도 동일 slot 사용

Body 는 `viewMode === 'stats'` 이고 `images.length > 0` 일 때 `statsContent` 렌더. 빈 데이터면 `<EmptyState title="No data" ... />`.

같은 패턴 — Detail modal 안의 콘텐츠도 `detailContent: ReactNode` slot.

---

## 8. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 2 | `npm run build:package` | workspace 빌드 통과, `packages/platform-pages/lib/index.js` 19 KB → ~80 KB 예상 |
| 3 | `npm run build:storybook` | exit 0 |
| 4 | Playwright probe — 12 scenario | 12/12 pass, console error 0 |

probe 대상 12 scenario:
- `default` — desktop grid + dataset list + toolbar
- `empty-images` — empty state
- `loading-images` — spinner
- `permission-denied` — warning alert
- `mixed-sync` — sync chip varied
- `table-view` — GalleryImagesTable
- `stats-view` — AnalysisDashboard 렌더
- `multi-selection` — selection bar count
- `image-menu-open` — GalleryImageMenu visible
- `detail-open` — GalleryDetailModal visible
- `mobile-default` — CatalogMobileShell 렌더
- `modal-add-dataset` — AddDatasetModal visible

---

## 9. 성공 기준

- 검증 1~4 통과
- view 파일 11개 각 200 줄 미만
- story file 줄 수 ≤ 250 (현재 662, 60% 감소)
- scene hook (`use-catalog-scene.ts`) 그대로 유지

---

## 10. 리스크

### 10.1 props surface 가 너무 큼

위험: 80+ props 가 9 group 으로 묶여도 호출부가 복잡

대응: scene hook 결과를 그룹별로 spread 하는 **변환 함수** 를 story 에 작성. platform 마이그레이션 시에도 동일 패턴.

### 10.2 desktop/mobile JSX 가 사실상 별도

위험: CatalogView 의 두 path 가 거의 안 겹쳐서 같은 view 로 묶는 게 어색

대응: `CatalogView` 는 `isMobile ? <CatalogMobileView ... /> : <CatalogDesktopView ... />` 의 얇은 dispatcher. 두 subview 가 자체 로직. 같은 props 받지만 일부만 사용.

### 10.3 stats / detail content 가 slot 이라 platform 이 다시 짜야 함

위험: 추출 효과 줄어듦

대응: 의도된 trade-off. stats 의 8 widget data 를 prop 으로 받는 게 더 부담. detail 도 platform 이 annotation 편집 UI 결정 권한이 있음. slot 으로 두면 양쪽이 유연.

### 10.4 GalleryToolbar 의 props 가 매우 많음 (~25개)

위험: `CatalogToolbarRow.tsx` 가 200 줄 초과 가능

대응: 본 spec 의 §3 에서 toolbar 를 별도 파일로 분리. props pass-through 만 하면 ~150 줄.

### 10.5 50+ scenario 변환 함수 verbose

위험: story 가 250 줄 초과

대응: scenario / scene → props 변환을 헬퍼로 분리 (e.g. `buildCatalogViewProps(scenario, scene)`). 별도 helper 파일은 만들지 않고 story 내부 함수.

### 10.6 mobile bottom sheet 의 inline style

위험: story 의 mobile filter bottom sheet 가 inline `position: fixed` JSX → view 안에 옮기면 추상화 깨짐

대응: view 의 `CatalogMobileView` 에 자체 styled `BottomSheetWrap` 으로 옮김. mobile 전용 시각 자산.

### 10.7 패턴 prop 들의 generic / readonly mismatch

위험: view 의 `CatalogDataset[]` 와 pattern (`DatasetListPanel`) 의 input type 이 미묘하게 다를 수 있음

대응: 실행 시 typecheck. 도메인 type 을 pattern 에 맞춰 좁힘 또는 mapping 함수 사용.

---

## 11. Rollback

git revert: 신규 11 file + 수정 2 file. workspace 빌드는 동일 상태. probe 회귀.

---

## 12. 다음 액션

1. 본 spec ok
2. 11 신규 file 작성 순서: types → styles → Overlays → RightSidebar → ToolbarRow → GridView → Body → MobileView → DesktopView → View → index
3. story rewrite (변환 helper 포함)
4. probe 작성
5. 검증 1~4 실행
6. Phase 4 (Settings) spec 으로 이동
