import styled from 'styled-components'
import { Alert } from '../../components/feedback/alert'
import { Button } from '../../components/inputs/button'
import { PasswordField } from '../../components/inputs/text-fields'
import { DialogShell } from '../../components/overlays/dialog-shell'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const Label = styled.label`
  color: var(--ig-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
`

const FullPasswordField = styled(PasswordField)`
  width: 100%;
`

export interface PasswordChangeDialogProps {
  open: boolean
  saving?: boolean
  currentPassword: string
  onChangeCurrentPassword: (value: string) => void
  newPassword: string
  onChangeNewPassword: (value: string) => void
  newPasswordConfirm: string
  onChangeNewPasswordConfirm: (value: string) => void
  passwordMessage?: string | null
  successText?: string
  onClose: () => void
  onSubmit: () => void
  title?: string
}

export function PasswordChangeDialog({
  open, saving,
  currentPassword, onChangeCurrentPassword,
  newPassword, onChangeNewPassword,
  newPasswordConfirm, onChangeNewPasswordConfirm,
  passwordMessage, successText = 'Password changed.',
  onClose, onSubmit,
  title = 'Change Password',
}: PasswordChangeDialogProps) {
  if (!open) return null
  const invalidConfirm = Boolean(newPasswordConfirm) && newPassword !== newPasswordConfirm
  const submitDisabled = !!saving || !currentPassword || !newPassword || newPassword !== newPasswordConfirm

  return (
    <DialogShell
      title={title}
      onClose={onClose}
      width="min(420px, 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={!!saving}>Cancel</Button>
          <Button type="button" variant="accent" onClick={onSubmit} disabled={submitDisabled}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <Stack>
        <FieldRow>
          <Label htmlFor="settings-current-password">Current password</Label>
          <FullPasswordField
            id="settings-current-password"
            value={currentPassword}
            onChange={(e) => onChangeCurrentPassword(e.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <Label htmlFor="settings-new-password">New password</Label>
          <FullPasswordField
            id="settings-new-password"
            value={newPassword}
            onChange={(e) => onChangeNewPassword(e.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <Label htmlFor="settings-confirm-password">Confirm new password</Label>
          <FullPasswordField
            id="settings-confirm-password"
            value={newPasswordConfirm}
            onChange={(e) => onChangeNewPasswordConfirm(e.target.value)}
          />
        </FieldRow>
        {invalidConfirm ? <Alert $tone="danger">New password and confirmation must match.</Alert> : null}
        {passwordMessage ? (
          <Alert $tone={passwordMessage === successText ? 'success' : 'danger'}>{passwordMessage}</Alert>
        ) : null}
      </Stack>
    </DialogShell>
  )
}
