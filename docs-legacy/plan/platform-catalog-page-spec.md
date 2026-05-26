---
title: Platform Catalog 페이지 전체 명세
purpose: ingradient-platform 의 Catalog 페이지(/p/:projectId/catalog) 를 storybook 에서 재현하기 위한 픽셀·요소 단위 명세
audience: ingradient-ui contributor / storybook story 작성자 / platform UI migration 작업자
date: 2026-05-14
status: 작성 중 — storybook 재현이 끝날 때까지 유지
---

# Platform Catalog 페이지 전체 명세

storybook 의 `Pages/Platform/0.0.1/Catalog` 가 platform 의 실제 화면과 일치하도록 만들기 위한 **단일 진실 명세서**. 모든 UI 요소를 한 줄도 빠뜨리지 않고 platform 원본 jsx / styled / 데이터를 정리. 각 요소 옆 ✅ 는 storybook 에 구현됨, ⚠️ 는 부분 구현, ❌ 는 미구현.

---

## 0. 라우팅 & 전체 진입점

- **URL**: `/p/:projectId/catalog`
- **라우트 정의**: [frontend/app/ProtectedAppShell.tsx:204-209](../../../ingradient-platform/frontend/app/ProtectedAppShell.tsx#L204-L209)
  ```tsx
  <Route path="/p/:projectId" element={<ProjectRouteGuard />}>
    <Route index element={<Navigate to="catalog" replace />} />
    <Route path="catalog" element={<CatalogPage />} />
  </Route>
  ```
- **Layout 래퍼**: `<Layout>` → `<Sidebar>` (앱 전역 nav) + `<MobileNavigation>` + `<Main>` → 그 안에 `CatalogPage` 렌더
- **모바일 분기**: `useCatalogViewport(MOBILE_BREAKPOINT = 768)` 으로 `viewport.isMobile` 판정 → `CatalogPageMobile` 또는 `CatalogPageDesktop` 렌더
- **상수**: [frontend/features/catalog/constants.ts](../../../ingradient-platform/frontend/features/catalog/constants.ts)
  ```ts
  TOP_BAR_HEIGHT = 72        // TopBar / section header 의 공통 높이
  MOBILE_BREAKPOINT = 768
  PANEL_MIN_WIDTH = 150
  PANEL_MAX_WIDTH = 600
  PANEL_STORAGE_KEY = 'ingradient-catalog-panel-widths'
  TASK_TAG = { classification: 'CLS', object_detection: 'OD', segmentation: 'Seg', point: 'PT' }
  ```

---

## 1. TopBar (페이지 헤더) ⚠️

[frontend/pages/CatalogPage.tsx:99-115](../../../ingradient-platform/frontend/pages/CatalogPage.tsx#L99-L115) — `<TopBar>` 가 전체 페이지 최상단에 1개.

### 1-1. 구조
```tsx
<TopBar style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <TopBarTitle>Catalog</TopBarTitle>
    <TopBarSubtitle>Organize datasets, manage dataset-class links, and browse labeled images inside rounded workspaces.</TopBarSubtitle>
  </div>
  {currentProject && <HeaderProjectName>{currentProject.name}</HeaderProjectName>}
</TopBar>
```

### 1-2. 스타일 ([catalog.styles.ts:22-39](../../../ingradient-platform/frontend/components/catalog/catalog.styles.ts#L22-L39))
| 요소 | 스타일 |
|---|---|
| `TopBar` | `styled(UiPageHeader)` — `display: flex; flex-direction: column; justify-content: center; gap: 6px;` |
| `TopBarTitle` | `UiPageTitle` — 페이지 메인 타이틀 |
| `TopBarSubtitle` | `UiPageSubtitle` — 페이지 서브 타이틀 |
| `HeaderProjectName` | `font-size: 18px; font-weight: 700; color: var(--ig-color-text-secondary);` |

### 1-3. Storybook 현황
- ✅ PageTopBar pattern 추가 ([src/patterns/page/page-top-bar.tsx](../../src/patterns/page/page-top-bar.tsx))
- ⚠️ "Project · Wafer-2026" 텍스트 — `HeaderProjectName` 의 font-size 18px / font-weight 700 / text-secondary 정확히 맞춰야

---

## 2. 3-column Layout (Desktop) ⚠️

[frontend/components/catalog/CatalogDesktopView.tsx](../../../ingradient-platform/frontend/components/catalog/CatalogDesktopView.tsx) — `<ContentRow>` 안에 좌·중·우 3개 패널 + 양 사이에 `ResizeHandle`.

### 2-1. 구조
```tsx
<ContentRow>
  <CatalogLeftSidebar ... />
  <CatalogCenterPanel ... />
  <CatalogRightSidebar ... />
</ContentRow>
```

### 2-2. 스타일 ([catalog.styles.ts:41-68](../../../ingradient-platform/frontend/components/catalog/catalog.styles.ts#L41-L68))
| 요소 | 스타일 |
|---|---|
| `ContentRow` | `styled(UiPageContent)` — `flex-direction: row; gap: 0; overflow: hidden;` |
| `ResizeHandle` | `width: 8px; flex-shrink: 0; cursor: col-resize; position: relative; z-index: 10;` |
| `ResizeHandleBar` | `position: absolute; top: 0; bottom: 0; left: 3px; width: 2px; border-radius: 1px; background: transparent;` — hover 시 `var(--ig-color-white-12)` |

### 2-3. 동작
- 좌측 `ResizeHandle` — `datasetsPanelExpanded === false` 일 때 숨김 (사이드바 collapse 시 자동 제거)
- 우측 `ResizeHandle` — 항상 표시
- 좌/우 width 는 localStorage `ingradient-catalog-panel-widths` 에 저장, range `[PANEL_MIN_WIDTH=150, PANEL_MAX_WIDTH=600]`
- drag 중 `dragOverlayRef` 가 fixed full-screen overlay 로 cursor 유지

### 2-4. Storybook 현황
- ✅ CatalogShell pattern 으로 3-column 구현
- ✅ ResizeHandle (8px) 추가
- ⚠️ ResizeHandleBar 의 detail (left 3px, width 2px) 약간 다름
- ❌ localStorage 저장 안 함 (UI-only 라 의도된 omit)

---

## 3. 좌측 사이드바 (Datasets) ⚠️

[frontend/components/catalog/CatalogLeftSidebar.tsx](../../../ingradient-platform/frontend/components/catalog/CatalogLeftSidebar.tsx) → [CatalogLeftPanel.tsx](../../../ingradient-platform/frontend/components/catalog/CatalogLeftPanel.tsx)

### 3-1. Wrapper (LeftPanelWrap)
- `styled(UiPanel)` — `flex-shrink: 0; display: flex; flex-direction: column; min-height: 0;`
- `width: leftWidth` (px, 동적)

### 3-2. Header (LeftPanelHeader) — 72px ✅
[CatalogLeftPanel.styles.ts:13-51](../../../ingradient-platform/frontend/components/catalog/CatalogLeftPanel.styles.ts#L13-L51)

| 요소 | 스타일 / 내용 |
|---|---|
| `LeftPanelHeader` | `padding: 0 24px; min-height: 72px; display: flex; align-items: center; gap: 10px;` |
| `PanelTitle` (h2) | `font-size: 16px; font-weight: 600; color: var(--ig-color-text-primary); flex: 1; overflow: hidden; text-overflow: ellipsis;` — 텍스트 `"Datasets"` |
| `CollapseBtn` (button) | `background: none; border: none; padding: 4px; color: var(--ig-color-text-muted); cursor: pointer;` — hover `text-primary` — svg 20x20 — `iconClosePanel` (`<X />` from lucide-react) |

**Storybook**: ✅ DatasetListPanel header 72px / padding 0 24px / title lg (15px ≈ platform 16px) 적용. ❌ CollapseBtn 미구현.

### 3-3. SelectAllRow ⚠️
[CatalogLeftPanel.styles.ts:61-69](../../../ingradient-platform/frontend/components/catalog/CatalogLeftPanel.styles.ts#L61-L69) + [CatalogLeftPanel.tsx:118-126](../../../ingradient-platform/frontend/components/catalog/CatalogLeftPanel.tsx#L118-L126)

조건: `datasets.length > 0 && currentProjectId` 일 때만 표시

| 요소 | 스타일 / 내용 |
|---|---|
| `SelectAllRow` | `display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 18px; border-bottom: 1px solid var(--ig-color-border-subtle);` |
| `SelectAllRowLeft` | `Checkbox` — `checked={allSelected}; indeterminate={someSelected && !allSelected}; aria-label="Select all datasets"` |
| `SelectAllRowRight` | `Button variant="accent" size="sm" disabled={createDatasetPending} onClick={onOpenAddDataset}` — 텍스트 `"+ Add Dataset"` |

**Storybook**: ✅ 동등 구조 — padding `var(--ig-space-4) var(--ig-space-6)` (≈ 10px 12px, platform 은 14px 18px 로 약간 다름). gap `var(--ig-space-5)` = 12px (vs platform 16px).

### 3-4. Body 의 4가지 상태 분기 ⚠️

| 조건 | 표시 |
|---|---|
| `!currentProjectId` | `<div style={{padding:20}}>"No project selected."</div>` |
| `datasetsLoading` | `<LoadingHint>"Loading…"</LoadingHint>` — `padding: 20; color: text-muted; font-size: 14px;` |
| `datasets.length === 0` | `<div style={{padding:20}}>"No datasets in this project."</div>` |
| 정상 | `<CatalogDatasetList />` + `<DatasetContextMenu />` |

**Storybook**: ✅ 4 상태 처리 (no-project / loading-datasets / empty-datasets / default 시나리오).

### 3-5. CatalogDatasetList ✅⚠️
[CatalogDatasetList.tsx:46-114](../../../ingradient-platform/frontend/components/catalog/CatalogDatasetList.tsx#L46-L114)

```tsx
<DatasetListScroll>
  <DatasetList>  // <ul>
    {datasets.map((dataset) => (
      <SelectableListItem
        key={dataset.id}
        variant="flat"
        selected={selectedSet.has(dataset.id)}
        dragOver={dragOverDatasetId === dataset.id}
        onDragOver={...} onDragEnter={...} onDragLeave={...} onDrop={...}
        onClick={...}
      >
        <span onClick={stopPropagation}>
          <Checkbox checked={selectedSet.has(dataset.id)} onChange={onToggleDatasetSelection} aria-label={`Select ${dataset.name}`} />
        </span>
        <DatasetRowLabel>{dataset.name}</DatasetRowLabel>
        <DatasetTaskTag $type={dataset.task_type}>{TASK_TAG[dataset.task_type]}</DatasetTaskTag>
        <MenuWrap data-dataset-menu>
          <KebabBtn aria-label="Dataset menu" aria-expanded={...} onClick={onOpenMenu}>
            <MoreVertical />
          </KebabBtn>
        </MenuWrap>
      </SelectableListItem>
    ))}
  </DatasetList>
</DatasetListScroll>
```

**스타일** ([CatalogDatasetList.styles.ts](../../../ingradient-platform/frontend/components/catalog/CatalogDatasetList.styles.ts)):
| 요소 | 스타일 |
|---|---|
| `DatasetListScroll` | `flex: 1; min-height: 0; overflow-y: auto;` |
| `DatasetList` | `list-style: none; margin: 0; padding: 0;` |
| `DatasetRowLabel` | `flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` |
| `DatasetTaskTag` | `font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px; letter-spacing: 0.03em;` — 색상은 task_type 별 분기 |

**TaskTag 색상** (정확):
- `classification`: bg `rgba(110,200,122,0.15)` / color `#6ec87a`
- `segmentation`: bg `rgba(180,120,230,0.15)` / color `#c07be8`
- 그 외 (object_detection / point default): bg `rgba(77,136,255,0.15)` / color `var(--ig-color-accent)`

**KebabBtn** (`DatasetContextMenu.styles.ts:4-22`):
- `flex-shrink: 0; padding: 4px; margin: -4px -4px -4px 0; background: none; border: none; color: var(--ig-color-text-muted);` — hover `text-primary`
- svg 18x18 (MoreVertical lucide-react)

**Storybook**: ✅ DatasetListItem 으로 동등. ⚠️ DatasetTaskTag 색은 일치하나, kebab 의 정확 위치/사이즈 점검 필요.

### 3-6. DatasetContextMenu ✅
[DatasetContextMenu.tsx](../../../ingradient-platform/frontend/components/catalog/DatasetContextMenu.tsx) + [.styles.ts](../../../ingradient-platform/frontend/components/catalog/DatasetContextMenu.styles.ts)

createPortal to `document.body`, anchor 는 `kebabButton.getBoundingClientRect()` 의 top/right 기준.

```tsx
<MenuDropdown anchor={{ top, left: rect.right + 4 }}>
  <MenuItem onClick={...} disabled={renamePending}>{renamePending ? "…" : "Rename"}</MenuItem>
  <MenuItem onClick={onDuplicate} disabled={copyPending}>{copyPending ? "Copying…" : "Duplicate Dataset"}</MenuItem>
  <MenuItem onClick={onExport}>Export (.igp)</MenuItem>
  <MenuItemDanger onClick={onDelete}>Delete</MenuItemDanger>
</MenuDropdown>
```

**스타일**:
| 요소 | 스타일 |
|---|---|
| `MenuDropdown` | `margin-left: 4px; min-width: 120px; border-radius: 16px; z-index: 1000;` |
| `MenuItem` | `padding: 10px 14px; font-size: 13px; color: var(--ig-color-text-primary); border-bottom: 1px solid var(--ig-color-border-strong);` — hover `var(--ig-color-white-08)` |
| `MenuItemDanger` | 위 + `color: var(--ig-color-danger);` — hover `rgba(224,92,92,0.12)` |

**Storybook**: ✅ DatasetMenu pattern 으로 구현. 4개 액션 동일.

---

## 4. 가운데 Center Panel (Gallery) ✅⚠️

[frontend/components/catalog/CatalogCenterPanel.tsx](../../../ingradient-platform/frontend/components/catalog/CatalogCenterPanel.tsx)

```tsx
<CenterPanel>  // styled(UiPanel): flex: 1; min-width: 0; display: flex; flex-direction: column;
  {currentDatasetId ? (
    <ThemeProvider>
      <GalleryContent
        Wrapper={GalleryColumn}
        topSectionMinHeight={TOP_BAR_HEIGHT}
        showSearchBar
        leftOfSelectionCount={
          !datasetsPanelExpanded ? <ExpandBtn onClick={...}>{iconMenu}</ExpandBtn> : undefined
        }
        filterDatasetId={currentDatasetId}
        filterDatasetIds={selectedDatasetIds}
        uploadDatasetIds={selectedDatasetIds}
        ...
      />
    </ThemeProvider>
  ) : (
    <div style={{ padding: 24 }}>
      <EmptyHint>Select a dataset on the left to view its images.</EmptyHint>
    </div>
  )}
</CenterPanel>
```

특이점: 좌측 사이드바가 collapse 된 상태면 toolbar 왼쪽에 **ExpandBtn** (사이드바 다시 열기) 가 `leftOfSelectionCount` 슬롯으로 주입됨.

**Storybook**: ✅ CenterPanel = CatalogShell 의 center. ❌ ExpandBtn (사이드바 collapse 시 toolbar 안의 열기 버튼) 미구현.

---

## 5. Gallery Toolbar ⚠️

[frontend/components/gallery/toolbar/toolbar.tsx](../../../ingradient-platform/frontend/components/gallery/toolbar/toolbar.tsx) — 데스크톱 / 모바일 분기.

### 5-1. Toolbar Wrapper
- 데스크톱: `<Toolbar>` (`UploadDropzone` 가 toolbar 만 감싸기도 / body 도 감쌈 — 코드 따라 확인 필요)

### 5-2. 데스크톱 Row 1 — GalleryDesktopToolbarRow ⚠️
[toolbar.tsx:4-14 스타일](../../../ingradient-platform/frontend/components/gallery/toolbar/toolbar-styles.tsx)
```
Toolbar:
  padding: 16px
  min-height: topSectionMinHeight (72px) or 'none'
  background: rgba(12, 15, 20, 0.76)
  backdrop-filter: blur(12px)
  border-bottom: 1px solid var(--ig-color-border-subtle)
  gap: 12px
```

[GalleryDesktopToolbarRow.tsx:40-66](../../../ingradient-platform/frontend/components/gallery/toolbar/GalleryDesktopToolbarRow.tsx) — 좌 → 우 순서:

1. `leftOfSelectionCount` (optional, ExpandBtn 또는 undefined)
2. `<SearchField size="sm" maxWidth="220px" placeholder="Search file name" />`
3. `<FilterBtn $active={hasActiveFilter} onClick={...}>` — IconButton style + `<Filter />` icon. 라벨 텍스트 없음
4. `<SortBtn $active={hasActiveSort} onClick={...}>` — `<ArrowUpDown />` icon
5. (margin-left: auto)
6. `<ExportBtn disabled={!canExport}>` — `BarBtn` style, 텍스트 `"Export"`
7. `<UploadBtn>` — `<Button>`, 텍스트 `"Upload"`

**FilterBtn / SortBtn 스타일** ([toolbar-styles.tsx:22-40](../../../ingradient-platform/frontend/components/gallery/toolbar/toolbar-styles.tsx#L22-L40)):
- inactive: `background: var(--ig-color-surface-interactive); border: 1px solid var(--ig-color-border-strong); color: var(--ig-color-text-muted);`
- active: `background: var(--ig-color-blue-tint-16); border-color: var(--ig-color-accent); color: var(--ig-color-accent);`
- padding: 8px 10px / border-radius: 10px / icon 18x18

**Storybook**: ✅ FilterPopoverTrigger / SortPopoverTrigger 추가. ⚠️ "Filter" 텍스트 라벨 동봉 — platform 은 icon-only. ❌ Lucide icon (Filter / ArrowUpDown) 미사용.

### 5-3. 데스크톱 Row 2 — GallerySelectionRow ⚠️
[GallerySelectionRow.tsx:44-73](../../../ingradient-platform/frontend/components/gallery/toolbar/GallerySelectionRow.tsx#L44-L73)

```tsx
<SelectionRow>  // 항상 표시되는 row
  <SelectionBar selectedCount={...} totalCount={...} itemLabel="image" />
  <ViewModeToggle style={{ marginLeft: 'auto' }} value={viewMode} onChange={...} />
</SelectionRow>
```

SelectionBar 의 내용:
- 좌측: Checkbox (selectedCount < loadedCount → indeterminate)
- text: `{selectedCount} of {totalCount} {itemLabel} selected` (선택 시) 또는 `{totalCount} {itemLabel}` (미선택 시)
- 숨겨진 아이템 있으면 "Select all {totalCount}" 링크
- Delete 버튼 (disabled={isDeleting}), `DeleteBtn` style — `background: rgba(120,28,28,0.18); border: 1px solid rgba(224,92,92,0.45); color: var(--ig-color-danger);`

ViewModeToggle 3개 버튼 (icon-only):
- `<LayoutGrid />` Grid
- `<Table />` Table
- `<BarChart3 />` Stats
- pill shape (border-radius 999px), active 배경 `var(--ig-color-accent)`

**Storybook**: ⚠️ SelectionRow 가 selectionCount > 0 시에만 보이는데 platform 은 **항상** 표시. ViewModeToggle 도 항상 표시. → GalleryToolbar pattern 수정 필요.

### 5-4. 모바일 Toolbar ❌
[toolbar-mobile.tsx:52-75](../../../ingradient-platform/frontend/components/gallery/toolbar/toolbar-mobile.tsx#L52-L75) — `position: sticky; bottom: 0; height: 60px;` 의 하단 fixed bar. 5 버튼 (View / Filter / Sort / Export / Upload) — 각 버튼은 icon 위 10px 라벨.

**Storybook**: ❌ 모바일 toolbar 미구현.

### 5-5. GalleryFilterDropdown ⚠️
[toolbar-dropdowns.tsx:107-240](../../../ingradient-platform/frontend/components/gallery/toolbar/toolbar-dropdowns.tsx#L107-L240) — createPortal, FilterPopover 위치는 FilterBtn 의 rect 기준.

8개 섹션:
1. **Upload date** — 2개 `<DatePickerField>` ("From date" - "To date")
2. **Last modified date** — 동일 구조
3. **Labeled** — `<ViewModeToggle>` (All / Labeled / Unlabeled)
4. **Archive** — `<ViewModeToggle>` (All / Unarchived / Archived)
5. **Commented** — 1개 `<FilterClassChip>` (체크박스 + "Has comments")
6. **Class (has annotation)** — `<FilterSearchableList>`:
   - SearchField (size sm, placeholder "Search class")
   - 스크롤 가능 리스트 (maxHeight 180px), 각 항목 `[체크박스] [10x10 color swatch] [class 명]`
7. **Labeled by** — `<FilterSearchableList>`: 멤버 chip 리스트
8. **Pattern labels (Deflectometry, 조건부)** — "Select all" / "Reset" 액션 + chip list

**Storybook**: ⚠️ FilterPopoverTrigger 안에 mock 라벨만 — 실제 8 섹션 구조 미구현.

### 5-6. GallerySortDropdown ✅⚠️
[toolbar-dropdowns.tsx:252-269](../../../ingradient-platform/frontend/components/gallery/toolbar/toolbar-dropdowns.tsx#L252-L269) — 정렬 옵션 list, 각각 `<SortOptionButton>`.

Platform 의 정렬 옵션 종류는 source 직접 확인 필요 (이번 audit 에서 hex 미수집).

**Storybook**: ✅ SortPopoverTrigger 구현, 5 mock 옵션 (Most recent / Name A-Z / Name Z-A / File size / Labeled status). ⚠️ 실제 platform 옵션과 일치 확인 필요.

---

## 6. Gallery Body ⚠️

[frontend/components/gallery/Body.tsx](../../../ingradient-platform/frontend/components/gallery/Body.tsx) + [Body.styles.tsx](../../../ingradient-platform/frontend/components/gallery/Body.styles.tsx)

### 6-1. GridWrap container
- `flex: 1; min-height: 0; padding: 0 16px 16px; overflow: auto; position: relative;`

### 6-2. View 분기
```tsx
if (viewMode === 'grid')  return <CatalogImageGrid />
if (viewMode === 'table') return <ImagesTable />
if (viewMode === 'stats') return <AnalysisDashboard />
```

### 6-3. Drag-over overlay
- `<GridDropOverlay><GridDropOverlayText>"Drop images here to upload"</GridDropOverlayText></GridDropOverlay>`
- `position: absolute; inset: 0; background: rgba(0,0,0,0.6); border: 3px dashed rgba(255,255,255,0.4);`

### 6-4. Loading spinner
- `<SpinnerWrap><Spinner aria-label="Loading" /></SpinnerWrap>` — 0.8s linear infinite rotate

**Storybook**: ✅ 3 view 분기 + DragOverlay + Loading. ⚠️ DragOverlay 색이 다름 (storybook accent-soft 사용, platform 은 black 0.6).

---

## 7. CatalogImageGrid (Grid view) ⚠️

[frontend/components/gallery/CatalogImageGrid.tsx:89-141](../../../ingradient-platform/frontend/components/gallery/CatalogImageGrid.tsx#L89-L141)

```tsx
<ImageGrid<CatalogImageGridItem>
  items={items}
  layout={{ minWidth: 140, gap: 4 }}
  selectedIds={selectedIds}
  highlightedId={highlightedId}
  renderCellOverlay={(image) => (
    <CellOverlay>
      <CellTopRightBadges>
        <ImageOptionBtn onClick={onOpenMenu}>{iconKebab}</ImageOptionBtn>
      </CellTopRightBadges>
      {image.archived ? <ArchivedOverlay /> : null}
      {image.processing ? <ProcessingOverlay><Spinner /></ProcessingOverlay> : null}
    </CellOverlay>
  )}
  renderCellTopRight={(image) => (
    <>
      {image.sync_state ? <SyncStateChip $state={image.sync_state}>{getLabel(image.sync_state)}</SyncStateChip> : null}
      {image.group_count > 1 ? <GroupCountCircle>{image.group_count}</GroupCountCircle> : null}
    </>
  )}
/>
```

### 7-1. 셀의 시각 요소들 (Body.styles.tsx:67-136)

**ImageOptionBtn** (kebab):
- `width: 18px; height: 18px; padding: 0; border-radius: 6px; background: rgba(0,0,0,0.6);` — hover `rgba(0,0,0,0.8)` — svg 14x14

**GroupCountCircle**:
- `min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px;`
- `background: rgba(12,16,24,0.92); border: 1px solid rgba(255,255,255,0.14);`
- `transform: translate(12px, -10px);` — 우상향 offset
- `font-size: 11px; font-weight: 700;`

**SyncStateChip** (opaque):
- `padding: 0 8px; height: 20px; border-radius: 999px; font-size: 10px; font-weight: 700;`
- synced: `background: rgba(34,197,94,0.92);`
- upload_failed: `background: rgba(220,38,38,0.92);`
- uploading: `background: rgba(234,179,8,0.92);`

**ArchivedOverlay** ([ArchivedOverlay.tsx:27-62](../../../ingradient-platform/frontend/components/gallery/ArchivedOverlay.tsx#L27-L62)):
- SVG hatched pattern, 45° rotation
- DIM_FILL: `rgba(0,0,0,0.3)`
- STRIPE_COLOR: `rgba(0,0,0,0.5)`, STRIPE_WIDTH: 2px

**ProcessingOverlay**: 반투명 dim + 가운데 Spinner

**Storybook**: ⚠️ GalleryImageCard 가 ImageOption / GroupCount / SyncChip / Overlay 슬롯 갖고 있음. ❌ ArchivedOverlay SVG hatch pattern 은 단순 dim 으로 대체.

---

## 8. ImagesTable (Table view) ⚠️

[frontend/components/gallery/grid/images-table.tsx:35-88](../../../ingradient-platform/frontend/components/gallery/grid/images-table.tsx#L35-L88) — 8 columns:

| # | 컬럼 | 내용 |
|---|---|---|
| 1 | Thumb | 64x64 이미지 |
| 2 | File | 파일명 |
| 3 | Dataset | 데이터셋명 |
| 4 | Sequence | `"Seq {step}/5"` 또는 `"—"` |
| 5 | Pattern | 패턴 라벨 (formatPatternLabel 적용) |
| 6 | Sync | `"Synced" / "Uploading" / "Upload Failed" / "Local" / "—"` |
| 7 | Created at | ISO 날짜 |
| 8 | Labeled | `"Yes" / "No"` |

**Storybook**: ⚠️ GalleryImagesTable 에 7개 column. "Labeled" column 누락. Sync 표시는 SyncStatusChip soft variant 사용 (platform 은 그냥 텍스트).

---

## 9. AnalysisDashboard (Stats view) ❌

[frontend/components/gallery/AnalysisDashboard.tsx:19-28](../../../ingradient-platform/frontend/components/gallery/AnalysisDashboard.tsx#L19-L28) — 8 위젯:

1. **data_collection** — "Images by dataset" 막대 차트
2. **timeline** — "Images over time" 라인 차트
3. **labeling_status** — "Labeled vs unlabeled" 원형 차트
4. **class_ratio** — "Class distribution" 원형
5. **labeling_by_person** — "Uploader activity" 테이블
6. **defects_by_source** — "Source breakdown" 막대
7. **pending_processed** — "Labeling progress" 진행바
8. **dataset_distribution** — "Per-dataset class counts" 히트맵

**Storybook**: ❌ AnalysisDashboard pattern 에 mock 4 stat card 만 — 차트 / 테이블 / 히트맵 등 8 위젯 미구현.

---

## 10. 우측 사이드바 (Class & Members) ❌

[frontend/components/catalog/CatalogRightSidebar.tsx](../../../ingradient-platform/frontend/components/catalog/CatalogRightSidebar.tsx) → `CatalogRightPanel`

### 10-1. 구조
```tsx
<RightPanel>
  {/* Class section */}
  <Section>
    <SectionHeaderRow><SectionTitle>Class</SectionTitle></SectionHeaderRow>
    {classesLoading ? <LoadingHint>Loading…</LoadingHint> :
     classes.length === 0 ? <EmptyHint>No classes</EmptyHint> :
     <>
       <TagListSearch placeholder="Search Class to add" candidates={...} onSelect={onEnableClass} />
       <ClassPoolList>
         {connectedClasses.map((cls) => (
           <ClassChipWrap>
             <ClassChipRow>
               <ColorDot color={cls.color} />
               <ClassChip><ClassChipLabel>{cls.name}</ClassChipLabel></ClassChip>
               <ClassRemoveButton onClick={() => onRemoveClass(cls.id)} />
             </ClassChipRow>
           </ClassChipWrap>
         ))}
       </ClassPoolList>
     </>}
  </Section>

  {/* Members section */}
  <CatalogDatasetUsersSection ... />
</RightPanel>
```

### 10-2. 스타일
- `RightPanel`: `flex-shrink: 0; overflow-y: auto;`
- `Section`: `padding: 0 24px 20px; border-bottom: 1px solid;`
- `SectionHeaderRow`: `min-height: 72px; display: flex; align-items: center;`
- `ClassPoolList`: `display: flex; flex-direction: column; gap: 8px;`
- `ClassChipRow`: `padding: 6px 10px 6px 12px; border-radius: 6px;`

**Storybook**: ❌ 우측 사이드바 전체 미구현. CatalogShell 의 `rightSidebar` slot 빈 채.

---

## 11. Modal / Dialog 들 ❌

[frontend/components/catalog/CatalogDialogs.tsx:106-194](../../../ingradient-platform/frontend/components/catalog/CatalogDialogs.tsx#L106-L194) — 조건부로 6개 modal 렌더.

| Modal | 트리거 | 내용 |
|---|---|---|
| **AddDatasetModal** | "+ Add Dataset" 버튼 | 이름 입력 + task_type select + class 선택 |
| **DuplicateDatasetModal** | kebab "Duplicate" | 새 이름 + "Copy labels too" 체크박스 |
| **ConfirmRemovalModal** (class) | 우측 사이드바 class 제거 | "Remove class?" 확인 |
| **ConfirmRemovalModal** (member) | 우측 사이드바 member 제거 | "Remove member?" 확인 |
| **ClassHoverPreview** | class chip hover | tooltip |
| **DragDropDialogModal** | dataset 간 이미지 drag-drop | Copy / Move 옵션 |
| **IgpExportModal** | kebab "Export (.igp)" | export 진행 + 다운로드 링크 |

**Gallery 쪽 다이얼로그** ([frontend/components/gallery/dialogs/](../../../ingradient-platform/frontend/components/gallery/dialogs/)):
- Delete confirmation
- Move/Copy confirmation
- UploadQualityModal — 4 옵션 (High / Medium / Low / Lossless)

**Storybook**: ❌ 모든 modal 미구현 (Add Dataset / Duplicate / Confirm 등).

---

## 12. Image Detail Modal ❌

[frontend/components/gallery/image-detail/](../../../ingradient-platform/frontend/components/gallery/image-detail/) — image 클릭 시 열리는 large preview + metadata + annotation viewer.

**Storybook**: ⚠️ GalleryDetailModal pattern 으로 기본 shell 만. 실제 annotation viewer / comment / class 정보 미구현.

---

## 13. Image Context Menu ❌

[frontend/components/gallery/menu/image-menu.tsx](../../../ingradient-platform/frontend/components/gallery/menu/image-menu.tsx) — 우클릭 또는 kebab 클릭 시 메뉴.

| 메뉴 항목 |
|---|
| Copy To (서브메뉴) |
| Cut / Paste |
| Archive / Unarchive |
| Delete (danger color) |

**Storybook**: ⚠️ GalleryImageMenu pattern 에 5 generic action (label / change status / move / archive / delete). 실제 Copy To 서브메뉴 / Cut-Paste 분리 미구현.

---

## 14. HoverPreview ⚠️

[frontend/components/gallery/HoverPreview.tsx:40-45](../../../ingradient-platform/frontend/components/gallery/HoverPreview.tsx#L40-L45)
- Position fixed, z-index 100
- `transform: scale(1.06)`
- 이미지 hover 시 delay 후 큰 미리보기

**Storybook**: ⚠️ HoverPreview pattern 추가했지만 scale 효과 / 정확한 위치 다름. Catalog story 의 `hover-preview` scenario 에서만 발동.

---

## 15. UploadDropzone wrapper ❌

[frontend/components/gallery/UploadDropzone.tsx](../../../ingradient-platform/frontend/components/gallery/UploadDropzone.tsx) — toolbar 와 body 를 감싸 drag-over 시 화면 전체에 overlay 표시. `hideDropZone=true` prop 으로 drop 영역만 숨김.

**Storybook**: ❌ UploadDropzone 미통합. drag-over 시각만 grid 안쪽에 표시.

---

## 16. UploadQualityModal ❌

[frontend/components/gallery/UploadQualityModal.tsx:25-69](../../../ingradient-platform/frontend/components/gallery/UploadQualityModal.tsx#L25-L69) — Upload 버튼 클릭 후 파일 선택 → 이 modal 이 떠서 4 옵션 선택:

| 옵션 | 설명 |
|---|---|
| High Quality (기본) | original 압축 |
| Medium Quality | 중간 압축 |
| Low Quality | 강한 압축 |
| Lossless (Original) | 원본 그대로 |

**Storybook**: ❌ 미구현.

---

## 17. SelectionBar (분리 컴포넌트) ⚠️

[frontend/components/gallery/SelectionBar.tsx:137-190](../../../ingradient-platform/frontend/components/gallery/SelectionBar.tsx#L137-L190)
```tsx
<SelectionBar>
  <Checkbox checked={someSelected} indeterminate={partial} />
  <SelectionCount>{selectedCount} of {totalCount} {itemLabel} selected</SelectionCount>
  {hiddenCount > 0 && <SelectAllLink>Select all {totalCount}</SelectAllLink>}
  <DeleteBtn disabled={isDeleting}>Delete</DeleteBtn>
</SelectionBar>
```

`DeleteBtn` 스타일: `background: rgba(120,28,28,0.18); border: 1px solid rgba(224,92,92,0.45); color: var(--ig-color-danger);`

**Storybook**: ⚠️ GalleryToolbar 안 selection row 에 비슷한 항목 있지만 Delete 의 빨간 dim 배경 / 정확 스타일 다름.

---

## 18. 아이콘 매핑 ❌

[frontend/components/gallery/gallery.icons.tsx:1-10](../../../ingradient-platform/frontend/components/gallery/gallery.icons.tsx#L1-L10) — lucide-react 기준:

| 변수 | 아이콘 |
|---|---|
| `GalleryKebabIcon` | `<MoreVertical />` (18x18) |
| `GalleryGridIcon` | `<LayoutGrid />` |
| `GalleryTableIcon` | `<Table />` |
| `GalleryStatsIcon` | `<BarChart3 />` |
| `GalleryFilterIcon` | `<Filter />` |
| `GallerySortIcon` | `<ArrowUpDown />` |

[frontend/components/catalog/catalog.icons.tsx](../../../ingradient-platform/frontend/components/catalog/catalog.icons.tsx):
| 변수 | 아이콘 |
|---|---|
| `iconClosePanel` | `<X />` |
| `iconKebab` | `<MoreVertical />` |
| `iconMenu` | `<Menu />` (사이드바 expand 버튼) |

**Storybook**: ❌ 모든 곳에서 `⋮` (텍스트) / 라벨 사용. lucide-react 아이콘 미사용. → IconButton 의 children 에 `<MoreVertical />` 등 lucide icon 주입 필요.

---

## 19. 모바일 view ❌

[frontend/components/catalog/CatalogMobileView.tsx](../../../ingradient-platform/frontend/components/catalog/CatalogMobileView.tsx)
- 상단에 `MobileTopBar` — dataset selector dropdown (현재 dataset 이름 + ✓ 표시 + 다른 dataset list)
- 가운데 `MobileGalleryArea` — `<GalleryContent isMobile />`
- 하단에 모바일 toolbar (60px 고정)

**Storybook**: ❌ 모바일 view 미구현. (storybook 의 viewport 토글로 작은 사이즈 보기는 가능하지만 dedicated mobile UI 는 없음)

---

## 20. Hook & 데이터 흐름 (참조용)

이 plan 의 직접 구현 대상은 아니지만, props 설계 시 데이터 모양 매칭에 필요.

### 20-1. useCatalogDatasets 출력
- `datasets: Dataset[]` (id, name, task_type, image_count, created_at, updated_at, owner)
- `datasetsLoading: boolean`
- `selectedDatasetIds`, `setSelectedDatasetIds`
- `selectedSet: Set<string>`
- `allSelected`, `someSelected`
- `currentDatasetId` (localStorage 저장)

### 20-2. useCatalogPageUiState 출력
- `datasetsPanelExpanded: boolean`
- `dragOverDatasetId: string | null`
- `addDatasetModalOpen`, `addDatasetName`, `addDatasetTaskType`, `addDatasetSelectedClasses`
- `duplicateModal: { datasetId, defaultName } | null`
- `duplicateName`, `duplicateCopyLabels`
- `clipboard`, `dragDropDialog`
- `pendingClassRemoval`, `pendingMemberRemoval`

### 20-3. useGalleryImageList 출력 (infinite query)
- `pages: { images: GalleryImage[] }[]`
- `hasNextPage`, `isFetchingNextPage`
- `fetchNextPage()`

### 20-4. ImageItem 필드 (참조)
```ts
{
  id, thumb_url, thumb_bbox_url, name,
  sync_state: 'local_only' | 'uploading' | 'synced' | 'upload_failed',
  archived, group_count, status,
  dataset_id, created_at, labeled_at, labeled_by, classification_class_ids,
  sequence_id, sequence_step, pattern_label,
  width, height, size_bytes, captured_at, uploader, camera_ip
}
```

---

## 21. Storybook 현황 종합

### 21-1. ✅ 완료된 부분
- 3-column 레이아웃 (CatalogShell)
- 좌측 사이드바 (DatasetListPanel + Item + Menu)
- TopBar
- DatasetTaskTag (platform 색 일치)
- SyncStatusChip (soft + opaque variant)
- GroupCountBadge (22x22, top-right offset)
- GalleryImageCard
- GalleryImagesTable (7 column — 1 column 누락)
- GalleryDetailModal (shell)
- GalleryImageMenu (5 generic action)
- GalleryToolbar (Search + Filter trigger + Sort trigger + Export + Upload)
- FilterPopoverTrigger (mock 내용)
- SortPopoverTrigger
- AnalysisDashboard (4 stat card)
- HoverPreview pattern
- ResizeHandle
- ModeSwitcher shape=pill

### 21-2. ⚠️ 부분 구현 / 차이
- TopBar 의 HeaderProjectName 정확 스타일 (font 18 / weight 700)
- DatasetListPanel SelectAllRow padding (14px 18px / gap 16px)
- KebabBtn 크기·위치
- FilterBtn / SortBtn icon-only (라벨 제거 필요)
- GallerySelectionRow 가 항상 표시되어야 (storybook 은 selectionCount > 0 만)
- ViewModeToggle icon-only (lucide icon)
- ImageOptionBtn 18x18 정확
- DragOverlay 색 (black 0.6 vs accent-soft)
- ImagesTable "Labeled" column 누락
- SelectionBar 의 DeleteBtn 빨간 dim 배경
- GalleryImageMenu — Copy To 서브메뉴 / Cut-Paste 분리
- HoverPreview scale(1.06) 효과
- ArchivedOverlay SVG hatched pattern

### 21-3. ❌ 미구현 (큰 누락)

| # | 항목 | 영향도 |
|---|---|---|
| 1 | **우측 사이드바 (Class / Members)** | 🔴 큰 화면 영역 비어있음 |
| 2 | **GalleryFilterDropdown 8 섹션 내용** | 🔴 filter popover 가 mock label 뿐 |
| 3 | **AnalysisDashboard 8 위젯** | 🔴 stats view 가 4 stat card 만 |
| 4 | **모든 modal** (AddDataset / Duplicate / Confirm / DragDrop / IgpExport / UploadQuality) | 🔴 dataset 추가·수정·삭제·이미지 업로드 flow 없음 |
| 5 | **UploadDropzone wrapper** + Upload Quality Modal | 🟡 업로드 시각 흐름 없음 |
| 6 | **CollapseBtn** (사이드바 collapse) + **ExpandBtn** (toolbar 의 expand) | 🟡 사이드바 토글 UX 미구현 |
| 7 | **lucide-react icon 매핑** (Filter / ArrowUpDown / MoreVertical / LayoutGrid / Table / BarChart3 / X / Menu) | 🟡 텍스트 / `⋮` 로 대체 중 |
| 8 | **모바일 view** (CatalogMobileView, MobileTopBar, MobileGalleryArea, mobile toolbar 60px sticky) | 🟢 데스크톱 우선이라 후순위 |
| 9 | **ImageDetailModal 내부 annotation viewer / comments** | 🟡 큰 modal 의 내부가 비어있음 |
| 10 | **TagListSearch** (우측 사이드바 의 class 검색 추가 + chip 리스트) | 우측 사이드바 일부 |

### 21-4. 우선순위 권고 (다음 라운드)

**P0 — 시각 fidelity 와 큰 누락 즉시 해결 후보**
1. Lucide-react icon 도입 (모든 텍스트 `⋮` / "Filter" / "Sort" 텍스트 제거)
2. FilterBtn / SortBtn icon-only 로 (라벨 제거)
3. SelectionRow 항상 표시 (ViewModeToggle 노출)
4. ImagesTable "Labeled" column 추가
5. ImageOptionBtn 18x18 정확 적용
6. SelectionBar DeleteBtn 빨간 dim 스타일

**P1 — 큰 영역 채우기**
1. 우측 사이드바 (CatalogRightPanel) pattern 추가
2. GalleryFilterDropdown 8 섹션 패턴화 (DateRange / ViewModeToggle / FilterClassChip / FilterSearchableList)
3. AnalysisDashboard 8 위젯 확장 (ChartCard 활용)

**P2 — Modal flow**
1. AddDatasetModal pattern
2. DuplicateDatasetModal pattern
3. UploadQualityModal pattern
4. ConfirmRemovalModal — DialogShell + ConfirmDialog 활용
5. ImageDetailModal 의 annotation viewer slot 확장

**P3 — 모바일 / 부가**
1. CatalogMobileView pattern
2. CollapseBtn / ExpandBtn (사이드바 토글)
3. DragOverlay 색 정확화
4. ArchivedOverlay SVG hatch

---

## 22. 변경 이력

- 2026-05-14 — 초안 작성. Platform 의 catalog 페이지 전 요소를 1:1 매핑, storybook 현황 ✅⚠️❌ 표기, 우선순위 권고.
