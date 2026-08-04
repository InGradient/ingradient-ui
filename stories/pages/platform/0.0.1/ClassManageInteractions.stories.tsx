import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ClassScenarioKey } from '../../../fixtures/platform/0.0.1/class-scenarios'
import {
  playClassSelection,
  playDatasetSelection,
  playImageReview,
} from './class/class-manage-story-plays'
import {
  ClassManagementScene,
  classManageArgTypes,
  classManageParameters,
  createClassManageActionArgs,
} from './class/class-manage-story-runtime'

const SCENARIOS = ['no-class-selected', 'default'] as const satisfies readonly ClassScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Class Management/Interactions',
  component: ClassManagementScene,
  tags: ['autodocs'],
  parameters: classManageParameters(
    'Executable class selection, dataset selection, image inspection, and reference-assignment behavior.',
  ),
  argTypes: classManageArgTypes(SCENARIOS),
  args: { scenario: 'default', ...createClassManageActionArgs() },
} satisfies Meta<typeof ClassManagementScene>

export default meta
type Story = StoryObj<typeof meta>

export const ClassSelectionWorkflow: Story = {
  name: 'Class selection workflow',
  args: { scenario: 'no-class-selected' },
  play: playClassSelection,
}
export const DatasetSelectionWorkflow: Story = {
  name: 'Dataset selection workflow',
  play: playDatasetSelection,
}
export const ImageReviewWorkflow: Story = {
  name: 'Image review workflow',
  play: playImageReview,
}
