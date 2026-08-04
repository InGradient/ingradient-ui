import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SettingsScenarioKey } from '../../../fixtures/platform/0.0.1/settings-scenarios'
import { playEdgeExportSelection } from './settings/settings-modal-story-plays'
import {
  SettingsModalScene,
  createSettingsModalActionArgs,
  settingsModalArgTypes,
  settingsModalParameters,
} from './settings/settings-modal-story-runtime'

const SCENARIOS = [
  'edge-no-project',
  'edge-work-default',
  'edge-work-deflectometry',
  'edge-export-with-packages',
  'edge-import-idle',
  'edge-import-uploading',
  'edge-import-completed',
] as const satisfies readonly SettingsScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Settings Modal/Edge',
  component: SettingsModalScene,
  tags: ['autodocs'],
  parameters: settingsModalParameters(
    'Edge project availability, work options, package export, and import lifecycle contracts.',
  ),
  argTypes: settingsModalArgTypes(SCENARIOS),
  args: { scenario: 'edge-work-default', ...createSettingsModalActionArgs() },
} satisfies Meta<typeof SettingsModalScene>

export default meta
type Story = StoryObj<typeof meta>

export const NoProjectSelected: Story = {
  name: 'No project selected',
  args: { scenario: 'edge-no-project' },
}
export const WorkOptions: Story = { name: 'Work options' }
export const DeflectometryWorkOptions: Story = {
  name: 'Deflectometry work options',
  args: { scenario: 'edge-work-deflectometry' },
}
export const ExportSelectionWorkflow: Story = {
  name: 'Export selection workflow',
  args: { scenario: 'edge-export-with-packages' },
  play: playEdgeExportSelection,
}
export const ImportIdle: Story = {
  name: 'Import idle',
  args: { scenario: 'edge-import-idle' },
}
export const ImportUploading: Story = {
  name: 'Import uploading',
  args: { scenario: 'edge-import-uploading' },
}
export const ImportCompletedWithFailures: Story = {
  name: 'Import completed with failures',
  args: { scenario: 'edge-import-completed' },
}
