// License key and bind states.
import type { Meta, StoryObj } from '@storybook/react-vite'
import License001, * as Li from '../0.0.1/License.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/License/System States',
  component: License001.component,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'License',
    referenceStory: 'Pages / Edge / 0.0.6 / License / System States / Key filled',
    fixturesPath: 'stories/pages/edge/0.0.1/License.stories.tsx (labels)',
    requiredScenarios: ['key-filled', 'key-invalid', 'key-submitting', 'bind-submitting'],
    interactions: ['Filled, invalid and submitting keys; bind in progress'],
  }),
} satisfies Meta<typeof License001.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const KeyFilled: Story = { ...Li.KeyFilled, name: 'Key filled' }
export const KeyInvalid: Story = { ...Li.KeyInvalid, name: 'Key invalid' }
export const KeySubmitting: Story = { ...Li.KeySubmitting, name: 'Key submitting' }
export const BindSubmitting: Story = { ...Li.BindSubmitting, name: 'Bind submitting' }
