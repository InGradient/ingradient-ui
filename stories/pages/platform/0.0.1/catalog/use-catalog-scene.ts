import { useEffect, useState } from 'react'
import { emptyGalleryFilterPanelState, type GalleryFilterPanelState } from '@ingradient/ui/patterns'
import type { CatalogScene, CatalogViewMode, FilterKey } from '../../../../fixtures/platform/0.0.1/catalog-scenarios'
import { useCatalogExtraDialogs, type CatalogExtraDialogState } from './use-catalog-extra-dialogs'

export interface CatalogSceneState {
  selectedDatasetIds: Set<string>
  selectedImageIds: Set<string>
  currentDatasetId: string | undefined
  viewMode: CatalogViewMode
  sidebarCollapsed: boolean
  hoverImageId: string | undefined
  detailImageId: string | undefined
  filterOpen: FilterKey
  imageMenuAnchor: { id: string; el: HTMLElement } | null
  datasetMenuAnchor: { id: string; el: HTMLElement } | null
  dragOverDatasetId: string | undefined
  dragOverGrid: boolean
  uploadProgress: number | undefined
  filterState: GalleryFilterPanelState
  setFilterState: (next: GalleryFilterPanelState) => void
  resetFilterState: () => void
  hasActiveFilter: boolean
  // Modals
  addDatasetOpen: boolean
  duplicateDatasetId: string | undefined
  dragDropOpen: boolean
  igpExportOpen: boolean
  igpExportPhase: 'preparing' | 'processing' | 'ready' | 'error'
  uploadQualityOpen: boolean
  pendingClassRemovalId: string | undefined
  pendingMemberRemovalId: string | undefined
  pendingDatasetDeletionId: string | undefined
  setAddDatasetOpen: (v: boolean) => void
  setDuplicateDatasetId: (id: string | undefined) => void
  setDragDropOpen: (v: boolean) => void
  setIgpExportOpen: (v: boolean) => void
  setIgpExportPhase: (p: 'preparing' | 'processing' | 'ready' | 'error') => void
  setUploadQualityOpen: (v: boolean) => void
  setPendingClassRemovalId: (id: string | undefined) => void
  setPendingMemberRemovalId: (id: string | undefined) => void
  setPendingDatasetDeletionId: (id: string | undefined) => void
  // Mobile
  mobileDatasetDropdownOpen: boolean
  setMobileDatasetDropdownOpen: (v: boolean) => void
  mobileBottomSheet: 'filter' | 'sort' | null
  setMobileBottomSheet: (v: 'filter' | 'sort' | null) => void

  setSelectedDatasetIds: (next: Set<string>) => void
  toggleDatasetSelection: (id: string, checked: boolean) => void
  selectCurrent: (id: string) => void
  setSelectedImageIds: (next: Set<string>) => void
  toggleImageSelection: (id: string, checked: boolean) => void
  setViewMode: (mode: CatalogViewMode) => void
  setSidebarCollapsed: (v: boolean) => void
  setHoverImageId: (v: string | undefined) => void
  setDetailImageId: (v: string | undefined) => void
  setFilterOpen: (v: FilterKey) => void
  openImageMenu: (id: string, el: HTMLElement) => void
  closeImageMenu: () => void
  openDatasetMenu: (id: string, el: HTMLElement) => void
  closeDatasetMenu: () => void
  extra: CatalogExtraDialogState
}

export function useCatalogScene(scenario: CatalogScene): CatalogSceneState {
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<Set<string>>(() => new Set(scenario.selectedDatasetIds))
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(() => new Set(scenario.selectedImageIds))
  const [currentDatasetId, setCurrentDatasetId] = useState<string | undefined>(scenario.currentDatasetId)
  const [viewMode, setViewMode] = useState<CatalogViewMode>(scenario.viewMode ?? 'grid')
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(!!scenario.sidebarCollapsed)
  const [hoverImageId, setHoverImageId] = useState<string | undefined>(scenario.hoverImageId)
  const [detailImageId, setDetailImageId] = useState<string | undefined>(scenario.detailImageId)
  const [filterOpen, setFilterOpen] = useState<FilterKey>(scenario.filterOpen ?? null)
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

  const hasActiveFilter = filterIsActive(filterState)
  const extra = useCatalogExtraDialogs(scenario)

  return {
    selectedDatasetIds, selectedImageIds, currentDatasetId, viewMode, sidebarCollapsed,
    hoverImageId, detailImageId, filterOpen, imageMenuAnchor, datasetMenuAnchor,
    dragOverDatasetId: scenario.dragOverDatasetId,
    dragOverGrid: !!scenario.dragOverGrid,
    uploadProgress: scenario.uploadProgress,
    setSelectedDatasetIds,
    toggleDatasetSelection: (id, checked) => setSelectedDatasetIds((prev) => {
      const next = new Set(prev); if (checked) next.add(id); else next.delete(id); return next
    }),
    selectCurrent: setCurrentDatasetId,
    setSelectedImageIds,
    toggleImageSelection: (id, checked) => setSelectedImageIds((prev) => {
      const next = new Set(prev); if (checked) next.add(id); else next.delete(id); return next
    }),
    setViewMode, setSidebarCollapsed, setHoverImageId, setDetailImageId, setFilterOpen,
    openImageMenu: (id, el) => setImageMenuAnchor({ id, el }),
    closeImageMenu: () => setImageMenuAnchor(null),
    openDatasetMenu: (id, el) => setDatasetMenuAnchor({ id, el }),
    closeDatasetMenu: () => setDatasetMenuAnchor(null),
    filterState,
    setFilterState,
    resetFilterState: () => setFilterState(emptyGalleryFilterPanelState()),
    hasActiveFilter,
    addDatasetOpen, duplicateDatasetId, dragDropOpen, igpExportOpen, igpExportPhase, uploadQualityOpen,
    pendingClassRemovalId, pendingMemberRemovalId, pendingDatasetDeletionId,
    setAddDatasetOpen, setDuplicateDatasetId, setDragDropOpen, setIgpExportOpen, setIgpExportPhase, setUploadQualityOpen,
    setPendingClassRemovalId, setPendingMemberRemovalId, setPendingDatasetDeletionId,
    mobileDatasetDropdownOpen, setMobileDatasetDropdownOpen,
    mobileBottomSheet, setMobileBottomSheet,
    extra,
  }
}

function initialFilterState(scenario: CatalogScene): GalleryFilterPanelState {
  const base = emptyGalleryFilterPanelState()
  if (scenario.filterOpen === 'status') {
    return {
      ...base,
      uploadFrom: '2024-12-01',
      uploadTo: '2024-12-31',
      labeled: 'labeled',
      hasComments: true,
      selectedClassIds: new Set(['cl-1', 'cl-3']),
    }
  }
  return base
}

function filterIsActive(state: GalleryFilterPanelState): boolean {
  return !!(state.uploadFrom || state.uploadTo || state.modifiedFrom || state.modifiedTo
    || state.labeled !== 'all' || state.archive !== 'all' || state.hasComments
    || state.selectedClassIds.size > 0 || state.selectedMemberIds.size > 0 || state.selectedPatternIds.size > 0)
}
