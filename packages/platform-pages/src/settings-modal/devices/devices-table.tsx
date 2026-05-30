import styled from 'styled-components'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { DropdownSelect } from '@ingradient/ui/components'
import { SearchField } from '@ingradient/ui/components'
import { DeviceStatusBadge } from './device-status-badge'

const SEARCH_FIELD_STYLE = { width: 200 }
const TH_ACTIONS_STYLE = { width: 120 }

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ig-font-size-sm);
  & th {
    text-align: left;
    padding: var(--ig-space-2) var(--ig-space-3);
    font-weight: var(--ig-font-weight-medium);
    border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    white-space: nowrap;
  }
  & td {
    padding: var(--ig-space-3);
    border-bottom: var(--ig-border-1px) solid var(--ig-color-white-04);
    vertical-align: middle;
  }
  & td.mono { font-family: monospace; font-size: var(--ig-font-size-xs); }
  & td.muted { color: var(--ig-color-text-muted); }
  & td.actions { white-space: nowrap; }
  & td.empty {
    padding: var(--ig-space-7) var(--ig-space-3);
    text-align: center;
    color: var(--ig-color-text-muted);
    border-bottom: none;
  }
`

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

  return (
    <Stack as="section" gap={4}>
      <Inline justify="space-between" gap={3} wrap="wrap">
        <Text as="h3" size="var(--ig-font-size-lg)" weight={600}>{title}</Text>
        {isAdmin ? (
          <Inline gap={3}>
            {offlineEnabled ? (
              <Button type="button" size="sm" variant="secondary" onClick={onToggleIssue}>Issue License</Button>
            ) : null}
            <Button type="button" size="sm" onClick={onToggleRegister}>Register Device</Button>
          </Inline>
        ) : null}
      </Inline>

      <Inline gap={3} wrap="wrap">
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

      <Table>
        <thead>
          <tr>
            <th>Device UID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Registered</th>
            <th>Last seen</th>
            {isAdmin ? <th style={TH_ACTIONS_STYLE} /> : null}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="empty" colSpan={6}>Loading…</td></tr>
          ) : filteredDevices.length === 0 ? (
            <tr><td className="empty" colSpan={6}>{devices.length === 0 ? 'No devices registered' : 'No devices match the filter'}</td></tr>
          ) : (
            filteredDevices.map((device) => (
              <tr key={device.id}>
                <td className="mono">{device.deviceUid}</td>
                <td>{device.name ?? '—'}</td>
                <td>
                  <DeviceStatusBadge tone={statusTone(device.status)}>{formatStatus(device.status)}</DeviceStatusBadge>
                </td>
                <td className="muted">{new Date(device.registeredAt).toLocaleDateString()}</td>
                <td className="muted">{device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : '—'}</td>
                {isAdmin ? (
                  <td className="actions">
                    <Inline gap={3}>
                      <Button type="button" size="sm" variant="secondary" onClick={() => onViewDetails?.(device)}>Details</Button>
                      {device.status !== 'REVOKED' ? (
                        <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onRevoke?.(device.id)}>Revoke</Button>
                      ) : null}
                      <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onDelete?.(device.id)}>Delete</Button>
                    </Inline>
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Stack>
  )
}
