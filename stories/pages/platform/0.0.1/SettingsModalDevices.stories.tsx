import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SettingsScenarioKey } from '../../../fixtures/platform/0.0.1/settings-scenarios'
import { playDeviceManagement } from './settings/settings-modal-story-plays'
import {
  SettingsModalScene,
  createSettingsModalActionArgs,
  settingsModalArgTypes,
  settingsModalParameters,
} from './settings/settings-modal-story-runtime'

const SCENARIOS = [
  'admin-devices',
  'admin-devices-loading',
  'admin-devices-token-issued',
] as const satisfies readonly SettingsScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Settings Modal/Devices',
  component: SettingsModalScene,
  tags: ['autodocs'],
  parameters: settingsModalParameters(
    'Device filtering, registration, license loading, and issued offline-token contracts.',
  ),
  argTypes: settingsModalArgTypes(SCENARIOS),
  args: { scenario: 'admin-devices', ...createSettingsModalActionArgs() },
} satisfies Meta<typeof SettingsModalScene>

export default meta
type Story = StoryObj<typeof meta>

export const ManagementWorkflow: Story = {
  name: 'Management workflow',
  play: playDeviceManagement,
}
export const Loading: Story = {
  name: 'Loading',
  args: { scenario: 'admin-devices-loading' },
}
export const OfflineTokenIssued: Story = {
  name: 'Offline token issued',
  args: { scenario: 'admin-devices-token-issued' },
}
