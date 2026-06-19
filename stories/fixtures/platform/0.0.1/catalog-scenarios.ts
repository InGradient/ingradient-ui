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
  | 'stress-test'
  | 'multi-selection' | 'archived' | 'processing' | 'group-mode'
  | 'hover-preview' | 'detail-open' | 'filter-open' | 'sort-open' | 'image-menu' | 'dataset-menu-open'
  | 'drag-over' | 'uploading' | 'sidebar-collapsed'
  | 'table-view' | 'stats-view' | 'stats-empty'
  | 'right-loading' | 'right-many-classes'
  | 'modal-add-dataset' | 'modal-duplicate' | 'modal-drag-drop'
  | 'modal-igp-export' | 'modal-upload-quality'
  | 'modal-confirm-delete' | 'modal-bulk-delete'
  | 'modal-export' | 'modal-transfer'
  | 'detail-with-annotations' | 'detail-with-comments' | 'detail-multi-class'
  | 'mobile-default' | 'mobile-dataset-dropdown-open' | 'mobile-bottom-filter'

const datasetD1Images = mockImages.filter((img) => img.dataset_id === 'd1')
const datasetD2Images = mockImages.filter((img) => img.dataset_id === 'd2')

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

/** Stress test 합성 — 많은 이미지(60) + 첫 1개는 매우 긴 파일명. */
function stressImages(): MockGalleryImage[] {
  const many = Array.from({ length: 60 }, (_, i) => {
    const seed = mockImages[i % mockImages.length]
    return { ...seed, id: `stress-${i + 1}`, name: `extra-image-${String(i + 1).padStart(3, '0')}.jpg` }
  })
  many[0] = { ...many[0], name: 'very-long-image-filename-2024-q4-batch-3-wafer-line-a-001-cropped-and-aligned.jpg' }
  return many
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
  'stress-test': { ...base, images: stressImages() },
  'multi-selection': { ...base, selectedImageIds: ['img-1', 'img-2', 'img-3'] },
  'archived': { ...base, images: datasetD1Images.map((img, i) => i % 3 === 0 ? { ...img, archived: true } : img) },
  'processing': { ...base, images: datasetD1Images.map((img, i) => i < 3 ? { ...img, processing: true, sync_state: 'uploading' } : img), uploadProgress: 42 },
  'group-mode': { ...base, images: datasetD1Images.map((img, i) => i % 2 === 0 ? { ...img, group_count: 3 + i } : img) },
  'hover-preview': { ...base, hoverImageId: 'img-1' },
  'detail-open': { ...base, detailImageId: 'img-1' },
  'filter-open': { ...base, filterOpen: 'status' },
  'sort-open': { ...base, filterOpen: 'sort' },
  'image-menu': { ...base, imageMenuOpenId: 'img-2' },
  'dataset-menu-open': { ...base, datasetMenuOpenId: 'd2' },
  'drag-over': { ...base, dragOverGrid: true },
  'uploading': { ...base, uploadProgress: 67 },
  'sidebar-collapsed': { ...base, sidebarCollapsed: true },
  'table-view': { ...base, viewMode: 'table' },
  'stats-view': { ...base, viewMode: 'stats' },
  'stats-empty': { ...base, viewMode: 'stats', images: [] },
  'right-loading': { ...base, classesLoading: true, membersLoading: true, classes: [], members: [] },
  'right-many-classes': { ...base, connectedClassIds: mockClasses.map((c) => c.id) },
  'modal-add-dataset': { ...base, addDatasetOpen: true },
  'modal-duplicate': { ...base, duplicateDatasetId: 'd1' },
  'modal-drag-drop': { ...base, dragDropOpen: true },
  'modal-igp-export': { ...base, igpExportOpen: true, igpExportPhase: 'ready' },
  'modal-upload-quality': { ...base, uploadQualityOpen: true },
  'modal-confirm-delete': { ...base, pendingDatasetDeletionId: 'd1' },
  'modal-bulk-delete': { ...base, selectedImageIds: ['img-1', 'img-2', 'img-3'], bulkDeleteOpen: true },
  'modal-export': { ...base, selectedImageIds: ['img-1', 'img-2', 'img-3'], exportConfigOpen: true },
  'modal-transfer': { ...base, selectedImageIds: ['img-1', 'img-2'], datasetTransferAction: 'copy' },
  'detail-with-annotations': { ...base, detailImageId: 'img-1', detailVariant: 'with-annotations' },
  'detail-with-comments': { ...base, detailImageId: 'img-1', detailVariant: 'with-comments' },
  'detail-multi-class': { ...base, detailImageId: 'img-1', detailVariant: 'multi-class' },
  'mobile-default': { ...base, isMobile: true },
  'mobile-dataset-dropdown-open': { ...base, isMobile: true, mobileDatasetDropdownOpen: true },
  'mobile-bottom-filter': { ...base, isMobile: true, mobileBottomSheet: 'filter' },
}

// 호환성 — 향후 fixture-registry 등에서 type 재사용
export type { MockDataset, MockGalleryImage, DatasetTaskType, SyncState }
