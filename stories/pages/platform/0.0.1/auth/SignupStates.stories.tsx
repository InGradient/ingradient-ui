import type { Meta, StoryObj } from '@storybook/react-vite'
import { createSignupActionArgs } from './auth-story-actions'
import { authStoryParameters, signupArgTypes } from './auth-story-config'
import { SignupStoryScene } from './auth-story-runtime'

const states = ['password-requirements', 'submitting'] as const

const meta = {
  title: 'Pages/Platform/0.0.1/Auth/Signup/System States',
  component: SignupStoryScene,
  tags: ['autodocs'],
  parameters: authStoryParameters(
    'signup',
    'Distinct Signup password-validation and request-in-progress states.',
  ),
  argTypes: signupArgTypes(states),
  args: { scenario: 'password-requirements', ...createSignupActionArgs() },
} satisfies Meta<typeof SignupStoryScene>

export default meta
type Story = StoryObj<typeof meta>

export const PasswordRequirements: Story = { args: { scenario: 'password-requirements' } }
export const Submitting: Story = { args: { scenario: 'submitting' } }
