import { useId, type ReactNode } from 'react'
import { Button } from '@ingradient/ui/components'
import {
  ConfirmActions, ConfirmCard, ConfirmError, ConfirmOverlay, ConfirmText, ConfirmTitle,
} from './image-detail-confirm-dialogs.styles'

/** `image` is the opened image only; `group` is every image in its group. */
export type ImageDetailDeleteScope = 'image' | 'group'

export interface ImageDetailArchiveCommentConfirm {
  open: boolean
  saving?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export interface ImageDetailDeleteImageConfirm {
  open: boolean
  /** The image belongs to a group: the dialog offers "This image" and "Entire group". */
  grouped?: boolean
  deleting?: boolean
  error?: string | null
  onCancel: () => void
  onConfirm: (scope: ImageDetailDeleteScope) => void
}

export interface ImageDetailConfirmDialogsProps {
  archiveComment?: ImageDetailArchiveCommentConfirm
  deleteImage?: ImageDetailDeleteImageConfirm
}

function ConfirmDialog({ title, text, error, onDismiss, children }: {
  title: string
  text: string
  error?: string | null
  onDismiss?: () => void
  children: ReactNode
}) {
  const titleId = useId()
  return (
    <ConfirmOverlay onClick={onDismiss}>
      <ConfirmCard role="alertdialog" aria-modal="true" aria-labelledby={titleId} onClick={(event) => event.stopPropagation()}>
        <ConfirmTitle id={titleId}>{title}</ConfirmTitle>
        <ConfirmText>{text}</ConfirmText>
        {error ? <ConfirmError role="alert">{error}</ConfirmError> : null}
        <ConfirmActions>{children}</ConfirmActions>
      </ConfirmCard>
    </ConfirmOverlay>
  )
}

/** The two questions the image detail asks over its main area. The app owns the open state and the work. */
export function ImageDetailConfirmDialogs({ archiveComment, deleteImage }: ImageDetailConfirmDialogsProps) {
  return (
    <>
      {archiveComment?.open ? (
        <ConfirmDialog
          title="Archive comment?"
          text="This will remove the selected comment from this image thread."
          onDismiss={archiveComment.saving ? undefined : archiveComment.onCancel}
        >
          <Button type="button" size="sm" variant="secondary" onClick={archiveComment.onCancel} disabled={archiveComment.saving}>Cancel</Button>
          <Button type="button" size="sm" variant="secondary" tone="danger" onClick={archiveComment.onConfirm} disabled={archiveComment.saving}>
            {archiveComment.saving ? 'Archiving…' : 'Archive'}
          </Button>
        </ConfirmDialog>
      ) : null}
      {deleteImage?.open ? (
        <ConfirmDialog
          title={deleteImage.grouped ? 'Delete from group?' : 'Delete image?'}
          text={deleteImage.grouped
            ? 'Choose whether to delete only the currently opened image or every image in this group.'
            : 'This will permanently remove the current image from the dataset.'}
          error={deleteImage.error}
          onDismiss={deleteImage.onCancel}
        >
          <Button type="button" size="sm" variant="secondary" onClick={deleteImage.onCancel} disabled={deleteImage.deleting}>Cancel</Button>
          {deleteImage.grouped ? (
            <Button type="button" size="sm" variant="secondary" tone="danger" onClick={() => deleteImage.onConfirm('image')} disabled={deleteImage.deleting}>
              {deleteImage.deleting ? 'Deleting…' : 'This image'}
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            tone="danger"
            onClick={() => deleteImage.onConfirm(deleteImage.grouped ? 'group' : 'image')}
            disabled={deleteImage.deleting}
          >
            {deleteImage.deleting ? 'Deleting…' : deleteImage.grouped ? 'Entire group' : 'Delete'}
          </Button>
        </ConfirmDialog>
      ) : null}
    </>
  )
}
