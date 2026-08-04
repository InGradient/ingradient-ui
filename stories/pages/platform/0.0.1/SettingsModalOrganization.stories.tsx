import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SettingsScenarioKey } from '../../../fixtures/platform/0.0.1/settings-scenarios'
import { playMembersAndInvitations } from './settings/settings-modal-story-plays'
import {
  SettingsModalScene,
  createSettingsModalActionArgs,
  settingsModalArgTypes,
  settingsModalParameters,
} from './settings/settings-modal-story-runtime'

const SCENARIOS = [
  'admin-organization',
  'admin-org-saved',
  'admin-members',
] as const satisfies readonly SettingsScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Settings Modal/Organization',
  component: SettingsModalScene,
  tags: ['autodocs'],
  parameters: settingsModalParameters(
    'Organization profile, save feedback, member visibility, invitation search, and invite Actions.',
  ),
  argTypes: settingsModalArgTypes(SCENARIOS),
  args: { scenario: 'admin-organization', ...createSettingsModalActionArgs() },
} satisfies Meta<typeof SettingsModalScene>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { name: 'Overview' }
export const Saved: Story = { name: 'Saved', args: { scenario: 'admin-org-saved' } }
export const MembersAndInvitationsWorkflow: Story = {
  name: 'Members and invitations workflow',
  args: { scenario: 'admin-members' },
  play: playMembersAndInvitations,
}
