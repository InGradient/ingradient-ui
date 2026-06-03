import { Stack, Text } from '@ingradient/ui/primitives'
import { Alert } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { PasswordField } from '@ingradient/ui/components'
import { DialogShell } from '@ingradient/ui/components'

const FULL_FIELD_STYLE = { width: '100%' }

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
      width="min(var(--ig-popup-2xl-narrow), 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={!!saving}>Cancel</Button>
          <Button type="button" variant="accent" onClick={onSubmit} disabled={submitDisabled}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <Stack gap={5}>
        <Stack gap={2}>
          <Text as="label" htmlFor="settings-current-password" tone="secondary" size="var(--ig-font-size-sm)" weight={600}>Current password</Text>
          <PasswordField
            id="settings-current-password"
            value={currentPassword}
            onChange={(e) => onChangeCurrentPassword(e.target.value)}
            style={FULL_FIELD_STYLE}
          />
        </Stack>
        <Stack gap={2}>
          <Text as="label" htmlFor="settings-new-password" tone="secondary" size="var(--ig-font-size-sm)" weight={600}>New password</Text>
          <PasswordField
            id="settings-new-password"
            value={newPassword}
            onChange={(e) => onChangeNewPassword(e.target.value)}
            style={FULL_FIELD_STYLE}
          />
        </Stack>
        <Stack gap={2}>
          <Text as="label" htmlFor="settings-confirm-password" tone="secondary" size="var(--ig-font-size-sm)" weight={600}>Confirm new password</Text>
          <PasswordField
            id="settings-confirm-password"
            value={newPasswordConfirm}
            onChange={(e) => onChangeNewPasswordConfirm(e.target.value)}
            style={FULL_FIELD_STYLE}
          />
        </Stack>
        {invalidConfirm ? <Alert $tone="danger">New password and confirmation must match.</Alert> : null}
        {passwordMessage ? (
          <Alert $tone={passwordMessage === successText ? 'success' : 'danger'}>{passwordMessage}</Alert>
        ) : null}
      </Stack>
    </DialogShell>
  )
}
