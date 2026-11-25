import { Badge, DialogShell } from '@ingradient/ui/components'
import {
  DialogHint, DialogScrollBody, RowAuthor, RowButton, RowList, RowMain, RowMeta, RowText, RowThumb, RowTitle,
} from './app-shell-dialogs.styles'

const DIALOG_WIDTH = 'min(var(--ig-popup-3xl), 100%)'
const COUNT_BADGE_STYLE = { flexShrink: 0 }

export interface CommentedImagesDialogItem {
  imageId: string
  imageName: string
  thumbUrl: string
  datasetName?: string
  /** Already formatted for display; the app owns locale and time zone. */
  latestAtLabel: string
  latestAuthor: string
  latestPreview: string
  commentCount: number
}

export interface CommentedImagesDialogProps {
  open: boolean
  items: CommentedImagesDialogItem[]
  loading?: boolean
  onClose: () => void
  onOpenImage: (imageId: string) => void
}

/** Commented-image list opened from the app shell's Comment row. */
export function CommentedImagesDialog({ open, items, loading = false, onClose, onOpenImage }: CommentedImagesDialogProps) {
  if (!open) return null
  return (
    <DialogShell
      title="Comment"
      description="Browse all commented images in the current project."
      onClose={onClose}
      width={DIALOG_WIDTH}
    >
      <DialogScrollBody data-ig-component="CommentedImagesDialog">
        {loading ? (
          <DialogHint>Loading comments…</DialogHint>
        ) : items.length === 0 ? (
          <DialogHint>No comments yet.</DialogHint>
        ) : (
          <RowList>
            {items.map((item) => (
              <li key={item.imageId}>
                <RowButton type="button" onClick={() => onOpenImage(item.imageId)}>
                  <RowThumb src={item.thumbUrl} alt="" />
                  <RowMain>
                    <RowTitle>{item.imageName}</RowTitle>
                    <RowMeta>
                      {item.datasetName ? `${item.datasetName} · ` : ''}
                      {item.latestAtLabel}
                    </RowMeta>
                    <RowText>
                      <RowAuthor>{item.latestAuthor}:</RowAuthor>
                      {item.latestPreview}
                    </RowText>
                  </RowMain>
                  <Badge $tone="accent" style={COUNT_BADGE_STYLE}>
                    {item.commentCount.toLocaleString()} {item.commentCount === 1 ? 'comment' : 'comments'}
                  </Badge>
                </RowButton>
              </li>
            ))}
          </RowList>
        )}
      </DialogScrollBody>
    </DialogShell>
  )
}
