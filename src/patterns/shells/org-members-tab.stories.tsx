import type { Meta, StoryObj } from '@storybook/react-vite'
import { OrgMembersTab, type OrgMember } from './org-members-tab'

const members: OrgMember[] = [
  { id: 'm-1', userId: 'u-1', user: { loginId: 'june', displayName: 'June Lee' }, role: { code: 'organizer' }, status: 'active' },
  { id: 'm-2', userId: 'u-2', user: { loginId: 'soyeon', displayName: 'Soyeon Park' }, role: { code: 'organizer' }, status: 'active' },
  { id: 'm-3', userId: 'u-3', user: { loginId: 'junho', displayName: 'Junho Kim' }, role: { code: 'member' }, status: 'active' },
  { id: 'm-4', userId: 'u-4', user: { loginId: 'minji', displayName: 'Minji Yu' }, role: { code: 'member' }, status: 'pending' },
  { id: 'm-5', userId: 'u-5', user: { loginId: 'hyunjin', displayName: 'Hyunjin Cha' }, role: { code: 'member' }, status: 'suspended' },
]

const meta: Meta<typeof OrgMembersTab> = {
  title: 'Patterns/Shells/OrgMembersTab',
  component: OrgMembersTab,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 900, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { members, myUserId: 'u-1', isAdmin: true } }
export const NonAdmin: Story = { args: { members, myUserId: 'u-1', isAdmin: false } }
export const Empty: Story = { args: { members: [] } }
export const Loading: Story = { args: { members: [], loading: true } }
export const ErrorState: Story = { args: { members: [], error: 'Failed to load members.' } }
export const Removing: Story = { args: { members, myUserId: 'u-1', isAdmin: true, removingMemberId: 'm-3' } }
