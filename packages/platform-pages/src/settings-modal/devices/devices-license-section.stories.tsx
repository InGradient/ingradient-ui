import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DevicesLicenseSection } from './devices-license-section'

const license = {
  planCode: 'PRO_OFFLINE',
  offlineEnabled: true,
  offlineMaxDays: 14,
  maxUsers: 50,
  maxDevices: 10,
  expiresAt: '2026-12-31',
}

const noop = () => undefined

const baseArgs = {
  isAdmin: true,
  license,
  renewDate: '', onChangeRenewDate: noop, onRenew: noop,
}

const meta: Meta<typeof DevicesLicenseSection> = {
  title: 'Platform Pages/Devices/DevicesLicenseSection',
  component: DevicesLicenseSection,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 720, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: { ...baseArgs, expiry: { label: '2026-12-31 (231 days)', tone: 'ok' } },
}

export const ExpiringSoon: Story = {
  args: { ...baseArgs, expiry: { label: '2026-05-30 (15 days)', tone: 'soon' } },
}

export const Expired: Story = {
  args: { ...baseArgs, expiry: { label: '2026-01-01 (-134 days)', tone: 'expired' } },
}

export const ShowRenewForm: Story = {
  args: { ...baseArgs, showRenew: true },
}

export const Renewing: Story = {
  args: { ...baseArgs, showRenew: true, renewDate: '2027-01-01', renewing: true },
}

export const RenewError: Story = {
  args: { ...baseArgs, showRenew: true, renewDate: '2027-01-01', renewError: 'Server returned 500' },
}

export const Loading: Story = { args: { ...baseArgs, license: null, loading: true } }
export const NoLicense: Story = { args: { ...baseArgs, license: null } }
export const ErrorState: Story = { args: { ...baseArgs, license: null, error: 'Failed to load license' } }
export const NonAdmin: Story = { args: { ...baseArgs, isAdmin: false } }

export const Interactive: Story = {
  render: () => {
    const [showRenew, setShowRenew] = useState(false)
    const [date, setDate] = useState('')
    return (
      <DevicesLicenseSection
        isAdmin
        license={license}
        expiry={{ label: '2026-12-31', tone: 'ok' }}
        showRenew={showRenew}
        onToggleRenew={() => setShowRenew((v) => !v)}
        onCancelRenew={() => { setShowRenew(false); setDate('') }}
        renewDate={date}
        onChangeRenewDate={setDate}
        onRenew={() => setShowRenew(false)}
      />
    )
  },
}
