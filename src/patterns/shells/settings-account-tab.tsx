import styled from 'styled-components'
import { Alert } from '../../components/feedback/alert'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { SettingsSection } from './settings-section'
import { SettingsHint } from './settings-hint'
import { LicenseInfoDisplay, type LicenseInfo } from './license-info-display'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

const Field = styled(TextField)`
  min-width: 240px;
`

const DangerButton = styled(Button).attrs({ variant: 'secondary' as const, tone: 'danger' as const })``

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
    <Wrap>
      <SettingsSection title="Profile">
        <Row>
          <Field
            value={accountName}
            onChange={(e) => onChangeAccountName(e.target.value)}
            placeholder="Display name"
            aria-label="Display name"
          />
          <Button type="button" variant="accent" disabled={saveDisabled} onClick={onSaveName}>
            {accountSaving ? 'Saving…' : 'Save'}
          </Button>
        </Row>
        <SettingsHint>{user?.email ? `Signed in as ${user.email}` : 'Signed in user account.'}</SettingsHint>
        {accountMessage ? (
          <Alert $tone={accountMessage === 'Saved.' ? 'success' : 'info'}>{accountMessage}</Alert>
        ) : null}
      </SettingsSection>

      <SettingsSection title="License">
        <LicenseInfoDisplay license={license} />
      </SettingsSection>

      <SettingsSection title="Access">
        <Row>
          <Button type="button" variant="secondary" onClick={onOpenPassword}>Change password</Button>
          <Button type="button" variant="secondary" onClick={onLogout}>Log out</Button>
        </Row>
      </SettingsSection>

      <SettingsSection title="Delete account">
        <SettingsHint>
          Type your email address exactly, then press Delete Account. You will be asked for your password to confirm,
          and any shared projects will need to be transferred or deleted before the account is removed.
        </SettingsHint>
        <Row>
          <Field
            value={deleteAccountConfirmInput}
            onChange={(e) => onChangeDeleteAccountConfirmInput(e.target.value)}
            placeholder={user?.email ?? 'Type your email to confirm'}
            aria-label="Type email to confirm account deletion"
          />
          <DangerButton
            type="button"
            disabled={!deleteAccountEmailMatches || !!deleteAccountPreviewLoading}
            onClick={onOpenDeleteAccountPreview}
          >
            {deleteAccountPreviewLoading ? 'Preparing…' : 'Delete Account'}
          </DangerButton>
        </Row>
        {deleteAccountMessage ? <Alert $tone="danger">{deleteAccountMessage}</Alert> : null}
      </SettingsSection>
    </Wrap>
  )
}
