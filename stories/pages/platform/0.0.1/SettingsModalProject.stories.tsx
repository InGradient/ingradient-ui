import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SettingsScenarioKey } from '../../../fixtures/platform/0.0.1/settings-scenarios'
import {
  playProjectConfiguration,
  playProjectPermissions,
} from './settings/settings-modal-story-plays'
import {
  SettingsModalScene,
  createSettingsModalActionArgs,
  settingsModalArgTypes,
  settingsModalParameters,
} from './settings/settings-modal-story-runtime'

const SCENARIOS = [
  'project-default',
  'project-deflectometry',
  'project-readonly',
  'project-saving',
  'project-name-invalid',
  'project-no-project',
  'project-permissions-expand-all',
] as const satisfies readonly SettingsScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Settings Modal/Project',
  component: SettingsModalScene,
  tags: ['autodocs'],
  parameters: settingsModalParameters(
    'Project configuration, access, validation, availability, save, and permission-matrix contracts.',
  ),
  argTypes: settingsModalArgTypes(SCENARIOS),
  args: { scenario: 'project-default', ...createSettingsModalActionArgs() },
} satisfies Meta<typeof SettingsModalScene>

export default meta
type Story = StoryObj<typeof meta>

export const ConfigurationWorkflow: Story = {
  name: 'Configuration workflow',
  play: playProjectConfiguration,
}
export const DeflectometryProject: Story = {
  name: 'Deflectometry project',
  args: { scenario: 'project-deflectometry' },
}
export const NonOwnerDetails: Story = {
  name: 'Non-owner details',
  args: { scenario: 'project-readonly' },
}
export const Saving: Story = { name: 'Saving', args: { scenario: 'project-saving' } }
export const InvalidName: Story = {
  name: 'Invalid name',
  args: { scenario: 'project-name-invalid' },
}
export const NoProjectSelected: Story = {
  name: 'No project selected',
  args: { scenario: 'project-no-project' },
}
export const PermissionsWorkflow: Story = {
  name: 'Permissions workflow',
  args: { scenario: 'project-permissions-expand-all' },
  play: playProjectPermissions,
}
