// Dataset Select loading, empty, error and session states.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Dataset005, * as D from '../0.0.5/DatasetSelect.stories'
import { DIALOG_ONLY, edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Dataset Select/System States',
  component: Dataset005.component,
  args: Dataset005.args,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Dataset Select',
    referenceStory: 'Pages / Edge / 0.0.6 / Dataset Select / System States / Loading',
    fixturesPath: 'stories/fixtures/edge/0.0.5/datasets.ts',
    requiredScenarios: ['loading', 'empty', 'fetch-error', 'session-expired'],
    interactions: ['Loading, empty, fetch error and session expiry'],
  }),
} satisfies Meta<typeof Dataset005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Loading: Story = { ...D.Loading, name: 'Loading' }
export const Empty: Story = { ...D.Empty, name: 'Empty' }
export const FetchError: Story = { ...D.FetchError, name: 'Fetch error' }
export const SessionExpired: Story = { ...D.SessionExpired, ...DIALOG_ONLY, name: 'Session expired' }
