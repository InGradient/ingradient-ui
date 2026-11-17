// Statics page: capture and labeling totals. Numbers are temporary mock data (temp-statics.ts).
import type { Meta, StoryObj } from '@storybook/react-vite'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Statics/Workspace',
  component: Workspace005.component,
  args: { ...Workspace005.args, settingsPlcJudge: true, setupLatest: true, staticsLive: true },
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Statics',
    referenceStory: 'Pages / Edge / 0.0.6 / Statics / Workspace / Overview',
    fixturesPath: 'stories/fixtures/edge/0.0.5/temp-statics.ts',
    requiredScenarios: ['overview'],
    interactions: ['Collapse and expand chart sections', 'Switch the live status range (1 hour / 1 day / 1 week)'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Overview: Story = { ...W.Statics, name: 'Overview' }
