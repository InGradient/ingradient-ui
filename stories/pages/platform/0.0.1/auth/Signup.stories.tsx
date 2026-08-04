import type { Meta, StoryObj } from '@storybook/react-vite'
import { createSignupActionArgs } from './auth-story-actions'
import { authStoryParameters, signupArgTypes } from './auth-story-config'
import { SignupStoryScene } from './auth-story-runtime'

const meta = {
  title: 'Pages/Platform/0.0.1/Auth/Signup/Workspace',
  component: SignupStoryScene,
  tags: ['autodocs'],
  parameters: authStoryParameters(
    'signup',
    'Canonical empty Signup workspace. Use System States for request and validation variants and Workflows for account creation.',
  ),
  argTypes: signupArgTypes(['default']),
  args: { scenario: 'default', ...createSignupActionArgs() },
} satisfies Meta<typeof SignupStoryScene>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {}
