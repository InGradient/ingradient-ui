import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { DropdownSelect } from '@ingradient/ui/components'
import { EmptyState } from '@ingradient/ui/components'
import { SearchField } from '@ingradient/ui/components'
import { Table, type TableColumn } from '@ingradient/ui/components'
import { popupSizeNumbers } from '@ingradient/ui/tokens'
import { DeviceStatusBadge } from './device-status-badge'

const SEARCH_FIELD_STYLE = { width: popupSizeNumbers.listMin }

export type DeviceFilterStatus = 'all' | 'active' | 'revoked'

export interface DeviceRow {
  id: string
  deviceUid: string
  name?: string | null
  status: 'ACTIVE' | 'REVOKED' | string
  registeredAt: string
  lastSeenAt?: string | null
}

export interface DevicesTableProps {
  isAdmin?: boolean
  offlineEnabled?: boolean
  loading?: boolean
  devices: DeviceRow[]
  filteredDevices: DeviceRow[]
  filterSearch: string
  onChangeFilterSearch: (value: string) => void
  filterStatus: DeviceFilterStatus
  onChangeFilterStatus: (value: DeviceFilterStatus) => void
  onToggleRegister?: () => void
  onToggleIssue?: () => void
  onRevoke?: (deviceId: string) => void
  onDelete?: (deviceId: string) => void
  onViewDetails?: (device: DeviceRow) => void
  title?: string
}

export function DevicesTable({
  isAdmin, offlineEnabled, loading,
  devices, filteredDevices,
  filterSearch, onChangeFilterSearch, filterStatus, onChangeFilterStatus,
  onToggleRegister, onToggleIssue, onRevoke, onDelete, onViewDetails,
  title = 'Devices',
}: DevicesTableProps) {
  const formatStatus = (status: string) => status.charAt(0) + status.slice(1).toLowerCase()
  const statusTone = (status: string) => status === 'ACTIVE' ? 'active' : status === 'REVOKED' ? 'revoked' : 'pending'

  const columns: TableColumn<DeviceRow>[] = [
    { key: 'deviceUid', header: 'Device UID', mono: true, render: (d) => d.deviceUid },
    { key: 'name', header: 'Name', render: (d) => d.name ?? '—' },
    {
      key: 'status', header: 'Status',
      render: (d) => <DeviceStatusBadge tone={statusTone(d.status)}>{formatStatus(d.status)}</DeviceStatusBadge>,
    },
    { key: 'registered', header: 'Registered', muted: true, render: (d) => new Date(d.registeredAt).toLocaleDateString() },
    { key: 'lastSeen', header: 'Last seen', muted: true, render: (d) => d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleString() : '—' },
  ]
  if (isAdmin) {
    columns.push({
      key: 'actions', header: '', width: popupSizeNumbers['2xsNarrow'],
      render: (d) => (
        <Inline gap="var(--ig-space-3)">
          <Button type="button" size="sm" variant="secondary" onClick={() => onViewDetails?.(d)}>Details</Button>
          {d.status !== 'REVOKED' ? (
            <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onRevoke?.(d.id)}>Revoke</Button>
          ) : null}
          <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onDelete?.(d.id)}>Delete</Button>
        </Inline>
      ),
    })
  }

  return (
    <Stack as="section" gap="var(--ig-space-4)">
      <Inline justify="space-between" gap="var(--ig-space-3)" wrap="wrap">
        {title ? <Text as="h3" size="var(--ig-font-size-lg)" weight={600}>{title}</Text> : null}
        {isAdmin ? (
          <Inline gap="var(--ig-space-3)">
            {offlineEnabled ? (
              <Button type="button" size="sm" variant="secondary" onClick={onToggleIssue}>Issue License</Button>
            ) : null}
            <Button type="button" size="sm" onClick={onToggleRegister}>Register Device</Button>
          </Inline>
        ) : null}
      </Inline>

      <Inline gap="var(--ig-space-3)" wrap="wrap">
        <SearchField
          placeholder="Search UID or name…"
          value={filterSearch}
          onChange={(e) => onChangeFilterSearch(e.target.value)}
          onClear={() => onChangeFilterSearch('')}
          style={SEARCH_FIELD_STYLE}
        />
        <DropdownSelect
          value={filterStatus}
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'revoked', label: 'Revoked' },
          ]}
          onChange={(v) => onChangeFilterStatus(v as DeviceFilterStatus)}
        />
      </Inline>

      {loading ? (
        <EmptyState>Loading…</EmptyState>
      ) : filteredDevices.length === 0 ? (
        <EmptyState>{devices.length === 0 ? 'No devices registered' : 'No devices match the filter'}</EmptyState>
      ) : (
        <Table columns={columns} rows={filteredDevices} ariaLabel="Devices" />
      )}
    </Stack>
  )
}
