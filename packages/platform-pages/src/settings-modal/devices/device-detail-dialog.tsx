import styled from 'styled-components'
import { Grid, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { DialogShell } from '@ingradient/ui/components'

const ValueBox = styled(Text)`
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
      width="min(var(--ig-popup-2xl-wide), 100%)"
      actions={<Button type="button" variant="secondary" onClick={onClose}>Close</Button>}
    >
      <Grid gap="var(--ig-spacing-8) var(--ig-spacing-16)" columns="var(--ig-form-label-col) 1fr">
        <Text tone="muted" size="var(--ig-text-body-sm)">Device UID</Text><ValueBox size="var(--ig-text-body-sm)">{device.deviceUid}</ValueBox>
        <Text tone="muted" size="var(--ig-text-body-sm)">Name</Text><ValueBox size="var(--ig-text-body-sm)">{device.name ?? '—'}</ValueBox>
        <Text tone="muted" size="var(--ig-text-body-sm)">Status</Text><ValueBox size="var(--ig-text-body-sm)">{device.status}</ValueBox>
        <Text tone="muted" size="var(--ig-text-body-sm)">Organization ID</Text><ValueBox size="var(--ig-text-body-sm)">{device.organizationId}</ValueBox>
        <Text tone="muted" size="var(--ig-text-body-sm)">Registered</Text><ValueBox size="var(--ig-text-body-sm)">{formatDate(device.registeredAt)}</ValueBox>
        <Text tone="muted" size="var(--ig-text-body-sm)">Last seen</Text><ValueBox size="var(--ig-text-body-sm)">{formatDate(device.lastSeenAt)}</ValueBox>
        <Text tone="muted" size="var(--ig-text-body-sm)">Revoked</Text><ValueBox size="var(--ig-text-body-sm)">{formatDate(device.revokedAt)}</ValueBox>
      </Grid>
    </DialogShell>
  )
}
