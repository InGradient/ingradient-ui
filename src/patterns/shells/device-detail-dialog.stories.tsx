import type { Meta, StoryObj } from '@storybook/react-vite'
import { DeviceDetailDialog } from './device-detail-dialog'

const device = {
  deviceUid: 'ABC-123-XYZ',
  name: 'Edge-A1',
  status: 'ACTIVE',
  organizationId: 'org-ingradient',
  registeredAt: '2026-01-15T09:30:00Z',
  lastSeenAt: '2026-05-14T08:30:00Z',
  revokedAt: null,
}

const meta: Meta<typeof DeviceDetailDialog> = {
  title: 'Patterns/Shells/DeviceDetailDialog',
  component: DeviceDetailDialog,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Active: Story = { args: { device, onClose: () => undefined } }
export const Revoked: Story = {
  args: { device: { ...device, status: 'REVOKED', revokedAt: '2026-03-01T11:00:00Z' }, onClose: () => undefined },
}
export const NoName: Story = { args: { device: { ...device, name: null }, onClose: () => undefined } }
export const Closed: Story = { args: { device: null, onClose: () => undefined } }
