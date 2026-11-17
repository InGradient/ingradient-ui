// Capture states: capturing, failed sequence, log filter and camera offline.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { DIALOG_ONLY, edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Capture/System States',
  component: Workspace005.component,
  args: { ...Workspace005.args, settingsPlcJudge: true, setupLatest: true },
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Capture',
    referenceStory: 'Pages / Edge / 0.0.6 / Capture / System States / Capturing',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['capturing', 'sequence-failed', 'log-filter-open', 'camera-offline', 'optimize-confirm', 'optimize-running', 'optimize-result', 'optimize-error'],
    interactions: ['Capturing lock, failed sequence, log filter, offline camera', 'Setup: find the best capture settings (confirm, running, result, error)'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Capturing: Story = { ...W.Capturing, name: 'Capturing' }
export const SequenceFailed: Story = { ...W.SequenceFailed, ...DIALOG_ONLY, name: 'Sequence failed' }
export const LogFilterOpen: Story = { ...W.LogFilterOpen, name: 'Log filter open' }
export const CameraOffline: Story = { ...W.Offline, name: 'Camera offline' }

/** Setup › Find the best capture settings — each dialog of the real app's flow, with fixed synthetic numbers. */
export const OptimizeConfirm: Story = { ...DIALOG_ONLY, name: 'Setup: find settings — confirm', args: { activeTab: 'setup', setupOptimizePhase: 'confirm' } }
export const OptimizeRunning: Story = { ...DIALOG_ONLY, name: 'Setup: find settings — running', args: { activeTab: 'setup', setupOptimizePhase: 'running' } }
export const OptimizeResult: Story = { ...DIALOG_ONLY, name: 'Setup: find settings — result', args: { activeTab: 'setup', setupOptimizePhase: 'result' } }
export const OptimizeError: Story = { ...DIALOG_ONLY, name: 'Setup: find settings — error', args: { activeTab: 'setup', setupOptimizePhase: 'error' } }
