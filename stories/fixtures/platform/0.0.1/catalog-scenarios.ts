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
  | 'multi-selection' | 'filter-active'
  | 'filter-open' | 'sort-open' | 'image-menu-open' | 'dataset-menu-open'
  | 'drag-over-sidebar' | 'drag-over-grid' | 'drag-over-full' | 'sidebar-collapsed'
  | 'table-view' | 'stats-view'
  | 'stats-empty'
  | 'right-empty-classes' | 'right-loading' | 'dataset-details-overflow'
  | 'modal-add-dataset' | 'modal-igp-export-progress' | 'modal-upload-quality'
  | 'modal-bulk-delete' | 'modal-export-config' | 'modal-transfer-move'
  | 'upload-in-progress'
  | 'detail-with-comments'
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
  'filter-active': { ...base, filterActive: true },
  'filter-open': { ...base, filterOpen: 'status' },
  'sort-open': { ...base, filterOpen: 'sort' },
  'image-menu-open': { ...base, imageMenuOpenId: 'img-2' },
  'dataset-menu-open': { ...base, datasetMenuOpenId: 'd2' },
  'drag-over-sidebar': { ...base, dragOverDatasetId: 'd3' },
  'drag-over-grid': { ...base, dragOverGrid: true },
  'drag-over-full': { ...base, dragOverFull: true },
  'sidebar-collapsed': { ...base, sidebarCollapsed: true },
  'table-view': { ...base, viewMode: 'table' },
  'stats-view': { ...base, viewMode: 'stats' },
  'stats-empty': { ...base, viewMode: 'stats', images: [] },
  'right-empty-classes': { ...base, connectedClassIds: [] },
  'right-loading': { ...base, classesLoading: true, membersLoading: true, classes: [], members: [] },
  'dataset-details-overflow': {
    ...base,
    connectedClassIds: mockClasses.map((c) => c.id),
    members: mockMembers,
  },
  'modal-add-dataset': { ...base, addDatasetOpen: true },
  'modal-igp-export-progress': { ...base, igpExportOpen: true, igpExportPhase: 'processing' },
  'modal-upload-quality': { ...base, uploadQualityOpen: true },
  'modal-bulk-delete': { ...base, selectedImageIds: ['img-1', 'img-2', 'img-3'], bulkDeleteOpen: true },
  'modal-export-config': { ...base, selectedImageIds: ['img-1', 'img-2', 'img-3'], exportConfigOpen: true },
  'modal-transfer-move': { ...base, selectedImageIds: ['img-1', 'img-2'], datasetTransferAction: 'move' },
  'upload-in-progress': { ...base, uploadProgress: 32 },
  'detail-with-comments': { ...base, detailImageId: 'img-1', detailVariant: 'with-comments' },
  'mobile-default': { ...base, isMobile: true },
  'mobile-dataset-dropdown-open': { ...base, isMobile: true, mobileDatasetDropdownOpen: true },
  'mobile-bottom-filter': { ...base, isMobile: true, mobileBottomSheet: 'filter' },
  'mobile-bottom-sort': { ...base, isMobile: true, mobileBottomSheet: 'sort' },
}

// 호환성 — 향후 fixture-registry 등에서 type 재사용
export type { MockDataset, MockGalleryImage, DatasetTaskType, SyncState }
