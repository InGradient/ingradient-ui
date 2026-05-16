import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DevicesTable, type DeviceFilterStatus, type DeviceRow } from './devices-table'

const devices: DeviceRow[] = [
  { id: 'd-1', deviceUid: 'ABC-123-XYZ', name: 'Edge-A1', status: 'ACTIVE', registeredAt: '2026-01-15', lastSeenAt: '2026-05-14T08:30:00Z' },
  { id: 'd-2', deviceUid: 'DEF-456-UVW', name: null, status: 'ACTIVE', registeredAt: '2026-02-20', lastSeenAt: '2026-05-13T14:22:00Z' },
  { id: 'd-3', deviceUid: 'GHI-789-RST', name: 'Edge-B2', status: 'REVOKED', registeredAt: '2025-11-30', lastSeenAt: '2026-03-01T11:00:00Z' },
  { id: 'd-4', deviceUid: 'JKL-012-MNO', name: 'Edge-C3', status: 'ACTIVE', registeredAt: '2026-04-01', lastSeenAt: null },
]

const noop = () => undefined

const baseArgs = {
  isAdmin: true,
  offlineEnabled: true,
  devices,
  filteredDevices: devices,
  filterSearch: '', onChangeFilterSearch: noop,
  filterStatus: 'all' as DeviceFilterStatus, onChangeFilterStatus: noop,
}

const meta: Meta<typeof DevicesTable> = {
  title: 'Patterns/Shells/DevicesTable',
  component: DevicesTable,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 1000, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: baseArgs }
export const NonAdmin: Story = { args: { ...baseArgs, isAdmin: false } }
export const Loading: Story = { args: { ...baseArgs, loading: true } }
export const Empty: Story = { args: { ...baseArgs, devices: [], filteredDevices: [] } }
export const FilterNoMatch: Story = { args: { ...baseArgs, filterSearch: 'xyz', filteredDevices: [] } }
export const OnlyActive: Story = {
  args: { ...baseArgs, filterStatus: 'active', filteredDevices: devices.filter((d) => d.status === 'ACTIVE') },
}

export const Interactive: Story = {
  render: () => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<DeviceFilterStatus>('all')
    const filtered = devices.filter((d) => {
      const matchSearch = !search || d.deviceUid.toLowerCase().includes(search.toLowerCase()) || (d.name ?? '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === 'all' || (status === 'active' ? d.status === 'ACTIVE' : d.status === 'REVOKED')
      return matchSearch && matchStatus
    })
    return (
      <DevicesTable
        isAdmin offlineEnabled
        devices={devices}
        filteredDevices={filtered}
        filterSearch={search} onChangeFilterSearch={setSearch}
        filterStatus={status} onChangeFilterStatus={setStatus}
      />
    )
  },
}
