import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ClassScenarioKey } from '../../../fixtures/platform/0.0.1/class-scenarios'
import { playPatternSequence } from './class/class-manage-story-plays'
import {
  ClassManagementScene,
  classManageArgTypes,
  classManageParameters,
  createClassManageActionArgs,
} from './class/class-manage-story-runtime'

const SCENARIOS = ['pattern-sequence'] as const satisfies readonly ClassScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Class Management/Image Inspector',
  component: ClassManagementScene,
  tags: ['autodocs'],
  parameters: classManageParameters(
    'Pattern-sequence image inspection with synchronized image and annotation state.',
  ),
  argTypes: classManageArgTypes(SCENARIOS),
  args: { scenario: 'pattern-sequence', ...createClassManageActionArgs() },
} satisfies Meta<typeof ClassManagementScene>

export default meta
type Story = StoryObj<typeof meta>

export const PatternSequence: Story = {
  name: 'Pattern sequence',
  play: playPatternSequence,
}
