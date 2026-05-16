import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { DialogShell } from '../../components/overlays/dialog-shell'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px 16px;
  font-size: 13px;
`

const Label = styled.div`
  color: var(--ig-color-text-muted);
`

const Value = styled.div`
  color: var(--ig-color-text-primary);
  word-break: break-all;
`

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  try { return new Date(value).toLocaleString() } catch { return value }
}

export interface DeviceDetail {
  deviceUid: string
  name?: string | null
  status: string
  organizationId: string
  registeredAt: string
  lastSeenAt?: string | null
  revokedAt?: string | null
}

export interface DeviceDetailDialogProps {
  device: DeviceDetail | null
  onClose: () => void
  title?: string
}

export function DeviceDetailDialog({ device, onClose, title = 'Device Details' }: DeviceDetailDialogProps) {
  if (!device) return null
  return (
    <DialogShell
      title={title}
      onClose={onClose}
      width="min(520px, 100%)"
      actions={<Button type="button" variant="secondary" onClick={onClose}>Close</Button>}
    >
      <Grid>
        <Label>Device UID</Label><Value>{device.deviceUid}</Value>
        <Label>Name</Label><Value>{device.name ?? '—'}</Value>
        <Label>Status</Label><Value>{device.status}</Value>
        <Label>Organization ID</Label><Value>{device.organizationId}</Value>
        <Label>Registered</Label><Value>{formatDate(device.registeredAt)}</Value>
        <Label>Last seen</Label><Value>{formatDate(device.lastSeenAt)}</Value>
        <Label>Revoked</Label><Value>{formatDate(device.revokedAt)}</Value>
      </Grid>
    </DialogShell>
  )
}
