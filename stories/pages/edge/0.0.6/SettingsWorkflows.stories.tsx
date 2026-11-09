// Settings opened from the capture page: drafts survive tab changes and reopening.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { paced } from '../../../support/paced-play'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Settings/Workflows',
  component: Workspace005.component,
  args: Workspace005.args,
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Settings',
    referenceStory: 'Pages / Edge / 0.0.6 / Settings / Workflows / General draft',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['general-draft', 'capture-ai-mode', 'lighting-draft', 'experiments-draft', 'message-test-failed'],
    interactions: ['Session-only drafts; replay starts from fixture defaults'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const GeneralDraft: Story = { ...W.SettingsDraftWorkflow, name: 'General draft', play: paced(W.SettingsDraftWorkflow.play) }
export const CaptureAiMode: Story = { ...W.CaptureSettingsWorkflow, name: 'Capture AI mode', play: paced(W.CaptureSettingsWorkflow.play) }
export const LightingDraft: Story = { ...W.LightingDraftWorkflow, name: 'Lighting draft', play: paced(W.LightingDraftWorkflow.play) }
export const ExperimentsDraft: Story = { ...W.ExperimentsDraftWorkflow, name: 'Experiments draft', play: paced(W.ExperimentsDraftWorkflow.play) }
export const MessageTestFailed: Story = { ...W.MockMessageFailed, name: 'Message test failed', play: paced(W.MockMessageFailed.play) }
