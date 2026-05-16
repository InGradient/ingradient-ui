import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DeleteAccountDialog,
  type DeleteAccountPreview,
  type DeleteAccountResolutions,
} from './delete-account-dialog'

const candidates = [
  { user_id: 'u-a', name: 'Soyeon Park', email: 'soyeon@ingradient.ai' },
  { user_id: 'u-b', name: 'Junho Kim', email: 'junho@ingradient.ai' },
]

const preview: DeleteAccountPreview = {
  solo_projects: [
    { project_id: 'sp-1', project_name: 'Solo defect study', role: 'owner', member_count: 1 },
  ],
  requires_resolution: [
    { project_id: 'p-1', project_name: 'Wafer line A — production', role: 'owner', member_count: 4, owner_count: 1, transfer_candidates: candidates },
    { project_id: 'p-2', project_name: 'Surface defects', role: 'owner', member_count: 3, owner_count: 1, transfer_candidates: candidates },
  ],
}

const previewNoSolo: DeleteAccountPreview = { solo_projects: [], requires_resolution: preview.requires_resolution }

const meta: Meta<typeof DeleteAccountDialog> = {
  title: 'Patterns/Shells/DeleteAccountDialog',
  component: DeleteAccountDialog,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

const baseArgs = {
  open: true,
  preview,
  unresolvedCount: 0,
  resolutions: {} as DeleteAccountResolutions,
  onChangeResolutions: () => undefined,
  password: '',
  onChangePassword: () => undefined,
  passwordReady: false,
  finalConfirmText: '',
  onChangeFinalConfirmText: () => undefined,
  onClose: () => undefined,
  onSubmit: () => undefined,
}

export const WithSoloAndResolutions: Story = { args: baseArgs }

export const ResolutionsOnly: Story = { args: { ...baseArgs, preview: previewNoSolo } }

export const UnresolvedWarning: Story = { args: { ...baseArgs, unresolvedCount: 2 } }

export const ReadyToSubmit: Story = {
  args: {
    ...baseArgs,
    unresolvedCount: 0,
    resolutions: {
      'p-1': { action: 'transfer', transfer_user_id: 'u-a' },
      'p-2': { action: 'delete_project' },
    },
    password: 'mypassword',
    passwordReady: true,
    finalConfirmText: 'DELETE',
  },
}

export const Deleting: Story = { args: { ...ReadyToSubmit.args!, pending: true } }

export const ErrorMessage: Story = {
  args: { ...baseArgs, deleteAccountMessage: 'Password incorrect.' },
}

export const Closed: Story = { args: { ...baseArgs, open: false } }

export const Interactive: Story = {
  render: () => {
    const [resolutions, setResolutions] = useState<DeleteAccountResolutions>({})
    const [password, setPassword] = useState('')
    const [finalText, setFinalText] = useState('')
    const unresolvedCount = preview.requires_resolution.filter((p) => {
      const r = resolutions[p.project_id]
      if (!r) return true
      return r.action === 'transfer' && !r.transfer_user_id
    }).length
    return (
      <DeleteAccountDialog
        open
        preview={preview}
        unresolvedCount={unresolvedCount}
        resolutions={resolutions}
        onChangeResolutions={setResolutions}
        password={password}
        onChangePassword={setPassword}
        passwordReady={password.length > 0}
        finalConfirmText={finalText}
        onChangeFinalConfirmText={setFinalText}
        onClose={() => undefined}
        onSubmit={() => undefined}
      />
    )
  },
}
