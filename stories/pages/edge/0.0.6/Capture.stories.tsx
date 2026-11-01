// Capture page: logs (left), live preview (center), pattern preview and classes (right).
import type { Meta, StoryObj } from '@storybook/react-vite'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Capture/Workspace',
  component: Workspace005.component,
  args: Workspace005.args,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Capture',
    referenceStory: 'Pages / Edge / 0.0.6 / Capture / Workspace / Overview',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['overview', 'setup'],
    interactions: ['Pattern preview selection', 'Log entry detail', 'Panel collapse and expand'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Overview: Story = { ...W.Capture, name: 'Overview' }
export const Setup: Story = { ...W.Setup, name: 'Setup' }
