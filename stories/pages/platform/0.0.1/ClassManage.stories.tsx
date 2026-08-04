import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ClassScenarioKey } from '../../../fixtures/platform/0.0.1/class-scenarios'
import { playSidebarCollapse } from './class/class-manage-story-plays'
import {
  ClassManagementScene,
  classManageArgTypes,
  classManageParameters,
  createClassManageActionArgs,
} from './class/class-manage-story-runtime'

const SCENARIOS = [
  'default',
  'sidebar-collapsed',
  'large-image-set',
  'class-list-overflow',
] as const satisfies readonly ClassScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Class Management/Workspace',
  component: ClassManagementScene,
  tags: ['autodocs'],
  parameters: classManageParameters(
    'Canonical three-column Class Management workspace, constrained layout, and content stress states.',
  ),
  argTypes: classManageArgTypes(SCENARIOS),
  args: { scenario: 'default', ...createClassManageActionArgs() },
} satisfies Meta<typeof ClassManagementScene>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { name: 'Overview' }
export const SidebarCollapsed: Story = {
  name: 'Sidebar collapsed',
  args: { scenario: 'sidebar-collapsed' },
  play: playSidebarCollapse,
}
export const LargeImageSet: Story = {
  name: 'Large image set',
  args: { scenario: 'large-image-set' },
}
export const ClassListOverflow: Story = {
  name: 'Class list overflow',
  args: { scenario: 'class-list-overflow' },
}
