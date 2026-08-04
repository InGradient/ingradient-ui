import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ClassScenarioKey } from '../../../fixtures/platform/0.0.1/class-scenarios'
import { playAddClass, playClassActions } from './class/class-manage-story-plays'
import {
  ClassManagementScene,
  classManageArgTypes,
  classManageParameters,
  createClassManageActionArgs,
} from './class/class-manage-story-runtime'

const SCENARIOS = [
  'add-class-dialog',
  'default',
] as const satisfies readonly ClassScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Class Management/Workflows',
  component: ClassManagementScene,
  tags: ['autodocs'],
  parameters: classManageParameters(
    'Executable add, duplicate, and delete workflows for controlled class state.',
  ),
  argTypes: classManageArgTypes(SCENARIOS),
  args: { scenario: 'add-class-dialog', ...createClassManageActionArgs() },
} satisfies Meta<typeof ClassManagementScene>

export default meta
type Story = StoryObj<typeof meta>

export const AddClass: Story = { name: 'Add class', play: playAddClass }
export const ClassActions: Story = {
  name: 'Class actions',
  args: { scenario: 'default' },
  play: playClassActions,
}
