// Dataset Select page: recent datasets and per-project lists after sign-in.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Dataset005, * as D from '../0.0.5/DatasetSelect.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Dataset Select/Workspace',
  component: Dataset005.component,
  args: Dataset005.args,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Dataset Select',
    referenceStory: 'Pages / Edge / 0.0.6 / Dataset Select / Workspace / Overview',
    fixturesPath: 'stories/fixtures/edge/0.0.5/datasets.ts',
    requiredScenarios: ['overview', 'online'],
    interactions: ['Open dataset', 'Dataset menu → Export', '+ Dataset → Add dataset dialog'],
  }),
} satisfies Meta<typeof Dataset005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Overview: Story = { ...D.Offline, name: 'Overview' }
export const Online: Story = { ...D.Online, name: 'Online' }
