import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CreateProjectScenario } from '../../../fixtures/platform/0.0.1/create-project-scenarios'
import {
  CreateProjectScene,
  createCreateProjectActionArgs,
  createProjectArgTypes,
  createProjectParameters,
} from './create-project/create-project-story-runtime'

const SCENARIOS = ['default'] as const satisfies readonly CreateProjectScenario[]

const meta = {
  title: 'Pages/Platform/0.0.1/Create Project/Workspace',
  component: CreateProjectScene,
  tags: ['autodocs'],
  parameters: createProjectParameters(
    'Canonical Create Project workspace before any project details are entered.',
  ),
  argTypes: createProjectArgTypes(SCENARIOS),
  args: { scenario: 'default', ...createCreateProjectActionArgs() },
} satisfies Meta<typeof CreateProjectScene>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = { name: 'Overview' }
