import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { JoinCodesSection, type JoinCodeRow } from './join-codes-section'

const roles = [
  { value: 'organizer', label: 'Organizer' },
  { value: 'member', label: 'Member' },
]

const codes: JoinCodeRow[] = [
  { id: 'c-1', code: 'WAFER-2026-XK4', roleId: 'member', usedCount: 3, maxUses: 10, expiresAt: '2026-08-01' },
  { id: 'c-2', code: 'ORG-INVITE-9YZ', roleId: 'organizer', usedCount: 1, maxUses: null, expiresAt: null },
  { id: 'c-3', code: 'WAFER-2026-AAB', roleId: 'member', usedCount: 5, maxUses: 5, expiresAt: '2026-06-15' },
]

const meta: Meta<typeof JoinCodesSection> = {
  title: 'Platform Pages/Settings Modal/Organization/JoinCodesSection',
  component: JoinCodesSection,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 900, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const noop = () => undefined
const baseArgs = {
  isAdmin: true,
  joinCodes: codes,
  roleOptions: roles,
  codeRoleId: 'member', onChangeCodeRoleId: noop,
  codeMaxUses: '', onChangeCodeMaxUses: noop,
  onCreate: noop, onDelete: noop,
}

export const AdminDefault: Story = { args: baseArgs }
export const NonAdmin: Story = { args: { ...baseArgs, isAdmin: false } }
export const Empty: Story = { args: { ...baseArgs, joinCodes: [] } }
export const CreateDisabled: Story = {
  args: { ...baseArgs, createDisabled: true, createDisabledTitle: 'Coming soon' },
}

export const Interactive: Story = {
  render: () => {
    const [role, setRole] = useState('member')
    const [max, setMax] = useState('')
    return (
      <JoinCodesSection
        isAdmin
        joinCodes={codes}
        roleOptions={roles}
        codeRoleId={role}
        onChangeCodeRoleId={setRole}
        codeMaxUses={max}
        onChangeCodeMaxUses={setMax}
        onCreate={noop}
        onDelete={noop}
      />
    )
  },
}
