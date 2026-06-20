import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { LicenseView, type LicenseLabels, type LicenseMode } from '@ingradient/edge-pages'
import { defineHandoff } from '../../../support/handoff'
import { EdgeAppFrame } from './shared/build-shell-slots'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'License',
  referenceStory: 'Pages / Edge / 0.0.1 / License / KeyEmpty',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/devices.ts (mockLicense)',
  requiredScenarios: ['key-empty', 'key-filled', 'key-invalid', 'key-submitting', 'bind-mode', 'bind-submitting'],
  interactions: [
    'license key 입력 (key mode)',
    'Activate 버튼 클릭',
    'Bind device 버튼 클릭 (bind mode)',
    'Device fingerprint copy',
  ],
  platformIntegration: [
    'replace mock license with Electron license module',
    'device fingerprint 는 OS-level machine ID',
    'Activate 액션은 license-server API 호출',
    'bind mode 는 .ige 의 device_id + platform_url 사용',
  ],
})

const DEFAULT_LABELS: LicenseLabels = {
  title: 'INGRADIENT Edge',
  subtitle: 'Activate this device to start using Edge.',
  bindHint: 'This package is bound to a server. Bind your device to continue.',
  hint: 'Enter the activation key provided by your administrator.',
  fingerprintLabel: 'Device fingerprint',
  copy: 'Copy',
  copied: 'Copied!',
  keyLabel: 'License key',
  activate: 'Activate',
  activating: 'Activating…',
  bindButton: 'Bind device',
  binding: 'Binding…',
  settingsTitle: 'Settings',
}

const LANG_SLOT = <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>EN</span>

type SceneArgs = Parameters<typeof LicenseScene>[0]

function LicenseScene(args: {
  mode?: LicenseMode
  fingerprint?: string
  licenseKeyDefault?: string
  submitting?: boolean
  copied?: boolean
  error?: string | null
}) {
  const [licenseKey, setLicenseKey] = useState(args.licenseKeyDefault ?? '')

  return (
    <EdgeAppFrame
      showFooter={false}
      content={
        <LicenseView
          mode={args.mode ?? 'key'}
          fingerprint={args.fingerprint ?? 'A1B2-C3D4-E5F6-7890'}
          licenseKey={licenseKey}
          submitting={args.submitting ?? false}
          copied={args.copied ?? false}
          error={args.error ?? null}
          labels={DEFAULT_LABELS}
          langSelector={LANG_SLOT}
          settingsDialog={null}
          onLicenseKeyChange={setLicenseKey}
          onSubmit={(e) => e.preventDefault()}
          onBind={() => undefined}
          onCopyFingerprint={() => undefined}
          onOpenSettings={() => undefined}
        />
      }
    />
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/License',
  component: LicenseScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof LicenseScene>

export default meta

type Story = StoryObj<SceneArgs>

export const KeyEmpty: Story = { args: { mode: 'key' } }

export const KeyFilled: Story = {
  args: { mode: 'key', licenseKeyDefault: 'ABCD1234-EFGH5678-IJKL9012-MNOP3456' },
}

export const KeyInvalid: Story = {
  args: {
    mode: 'key',
    licenseKeyDefault: 'WRONG-KEY-FORMAT-HERE',
    error: 'License key invalid. Please check the key and try again.',
  },
}

export const KeySubmitting: Story = {
  args: { mode: 'key', licenseKeyDefault: 'ABCD1234-EFGH5678-IJKL9012-MNOP3456', submitting: true },
}

export const BindMode: Story = {
  args: { mode: 'bind', fingerprint: 'A1B2-C3D4-E5F6-7890' },
}

export const BindSubmitting: Story = {
  args: { mode: 'bind', fingerprint: 'A1B2-C3D4-E5F6-7890', submitting: true },
}
