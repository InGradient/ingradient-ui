import type { ReactNode } from 'react'
import type { SyncState } from '@ingradient/ui/components'
import type { DatasetTaskType, GalleryFilterPanelState } from '@ingradient/ui/patterns'

export type CatalogViewMode = 'grid' | 'table' | 'stats'
export type FilterKey = 'status' | 'dataset' | 'sort' | null

export interface CatalogDataset {
  id: string
  name: string
  task_type: DatasetTaskType
  image_count?: number
}

export interface CatalogImage {
  id: string
  name: string
  thumb_url: string
  sync_state?: SyncState
  archived?: boolean
  processing?: boolean
  group_count?: number
  dataset_id?: string
  sequence_id?: string
  sequence_step?: number
  pattern_label?: string
  width?: number
  height?: number
  size_bytes?: number
  uploader?: string
  created_at?: string
  labeled_at?: string
}

export interface CatalogClass {
  id: string
  name: string
  color: string
  count?: number
}

export interface CatalogMember {
  id: string
  name: string
  role: 'Owner' | 'Maintainer' | 'Labeler' | 'Reviewer' | 'Viewer'
  avatarUrl?: string
  initials?: string
}

export interface CatalogPagePaneProps {
  title: string
  subtitle: string
  projectName?: string | null
  permissionDenied?: boolean
  error?: string | null
  noProject?: boolean
  dragOverFull?: boolean
  dragOverGrid?: boolean
}

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
  onOpenDatasetMenu: (id: string, anchor: HTMLElement) => void
  onCollapse: () => void
  onExpand: () => void
}

export interface CatalogSortOption {
  value: string
  label: string
}

export interface CatalogToolbarPaneProps {
  viewMode: CatalogViewMode
  onChangeViewMode: (mode: CatalogViewMode) => void
  searchValue: string
  onSearchChange: (value: string) => void
  filterState: GalleryFilterPanelState
  onFilterChange: (state: GalleryFilterPanelState) => void
  onFilterReset: () => void
  hasActiveFilter: boolean
  filterDefaultOpen?: boolean
  sortValue: string
  sortOptions: CatalogSortOption[]
  onSortChange: (value: string) => void
  sortDefaultOpen?: boolean
  classes: CatalogClass[]
  members: CatalogMember[]
  patternItems?: Array<{ id: string; label: string }>
  totalCount: number
  loadedCount: number
  selectionCount: number
  allSelected: boolean
  uploadProgress?: number
  onToggleSelectAll: (checked: boolean) => void
  onDelete: () => void
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
  onOpenMenu: (id: string, anchor: HTMLElement) => void
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

export type { CatalogOverlaysProps } from './overlay-types'
import type { CatalogOverlaysProps } from './overlay-types'

export interface CatalogViewProps {
  isMobile?: boolean
  page: CatalogPagePaneProps
  datasets: CatalogDatasetsPaneProps
  toolbar: CatalogToolbarPaneProps
  images: CatalogImagesPaneProps
  rightSidebar: CatalogRightSidebarPaneProps | null
  mobile?: CatalogMobilePaneProps
  statsContent?: ReactNode
  detailContent?: { main?: ReactNode; sidebar?: ReactNode }
  overlays: CatalogOverlaysProps
}
