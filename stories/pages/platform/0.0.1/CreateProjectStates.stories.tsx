import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CreateProjectScenario } from '../../../fixtures/platform/0.0.1/create-project-scenarios'
import {
  CreateProjectScene,
  createCreateProjectActionArgs,
  createProjectArgTypes,
  createProjectParameters,
} from './create-project/create-project-story-runtime'

const SCENARIOS = ['submitting', 'server-error'] as const satisfies readonly CreateProjectScenario[]

const meta = {
  title: 'Pages/Platform/0.0.1/Create Project/System States',
  component: CreateProjectScene,
  tags: ['autodocs'],
  parameters: createProjectParameters(
    'Create Project submission progress and server-failure feedback.',
  ),
  argTypes: createProjectArgTypes(SCENARIOS),
  args: { scenario: 'submitting', ...createCreateProjectActionArgs() },
} satisfies Meta<typeof CreateProjectScene>

export default meta
type Story = StoryObj<typeof meta>

export const Submitting: Story = { name: 'Submitting' }
export const ServerError: Story = {
  name: 'Server error',
  args: { scenario: 'server-error' },
}
