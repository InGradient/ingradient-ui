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
      width="min(520px, 100%)"
      actions={<Button type="button" variant="secondary" onClick={onClose}>Close</Button>}
    >
      <Grid gap={4} columns="140px 1fr">
        <Text tone="muted" size="13px">Device UID</Text><Text size="13px" style={VALUE_STYLE}>{device.deviceUid}</Text>
        <Text tone="muted" size="13px">Name</Text><Text size="13px" style={VALUE_STYLE}>{device.name ?? '—'}</Text>
        <Text tone="muted" size="13px">Status</Text><Text size="13px" style={VALUE_STYLE}>{device.status}</Text>
        <Text tone="muted" size="13px">Organization ID</Text><Text size="13px" style={VALUE_STYLE}>{device.organizationId}</Text>
        <Text tone="muted" size="13px">Registered</Text><Text size="13px" style={VALUE_STYLE}>{formatDate(device.registeredAt)}</Text>
        <Text tone="muted" size="13px">Last seen</Text><Text size="13px" style={VALUE_STYLE}>{formatDate(device.lastSeenAt)}</Text>
        <Text tone="muted" size="13px">Revoked</Text><Text size="13px" style={VALUE_STYLE}>{formatDate(device.revokedAt)}</Text>
      </Grid>
    </DialogShell>
  )
}
