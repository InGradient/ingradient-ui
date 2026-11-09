// System Settings states that depend on the factory PLC and the judge model: what each tab shows
// before setup, while connected, while auto inspection runs, and in each model state.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Workspace005 from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Settings/System States',
  component: Workspace005.component,
  args: { ...Workspace005.args, activeTab: 'capture', settingsOpen: true, settingsPlcJudge: true },
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Settings',
    referenceStory: 'Pages / Edge / 0.0.6 / Settings / System States / PLC connected',
    fixturesPath: 'stories/fixtures/edge/0.0.5/settings-plc-judge.ts',
    requiredScenarios: [
      'plc-connected', 'plc-not-responding', 'plc-no-dataset', 'plc-auto-running', 'plc-duplicate-address',
      'judge-loading', 'judge-failed', 'judge-unreachable', 'judge-ready', 'judge-no-project',
    ],
    interactions: ['Static states; edits and the connection test: Settings / Workflows'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

const plc = (plcScenario: NonNullable<Story['args']>['plcScenario']) => ({ settingsTab: 'plc' as const, plcScenario })
const judge = (judgeScenario: NonNullable<Story['args']>['judgeScenario']) => ({ settingsTab: 'judge' as const, judgeScenario })

/** Address set and the PLC answers: heartbeat runs, the top-bar PLC icon is green. */
export const PlcConnected: Story = { name: 'PLC connected', args: plc('connected') }
export const PlcNotResponding: Story = { name: 'PLC not responding', args: plc('disconnected') }
/** Settings are saved per dataset, so without one the tab only explains why. */
export const PlcNoDataset: Story = { name: 'PLC without a dataset', args: plc('no-dataset') }
/** Fields and test buttons lock while auto inspection runs. */
export const PlcAutoRunning: Story = { name: 'PLC locked during auto inspection', args: plc('auto-running') }
export const PlcDuplicate: Story = { name: 'PLC duplicate address', args: plc('duplicate') }
export const JudgeLoading: Story = { name: 'Judge model preparing', args: judge('loading') }
export const JudgeFailed: Story = { name: 'Judge model failed', args: judge('failed') }
export const JudgeUnreachable: Story = { name: 'Judge agent unreachable', args: judge('unreachable') }
/** Model ready: one class saved, one picked by name (save to confirm), one not linked. */
export const JudgeReady: Story = { name: 'Judge model ready', args: judge('ready') }
export const JudgeNoProject: Story = { name: 'Judge model without a project', args: judge('ready-no-project') }
