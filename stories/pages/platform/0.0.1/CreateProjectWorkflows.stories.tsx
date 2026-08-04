import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CreateProjectScenario } from '../../../fixtures/platform/0.0.1/create-project-scenarios'
import {
  playProjectCancel,
  playProjectCreation,
} from './create-project/create-project-story-plays'
import {
  CreateProjectScene,
  createCreateProjectActionArgs,
  createProjectArgTypes,
  createProjectParameters,
} from './create-project/create-project-story-runtime'

const SCENARIOS = ['validation-error', 'filled'] as const satisfies readonly CreateProjectScenario[]

const meta = {
  title: 'Pages/Platform/0.0.1/Create Project/Workflows',
  component: CreateProjectScene,
  tags: ['autodocs'],
  parameters: createProjectParameters(
    'Executable project configuration, image upload, submit, and cancellation workflows.',
  ),
  argTypes: createProjectArgTypes(SCENARIOS),
  args: { scenario: 'validation-error', ...createCreateProjectActionArgs() },
} satisfies Meta<typeof CreateProjectScene>

export default meta
type Story = StoryObj<typeof meta>

export const ProjectCreation: Story = {
  name: 'Project creation workflow',
  play: playProjectCreation,
}
export const Cancel: Story = {
  name: 'Cancel workflow',
  args: { scenario: 'filled' },
  play: playProjectCancel,
}
