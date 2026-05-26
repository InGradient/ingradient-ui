import type { Meta, StoryObj } from '@storybook/react-vite'
import { DeviceStatusBadge } from './device-status-badge'

const meta: Meta<typeof DeviceStatusBadge> = {
  title: 'Platform Pages/Devices/DeviceStatusBadge',
  component: DeviceStatusBadge,
  decorators: [(Story) => <div style={{ padding: 24, display: 'flex', gap: 8, flexWrap: 'wrap', background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Active: Story = { args: { tone: 'active', children: 'Active' } }
export const Revoked: Story = { args: { tone: 'revoked', children: 'Revoked' } }
export const Pending: Story = { args: { tone: 'pending', children: 'Pending' } }
export const Expired: Story = { args: { tone: 'expired', children: 'Expired' } }
export const ExpiringSoon: Story = { args: { tone: 'soon', children: 'Expiring soon' } }
export const Ok: Story = { args: { tone: 'ok', children: 'Active' } }
