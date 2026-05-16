import type { Meta, StoryObj } from '@storybook/react-vite'
import { LicenseInfoDisplay } from './license-info-display'

const meta: Meta<typeof LicenseInfoDisplay> = {
  title: 'Patterns/Shells/LicenseInfoDisplay',
  component: LicenseInfoDisplay,
  decorators: [(Story) => <div style={{ width: 480, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = { args: { license: null } }

export const Organization: Story = {
  args: {
    license: { type: 'organization', organizationName: 'Ingradient', expiresAt: '2027-05-15', remainingDays: 365, expired: false },
  },
}

export const Personal: Story = {
  args: {
    license: { type: 'personal', expiresAt: '2026-08-30', remainingDays: 107, expired: false },
  },
}

export const Expired: Story = {
  args: {
    license: { type: 'personal', expiresAt: '2026-01-01', remainingDays: -134, expired: true },
  },
}
