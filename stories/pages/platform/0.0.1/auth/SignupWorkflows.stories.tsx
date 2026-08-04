import type { Meta, StoryObj } from '@storybook/react-vite'
import { createSignupActionArgs } from './auth-story-actions'
import { authStoryParameters, signupArgTypes } from './auth-story-config'
import { playSignupWorkflow } from './auth-story-plays'
import { SignupStoryScene } from './auth-story-runtime'

const meta = {
  title: 'Pages/Platform/0.0.1/Auth/Signup/Workflows',
  component: SignupStoryScene,
  tags: ['autodocs'],
  parameters: authStoryParameters(
    'signup',
    'Executable account-creation contract covering all fields, submit payload, and return-to-login navigation.',
  ),
  argTypes: signupArgTypes(['default']),
  args: { scenario: 'default', ...createSignupActionArgs() },
} satisfies Meta<typeof SignupStoryScene>

export default meta
type Story = StoryObj<typeof meta>

export const AccountCreation: Story = { play: playSignupWorkflow }
