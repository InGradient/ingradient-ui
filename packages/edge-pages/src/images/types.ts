import type { ReactNode } from 'react'
import type { ImageItem, ProjectGroupSettings, ImagesDatePreset } from './image-helpers'

export interface DatasetClass {
  class_id: string
  class_name?: string
  color: string
}

export interface EdgeImagesGridLabels {
  uploading: string
  conversionPending: string
  uploadFailed: (error: string | null | undefined) => string
  deleteGroup: string
}

export interface EdgeImagesGridViewProps {
  items: ImageItem[]
  selectedIds: Set<string>
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void | Promise<void>
  groupMap: Map<string, ImageItem[]>
  sequenceGroupMap: Map<string, ImageItem[]>
  groupSettings: ProjectGroupSettings | null | undefined
  selectedDatasetClasses: DatasetClass[]
  labels: EdgeImagesGridLabels
  getDisplayedGroupMembers: (img: ImageItem) => ImageItem[]
  onCellClick: (event: React.MouseEvent, img: ImageItem, members: ImageItem[]) => void | Promise<void>
  onDeleteGroupRequest: (img: ImageItem, members: ImageItem[], count: number) => void | Promise<void>
}

export interface ImagesModalLabels {
  cursorMode: string
  bboxMode: string
  hintDraw: string
  hintNoClass: string
  hintSelect: string
  close: string
  showAnnotations: string
  hideAnnotations: string
  enterFullscreen: string
  exitFullscreen: string
  bboxCount: (count: number) => string
}

export interface ImagesViewLabels {
  filterTitle: string
  selectAll: string
  deleteSelected: (count: number) => string
  empty: string
  emptyOffline: string
  retry: string
  deleteConfirmTitle: string
  deleteConfirmDesc: (count: number) => string
  deleteConfirm: string
  cancel: string
  loading: string
  loadingMore: string
  dateFilter: DateFilterLabels
  grid: EdgeImagesGridLabels
  modal: ImagesModalLabels
}

export interface DateFilterLabels {
  title: string
  all: string
  today: string
  last7: string
  last30: string
  custom: string
  from: string
  to: string
}

export interface ImagesViewProps {
  groupedImages: ImageItem[]
  groupMap: Map<string, ImageItem[]>
  sequenceGroupMap: Map<string, ImageItem[]>
  groupSettings: ProjectGroupSettings | null | undefined
  classes: DatasetClass[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  isOnline: boolean
  isDeleting: boolean

  datePreset: ImagesDatePreset
  fromDate: string
  toDate: string
  filterOpen: boolean

  selectedImageIds: Set<string>
  selectionMode: boolean

  // ── Modal (image-detail overlay) ──
  modalOpen: boolean
  modalActiveImage: ImageItem | null
  modalImageSrc: string | null
  modalEditMode: 'cursor' | 'bbox'
  /** BBoxCanvasView (canvas only) — view 가 ModalBBoxCanvasWrap 안에 mount */
  modalCanvasContent?: ReactNode
  /** ModalHint 텍스트. null 이면 hint 숨김. */
  modalHintText?: string | null
  /** 하단 ModalBBoxToolbar 표시 (편집 가능 시) */
  showModalToolbar: boolean
  /** Eye / Fullscreen 버튼 표시 여부 (header 좌측) */
  showModalOverlayControls: boolean
  modalAnnotationsVisible: boolean
  modalIsFullscreen: boolean
  modalBboxCount: number

  pendingDelete: { count: number } | null

  labels: ImagesViewLabels

  getDisplayedGroupMembers: (img: ImageItem) => ImageItem[]

  onLoadMore: () => void | Promise<void>
  onSetDatePreset: (preset: ImagesDatePreset) => void
  onSetFromDate: (date: string) => void
  onSetToDate: (date: string) => void
  onToggleFilter: () => void
  onSelectAll: () => void
  onClearSelection: () => void
  onToggleImageSelection: (id: string) => void
  onCloseModal: () => void
  onSetModalEditMode: (mode: 'cursor' | 'bbox') => void
  onModalSwipeNavigate?: (delta: number) => void
  onSetModalAnnotationsVisible: (visible: boolean) => void
  onToggleModalFullscreen: () => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
  onDeleteGroup: (img: ImageItem, members: ImageItem[], count: number) => void | Promise<void>
  onRetryReload: () => void
  onImageCellClick: (event: React.MouseEvent, img: ImageItem, members: ImageItem[]) => void | Promise<void>
}
