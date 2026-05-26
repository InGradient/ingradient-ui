import type {
  DatasetTransferAction,
  GalleryExportGroupBy,
  GalleryExportImageFormat,
  GalleryExportJobView,
  GalleryExportRange,
  GalleryExportType,
} from '@ingradient/ui/patterns'
import type { CatalogClass, CatalogDataset, CatalogImage } from './types'

export interface CatalogOverlaysProps {
  imageMenu: {
    anchorEl: HTMLElement | null
    datasets: CatalogDataset[]
    clipboardHasImages?: boolean
    archived?: boolean
    defaultOpenSubmenuKey?: 'copy-to' | 'move-to'
    onClose: () => void
    onCopyTo?: (datasetId: string) => void
    onMoveTo?: (datasetId: string) => void
    onArchive?: () => void
    onUnarchive?: () => void
    onDelete?: () => void
    onOpenLabeling?: () => void
  }
  datasetMenu: {
    anchorEl: HTMLElement | null
    onClose: () => void
    onRename: () => void
    onDuplicate: () => void
    onExport: () => void
    onDelete: () => void
  }
  detail: {
    image: CatalogImage | null
    open: boolean
    onClose: () => void
  }
  addDataset: {
    open: boolean
    classes: CatalogClass[]
    onClose: () => void
    onSubmit: () => void
  }
  duplicateDataset: {
    datasetId?: string
    defaultName: string
    onClose: () => void
    onSubmit: () => void
  }
  dragDrop: {
    open: boolean
    sourceDatasetName: string
    targetDatasetName: string
    itemCount: number
    onClose: () => void
    onConfirm: () => void
  }
  igpExport: {
    open: boolean
    phase: 'preparing' | 'processing' | 'ready' | 'error'
    progress: number
    downloadUrl?: string
    filename: string
    onClose: () => void
  }
  uploadQuality: {
    open: boolean
    fileCount: number
    onClose: () => void
    onConfirm: () => void
  }
  pendingClassRemoval: {
    className?: string
    onCancel: () => void
    onConfirm: () => void
  }
  pendingMemberRemoval: {
    open: boolean
    onCancel: () => void
    onConfirm: () => void
  }
  pendingDatasetDeletion: {
    datasetName?: string
    onCancel: () => void
    onConfirm: () => void
  }
  bulkDelete: {
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    error?: string | null
    isDeleting?: boolean
    onClose: () => void
    onConfirm: () => void
  }
  exportConfig: {
    open: boolean
    range: GalleryExportRange
    exportType: GalleryExportType
    imageFormat: GalleryExportImageFormat
    groupBy: GalleryExportGroupBy
    groupKeyRegex: string
    selectedCount: number
    allRangeTitle: string
    allRangeHint: string
    error?: string | null
    startPending?: boolean
    onRangeChange: (v: GalleryExportRange) => void
    onExportTypeChange: (v: GalleryExportType) => void
    onImageFormatChange: (v: GalleryExportImageFormat) => void
    onGroupByChange: (v: GalleryExportGroupBy) => void
    onGroupKeyRegexChange: (v: string) => void
    onClose: () => void
    onStart: () => void
  }
  exportProgress: {
    open: boolean
    jobId: string | null
    job?: GalleryExportJobView
    jobLoading?: boolean
    downloadedJobId?: string | null
    downloadingJobId?: string | null
    error?: string | null
    onClose: () => void
    onDownloadAgain: () => void
  }
  datasetTransfer: {
    action: DatasetTransferAction | null
    datasets: CatalogDataset[]
    sourceId: string
    targetId: string
    copyPending?: boolean
    movePending?: boolean
    onActionChange: (v: DatasetTransferAction | null) => void
    onSourceChange: (v: string) => void
    onTargetChange: (v: string) => void
    onCopy: () => void
    onMove: () => void
  }
}
