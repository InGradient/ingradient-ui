import { DialogShell } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { ExportErrorText, ExportOptionHint } from './gallery-export-dialog.styles'

export interface GalleryDeleteDialogProps {
  /** When null/undefined, the dialog stays closed. */
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  /** Error message shown below the description. */
  error?: string | null
  isDeleting?: boolean
  onClose: () => void
  onConfirm: () => void
}

/**
 * 갤러리 이미지 일괄 삭제 / 단일 삭제 확인 dialog.
 * Platform 의 `GalleryDeleteDialog` 와 시각·구조 동일.
 */
export function GalleryDeleteDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  error,
  isDeleting = false,
  onClose,
  onConfirm,
}: GalleryDeleteDialogProps) {
  if (!open) return null

  return (
    <DialogShell
      title={title}
      onClose={onClose}
      width="var(--ig-popup-lg)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" tone="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting…' : confirmLabel}
          </Button>
        </>
      }
    >
      <ExportOptionHint>{description}</ExportOptionHint>
      {error ? <ExportErrorText>{error}</ExportErrorText> : null}
    </DialogShell>
  )
}
