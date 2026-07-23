import type { DatasetTaskType, SyncState } from '@ingradient/platform-pages'
import { mockDatasets, type MockDataset } from './catalog-datasets'
import { mockImages, type MockGalleryImage } from './catalog-images'
import { mockClasses, type MockCatalogClass } from './catalog-classes'
import { mockMembers, type MockMember } from './catalog-members'

export type CatalogViewMode = 'grid' | 'table' | 'stats'
export type FilterKey = 'status' | 'dataset' | 'sort' | null

export interface CatalogScene {
  datasets: MockDataset[]
  images: MockGalleryImage[]
  selectedDatasetIds: string[]
  selectedImageIds: string[]
  currentDatasetId?: string
  datasetsLoading?: boolean
  imagesLoading?: boolean
  error?: string
  permissionDenied?: boolean
  noProject?: boolean
  sidebarCollapsed?: boolean
  viewMode?: CatalogViewMode
  searchValue?: string
  sortValue?: string
  filterActive?: boolean
  hoverImageId?: string
  detailImageId?: string
  filterOpen?: FilterKey
  imageMenuOpenId?: string
  datasetMenuOpenId?: string
  dragOverDatasetId?: string
  dragOverGrid?: boolean
  dragOverFull?: boolean
  uploadProgress?: number
  detailVariant?: 'minimal' | 'with-annotations' | 'with-comments' | 'multi-class'
  imageMenuSubmenu?: 'copy-to' | 'move-to'
  imageIsArchived?: boolean
  clipboardHasImages?: boolean
  // Mobile
  isMobile?: boolean
  mobileDatasetDropdownOpen?: boolean
  mobileBottomSheet?: 'filter' | 'sort'
  // Right sidebar
  classes?: MockCatalogClass[]
  connectedClassIds?: string[]
  classesLoading?: boolean
  members?: MockMember[]
  membersLoading?: boolean
  hoverClassId?: string
  // Modals (1개만 동시 open 가정)
  addDatasetOpen?: boolean
  duplicateDatasetId?: string
  dragDropOpen?: boolean
  igpExportOpen?: boolean
  igpExportPhase?: 'preparing' | 'processing' | 'ready' | 'error'
  uploadQualityOpen?: boolean
  pendingClassRemovalId?: string
  pendingMemberRemovalId?: string
  pendingDatasetDeletionId?: string
  bulkDeleteOpen?: boolean
  exportConfigOpen?: boolean
  exportProgressOpen?: boolean
  exportProgressStage?: 'queued' | 'running' | 'completed' | 'failed'
  datasetTransferAction?: 'copy' | 'move'
}

export type CatalogScenarioKey =
  | 'default'
  | 'empty-datasets' | 'empty-images'
  | 'loading-datasets' | 'loading-images'
  | 'error' | 'permission-denied' | 'no-project'
  | 'many-images' | 'long-text'
  | 'multi-selection' | 'mixed-sync' | 'archived' | 'processing' | 'group-mode'
  | 'search-results' | 'sort-name-desc'
  | 'hover-preview' | 'detail-open' | 'filter-open' | 'sort-open' | 'image-menu-open' | 'dataset-menu-open'
  | 'drag-over-sidebar' | 'drag-over-grid' | 'upload-pending' | 'sidebar-collapsed'
  | 'table-view' | 'stats-view'
  | 'right-empty-classes' | 'right-loading' | 'right-many-classes' | 'member-overflow'
  | 'filter-active'
  | 'stats-rich' | 'stats-empty'
  | 'modal-add-dataset' | 'modal-duplicate' | 'modal-drag-drop' | 'modal-igp-export-progress' | 'modal-igp-export-ready'
  | 'modal-upload-quality' | 'modal-confirm-class-removal' | 'modal-confirm-dataset-deletion'
  | 'modal-bulk-delete' | 'modal-export-config' | 'modal-export-progress' | 'modal-export-complete'
  | 'modal-transfer-copy' | 'modal-transfer-move'
  | 'upload-in-progress' | 'drag-over-full'
  | 'detail-with-annotations' | 'detail-with-comments' | 'detail-multi-class'
  | 'image-menu-submenu' | 'image-menu-archived' | 'image-menu-clipboard-ready'
  | 'mobile-default' | 'mobile-dataset-dropdown-open' | 'mobile-bottom-filter' | 'mobile-bottom-sort'

const datasetD1Images = mockImages.filter((img) => img.dataset_id === 'd1')

const base: CatalogScene = {
  datasets: mockDatasets,
  images: datasetD1Images,
  selectedDatasetIds: [],
  selectedImageIds: [],
  currentDatasetId: 'd1',
  classes: mockClasses,
  connectedClassIds: ['cl-1', 'cl-2', 'cl-3'],
  members: mockMembers.slice(0, 4),
}

function longName(n: number): MockGalleryImage[] {
  return mockImages.slice(0, n).map((img, i) =>
    i === 0 ? { ...img, name: 'very-long-image-filename-2024-q4-batch-3-wafer-line-a-001-cropped-and-aligned.jpg' } : img)
}

function manyImages(): MockGalleryImage[] {
  return Array.from({ length: 60 }, (_, i) => {
    const seed = mockImages[i % mockImages.length]
    return { ...seed, id: `many-${i + 1}`, name: `extra-image-${String(i + 1).padStart(3, '0')}.jpg` }
  })
}

