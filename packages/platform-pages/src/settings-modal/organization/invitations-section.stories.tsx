import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  InvitationsSection,
  type InvitationRow,
  type InvitationsCandidate,
} from './invitations-section'

const roles = [
  { value: 'organizer', label: 'Organizer' },
  { value: 'member', label: 'Member' },
]

const candidates: InvitationsCandidate[] = [
  { id: 'u-a', name: 'Soyeon Park', email: 'soyeon@ingradient.ai' },
  { id: 'u-b', name: 'Junho Kim', email: 'junho@ingradient.ai' },
]

const invitations: InvitationRow[] = [
  { id: 'i-1', email: 'minji@ingradient.ai', roleId: 'member', status: 'pending', expiresAt: '2026-07-30' },
  { id: 'i-2', email: 'hyunjin@external.com', roleId: 'organizer', status: 'accepted', expiresAt: null },
  { id: 'i-3', email: 'old@external.com', roleId: 'member', status: 'expired', expiresAt: '2025-12-01' },
  { id: 'i-4', email: 'cancel@external.com', roleId: 'member', status: 'revoked', expiresAt: null },
]

const meta: Meta<typeof InvitationsSection> = {
  title: 'Platform Pages/Settings Modal/Organization/InvitationsSection',
  component: InvitationsSection,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 900, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const noop = () => undefined
const baseArgs = {
  isAdmin: true,
  invitations, roleOptions: roles,
  inviteRoleId: 'member', onChangeInviteRoleId: noop,
  searchQuery: '', onChangeSearchQuery: noop,
  searchResults: [],
  onInviteUser: noop, onRevoke: noop,
}

export const AdminDefault: Story = { args: baseArgs }
export const NonAdmin: Story = { args: { ...baseArgs, isAdmin: false } }
export const Empty: Story = { args: { ...baseArgs, invitations: [] } }
export const WithSearchResults: Story = { args: { ...baseArgs, searchQuery: 'soy', searchResults: candidates } }
export const NoSearchResults: Story = { args: { ...baseArgs, searchQuery: 'xyz', searchResults: [] } }
export const Searching: Story = { args: { ...baseArgs, searchQuery: 'soy', isSearching: true, searchResults: [] } }
export const Inviting: Story = { args: { ...baseArgs, searchQuery: 'soy', searchResults: candidates, invitingUserId: 'u-a' } }
export const WithInviteMessage: Story = { args: { ...baseArgs, inviteMessage: 'Invitation sent.' } }

export const Interactive: Story = {
  render: () => {
    const [q, setQ] = useState('')
    const [role, setRole] = useState('member')
    return (
      <InvitationsSection
        isAdmin
        invitations={invitations}
        roleOptions={roles}
        inviteRoleId={role}
        onChangeInviteRoleId={setRole}
        searchQuery={q}
        onChangeSearchQuery={setQ}
        searchResults={candidates.filter((c) => (c.name ?? '').toLowerCase().includes(q.toLowerCase()) || c.email.includes(q))}
        onInviteUser={noop}
        onRevoke={noop}
      />
    )
  },
}
