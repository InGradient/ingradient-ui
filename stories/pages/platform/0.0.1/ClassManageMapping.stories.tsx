import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ClassScenarioKey } from '../../../fixtures/platform/0.0.1/class-scenarios'
import { playCocoMapping } from './class/class-manage-story-plays'
import {
  ClassManagementScene,
  classManageArgTypes,
  classManageParameters,
  createClassManageActionArgs,
} from './class/class-manage-story-runtime'

const SCENARIOS = ['mapping-enabled'] as const satisfies readonly ClassScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Class Management/Model Mapping',
  component: ClassManagementScene,
  tags: ['autodocs'],
  parameters: classManageParameters(
    'Controlled COCO mapping from an enabled but initially unmapped class state.',
  ),
  argTypes: classManageArgTypes(SCENARIOS),
  args: { scenario: 'mapping-enabled', ...createClassManageActionArgs() },
} satisfies Meta<typeof ClassManagementScene>

export default meta
type Story = StoryObj<typeof meta>

export const CocoMappingWorkflow: Story = {
  name: 'COCO mapping workflow',
  play: playCocoMapping,
}
