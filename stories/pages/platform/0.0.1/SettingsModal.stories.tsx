import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SettingsScenarioKey } from '../../../fixtures/platform/0.0.1/settings-scenarios'
import { playGeneralPreferences } from './settings/settings-modal-story-plays'
import {
  SettingsModalScene,
  createSettingsModalActionArgs,
  settingsModalArgTypes,
  settingsModalParameters,
} from './settings/settings-modal-story-runtime'

const SCENARIOS = ['general', 'non-admin'] as const satisfies readonly SettingsScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Settings Modal/General',
  component: SettingsModalScene,
  tags: ['autodocs'],
  parameters: settingsModalParameters(
    'Canonical Settings Modal shell, executable local preferences, and navigation visibility by role.',
  ),
  argTypes: settingsModalArgTypes(SCENARIOS),
  args: { scenario: 'general', ...createSettingsModalActionArgs() },
} satisfies Meta<typeof SettingsModalScene>

export default meta
type Story = StoryObj<typeof meta>

export const Preferences: Story = {
  name: 'Preferences',
  play: playGeneralPreferences,
}
export const NonAdminNavigation: Story = {
  name: 'Non-admin navigation',
  args: { scenario: 'non-admin' },
}
