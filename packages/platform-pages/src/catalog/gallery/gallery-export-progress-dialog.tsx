import { DialogShell } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { ProgressBar } from '@ingradient/ui/components'
import {
  ExportErrorText,
  ExportOptionHint,
  ExportProgressMeta,
  ExportStatusText,
  exportStageLabel,
} from './gallery-export-dialog.styles'

const EXPORT_DIALOG_WIDTH = 'min(440px, calc(100vw - var(--ig-space-13)))'

export type GalleryExportJobStatus = 'queued' | 'running' | 'completed' | 'failed' | string

export interface GalleryExportJobView {
  status: GalleryExportJobStatus
  stage?: string
  progress?: number
  processed_samples?: number
  total_samples?: number
  error?: string
}

export interface GalleryExportProgressDialogProps {
  open: boolean
  /** Job id used to compare against download state. When null, dialog is closed. */
  jobId: string | null
  job?: GalleryExportJobView | undefined
  jobLoading?: boolean
  downloadedJobId?: string | null
  downloadingJobId?: string | null
  error?: string | null
  onClose: () => void
  onDownloadAgain: () => void
}

/**
 * 갤러리 export 진행 상황 / 완료 후 재다운로드 dialog.
 * Platform 의 `GalleryExportProgressDialog` 와 시각·구조 동일.
 */
export function GalleryExportProgressDialog({
  open,
  jobId,
  job,
  jobLoading = false,
  downloadedJobId,
  downloadingJobId,
  error,
  onClose,
  onDownloadAgain,
}: GalleryExportProgressDialogProps) {
  if (!open || !jobId) return null
  const isCompleted = job?.status === 'completed'

  return (
    <DialogShell
      title={isCompleted ? 'Export Complete' : 'Exporting Data'}
      onClose={onClose}
      width={EXPORT_DIALOG_WIDTH}
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          {isCompleted ? (
            <Button type="button" onClick={onDownloadAgain} disabled={downloadingJobId === jobId}>
              {downloadingJobId === jobId ? 'Downloading…' : 'Download Again'}
            </Button>
          ) : null}
        </>
      }
    >
      <ExportStatusText>{exportStageLabel(job?.stage ?? 'queued')}</ExportStatusText>
      <ProgressBar value={job?.progress ?? 0} />
      <ExportProgressMeta>
        <span>{Math.max(0, Math.min(100, job?.progress ?? 0))}%</span>
        <span>
          {(job?.processed_samples ?? 0).toLocaleString()} / {(job?.total_samples ?? 0).toLocaleString()} samples
        </span>
      </ExportProgressMeta>
      {isCompleted ? (
        <ExportOptionHint>
          {downloadedJobId === jobId
            ? 'Download started automatically.'
            : downloadingJobId === jobId
              ? 'Starting download…'
              : 'Ready to download.'}
        </ExportOptionHint>
      ) : null}
      {job?.status === 'failed' ? <ExportErrorText>{job.error || 'Export failed'}</ExportErrorText> : null}
      {!job && jobLoading ? <ExportOptionHint>Loading export status…</ExportOptionHint> : null}
      {error ? <ExportErrorText>{error}</ExportErrorText> : null}
    </DialogShell>
  )
}
