import type { CatalogViewProps } from '@ingradient/platform-pages'
import type { CatalogScene } from '../../../../fixtures/platform/0.0.1/catalog-scenarios'
import type { useCatalogScene } from './use-catalog-scene'
import { buildStatsContent } from './build-stats-content'
import { buildCatalogOverlays } from './build-overlays'
import { buildDetailContent } from './build-detail-content'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'size', label: 'File size' },
  { value: 'labeled', label: 'Labeled status' },
]

const PATTERN_ITEMS = [
  { id: 'pt-A', label: 'Pattern A' },
  { id: 'pt-B', label: 'Pattern B' },
  { id: 'pt-C', label: 'Pattern C' },
]

export function buildCatalogViewProps(
  scenario: CatalogScene,
  s: ReturnType<typeof useCatalogScene>,
  datasetNameById: Record<string, string>,
  isMobile = !!scenario.isMobile,
): CatalogViewProps {
  const classes = scenario.classes ?? []
  const members = scenario.members ?? []
  const connectedClassIds = s.connectedClassIds
  const connectedClasses = classes.filter((c) => connectedClassIds.has(c.id))
  const candidateClasses = classes
    .filter((c) => !connectedClassIds.has(c.id))
    .map((c) => ({ id: c.id, color: c.color, label: c.name }))
  const currentImage = scenario.images.find(
    (img) => img.id === (s.detailImageId ?? scenario.detailImageId),
  )
  const visibleImageIds = s.visibleImages.map((image) => image.id)
  const visibleSelectionCount = visibleImageIds.filter((id) => s.selectedImageIds.has(id)).length
  const allVisibleSelected =
    visibleImageIds.length > 0 && visibleImageIds.every((id) => s.selectedImageIds.has(id))

  return {
    isMobile,
    page: {
      title: 'Catalog',
      subtitle: 'Organize datasets, manage dataset-class links, browse labeled images.',
      projectName: 'Wafer-2026',
      permissionDenied: scenario.permissionDenied,
      error: scenario.error ?? null,
      noProject: scenario.noProject,
      dragOverFull: scenario.dragOverFull,
      dragOverGrid: scenario.dragOverGrid,
    },
    datasets: {
      datasets: scenario.datasets,
      selectedIds: s.selectedDatasetIds,
      currentId: s.currentDatasetId,
      loading: scenario.datasetsLoading,
      noProject: scenario.noProject,
      dragOverDatasetId: s.dragOverDatasetId,
      sidebarCollapsed: s.sidebarCollapsed,
      onSelectAll: (checked) =>
        s.setSelectedDatasetIds(checked ? new Set(scenario.datasets.map((d) => d.id)) : new Set()),
      onToggleSelect: s.toggleDatasetSelection,
      onSelectCurrent: s.selectCurrent,
      onAddDataset: () => s.setAddDatasetOpen(true),
      onOpenDatasetMenu: s.openDatasetMenu,
      onCollapse: () => s.setSidebarCollapsed(true),
      onExpand: () => s.setSidebarCollapsed(false),
    },
    toolbar: {
      viewMode: s.viewMode,
      onChangeViewMode: s.setViewMode,
      searchValue: s.searchValue,
      onSearchChange: s.setSearchValue,
      filterState: s.filterState,
      onFilterChange: s.setFilterState,
      onFilterReset: s.resetFilterState,
      hasActiveFilter: s.hasActiveFilter,
      filterDefaultOpen: scenario.filterOpen === 'status',
      sortValue: s.sortValue,
      sortOptions: SORT_OPTIONS,
      onSortChange: s.setSortValue,
      sortDefaultOpen: scenario.filterOpen === 'sort',
      classes,
      members,
      patternItems: PATTERN_ITEMS,
      totalCount: s.visibleImages.length,
      loadedCount: s.visibleImages.length,
      selectionCount: visibleSelectionCount,
      allSelected: allVisibleSelected,
      uploadProgress: s.uploadProgress,
      onToggleSelectAll: (checked) => {
        const next = new Set(s.selectedImageIds)
        visibleImageIds.forEach((id) => checked ? next.add(id) : next.delete(id))
        s.setSelectedImageIds(next)
      },
      onDelete: () => s.extra.setBulkDeleteOpen(true),
      onExport: () => s.setIgpExportOpen(true),
      onUpload: () => s.setUploadQualityOpen(true),
    },
    images: {
      images: s.visibleImages,
      selectedImageIds: s.selectedImageIds,
      loading: scenario.imagesLoading,
      hoverImageId: s.hoverImageId,
      openMenuId: s.imageMenuAnchor?.id,
      datasetNameById,
      onToggleSelect: s.toggleImageSelection,
      onOpenDetail: (id) => s.setDetailImageId(id),
      onOpenMenu: s.openImageMenu,
    },
    rightSidebar: isMobile
      ? null
      : {
          classesLoading: scenario.classesLoading,
          membersLoading: scenario.membersLoading,
          connectedClasses,
          candidateClasses,
          members,
          onAddClass: s.addConnectedClass,
          onRemoveClass: (id) => s.setPendingClassRemovalId(id),
          onRemoveMember: (id) => s.setPendingMemberRemovalId(id),
        },
    mobile: isMobile
      ? {
          datasetSelectorOpen: s.mobileDatasetDropdownOpen,
          onSetDatasetSelectorOpen: s.setMobileDatasetDropdownOpen,
          bottomSheet: s.mobileBottomSheet,
          onSetBottomSheet: s.setMobileBottomSheet,
        }
      : undefined,
    statsContent: s.viewMode === 'stats' ? buildStatsContent() : undefined,
    detailContent: buildDetailContent(currentImage, datasetNameById, scenario.detailVariant),
    overlays: buildCatalogOverlays(scenario, s),
  }
}
