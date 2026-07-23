import { useEffect, useMemo, useState } from 'react'
import { emptyGalleryFilterPanelState, type GalleryFilterPanelState } from '@ingradient/platform-pages'
import type { CatalogScene, CatalogViewMode, FilterKey } from '../../../../fixtures/platform/0.0.1/catalog-scenarios'
import { useCatalogExtraDialogs } from './use-catalog-extra-dialogs'
import { catalogFilterIsActive, selectCatalogImages } from './catalog-scene-selectors'

export function useCatalogScene(scenario: CatalogScene) {
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<Set<string>>(() => new Set(scenario.selectedDatasetIds))
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(() => new Set(scenario.selectedImageIds))
  const [currentDatasetId, setCurrentDatasetId] = useState<string | undefined>(scenario.currentDatasetId)
  const [viewMode, setViewMode] = useState<CatalogViewMode>(scenario.viewMode ?? 'grid')
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(!!scenario.sidebarCollapsed)
  const [hoverImageId, setHoverImageId] = useState<string | undefined>(scenario.hoverImageId)
  const [detailImageId, setDetailImageId] = useState<string | undefined>(scenario.detailImageId)
  const [filterOpen, setFilterOpen] = useState<FilterKey>(scenario.filterOpen ?? null)
  const [searchValue, setSearchValue] = useState(scenario.searchValue ?? '')
  const [sortValue, setSortValue] = useState(scenario.sortValue ?? 'recent')
  const [imageMenuAnchor, setImageMenuAnchor] = useState<{ id: string; el: HTMLElement } | null>(null)
  const [datasetMenuAnchor, setDatasetMenuAnchor] = useState<{ id: string; el: HTMLElement } | null>(null)
  const [filterState, setFilterState] = useState<GalleryFilterPanelState>(() => initialFilterState(scenario))
  const [addDatasetOpen, setAddDatasetOpen] = useState<boolean>(!!scenario.addDatasetOpen)
  const [duplicateDatasetId, setDuplicateDatasetId] = useState<string | undefined>(scenario.duplicateDatasetId)
  const [dragDropOpen, setDragDropOpen] = useState<boolean>(!!scenario.dragDropOpen)
  const [igpExportOpen, setIgpExportOpen] = useState<boolean>(!!scenario.igpExportOpen)
  const [igpExportPhase, setIgpExportPhase] = useState<'preparing' | 'processing' | 'ready' | 'error'>(scenario.igpExportPhase ?? 'preparing')
  const [uploadQualityOpen, setUploadQualityOpen] = useState<boolean>(!!scenario.uploadQualityOpen)
  const [pendingClassRemovalId, setPendingClassRemovalId] = useState<string | undefined>(scenario.pendingClassRemovalId)
  const [pendingMemberRemovalId, setPendingMemberRemovalId] = useState<string | undefined>(scenario.pendingMemberRemovalId)
  const [pendingDatasetDeletionId, setPendingDatasetDeletionId] = useState<string | undefined>(scenario.pendingDatasetDeletionId)
  const [mobileDatasetDropdownOpen, setMobileDatasetDropdownOpen] = useState<boolean>(!!scenario.mobileDatasetDropdownOpen)
  const [mobileBottomSheet, setMobileBottomSheet] = useState<'filter' | 'sort' | null>(scenario.mobileBottomSheet ?? null)
  const [deletedImageIds, setDeletedImageIds] = useState<Set<string>>(new Set())
  const [connectedClassIds, setConnectedClassIds] = useState<Set<string>>(
    () => new Set(scenario.connectedClassIds ?? []),
  )

  // scenario 변경 시 state 재초기화 (Storybook 의 args.scenario 변경 추적)
  useEffect(() => {
    setSelectedDatasetIds(new Set(scenario.selectedDatasetIds))
    setSelectedImageIds(new Set(scenario.selectedImageIds))
    setCurrentDatasetId(scenario.currentDatasetId)
    setViewMode(scenario.viewMode ?? 'grid')
    setSidebarCollapsed(!!scenario.sidebarCollapsed)
    setHoverImageId(scenario.hoverImageId)
    setDetailImageId(scenario.detailImageId)
    setFilterOpen(scenario.filterOpen ?? null)
    setSearchValue(scenario.searchValue ?? '')
    setSortValue(scenario.sortValue ?? 'recent')
    setImageMenuAnchor(null)
    setDatasetMenuAnchor(null)
    setFilterState(initialFilterState(scenario))
    setAddDatasetOpen(!!scenario.addDatasetOpen)
    setDuplicateDatasetId(scenario.duplicateDatasetId)
    setDragDropOpen(!!scenario.dragDropOpen)
    setIgpExportOpen(!!scenario.igpExportOpen)
    setIgpExportPhase(scenario.igpExportPhase ?? 'preparing')
    setUploadQualityOpen(!!scenario.uploadQualityOpen)
    setPendingClassRemovalId(scenario.pendingClassRemovalId)
    setPendingMemberRemovalId(scenario.pendingMemberRemovalId)
    setPendingDatasetDeletionId(scenario.pendingDatasetDeletionId)
    setMobileDatasetDropdownOpen(!!scenario.mobileDatasetDropdownOpen)
    setMobileBottomSheet(scenario.mobileBottomSheet ?? null)
    setDeletedImageIds(new Set())
    setConnectedClassIds(new Set(scenario.connectedClassIds ?? []))
  }, [scenario])

  // 시나리오에 imageMenuOpenId / datasetMenuOpenId 가 있으면 mount 후 kebab DOM 찾아서 menu open
  useEffect(() => {
    if (!scenario.imageMenuOpenId) return
    const t = window.setTimeout(() => {
      const card = document.querySelector(`[data-image-id="${scenario.imageMenuOpenId}"]`)
      const btn = card?.querySelector<HTMLButtonElement>('button[aria-label^="Open menu"]')
      if (btn) setImageMenuAnchor({ id: scenario.imageMenuOpenId!, el: btn })
    }, 0)
    return () => window.clearTimeout(t)
  }, [scenario])

  useEffect(() => {
    if (!scenario.datasetMenuOpenId) return
    const t = window.setTimeout(() => {
      const row = document.querySelector(`[data-dataset-id="${scenario.datasetMenuOpenId}"]`)
      const btn = row?.querySelector<HTMLButtonElement>('button[aria-label^="Open menu"]')
      if (btn) setDatasetMenuAnchor({ id: scenario.datasetMenuOpenId!, el: btn })
    }, 0)
    return () => window.clearTimeout(t)
  }, [scenario])

  const visibleImages = useMemo(
    () => selectCatalogImages(scenario.images, {
      deletedIds: deletedImageIds,
      filterState,
      searchValue,
      sortValue,
    }),
    [deletedImageIds, filterState, scenario.images, searchValue, sortValue],
  )
  const hasActiveFilter = catalogFilterIsActive(filterState)
  const extra = useCatalogExtraDialogs(scenario)

  return {
    selectedDatasetIds, selectedImageIds, currentDatasetId, viewMode, sidebarCollapsed,
    hoverImageId, detailImageId, filterOpen, searchValue, sortValue, visibleImages,
    imageMenuAnchor, datasetMenuAnchor, connectedClassIds,
    dragOverDatasetId: scenario.dragOverDatasetId,
    dragOverGrid: !!scenario.dragOverGrid,
    uploadProgress: scenario.uploadProgress,
    setSelectedDatasetIds,
    toggleDatasetSelection: (id: string, checked: boolean) => setSelectedDatasetIds((prev) => {
      const next = new Set(prev); if (checked) next.add(id); else next.delete(id); return next
    }),
    selectCurrent: setCurrentDatasetId,
    setSelectedImageIds,
    toggleImageSelection: (id: string, checked: boolean) => setSelectedImageIds((prev) => {
      const next = new Set(prev); if (checked) next.add(id); else next.delete(id); return next
    }),
    setViewMode, setSidebarCollapsed, setHoverImageId, setDetailImageId, setFilterOpen,
    setSearchValue, setSortValue,
    openImageMenu: (id: string, el: HTMLElement) => setImageMenuAnchor({ id, el }),
    closeImageMenu: () => setImageMenuAnchor(null),
    openDatasetMenu: (id: string, el: HTMLElement) => setDatasetMenuAnchor({ id, el }),
    closeDatasetMenu: () => setDatasetMenuAnchor(null),
    filterState,
    setFilterState,
    resetFilterState: () => setFilterState(emptyGalleryFilterPanelState()),
    hasActiveFilter,
    addConnectedClass: (id: string) => setConnectedClassIds((prev) => new Set(prev).add(id)),
    removeConnectedClass: (id: string) => setConnectedClassIds((prev) => {
      const next = new Set(prev); next.delete(id); return next
    }),
    deleteImages: (ids: string[]) => {
      setDeletedImageIds((prev) => new Set([...prev, ...ids]))
      setSelectedImageIds((prev) => {
        const next = new Set(prev); ids.forEach((id) => next.delete(id)); return next
      })
    },
    addDatasetOpen, duplicateDatasetId, dragDropOpen, igpExportOpen, igpExportPhase, uploadQualityOpen,
    pendingClassRemovalId, pendingMemberRemovalId, pendingDatasetDeletionId,
    setAddDatasetOpen, setDuplicateDatasetId, setDragDropOpen, setIgpExportOpen, setIgpExportPhase, setUploadQualityOpen,
    setPendingClassRemovalId, setPendingMemberRemovalId, setPendingDatasetDeletionId,
    mobileDatasetDropdownOpen, setMobileDatasetDropdownOpen,
    mobileBottomSheet, setMobileBottomSheet,
    extra,
  }
}

export type CatalogSceneState = ReturnType<typeof useCatalogScene>

function initialFilterState(scenario: CatalogScene): GalleryFilterPanelState {
  const base = emptyGalleryFilterPanelState()
  if (scenario.filterActive) {
    return {
      ...base,
      uploadFrom: '2024-12-01',
      uploadTo: '2024-12-31',
      labeled: 'labeled',
      hasComments: true,
      selectedClassIds: new Set(['cl-1']),
    }
  }
  return base
}
