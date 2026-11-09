// Images page: captured image grid. Photos are temporary mock data (temp-images.ts).
import type { Meta, StoryObj } from '@storybook/react-vite'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Images/Workspace',
  component: Workspace005.component,
  args: { ...Workspace005.args, activeTab: 'images' },
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Images',
    referenceStory: 'Pages / Edge / 0.0.6 / Images / Workspace / Overview',
    fixturesPath: 'stories/fixtures/edge/0.0.5/temp-images.ts',
    requiredScenarios: ['overview'],
    interactions: ['Selection, date filter, deletion and inspector: see Images / Workflows'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Overview: Story = { ...W.Images, name: 'Overview' }
