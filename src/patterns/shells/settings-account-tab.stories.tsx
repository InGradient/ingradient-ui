import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsAccountTab } from './settings-account-tab'

const user = { id: 'u1', name: 'June Lee', email: 'june@ingradient.ai' }

const orgLicense = { type: 'organization' as const, organizationName: 'Ingradient', expiresAt: '2027-05-15', remainingDays: 365, expired: false }
const personalLicense = { type: 'personal' as const, expiresAt: '2026-08-30', remainingDays: 107, expired: false }
const expiredLicense = { type: 'personal' as const, expiresAt: '2026-01-01', remainingDays: -134, expired: true }

const meta: Meta<typeof SettingsAccountTab> = {
  title: 'Patterns/Shells/SettingsAccountTab',
  component: SettingsAccountTab,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 760, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const baseArgs = {
  user,
  license: orgLicense,
  accountName: 'June Lee',
  onChangeAccountName: () => undefined,
  onSaveName: () => undefined,
  onOpenPassword: () => undefined,
  onLogout: () => undefined,
  deleteAccountConfirmInput: '',
  onChangeDeleteAccountConfirmInput: () => undefined,
  deleteAccountEmailMatches: false,
  onOpenDeleteAccountPreview: () => undefined,
}

export const Default: Story = { args: baseArgs }

export const PersonalLicense: Story = { args: { ...baseArgs, license: personalLicense } }
export const ExpiredLicense: Story = { args: { ...baseArgs, license: expiredLicense } }
export const LoadingLicense: Story = { args: { ...baseArgs, license: null } }

export const SavedMessage: Story = { args: { ...baseArgs, accountName: 'New name', accountMessage: 'Saved.' } }
export const SavingState: Story = { args: { ...baseArgs, accountName: 'New name', accountSaving: true } }

export const EmailMatchedReadyDelete: Story = {
  args: { ...baseArgs, deleteAccountConfirmInput: 'june@ingradient.ai', deleteAccountEmailMatches: true },
}
export const DeleteErrorMessage: Story = {
  args: { ...baseArgs, deleteAccountMessage: 'Failed to verify password. Try again.' },
}

export const Interactive: Story = {
  render: () => {
    const [name, setName] = useState('June Lee')
    const [confirm, setConfirm] = useState('')
    return (
      <SettingsAccountTab
        user={user}
        license={orgLicense}
        accountName={name}
        onChangeAccountName={setName}
        onSaveName={() => undefined}
        onOpenPassword={() => undefined}
        onLogout={() => undefined}
        deleteAccountConfirmInput={confirm}
        onChangeDeleteAccountConfirmInput={setConfirm}
        deleteAccountEmailMatches={confirm.trim() === user.email}
        onOpenDeleteAccountPreview={() => undefined}
      />
    )
  },
}
