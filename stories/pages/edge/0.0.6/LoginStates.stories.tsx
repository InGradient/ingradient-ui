// Login states before and after a failed sign-in.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Login005, * as L from '../0.0.5/Login.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Login/System States',
  component: Login005.component,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Login',
    referenceStory: 'Pages / Edge / 0.0.6 / Login / System States / No project file',
    fixturesPath: 'stories/fixtures/edge/0.0.5/login.ts',
    requiredScenarios: ['no-project-file', 'signing-in', 'sign-in-error'],
    interactions: ['No project file loaded', 'Wrong password'],
  }),
} satisfies Meta<typeof Login005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const NoProjectFile: Story = { ...L.OfflineNoPackage, name: 'No project file' }
/** Signing in with email and password. */
export const SigningIn: Story = { name: 'Signing in', args: { mode: 'online', hasSession: false, loggingIn: true } }
export const SignInError: Story = { ...L.Error, name: 'Sign-in error' }
