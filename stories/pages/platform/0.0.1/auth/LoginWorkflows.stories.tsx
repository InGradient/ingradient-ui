import type { Meta, StoryObj } from '@storybook/react-vite'
import { createLoginActionArgs } from './auth-story-actions'
import { authStoryParameters, loginArgTypes } from './auth-story-config'
import { playLoginWorkflow } from './auth-story-plays'
import { LoginStoryScene } from './auth-story-runtime'

const meta = {
  title: 'Pages/Platform/0.0.1/Auth/Login/Workflows',
  component: LoginStoryScene,
  tags: ['autodocs'],
  parameters: authStoryParameters(
    'login',
    'Executable sign-in contract covering credential correction, preference toggles, submit payload, and signup navigation.',
  ),
  argTypes: loginArgTypes(['validation-error']),
  args: { scenario: 'validation-error', ...createLoginActionArgs() },
} satisfies Meta<typeof LoginStoryScene>

export default meta
type Story = StoryObj<typeof meta>

export const SignIn: Story = { play: playLoginWorkflow }
