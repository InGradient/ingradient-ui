// Capture workflows on the full page: panels, failed sequence and the capturing lock.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { paced } from '../../../support/paced-play'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Capture/Workflows',
  component: Workspace005.component,
  args: Workspace005.args,
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Capture',
    referenceStory: 'Pages / Edge / 0.0.6 / Capture / Workflows / Collapse panels',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['panel-collapse', 'sequence-retry', 'sequence-cancel', 'sequence-escape', 'capturing-keyboard-lock'],
    interactions: ['Mock actions only; no equipment commands'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const PanelCollapse: Story = { ...W.PanelCollapseWorkflow, name: 'Collapse panels', play: paced(W.PanelCollapseWorkflow.play) }
export const SequenceRetry: Story = { ...W.SequenceRetryWorkflow, name: 'Failed sequence → retry', play: paced(W.SequenceRetryWorkflow.play) }
export const SequenceCancel: Story = { ...W.SequenceCancelWorkflow, name: 'Failed sequence → cancel', play: paced(W.SequenceCancelWorkflow.play) }
export const SequenceEscape: Story = { ...W.SequenceEscapeWorkflow, name: 'Failed sequence → Escape', play: paced(W.SequenceEscapeWorkflow.play) }
export const CapturingKeyboardLock: Story = { ...W.CapturingKeyboardLock, name: 'Capturing locks navigation', play: paced(W.CapturingKeyboardLock.play) }
