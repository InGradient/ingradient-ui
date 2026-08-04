import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ClassScenarioKey } from '../../../fixtures/platform/0.0.1/class-scenarios'
import {
  ClassManagementScene,
  classManageArgTypes,
  classManageParameters,
  createClassManageActionArgs,
} from './class/class-manage-story-runtime'

const SCENARIOS = [
  'no-project',
  'permission-denied',
  'error',
  'classes-loading',
  'no-classes',
  'no-linked-datasets',
  'linked-datasets-loading',
  'images-loading',
  'no-images',
] as const satisfies readonly ClassScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Class Management/System States',
  component: ClassManagementScene,
  tags: ['autodocs'],
  parameters: classManageParameters(
    'Project, permission, class-list, linked-dataset, and image availability states.',
  ),
  argTypes: classManageArgTypes(SCENARIOS),
  args: { scenario: 'no-project', ...createClassManageActionArgs() },
} satisfies Meta<typeof ClassManagementScene>

export default meta
type Story = StoryObj<typeof meta>

export const NoProjectSelected: Story = { name: 'No project selected' }
export const AccessDenied: Story = {
  name: 'Access denied',
  args: { scenario: 'permission-denied' },
}
export const LoadError: Story = { name: 'Load error', args: { scenario: 'error' } }
export const ClassesLoading: Story = {
  name: 'Classes loading',
  args: { scenario: 'classes-loading' },
}
export const NoClasses: Story = { name: 'No classes', args: { scenario: 'no-classes' } }
export const NoLinkedDatasets: Story = {
  name: 'No linked datasets',
  args: { scenario: 'no-linked-datasets' },
}
export const LinkedDatasetsLoading: Story = {
  name: 'Linked datasets loading',
  args: { scenario: 'linked-datasets-loading' },
}
export const ImagesLoading: Story = {
  name: 'Images loading',
  args: { scenario: 'images-loading' },
}
export const NoImages: Story = { name: 'No images', args: { scenario: 'no-images' } }
