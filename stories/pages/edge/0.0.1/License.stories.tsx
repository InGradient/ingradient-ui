import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, Card, StatusPill, TextField, type StatusTone } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { BrandLogo } from '@ingradient/ui/brand'
import { mockLicense } from '../../../fixtures/edge/0.0.1'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'License',
  referenceStory: 'Pages / Edge / License / Valid',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/devices.ts (mockLicense)',
  requiredScenarios: ['valid', 'expired', 'unbound', 'submitting'],
  interactions: [
    'license key 입력',
    'Activate / Re-bind device 클릭',
    'device fingerprint 자동 표시 (machine ID)',
  ],
  platformIntegration: [
    'replace mock license with Electron license module',
    'device fingerprint 는 OS-level machine ID',
    'Activate 액션은 license-server API 호출',
    'expired 상태에서는 Activate 만 노출, valid 상태에서는 Re-bind',
  ],
})

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: 'var(--ig-space-8)',
  background: 'var(--ig-color-bg-canvas)',
}

const contentStyle: React.CSSProperties = {
  width: 'min(520px, calc(100vw - 32px))',
}

const cardStyle: React.CSSProperties = {
  padding: 'var(--ig-space-8)',
  borderRadius: 'var(--ig-radius-xl)',
}

const titleStyle: React.CSSProperties = {
  margin: '0 0 var(--ig-space-6)',
  fontSize: 'var(--ig-font-size-2xl)',
  fontWeight: 600,
  textAlign: 'center',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 'var(--ig-font-size-sm)',
  color: 'var(--ig-color-text-muted)',
  padding: 'var(--ig-space-3) 0',
  borderTop: '1px solid var(--ig-color-border-subtle)',
}

const fingerprintStyle: React.CSSProperties = {
  fontFamily: 'var(--ig-font-mono)',
  color: 'var(--ig-color-text-primary)',
}

type LicenseScene = {
  status?: 'valid' | 'expired' | 'unbound'
  key?: string
  fingerprint?: string
  expiresAt?: string
  error?: string
  submitting?: boolean
}

const statusTone: Record<string, StatusTone> = {
  valid: 'completed',
  expired: 'failed',
  unbound: 'idle',
}

function LicenseScene(scene: LicenseScene) {
  const {
    status = mockLicense.status,
    key = mockLicense.key,
    fingerprint = mockLicense.boundDeviceFingerprint,
    expiresAt = mockLicense.expiresAt,
    error,
    submitting = false,
  } = scene

  return (
    <div style={pageStyle}>
      <Stack gap={6} style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BrandLogo width={220} />
        </div>
        <Card style={cardStyle}>
          <h1 style={titleStyle}>License</h1>
          <Stack gap={4}>
            {error ? <Alert $tone="danger">{error}</Alert> : null}
            <TextField placeholder="License key" value={key} readOnly disabled={submitting} />
            <div style={{ ...rowStyle, borderTop: 'none' }}>
              <span>Status</span>
              <StatusPill tone={statusTone[status]}>{status.toUpperCase()}</StatusPill>
            </div>
            <div style={rowStyle}>
              <span>Device fingerprint</span>
              <span style={fingerprintStyle}>{fingerprint ?? '—'}</span>
            </div>
            <div style={rowStyle}>
              <span>Expires</span>
              <span style={fingerprintStyle}>{expiresAt ?? '—'}</span>
            </div>
            <Button variant="accent" disabled={submitting}>
              {submitting ? 'Activating…' : status === 'valid' ? 'Re-bind device' : 'Activate'}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Pages/Edge/License',
  component: LicenseScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof LicenseScene>

export default meta

type Story = StoryObj<typeof meta>

export const Valid: Story = { args: { status: 'valid' } }

export const Expired: Story = { args: { status: 'expired', error: 'License expired on 2026-04-30.' } }

export const Unbound: Story = {
  args: { status: 'unbound', fingerprint: undefined, expiresAt: undefined, key: '' },
}

export const Submitting: Story = { args: { submitting: true } }
