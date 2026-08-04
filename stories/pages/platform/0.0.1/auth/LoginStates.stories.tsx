import type { Meta, StoryObj } from '@storybook/react-vite'
import { createLoginActionArgs } from './auth-story-actions'
import { authStoryParameters, loginArgTypes } from './auth-story-config'
import { LoginStoryScene } from './auth-story-runtime'

const states = ['submitting', 'server-error', 'permission-denied', 'long-text'] as const

const meta = {
  title: 'Pages/Platform/0.0.1/Auth/Login/System States',
  component: LoginStoryScene,
  tags: ['autodocs'],
  parameters: authStoryParameters(
    'login',
    'Distinct Login request, failure, permission, and overflow states without duplicating the empty canonical workspace.',
  ),
  argTypes: loginArgTypes(states),
  args: { scenario: 'submitting', ...createLoginActionArgs() },
} satisfies Meta<typeof LoginStoryScene>

export default meta
type Story = StoryObj<typeof meta>

export const Submitting: Story = { args: { scenario: 'submitting' } }
export const ServerError: Story = { args: { scenario: 'server-error' } }
export const PermissionDenied: Story = { args: { scenario: 'permission-denied' } }
export const LongCredentials: Story = { args: { scenario: 'long-text' } }
