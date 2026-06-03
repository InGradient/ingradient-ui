import { Grid, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { DialogShell } from '@ingradient/ui/components'

const VALUE_STYLE = { wordBreak: 'break-all' as const }

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
      <Grid gap={4} columns="var(--ig-grid-label-col) 1fr">
        <Text tone="muted" size="var(--ig-font-size-sm)">Device UID</Text><Text size="var(--ig-font-size-sm)" style={VALUE_STYLE}>{device.deviceUid}</Text>
        <Text tone="muted" size="var(--ig-font-size-sm)">Name</Text><Text size="var(--ig-font-size-sm)" style={VALUE_STYLE}>{device.name ?? '—'}</Text>
        <Text tone="muted" size="var(--ig-font-size-sm)">Status</Text><Text size="var(--ig-font-size-sm)" style={VALUE_STYLE}>{device.status}</Text>
        <Text tone="muted" size="var(--ig-font-size-sm)">Organization ID</Text><Text size="var(--ig-font-size-sm)" style={VALUE_STYLE}>{device.organizationId}</Text>
        <Text tone="muted" size="var(--ig-font-size-sm)">Registered</Text><Text size="var(--ig-font-size-sm)" style={VALUE_STYLE}>{formatDate(device.registeredAt)}</Text>
        <Text tone="muted" size="var(--ig-font-size-sm)">Last seen</Text><Text size="var(--ig-font-size-sm)" style={VALUE_STYLE}>{formatDate(device.lastSeenAt)}</Text>
        <Text tone="muted" size="var(--ig-font-size-sm)">Revoked</Text><Text size="var(--ig-font-size-sm)" style={VALUE_STYLE}>{formatDate(device.revokedAt)}</Text>
      </Grid>
    </DialogShell>
  )
}
