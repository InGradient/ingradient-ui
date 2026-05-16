import type { Meta, StoryObj } from '@storybook/react-vite'
import { InvitationsTab } from './invitations-tab'
import type { InvitationRow } from './invitations-section'
import type { JoinCodeRow } from './join-codes-section'

const roles = [
  { value: 'organizer', label: 'Organizer' },
  { value: 'member', label: 'Member' },
]

const invitations: InvitationRow[] = [
  { id: 'i-1', email: 'minji@ingradient.ai', roleId: 'member', status: 'pending', expiresAt: '2026-07-30' },
  { id: 'i-2', email: 'hyunjin@external.com', roleId: 'organizer', status: 'accepted', expiresAt: null },
]

const codes: JoinCodeRow[] = [
  { id: 'c-1', code: 'WAFER-2026-XK4', roleId: 'member', usedCount: 3, maxUses: 10, expiresAt: '2026-08-01' },
]

const noop = () => undefined

const meta: Meta<typeof InvitationsTab> = {
  title: 'Patterns/Shells/InvitationsTab',
  component: InvitationsTab,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 900, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const baseArgs = {
  invitations: {
    isAdmin: true,
    invitations,
    roleOptions: roles,
    inviteRoleId: 'member',
    onChangeInviteRoleId: noop,
    searchQuery: '',
    onChangeSearchQuery: noop,
    searchResults: [],
    onInviteUser: noop,
    onRevoke: noop,
  },
  joinCodes: {
    isAdmin: true,
    joinCodes: codes,
    roleOptions: roles,
    codeRoleId: 'member',
    onChangeCodeRoleId: noop,
    codeMaxUses: '',
    onChangeCodeMaxUses: noop,
    onCreate: noop,
    onDelete: noop,
  },
}

export const Default: Story = { args: baseArgs }
export const Loading: Story = { args: { ...baseArgs, loading: true } }
export const ErrorState: Story = { args: { ...baseArgs, error: 'Failed to load invitations.' } }