export const catalogScenarios: Record<CatalogScenarioKey, CatalogScene> = {
  'default': base,
  'empty-datasets': { ...base, datasets: [], currentDatasetId: undefined, images: [] },
  'empty-images': { ...base, images: [] },
  'loading-datasets': { ...base, datasets: [], datasetsLoading: true, currentDatasetId: undefined, images: [] },
  'loading-images': { ...base, imagesLoading: true, images: [] },
  'error': { ...base, error: 'Failed to load images. Try again.', images: [] },
  'permission-denied': { ...base, permissionDenied: true, images: [] },
  'no-project': { ...base, noProject: true, datasets: [], images: [], currentDatasetId: undefined },
  'many-images': { ...base, images: manyImages() },
  'long-text': { ...base, images: longName(8) },
  'multi-selection': { ...base, selectedImageIds: ['img-1', 'img-2', 'img-3'] },
  'mixed-sync': { ...base, images: datasetD1Images.slice(0, 9) },
  'archived': { ...base, images: datasetD1Images.map((img, i) => i % 3 === 0 ? { ...img, archived: true } : img) },
  'processing': { ...base, images: datasetD1Images.map((img, i) => i < 3 ? { ...img, processing: true, sync_state: 'uploading' } : img), uploadProgress: 42 },
  'group-mode': { ...base, images: datasetD1Images.map((img, i) => i % 2 === 0 ? { ...img, group_count: 3 + i } : img) },
  'search-results': { ...base, searchValue: '20230808' },
  'sort-name-desc': { ...base, sortValue: 'name-desc' },
  'hover-preview': { ...base, hoverImageId: 'img-1' },
  'detail-open': { ...base, detailImageId: 'img-1' },
  'filter-open': { ...base, filterOpen: 'status' },
  'sort-open': { ...base, filterOpen: 'sort' },
  'image-menu-open': { ...base, imageMenuOpenId: 'img-2' },
  'dataset-menu-open': { ...base, datasetMenuOpenId: 'd2' },
  'drag-over-sidebar': { ...base, dragOverDatasetId: 'd3' },
  'drag-over-grid': { ...base, dragOverGrid: true },
  'upload-pending': { ...base, uploadProgress: 67 },
  'sidebar-collapsed': { ...base, sidebarCollapsed: true },
  'table-view': { ...base, viewMode: 'table' },
  'stats-view': { ...base, viewMode: 'stats' },
  'right-empty-classes': { ...base, connectedClassIds: [] },
  'right-loading': { ...base, classesLoading: true, membersLoading: true, classes: [], members: [] },
  'right-many-classes': { ...base, connectedClassIds: mockClasses.map((c) => c.id) },
  'member-overflow': { ...base, members: mockMembers },
  'filter-active': { ...base, filterActive: true },
  'stats-rich': { ...base, viewMode: 'stats' },
  'stats-empty': { ...base, viewMode: 'stats', images: [] },
  'modal-add-dataset': { ...base, addDatasetOpen: true },
  'modal-duplicate': { ...base, duplicateDatasetId: 'd1' },
  'modal-drag-drop': { ...base, dragDropOpen: true },
  'modal-igp-export-progress': { ...base, igpExportOpen: true, igpExportPhase: 'processing' },
  'modal-igp-export-ready': { ...base, igpExportOpen: true, igpExportPhase: 'ready' },
  'modal-upload-quality': { ...base, uploadQualityOpen: true },
  'modal-confirm-class-removal': { ...base, pendingClassRemovalId: 'cl-1' },
  'modal-confirm-dataset-deletion': { ...base, pendingDatasetDeletionId: 'd1' },
  'modal-bulk-delete': { ...base, selectedImageIds: ['img-1', 'img-2', 'img-3'], bulkDeleteOpen: true },
  'modal-export-config': { ...base, selectedImageIds: ['img-1', 'img-2', 'img-3'], exportConfigOpen: true },
  'modal-export-progress': { ...base, exportProgressOpen: true, exportProgressStage: 'running' },
  'modal-export-complete': { ...base, exportProgressOpen: true, exportProgressStage: 'completed' },
  'modal-transfer-copy': { ...base, selectedImageIds: ['img-1', 'img-2'], datasetTransferAction: 'copy' },
  'modal-transfer-move': { ...base, selectedImageIds: ['img-1', 'img-2'], datasetTransferAction: 'move' },
  'upload-in-progress': { ...base, uploadProgress: 32 },
  'drag-over-full': { ...base, dragOverFull: true },
  'detail-with-annotations': { ...base, detailImageId: 'img-1', detailVariant: 'with-annotations' },
  'detail-with-comments': { ...base, detailImageId: 'img-1', detailVariant: 'with-comments' },
  'detail-multi-class': { ...base, detailImageId: 'img-1', detailVariant: 'multi-class' },
  'image-menu-submenu': { ...base, imageMenuOpenId: 'img-2', imageMenuSubmenu: 'copy-to' },
  'image-menu-archived': { ...base, imageMenuOpenId: 'img-2', imageIsArchived: true },
  'image-menu-clipboard-ready': { ...base, imageMenuOpenId: 'img-2', clipboardHasImages: true },
  'mobile-default': { ...base, isMobile: true },
  'mobile-dataset-dropdown-open': { ...base, isMobile: true, mobileDatasetDropdownOpen: true },
  'mobile-bottom-filter': { ...base, isMobile: true, mobileBottomSheet: 'filter' },
  'mobile-bottom-sort': { ...base, isMobile: true, mobileBottomSheet: 'sort' },
}

// 호환성 — 향후 fixture-registry 등에서 type 재사용
export type { MockDataset, MockGalleryImage, DatasetTaskType, SyncState }
