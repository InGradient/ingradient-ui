import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { DropdownSelect } from '../../components/inputs/dropdown-select'
import { SearchField } from '../../components/inputs/search-field'
import { DeviceStatusBadge } from './device-status-badge'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
`

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`

const Th = styled.th`
  text-align: left;
  padding: 6px 8px;
  font-weight: 500;
  border-bottom: 1px solid var(--ig-color-border-subtle);
  white-space: nowrap;
`

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid var(--ig-color-white-04);
  vertical-align: middle;
`

const MonoTd = styled(Td)`
  font-family: monospace;
  font-size: 12px;
`

const MutedTd = styled(Td)`
  color: var(--ig-color-text-muted);
`

const ActionsTd = styled(Td)`
  white-space: nowrap;
`

const EmptyTd = styled.td`
  padding: 16px 8px;
  text-align: center;
  color: var(--ig-color-text-muted);
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
    <Section>
      <Header>
        <SectionTitle>{title}</SectionTitle>
        {isAdmin ? (
          <Actions>
            {offlineEnabled ? (
              <Button type="button" size="sm" variant="secondary" onClick={onToggleIssue}>Issue License</Button>
            ) : null}
            <Button type="button" size="sm" onClick={onToggleRegister}>Register Device</Button>
          </Actions>
        ) : null}
      </Header>

      <FilterBar>
        <SearchField
          placeholder="Search UID or name…"
          value={filterSearch}
          onChange={(e) => onChangeFilterSearch(e.target.value)}
          onClear={() => onChangeFilterSearch('')}
          style={{ width: 200 }}
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
      </FilterBar>

      <Table>
        <thead>
          <tr>
            <Th>Device UID</Th>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Registered</Th>
            <Th>Last seen</Th>
            {isAdmin ? <Th style={{ width: 120 }} /> : null}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><EmptyTd colSpan={6}>Loading…</EmptyTd></tr>
          ) : filteredDevices.length === 0 ? (
            <tr><EmptyTd colSpan={6}>{devices.length === 0 ? 'No devices registered' : 'No devices match the filter'}</EmptyTd></tr>
          ) : (
            filteredDevices.map((device) => (
              <tr key={device.id}>
                <MonoTd>{device.deviceUid}</MonoTd>
                <Td>{device.name ?? '—'}</Td>
                <Td>
                  <DeviceStatusBadge tone={statusTone(device.status)}>{formatStatus(device.status)}</DeviceStatusBadge>
                </Td>
                <MutedTd>{new Date(device.registeredAt).toLocaleDateString()}</MutedTd>
                <MutedTd>{device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : '—'}</MutedTd>
                {isAdmin ? (
                  <ActionsTd>
                    <Actions>
                      <Button type="button" size="sm" variant="secondary" onClick={() => onViewDetails?.(device)}>Details</Button>
                      {device.status !== 'REVOKED' ? (
                        <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onRevoke?.(device.id)}>Revoke</Button>
                      ) : null}
                      <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onDelete?.(device.id)}>Delete</Button>
                    </Actions>
                  </ActionsTd>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Section>
  )
}
