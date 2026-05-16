import type { Meta, StoryObj } from '@storybook/react-vite'
import { DevicesTab } from './devices-tab'
import type { DeviceFilterStatus, DeviceRow } from './devices-table'
import type { DeviceOption } from './devices-forms'

const noop = () => undefined

const license = {
  planCode: 'PRO_OFFLINE',
  offlineEnabled: true,
  offlineMaxDays: 14,
  maxUsers: 50,
  maxDevices: 10,
  expiresAt: '2026-12-31',
}

const devices: DeviceRow[] = [
  { id: 'd-1', deviceUid: 'ABC-123-XYZ', name: 'Edge-A1', status: 'ACTIVE', registeredAt: '2026-01-15', lastSeenAt: '2026-05-14T08:30:00Z' },
  { id: 'd-2', deviceUid: 'DEF-456-UVW', name: null, status: 'ACTIVE', registeredAt: '2026-02-20', lastSeenAt: '2026-05-13T14:22:00Z' },
  { id: 'd-3', deviceUid: 'GHI-789-RST', name: 'Edge-B2', status: 'REVOKED', registeredAt: '2025-11-30', lastSeenAt: '2026-03-01T11:00:00Z' },
]

const deviceOptions: DeviceOption[] = devices.filter((d) => d.status === 'ACTIVE').map((d) => ({ id: d.id, deviceUid: d.deviceUid, name: d.name }))

const meta: Meta<typeof DevicesTab> = {
  title: 'Patterns/Shells/DevicesTab',
  component: DevicesTab,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 1000, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const FullExample: Story = {
  args: {
    license: {
      isAdmin: true,
      license,
      expiry: { label: '2026-12-31 (231 days)', tone: 'ok' },
      renewDate: '', onChangeRenewDate: noop, onRenew: noop,
    },
    forms: {
      isAdmin: true,
      offlineEnabled: true,
      registerUid: '', onChangeRegisterUid: noop,
      registerName: '', onChangeRegisterName: noop,
      onRegister: noop,
      issueDeviceId: '', onChangeIssueDeviceId: noop,
      issueValidDays: '', onChangeIssueValidDays: noop,
      onIssue: noop,
      activeDevices: deviceOptions,
    },
    table: {
      isAdmin: true,
      offlineEnabled: true,
      devices,
      filteredDevices: devices,
      filterSearch: '', onChangeFilterSearch: noop,
      filterStatus: 'all' as DeviceFilterStatus, onChangeFilterStatus: noop,
    },
  },
}
