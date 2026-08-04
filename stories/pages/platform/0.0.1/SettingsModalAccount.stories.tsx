import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SettingsScenarioKey } from '../../../fixtures/platform/0.0.1/settings-scenarios'
import { playPasswordChange } from './settings/settings-modal-story-plays'
import {
  SettingsModalScene,
  createSettingsModalActionArgs,
  settingsModalArgTypes,
  settingsModalParameters,
} from './settings/settings-modal-story-runtime'

const SCENARIOS = [
  'account-default',
  'account-license-personal',
  'account-license-expired',
  'account-license-loading',
  'account-saved',
  'account-delete-dialog',
  'account-delete-with-solo',
] as const satisfies readonly SettingsScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Settings Modal/Account',
  component: SettingsModalScene,
  tags: ['autodocs'],
  parameters: settingsModalParameters(
    'Account profile, license entitlement, password, and destructive account-deletion contracts.',
  ),
  argTypes: settingsModalArgTypes(SCENARIOS),
  args: { scenario: 'account-default', ...createSettingsModalActionArgs() },
} satisfies Meta<typeof SettingsModalScene>

export default meta
type Story = StoryObj<typeof meta>

export const OrganizationLicense: Story = { name: 'Organization license' }
export const PersonalLicense: Story = {
  name: 'Personal license',
  args: { scenario: 'account-license-personal' },
}
export const ExpiredLicense: Story = {
  name: 'Expired license',
  args: { scenario: 'account-license-expired' },
}
export const LicenseLoading: Story = {
  name: 'License loading',
  args: { scenario: 'account-license-loading' },
}
export const ProfileSaved: Story = {
  name: 'Profile saved',
  args: { scenario: 'account-saved' },
}
export const PasswordChangeWorkflow: Story = {
  name: 'Password change workflow',
  play: playPasswordChange,
}
export const DeleteSharedProjects: Story = {
  name: 'Delete shared projects',
  args: { scenario: 'account-delete-dialog' },
}
export const DeleteWithSoloProject: Story = {
  name: 'Delete with solo project',
  args: { scenario: 'account-delete-with-solo' },
}
