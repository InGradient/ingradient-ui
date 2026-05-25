import styled from 'styled-components'
import { Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { DatePickerField } from '../../components/inputs/date-picker'
import { DeviceStatusBadge, type DeviceStatusTone } from './device-status-badge'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: var(--ig-space-2) var(--ig-space-5);
  font-size: 13px;
  align-items: center;
`

const InfoLabel = styled.span`
  font-weight: 500;
`

const InfoValue = styled.span`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  color: var(--ig-color-text-muted);
`

const FormBox = styled.div`
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xxs);
  padding: var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const FormRow = styled.div`
  display: flex;
  gap: var(--ig-space-3);
  align-items: center;
  flex-wrap: wrap;
`

const FormLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--ig-color-text-muted);
`

const ErrMsg = styled.span`
  font-size: 12px;
  color: var(--ig-color-danger);
`

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
    <Section>
      <Header>
        <SectionTitle>License</SectionTitle>
        {isAdmin && license ? (
          <Button type="button" size="sm" variant="secondary" onClick={onToggleRenew}>
            {showRenew ? 'Cancel' : 'Renew'}
          </Button>
        ) : null}
      </Header>

      {loading ? <Text as="p" tone="muted" size="13px" style={PLACEHOLDER_STYLE}>Loading…</Text> : null}
      {!loading && error ? <ErrMsg>{error}</ErrMsg> : null}
      {!loading && !error && license ? (
        <InfoGrid>
          <InfoLabel>Plan</InfoLabel>
          <InfoValue>{license.planCode}</InfoValue>
          <InfoLabel>Offline Mode</InfoLabel>
          <InfoValue>{license.offlineEnabled ? `Enabled (up to ${license.offlineMaxDays} days)` : 'Disabled'}</InfoValue>
          <InfoLabel>Max Users</InfoLabel>
          <InfoValue>{license.maxUsers}</InfoValue>
          <InfoLabel>Max Devices</InfoLabel>
          <InfoValue>{license.maxDevices}</InfoValue>
          <InfoLabel>Expires</InfoLabel>
          <InfoValue>
            {expiry?.label ?? (license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : '—')}
            {expiry ? <DeviceStatusBadge tone={expiryToneLabel[expiry.tone].tone}>{expiryToneLabel[expiry.tone].label}</DeviceStatusBadge> : null}
          </InfoValue>
        </InfoGrid>
      ) : null}
      {!loading && !error && !license ? <Text as="p" tone="muted" size="13px" style={PLACEHOLDER_STYLE}>No license found.</Text> : null}

      {isAdmin && showRenew ? (
        <FormBox>
          <FormLabel>Set a new expiry date for this organization's license.</FormLabel>
          <FormRow>
            <DatePickerField value={renewDate} onChange={onChangeRenewDate} />
            <Button type="button" onClick={onRenew} disabled={!!renewing || !renewDate}>
              {renewing ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancelRenew}>Cancel</Button>
          </FormRow>
          {renewError ? <ErrMsg>{renewError}</ErrMsg> : null}
        </FormBox>
      ) : null}
    </Section>
  )
}
