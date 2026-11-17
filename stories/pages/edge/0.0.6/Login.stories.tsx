// Login page: field PCs enter with a .ige project file; offices sign in online.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Login005, * as L from '../0.0.5/Login.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Login/Workspace',
  component: Login005.component,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Login',
    referenceStory: 'Pages / Edge / 0.0.6 / Login / Workspace / Overview',
    fixturesPath: 'stories/fixtures/edge/0.0.5/login.ts',
    requiredScenarios: ['overview', 'online-form'],
    interactions: ['Load .ige project file', 'Continue with saved account', 'Sign in with email and password'],
  }),
} satisfies Meta<typeof Login005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const Overview: Story = { ...L.Offline, name: 'Overview' }
export const OnlineForm: Story = { ...L.OnlineForm, name: 'Online form' }
