import styled from 'styled-components'
import { Alert } from '../../components/feedback/alert'
import { Button } from '../../components/inputs/button'
import { PasswordField, TextField } from '../../components/inputs/text-fields'
import { DialogShell } from '../../components/overlays/dialog-shell'
import {
  ProjectResolutionCard,
  type ProjectResolution,
  type ProjectResolutionInfo,
} from './project-resolution-card'

export const FINAL_DELETE_CONFIRM_TEXT = 'DELETE'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Copy = styled.p`
  margin: 0;
  color: var(--ig-color-text-soft);
  font-size: 14px;
  line-height: 1.55;
`

const SoloCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid var(--ig-color-alert-danger-border);
  border-radius: 10px;
  background: var(--ig-color-alert-danger-bg);
`

const Title = styled.div`
  color: var(--ig-color-text-primary);
  font-size: 14px;
  font-weight: 600;
`

const Meta = styled.div`
  color: var(--ig-color-text-muted);
  font-size: 12px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--ig-color-text-primary);
  font-size: 13px;
  font-weight: 600;
`

const FullPasswordField = styled(PasswordField)`
  width: 100%;
  min-width: 260px;
`

const FullConfirmField = styled(TextField)`
  width: 100%;
`

const DangerButton = styled(Button).attrs({ variant: 'secondary' as const, tone: 'danger' as const })``

export interface DeleteAccountSoloProject {
  project_id: string
  project_name: string
  role: string
  member_count: number
}

export interface DeleteAccountPreview {
  solo_projects: DeleteAccountSoloProject[]
  requires_resolution: ProjectResolutionInfo[]
}

export interface DeleteAccountResolutions {
  [projectId: string]: ProjectResolution
}

export interface DeleteAccountDialogProps {
  open: boolean
  preview: DeleteAccountPreview | null
  pending?: boolean
  unresolvedCount: number
  resolutions: DeleteAccountResolutions
  onChangeResolutions: (next: DeleteAccountResolutions) => void
  password: string
  onChangePassword: (value: string) => void
  passwordReady: boolean
  finalConfirmText: string
  onChangeFinalConfirmText: (value: string) => void
  deleteAccountMessage?: string | null
  onClose: () => void
  onSubmit: () => void
  title?: string
  confirmKeyword?: string
}

export function DeleteAccountDialog({
  open, preview, pending,
  unresolvedCount, resolutions, onChangeResolutions,
  password, onChangePassword, passwordReady,
  finalConfirmText, onChangeFinalConfirmText,
  deleteAccountMessage,
  onClose, onSubmit,
  title = 'Delete Account',
  confirmKeyword = FINAL_DELETE_CONFIRM_TEXT,
}: DeleteAccountDialogProps) {
  if (!open || !preview) return null
  const finalConfirmReady = finalConfirmText.trim() === confirmKeyword
  const submitDisabled = !!pending || unresolvedCount > 0 || !passwordReady || !finalConfirmReady

  return (
    <DialogShell
      title={title}
      onClose={onClose}
      width="min(640px, 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={!!pending}>Cancel</Button>
          <DangerButton type="button" onClick={onSubmit} disabled={submitDisabled}>
            {pending ? 'Deleting…' : 'Delete account'}
          </DangerButton>
        </>
      }
    >
      <Stack>
        <Copy>
          This account owns or participates in projects that need resolution before deletion. Review each shared project below
          and decide whether to transfer ownership or delete the project.
        </Copy>
        {preview.solo_projects.length > 0 && (
          <>
            <Alert $tone="warning">
              You are the only member of the following project{preview.solo_projects.length === 1 ? '' : 's'}. They will be permanently deleted along with your account.
            </Alert>
            {preview.solo_projects.map((p) => (
              <SoloCard key={p.project_id}>
                <Title>{p.project_name}</Title>
                <Meta>role: {p.role} · members: {p.member_count}</Meta>
              </SoloCard>
            ))}
          </>
        )}
        {preview.requires_resolution.map((p) => (
          <ProjectResolutionCard
            key={p.project_id}
            project={p}
            resolution={resolutions[p.project_id] ?? { action: 'transfer' }}
            onChange={(next) => onChangeResolutions({ ...resolutions, [p.project_id]: next })}
          />
        ))}
        {unresolvedCount > 0 && (
          <Alert $tone="danger">Select a transfer target or choose delete for every shared project before continuing.</Alert>
        )}
        <Label>
          Enter your password to confirm
          <FullPasswordField
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            placeholder="Current password"
            aria-label="Current password"
            autoComplete="new-password"
            name="delete-account-password"
          />
        </Label>
        <Label>
          Type <strong>{confirmKeyword}</strong> to confirm deletion
          <FullConfirmField
            value={finalConfirmText}
            onChange={(e) => onChangeFinalConfirmText(e.target.value)}
            placeholder={confirmKeyword}
            aria-label="Final delete confirmation"
            autoComplete="off"
            name="delete-account-final-confirm"
          />
        </Label>
        {deleteAccountMessage && <Alert $tone="danger">{deleteAccountMessage}</Alert>}
      </Stack>
    </DialogShell>
  )
}
