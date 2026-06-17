import { useEffect, useState } from 'react'
import type {
  DatasetTransferAction,
  GalleryExportGroupBy,
  GalleryExportImageFormat,
  GalleryExportJobView,
  GalleryExportRange,
  GalleryExportType,
} from '@ingradient/platform-pages'
import type { CatalogScene } from '../../../../fixtures/platform/0.0.1/catalog-scenarios'

export interface CatalogExtraDialogState {
  bulkDeleteOpen: boolean
  setBulkDeleteOpen: (v: boolean) => void
  exportConfigOpen: boolean
  setExportConfigOpen: (v: boolean) => void
  exportRange: GalleryExportRange
  setExportRange: (v: GalleryExportRange) => void
  exportType: GalleryExportType
  setExportType: (v: GalleryExportType) => void
  exportImageFormat: GalleryExportImageFormat
  setExportImageFormat: (v: GalleryExportImageFormat) => void
  exportGroupBy: GalleryExportGroupBy
  setExportGroupBy: (v: GalleryExportGroupBy) => void
  exportGroupKeyRegex: string
  setExportGroupKeyRegex: (v: string) => void
  exportProgressOpen: boolean
  setExportProgressOpen: (v: boolean) => void
  exportProgressJob: GalleryExportJobView | undefined
  transferAction: DatasetTransferAction | null
  setTransferAction: (v: DatasetTransferAction | null) => void
  transferSourceId: string
  setTransferSourceId: (v: string) => void
  transferTargetId: string
  setTransferTargetId: (v: string) => void
}

export function useCatalogExtraDialogs(scenario: CatalogScene): CatalogExtraDialogState {
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState<boolean>(!!scenario.bulkDeleteOpen)
  const [exportConfigOpen, setExportConfigOpen] = useState<boolean>(!!scenario.exportConfigOpen)
  const [exportRange, setExportRange] = useState<GalleryExportRange>('selected')
  const [exportType, setExportType] = useState<GalleryExportType>('images_and_labels')
  const [exportImageFormat, setExportImageFormat] = useState<GalleryExportImageFormat>('webp')
  const [exportGroupBy, setExportGroupBy] = useState<GalleryExportGroupBy>('none')
  const [exportGroupKeyRegex, setExportGroupKeyRegex] = useState<string>('')
  const [exportProgressOpen, setExportProgressOpen] = useState<boolean>(!!scenario.exportProgressOpen)
  const [transferAction, setTransferAction] = useState<DatasetTransferAction | null>(
    scenario.datasetTransferAction ?? null,
  )
  const [transferSourceId, setTransferSourceId] = useState<string>(scenario.currentDatasetId ?? '')
  const [transferTargetId, setTransferTargetId] = useState<string>('')

  useEffect(() => {
    setBulkDeleteOpen(!!scenario.bulkDeleteOpen)
    setExportConfigOpen(!!scenario.exportConfigOpen)
    setExportProgressOpen(!!scenario.exportProgressOpen)
    setTransferAction(scenario.datasetTransferAction ?? null)
    setTransferSourceId(scenario.currentDatasetId ?? '')
    setTransferTargetId('')
    setExportRange(scenario.selectedImageIds.length ? 'selected' : 'all')
    setExportGroupBy('none')
  }, [scenario])

  const exportProgressJob = jobFromStage(scenario.exportProgressStage)

  return {
    bulkDeleteOpen, setBulkDeleteOpen,
    exportConfigOpen, setExportConfigOpen,
    exportRange, setExportRange,
    exportType, setExportType,
    exportImageFormat, setExportImageFormat,
    exportGroupBy, setExportGroupBy,
    exportGroupKeyRegex, setExportGroupKeyRegex,
    exportProgressOpen, setExportProgressOpen,
    exportProgressJob,
    transferAction, setTransferAction,
    transferSourceId, setTransferSourceId,
    transferTargetId, setTransferTargetId,
  }
}

function jobFromStage(stage: CatalogScene['exportProgressStage']): GalleryExportJobView | undefined {
  switch (stage) {
    case 'queued':
      return { status: 'queued', stage: 'queued', progress: 0, processed_samples: 0, total_samples: 1248 }
    case 'running':
      return {
        status: 'running',
        stage: 'collecting_samples',
        progress: 38,
        processed_samples: 472,
        total_samples: 1248,
      }
    case 'completed':
      return {
        status: 'completed',
        stage: 'starting_download',
        progress: 100,
        processed_samples: 1248,
        total_samples: 1248,
      }
    case 'failed':
      return {
        status: 'failed',
        stage: 'failed',
        progress: 62,
        processed_samples: 770,
        total_samples: 1248,
        error: 'Network error',
      }
    default:
      return undefined
  }
}
