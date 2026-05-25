import { Box, Inline, Stack, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { DatePickerField } from '../../components/inputs/date-picker'
import { DeviceStatusBadge, type DeviceStatusTone } from './device-status-badge'

const INFO_GRID_STYLE = {
  display: 'grid' as const,
  gridTemplateColumns: '160px 1fr',
  gap: 'var(--ig-space-2) var(--ig-space-5)',
  fontSize: 13,
  alignItems: 'center' as const,
}

const INFO_LABEL_STYLE = { fontWeight: 500 }
const INFO_VALUE_STYLE = { display: 'flex' as const, alignItems: 'center' as const, gap: 'var(--ig-space-3)', color: 'var(--ig-color-text-muted)' }

const FORM_BOX_STYLE = {
  background: 'var(--ig-color-surface-raised)',
  border: '1px solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-xxs)',
  padding: 'var(--ig-space-5)',
}

const PLACEHOLDER_STYLE = { margin: 0 }

export interface DeviceLicense {
  planCode: string
  offlineEnabled?: boolean
  offlineMaxDays?: number
  maxUsers: number
  maxDevices: number
  expiresAt: string | null
}

export interface DevicesLicenseSectionExpiry {
  label: string
  tone: 'expired' | 'soon' | 'ok'
}

export interface DevicesLicenseSectionProps {
  isAdmin?: boolean
  loading?: boolean
  error?: string | null
  license: DeviceLicense | null
  /** 사전 계산된 expiry 표시 정보 — 외부에서 계산 */
  expiry?: DevicesLicenseSectionExpiry | null
  showRenew?: boolean
  onToggleRenew?: () => void
  onCancelRenew?: () => void
  renewDate: string
  onChangeRenewDate: (value: string) => void
  renewing?: boolean
  renewError?: string | null
  onRenew?: () => void
}

const expiryToneLabel: Record<'expired' | 'soon' | 'ok', { label: string; tone: DeviceStatusTone }> = {
  expired: { label: 'Expired', tone: 'expired' },
  soon: { label: 'Expiring soon', tone: 'soon' },
  ok: { label: 'Active', tone: 'ok' },
}

export function DevicesLicenseSection({
  isAdmin, loading, error, license, expiry,
  showRenew, onToggleRenew, onCancelRenew,
  renewDate, onChangeRenewDate, renewing, renewError, onRenew,
}: DevicesLicenseSectionProps) {
  return (
    <Stack as="section" gap={4}>
      <Inline justify="space-between" gap={3}>
        <Text as="h3" size="15px" weight={600}>License</Text>
        {isAdmin && license ? (
          <Button type="button" size="sm" variant="secondary" onClick={onToggleRenew}>
            {showRenew ? 'Cancel' : 'Renew'}
          </Button>
        ) : null}
      </Inline>

      {loading ? <Text as="p" tone="muted" size="13px" style={PLACEHOLDER_STYLE}>Loading…</Text> : null}
      {!loading && error ? <Text tone="danger" size="12px">{error}</Text> : null}
      {!loading && !error && license ? (
        <Box style={INFO_GRID_STYLE}>
          <Text style={INFO_LABEL_STYLE}>Plan</Text>
          <Text style={INFO_VALUE_STYLE}>{license.planCode}</Text>
          <Text style={INFO_LABEL_STYLE}>Offline Mode</Text>
          <Text style={INFO_VALUE_STYLE}>{license.offlineEnabled ? `Enabled (up to ${license.offlineMaxDays} days)` : 'Disabled'}</Text>
          <Text style={INFO_LABEL_STYLE}>Max Users</Text>
          <Text style={INFO_VALUE_STYLE}>{license.maxUsers}</Text>
          <Text style={INFO_LABEL_STYLE}>Max Devices</Text>
          <Text style={INFO_VALUE_STYLE}>{license.maxDevices}</Text>
          <Text style={INFO_LABEL_STYLE}>Expires</Text>
          <Text style={INFO_VALUE_STYLE}>
            {expiry?.label ?? (license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : '—')}
            {expiry ? <DeviceStatusBadge tone={expiryToneLabel[expiry.tone].tone}>{expiryToneLabel[expiry.tone].label}</DeviceStatusBadge> : null}
          </Text>
        </Box>
      ) : null}
      {!loading && !error && !license ? <Text as="p" tone="muted" size="13px" style={PLACEHOLDER_STYLE}>No license found.</Text> : null}

      {isAdmin && showRenew ? (
        <Stack gap={4} style={FORM_BOX_STYLE}>
          <Text size="12px" tone="muted" weight={500}>Set a new expiry date for this organization's license.</Text>
          <Inline gap={3} wrap="wrap">
            <DatePickerField value={renewDate} onChange={onChangeRenewDate} />
            <Button type="button" onClick={onRenew} disabled={!!renewing || !renewDate}>
              {renewing ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancelRenew}>Cancel</Button>
          </Inline>
          {renewError ? <Text tone="danger" size="12px">{renewError}</Text> : null}
        </Stack>
      ) : null}
    </Stack>
  )
}
