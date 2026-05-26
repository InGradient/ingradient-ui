import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectMemberRow } from './project-member-row'

const roles = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'labeler', label: 'Labeler' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'client', label: 'Client' },
  { value: 'viewer', label: 'Viewer' },
]

const member = {
  id: 'm-1',
  name: 'Soyeon Park',
  organization: 'Ingradient',
  email: 'soyeon@ingradient.ai',
  role: 'manager',
}

const meta: Meta<typeof ProjectMemberRow> = {
  title: 'Platform Pages/Settings Modal/Project/ProjectMemberRow',
  component: ProjectMemberRow,
  decorators: [(Story) => <ul style={{ listStyle: 'none', margin: 0, padding: 20, width: 720, background: 'var(--ig-color-surface-panel)' }}><Story /></ul>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { member, roleOptions: roles, canManagePermissions: true } }
export const Owner: Story = { args: { member: { ...member, role: 'owner' }, roleOptions: roles, canManagePermissions: true } }
export const OnlyOwner: Story = {
  args: { member: { ...member, role: 'owner' }, roleOptions: roles, canManagePermissions: true, isOnlyOwner: true },
}
export const ReadOnly: Story = { args: { member, roleOptions: roles, canManagePermissions: false } }
export const Removing: Story = { args: { member, roleOptions: roles, canManagePermissions: true, removing: true } }
export const NoOrganization: Story = { args: { member: { ...member, organization: null }, roleOptions: roles, canManagePermissions: true } }
export const NoName: Story = { args: { member: { ...member, name: null }, roleOptions: roles, canManagePermissions: true } }
