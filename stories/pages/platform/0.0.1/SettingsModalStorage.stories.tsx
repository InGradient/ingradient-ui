import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SettingsScenarioKey } from '../../../fixtures/platform/0.0.1/settings-scenarios'
import { playStorageReport } from './settings/settings-modal-story-plays'
import {
  SettingsModalScene,
  createSettingsModalActionArgs,
  settingsModalArgTypes,
  settingsModalParameters,
} from './settings/settings-modal-story-runtime'

const SCENARIOS = [
  'admin-storage',
  'admin-storage-loading',
  'admin-storage-error',
] as const satisfies readonly SettingsScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Settings Modal/Storage',
  component: SettingsModalScene,
  tags: ['autodocs'],
  parameters: settingsModalParameters(
    'Storage analytics, copy-report Action, loading placeholders, and error feedback.',
  ),
  argTypes: settingsModalArgTypes(SCENARIOS),
  args: { scenario: 'admin-storage', ...createSettingsModalActionArgs() },
} satisfies Meta<typeof SettingsModalScene>

export default meta
type Story = StoryObj<typeof meta>

export const Analytics: Story = { name: 'Analytics', play: playStorageReport }
export const Loading: Story = {
  name: 'Loading',
  args: { scenario: 'admin-storage-loading' },
}
export const Error: Story = {
  name: 'Error',
  args: { scenario: 'admin-storage-error' },
}
