import styled from 'styled-components'
import { Badge, Button, DialogShell, SelectableListItem } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { DialogHint } from './app-shell-dialogs.styles'

const DIALOG_WIDTH = 'min(var(--ig-popup-xl), 100%)'

const AccountRow = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-spacing-8);
  width: 100%;
  min-width: 0;
`

const AccountEmail = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export interface AccountSwitchDialogProps {
  open: boolean
  /** Recent account emails, in the order the app wants them listed. */
  accounts: string[]
  currentEmail?: string | null
  onClose: () => void
  onSelect: (email: string) => void
}

/** Recent-account list opened from the user menu's "Change account". */
export function AccountSwitchDialog({ open, accounts, currentEmail, onClose, onSelect }: AccountSwitchDialogProps) {
  if (!open) return null
  return (
    <DialogShell
      title="Change account"
      onClose={onClose}
      width={DIALOG_WIDTH}
      actions={<Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>}
    >
      {accounts.length === 0 ? (
        <DialogHint>No recent accounts</DialogHint>
      ) : (
        <Stack gap="var(--ig-spacing-4)" data-ig-component="AccountSwitchDialog">
          {accounts.map((email) => (
            <SelectableListItem key={email} variant="flat" selected={email === currentEmail} onClick={() => onSelect(email)}>
              <AccountRow>
                <AccountEmail>{email}</AccountEmail>
                {email === currentEmail ? <Badge $tone="neutral">Current account</Badge> : null}
              </AccountRow>
            </SelectableListItem>
          ))}
        </Stack>
      )}
    </DialogShell>
  )
}
