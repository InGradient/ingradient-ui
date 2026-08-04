import type { Meta, StoryObj } from '@storybook/react-vite'
import { createLoginActionArgs } from './auth-story-actions'
import { authStoryParameters, loginArgTypes } from './auth-story-config'
import { LoginStoryScene } from './auth-story-runtime'

const meta = {
  title: 'Pages/Platform/0.0.1/Auth/Login/Workspace',
  component: LoginStoryScene,
  tags: ['autodocs'],
  parameters: authStoryParameters(
    'login',
    'Canonical empty Login workspace. Use System States for operational variants and Workflows for executable authentication behavior.',
  ),
  argTypes: loginArgTypes(['default']),
  args: { scenario: 'default', ...createLoginActionArgs() },
} satisfies Meta<typeof LoginStoryScene>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {}
