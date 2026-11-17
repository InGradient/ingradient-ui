// Settings opened from the capture page: drafts survive tab changes and reopening.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { paced, userEvent } from '../../../support/paced-play'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Settings/Workflows',
  component: Workspace005.component,
  args: { ...Workspace005.args, settingsPlcJudge: true, setupLatest: true },
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Settings',
    referenceStory: 'Pages / Edge / 0.0.6 / Settings / Workflows / General draft',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['general-draft', 'capture-ai-mode', 'lighting-draft', 'experiments-draft', 'message-test-failed', 'plc-setup', 'plc-icon', 'judge-links'],
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

/** Installation day: enter the PLC address, check the connection, flip a signal, catch a duplicate address. */
export const PlcSetup: Story = {
  name: 'PLC setup and connection test',
  args: { settingsOpen: true, settingsTab: 'plc', plcScenario: 'no-address' },
  play: paced(async ({ canvasElement, args, step }) => {
    const dialog = within(within(canvasElement.ownerDocument.body).getByRole('dialog'))
    await step('Enter the PLC address', async () => {
      await expect(dialog.getByText('Enter the PLC address to connect')).toBeVisible()
      await expect(dialog.getByRole('button', { name: 'Check connection' })).toBeDisabled()
      await userEvent.type(dialog.getByLabelText('PLC address'), '192.168.0.10')
      await expect(args.onMockAction).toHaveBeenLastCalledWith('plc-change', { host: '192.168.0.10' })
    })
    await step('Check the connection', async () => {
      await userEvent.click(dialog.getByRole('button', { name: 'Check connection' }))
      await expect(dialog.getByText('Connected (192.168.0.10:502)')).toBeVisible()
      await expect(dialog.getByText('Connected to the PLC.')).toBeVisible()
      await expect(dialog.getByTestId('plc-handover-text')).toHaveTextContent('Inspection PC address: 192.168.0.21')
    })
    await step('Turn a signal on and off', async () => {
      await userEvent.click(dialog.getByRole('button', { name: 'Turn on: Capture done' }))
      await expect(args.onMockAction).toHaveBeenLastCalledWith('plc-test-output', { key: 'captureDone', on: true })
      await userEvent.click(dialog.getByRole('button', { name: 'Turn off: Capture done' }))
      await expect(dialog.getByRole('button', { name: 'Turn on: Capture done' })).toBeVisible()
    })
    await step('Give OK the same address as Capture done', async () => {
      const ok = dialog.getByLabelText('OK')
      await userEvent.clear(ok)
      await userEvent.type(ok, '1{Enter}')
      await expect(dialog.getByRole('alert')).toHaveTextContent('Two signals share the same address: 1')
      await expect(dialog.getByTestId('plc-handover-text')).toHaveTextContent('OK: inspection PC → PLC, Coil 1')
    })
  }),
}

/** The top-bar PLC icon opens Settings on the PLC tab, like the real app. */
export const PlcIcon: Story = {
  name: 'PLC icon opens PLC settings',
  args: { settingsOpen: false, plcScenario: 'connected' },
  play: paced(async ({ canvasElement, args, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    await step('Open PLC settings from the top bar', async () => {
      await userEvent.click(page.getByRole('button', { name: /^PLC connected/ }))
      await expect(args.onMockAction).toHaveBeenCalledWith('open-plc-settings')
      const dialog = within(page.getByRole('dialog'))
      await expect(dialog.getByRole('tab', { name: 'PLC Communication' })).toHaveAttribute('aria-selected', 'true')
      await expect(dialog.getByText('Connected (192.168.0.10:502)')).toBeVisible()
    })
  }),
}

/** Link each model class to a labeling class: confirm the name match, link the rest, save. */
export const JudgeLinks: Story = {
  name: 'Judge class links',
  args: { settingsOpen: true, settingsTab: 'judge', judgeScenario: 'ready' },
  play: paced(async ({ canvasElement, args, step }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = within(body.getByRole('dialog'))
    await step('Review the suggested and unlinked classes', async () => {
      await expect(dialog.getByText('Ready · v2026.10.31')).toBeVisible()
      await expect(dialog.getByText('Picked by matching name — save to confirm.')).toBeVisible()
      await expect(dialog.getByRole('alert')).toHaveTextContent('Model classes not linked: scratch')
    })
    await step('Link scratch to NG', async () => {
      await userEvent.click(dialog.getByRole('button', { name: 'scratch' }))
      await userEvent.click(body.getByRole('option', { name: 'NG' }))
      await expect(args.onMockAction).toHaveBeenLastCalledWith('judge-link', { modelKey: 'scratch', classId: 'cls-ng' })
      await expect(dialog.queryByRole('alert')).toBeNull()
    })
    await step('Save the links', async () => {
      await userEvent.click(dialog.getByRole('button', { name: 'Save' }))
      await expect(dialog.getByText('Saved.')).toBeVisible()
      await expect(dialog.queryByText('Picked by matching name — save to confirm.')).toBeNull()
      await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled()
    })
  }),
}
