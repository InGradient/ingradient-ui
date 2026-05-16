import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectMembersList } from './project-members-list'

const roles = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'labeler', label: 'Labeler' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'client', label: 'Client' },
  { value: 'viewer', label: 'Viewer' },
]

const members = [
  { id: 'm-1', name: 'June Lee', organization: 'Ingradient', email: 'june@ingradient.ai', role: 'owner' },
  { id: 'm-2', name: 'Soyeon Park', organization: 'Ingradient', email: 'soyeon@ingradient.ai', role: 'manager' },
  { id: 'm-3', name: 'Junho Kim', organization: 'Ingradient', email: 'junho@ingradient.ai', role: 'labeler' },
  { id: 'm-4', name: 'Minji Yu', organization: 'Ingradient', email: 'minji@ingradient.ai', role: 'reviewer' },
  { id: 'm-5', name: 'Hyunjin Cha', organization: 'External', email: 'hyunjin@external.com', role: 'client' },
]

const meta: Meta<typeof ProjectMembersList> = {
  title: 'Patterns/Shells/ProjectMembersList',
  component: ProjectMembersList,
  decorators: [(Story) => <div style={{ width: 760, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { members, roleOptions: roles, canManagePermissions: true } }
export const OnlyOneOwner: Story = {
  args: {
    members: [members[0], { ...members[1], role: 'labeler' }],
    roleOptions: roles,
    canManagePermissions: true,
  },
}
export const ReadOnly: Story = { args: { members, roleOptions: roles, canManagePermissions: false } }
export const Loading: Story = { args: { members: [], roleOptions: roles, loading: true } }
export const Empty: Story = { args: { members: [], roleOptions: roles } }
export const ErrorState: Story = { args: { members: [], roleOptions: roles, error: 'Failed to load members.' } }
export const RemovingMember: Story = {
  args: { members, roleOptions: roles, canManagePermissions: true, removingMemberId: 'm-3' },
}
