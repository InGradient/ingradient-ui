// Capture workflows on the full page: panels, failed sequence and the capturing lock.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { paced, userEvent } from '../../../support/paced-play'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Capture/Workflows',
  component: Workspace005.component,
  args: { ...Workspace005.args, settingsPlcJudge: true, setupLatest: true },
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Capture',
    referenceStory: 'Pages / Edge / 0.0.6 / Capture / Workflows / Collapse panels',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['panel-collapse', 'sequence-retry', 'sequence-cancel', 'sequence-escape', 'capturing-keyboard-lock', 'setup-optimize', 'setup-optimize-apply'],
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

/**
 * Setup: an unsaved edit blocks the search (hint + disabled), Save unblocks it, then
 * confirm → running (no close button, Stop only) → stopped.
 */
export const SetupOptimize: Story = {
  name: 'Setup: find settings — save first, start, stop',
  args: { activeTab: 'setup' },
  play: paced(async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const find = canvas.getByRole('button', { name: 'Find the best capture settings' })
    await expect(find).toBeEnabled()
    await userEvent.click(canvas.getAllByRole('button', { name: 'Increase' })[0])
    await expect(canvas.getByText(/Unsaved changes — press \[Save\] to use them/)).toBeVisible()
    await expect(find).toBeDisabled()
    await expect(canvas.getByText('Unsaved changes — press [Save] first.')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(find).toBeEnabled()
    await userEvent.click(find)
    const confirm = body.getByRole('dialog', { name: 'Find the best capture settings' })
    await expect(within(confirm).getByRole('alert')).toHaveTextContent('Do not touch the part')
    await userEvent.click(within(confirm).getByRole('button', { name: 'Start' }))
    const running = body.getByRole('dialog', { name: 'Finding capture settings' })
    await expect(within(running).queryByRole('button', { name: /close/i })).toBeNull()
    await userEvent.keyboard('{Escape}')
    await expect(body.getByRole('dialog', { name: 'Finding capture settings' })).toBeVisible()
    await userEvent.click(within(running).getByRole('button', { name: 'Stop' }))
    await expect(body.queryByRole('dialog')).toBeNull()
    await expect(args.onMockAction).toHaveBeenCalledWith('optimize-stop')
  }),
}

/** Setup: the result dialog applies the recommended exposure and saves. */
export const SetupOptimizeApply: Story = {
  name: 'Setup: find settings — apply result',
  args: { activeTab: 'setup', setupOptimizePhase: 'result' },
  play: paced(async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const result = body.getByRole('dialog', { name: 'Recommended capture settings' })
    await expect(within(result).getAllByRole('alert')[0]).toHaveTextContent('Fringe contrast is low')
    await userEvent.click(within(result).getByRole('button', { name: 'Apply' }))
    await expect(body.queryByRole('dialog')).toBeNull()
    await expect(within(canvasElement).getByLabelText('Exposure (s)')).toHaveValue('0.0800')
    await expect(args.onMockAction).toHaveBeenCalledWith('optimize-apply')
  }),
}
