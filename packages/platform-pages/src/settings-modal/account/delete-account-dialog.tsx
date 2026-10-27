import styled from 'styled-components'
import { Stack, Text } from '@ingradient/ui/primitives'
import { Alert } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { Card } from '@ingradient/ui/components'
import { PasswordField, TextField } from '@ingradient/ui/components'
import { DialogShell } from '@ingradient/ui/components'
import {
  ProjectResolutionCard,
  type ProjectResolution,
  type ProjectResolutionInfo,
} from '../project'

export const FINAL_DELETE_CONFIRM_TEXT = 'DELETE'

const FullPasswordBox = styled(PasswordField)`
  width: 100%;
  min-width: var(--ig-popup-sm-narrow);
`
const FullConfirmBox = styled(TextField)`
  width: 100%;
`
const CopyBox = styled(Text)`
  line-height: var(--ig-line-height-relaxed-plus);
`

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
      width="min(var(--ig-popup-3xl-narrow), 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={!!pending}>Cancel</Button>
          <Button type="button" variant="secondary" tone="danger" onClick={onSubmit} disabled={submitDisabled}>
            {pending ? 'Deleting…' : 'Delete account'}
          </Button>
        </>
      }
    >
      <Stack gap="var(--ig-spacing-16)">
        <CopyBox forwardedAs="p" tone="soft" size="var(--ig-text-body)">
          This account owns or participates in projects that need resolution before deletion. Review each shared project below
          and decide whether to transfer ownership or delete the project.
        </CopyBox>
        {preview.solo_projects.length > 0 && (
          <>
            <Alert $tone="warning">
              You are the only member of the following project{preview.solo_projects.length === 1 ? '' : 's'}. They will be permanently deleted along with your account.
            </Alert>
            {preview.solo_projects.map((p) => (
              <Card key={p.project_id} elevation="raised" flat tone="danger" radius="var(--ig-radius-xs)" padding="var(--ig-spacing-12) var(--ig-spacing-12)">
                <Stack gap="var(--ig-spacing-8)">
                  <Text size="var(--ig-text-body)" weight="semibold">{p.project_name}</Text>
                  <Text tone="muted" size="var(--ig-text-caption)">role: {p.role} · members: {p.member_count}</Text>
                </Stack>
              </Card>
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
        <Stack as="label" gap="var(--ig-spacing-8)">
          <Text size="var(--ig-text-body-sm)" weight="semibold">Enter your password to confirm</Text>
          <FullPasswordBox
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            placeholder="Current password"
            aria-label="Current password"
            autoComplete="new-password"
            name="delete-account-password"
          />
        </Stack>
        <Stack as="label" gap="var(--ig-spacing-8)">
          <Text size="var(--ig-text-body-sm)" weight="semibold">Type <strong>{confirmKeyword}</strong> to confirm deletion</Text>
          <FullConfirmBox
            value={finalConfirmText}
            onChange={(e) => onChangeFinalConfirmText(e.target.value)}
            placeholder={confirmKeyword}
            aria-label="Final delete confirmation"
            autoComplete="off"
            name="delete-account-final-confirm"
          />
        </Stack>
        {deleteAccountMessage && <Alert $tone="danger">{deleteAccountMessage}</Alert>}
      </Stack>
    </DialogShell>
  )
}
