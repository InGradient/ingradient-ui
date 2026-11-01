// Capture states: capturing, failed sequence, log filter and camera offline.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { DIALOG_ONLY, edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Capture/System States',
  component: Workspace005.component,
  args: Workspace005.args,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Capture',
    referenceStory: 'Pages / Edge / 0.0.6 / Capture / System States / Capturing',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['capturing', 'sequence-failed', 'log-filter-open', 'camera-offline'],
    interactions: ['Capturing lock, failed sequence, log filter, offline camera'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Capturing: Story = { ...W.Capturing, name: 'Capturing' }
export const SequenceFailed: Story = { ...W.SequenceFailed, ...DIALOG_ONLY, name: 'Sequence failed' }
export const LogFilterOpen: Story = { ...W.LogFilterOpen, name: 'Log filter open' }
export const CameraOffline: Story = { ...W.Offline, name: 'Camera offline' }
