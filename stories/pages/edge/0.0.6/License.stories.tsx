// License page: activate with a key, or bind to a server package.
import type { Meta, StoryObj } from '@storybook/react-vite'
import License001, * as Li from '../0.0.1/License.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/License/Workspace',
  component: License001.component,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'License',
    referenceStory: 'Pages / Edge / 0.0.6 / License / Workspace / Overview',
    fixturesPath: 'stories/pages/edge/0.0.1/License.stories.tsx (labels)',
    requiredScenarios: ['overview', 'bind-device'],
    interactions: ['Enter license key', 'Activate', 'Bind device', 'Copy device fingerprint'],
  }),
} satisfies Meta<typeof License001.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Overview: Story = { ...Li.KeyEmpty, name: 'Overview' }
export const BindDevice: Story = { ...Li.BindMode, name: 'Bind device' }
