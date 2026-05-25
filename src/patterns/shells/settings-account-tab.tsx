import { Inline, Stack } from '../../primitives'
import { Alert } from '../../components/feedback/alert'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { SettingsSection } from './settings-section'
import { SettingsHint } from './settings-hint'
import { LicenseInfoDisplay, type LicenseInfo } from './license-info-display'

const FIELD_STYLE = { minWidth: 240 }

export interface SettingsAccountTabUser {
  id?: string
  name?: string | null
  email?: string | null
}

export interface SettingsAccountTabProps {
  user: SettingsAccountTabUser | null
  license: LicenseInfo | null

  accountName: string
  onChangeAccountName: (value: string) => void
  accountSaving?: boolean
  accountMessage?: string | null
  onSaveName: () => void
  onOpenPassword: () => void
  onLogout: () => void

  deleteAccountConfirmInput: string
  onChangeDeleteAccountConfirmInput: (value: string) => void
  deleteAccountEmailMatches: boolean
  deleteAccountPreviewLoading?: boolean
  onOpenDeleteAccountPreview: () => void
  deleteAccountMessage?: string | null
}

export function SettingsAccountTab({
  user, license,
  accountName, onChangeAccountName, accountSaving, accountMessage, onSaveName,
  onOpenPassword, onLogout,
  deleteAccountConfirmInput, onChangeDeleteAccountConfirmInput,
  deleteAccountEmailMatches, deleteAccountPreviewLoading,
  onOpenDeleteAccountPreview, deleteAccountMessage,
}: SettingsAccountTabProps) {
  const sameAsCurrent = accountName.trim() === (user?.name ?? '')
  const saveDisabled = !!accountSaving || !accountName.trim() || sameAsCurrent

  return (
    <Stack gap={5}>
      <SettingsSection title="Profile">
        <Inline gap={5} wrap="wrap">
          <TextField
            value={accountName}
            onChange={(e) => onChangeAccountName(e.target.value)}
            placeholder="Display name"
            aria-label="Display name"
            style={FIELD_STYLE}
          />
          <Button type="button" variant="accent" disabled={saveDisabled} onClick={onSaveName}>
            {accountSaving ? 'Saving…' : 'Save'}
          </Button>
        </Inline>
        <SettingsHint>{user?.email ? `Signed in as ${user.email}` : 'Signed in user account.'}</SettingsHint>
        {accountMessage ? (
          <Alert $tone={accountMessage === 'Saved.' ? 'success' : 'info'}>{accountMessage}</Alert>
        ) : null}
      </SettingsSection>

      <SettingsSection title="License">
        <LicenseInfoDisplay license={license} />
      </SettingsSection>

      <SettingsSection title="Access">
        <Inline gap={5} wrap="wrap">
          <Button type="button" variant="secondary" onClick={onOpenPassword}>Change password</Button>
          <Button type="button" variant="secondary" onClick={onLogout}>Log out</Button>
        </Inline>
      </SettingsSection>

      <SettingsSection title="Delete account">
        <SettingsHint>
          Type your email address exactly, then press Delete Account. You will be asked for your password to confirm,
          and any shared projects will need to be transferred or deleted before the account is removed.
        </SettingsHint>
        <Inline gap={5} wrap="wrap">
          <TextField
            value={deleteAccountConfirmInput}
            onChange={(e) => onChangeDeleteAccountConfirmInput(e.target.value)}
            placeholder={user?.email ?? 'Type your email to confirm'}
            aria-label="Type email to confirm account deletion"
            style={FIELD_STYLE}
          />
          <Button
            type="button"
            variant="secondary"
            tone="danger"
            disabled={!deleteAccountEmailMatches || !!deleteAccountPreviewLoading}
            onClick={onOpenDeleteAccountPreview}
          >
            {deleteAccountPreviewLoading ? 'Preparing…' : 'Delete Account'}
          </Button>
        </Inline>
        {deleteAccountMessage ? <Alert $tone="danger">{deleteAccountMessage}</Alert> : null}
      </SettingsSection>
    </Stack>
  )
}
