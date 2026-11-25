import { ArchiveIcon, Button, DialogShell, IconButton } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'
import {
  DialogHint, DialogScrollBody, RowActions, RowCard, RowList, RowMain, RowMeta, RowText, RowTitle,
} from './app-shell-dialogs.styles'

const DIALOG_WIDTH = 'min(var(--ig-popup-2xl), 100%)'

export interface NoticesDialogItem {
  id: string
  title: string
  description: string
  /** Already formatted for display; the app owns locale and time zone. */
  createdAtLabel: string
  /** Shows the Open button for notices that lead somewhere. */
  canOpen?: boolean
}

export interface NoticesDialogProps {
  open: boolean
  notices: NoticesDialogItem[]
  loading?: boolean
  onClose: () => void
  onArchive: (id: string) => void
  onOpen?: (id: string) => void
}

/** Notice list opened from the app shell's Notice row. */
export function NoticesDialog({ open, notices, loading = false, onClose, onArchive, onOpen }: NoticesDialogProps) {
  if (!open) return null
  return (
    <DialogShell title="Notice" onClose={onClose} width={DIALOG_WIDTH}>
      <DialogScrollBody data-ig-component="NoticesDialog">
        {loading ? (
          <DialogHint>Loading…</DialogHint>
        ) : notices.length === 0 ? (
          <DialogHint>No new notices.</DialogHint>
        ) : (
          <RowList>
            {notices.map((notice) => (
              <RowCard key={notice.id}>
                <RowMain>
                  <RowTitle>{notice.title}</RowTitle>
                  <RowText>{notice.description}</RowText>
                  <RowMeta>{notice.createdAtLabel}</RowMeta>
                </RowMain>
                <RowActions>
                  {notice.canOpen && onOpen ? (
                    <Button type="button" variant="secondary" size="sm" onClick={() => onOpen(notice.id)}>Open</Button>
                  ) : null}
                  <IconButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    title="Archive notice"
                    aria-label={`Archive notice: ${notice.title}`}
                    onClick={() => onArchive(notice.id)}
                  >
                    <ArchiveIcon size={iconSizeNumbers.sm} aria-hidden />
                  </IconButton>
                </RowActions>
              </RowCard>
            ))}
          </RowList>
        )}
      </DialogScrollBody>
    </DialogShell>
  )
}
