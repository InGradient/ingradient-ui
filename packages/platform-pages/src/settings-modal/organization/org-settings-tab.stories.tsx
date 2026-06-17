import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { OrgSettingsTab } from './org-settings-tab'

const org = { code: 'ING-2026', name: 'Ingradient', status: 'active' }

const meta: Meta<typeof OrgSettingsTab> = {
  title: 'Platform Pages/Settings Modal/Organization/OrgSettingsTab',
  component: OrgSettingsTab,
  decorators: [(Story) => <div style={{ padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const noop = () => undefined

export const AdminDefault: Story = {
  args: { organization: org, isAdmin: true, nameDraft: 'Ingradient', onChangeNameDraft: noop, onSave: noop },
}

export const Saving: Story = {
  args: { organization: org, isAdmin: true, nameDraft: 'Ingradient Co.', saving: true, onChangeNameDraft: noop, onSave: noop },
}

export const Saved: Story = {
  args: { organization: org, isAdmin: true, nameDraft: 'Ingradient', message: 'Saved', onChangeNameDraft: noop, onSave: noop },
}

export const ErrorState: Story = {
  args: { organization: org, isAdmin: true, nameDraft: '', error: 'Save failed', onChangeNameDraft: noop, onSave: noop },
}

export const ReadOnlyNonAdmin: Story = {
  args: { organization: org, isAdmin: false, nameDraft: 'Ingradient', onChangeNameDraft: noop, onSave: noop },
}

export const Loading: Story = {
  args: { organization: null, nameDraft: '', onChangeNameDraft: noop, onSave: noop },
}

export const NoOrganization: Story = {
  args: { organization: null, noOrganization: true, nameDraft: '', onChangeNameDraft: noop, onSave: noop },
}

export const Interactive: Story = {
  render: () => {
    const [name, setName] = useState(org.name)
    return <OrgSettingsTab organization={org} isAdmin nameDraft={name} onChangeNameDraft={setName} onSave={() => undefined} />
  },
}
