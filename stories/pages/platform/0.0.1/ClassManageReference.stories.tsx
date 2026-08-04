import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ClassScenarioKey } from '../../../fixtures/platform/0.0.1/class-scenarios'
import { playReferenceBbox } from './class/class-manage-story-plays'
import {
  ClassManagementScene,
  classManageArgTypes,
  classManageParameters,
  createClassManageActionArgs,
} from './class/class-manage-story-runtime'

const SCENARIOS = [
  'drag-over-reference',
  'reference-image-pending',
  'reference-image-error',
  'bbox-nav-multi',
] as const satisfies readonly ClassScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Class Management/Reference Image',
  component: ClassManagementScene,
  tags: ['autodocs'],
  parameters: classManageParameters(
    'Reference-image drop, asynchronous update, error, and multiple-bounding-box states.',
  ),
  argTypes: classManageArgTypes(SCENARIOS),
  args: { scenario: 'drag-over-reference', ...createClassManageActionArgs() },
} satisfies Meta<typeof ClassManagementScene>

export default meta
type Story = StoryObj<typeof meta>

export const DropTargetActive: Story = { name: 'Drop target active' }
export const UpdatePending: Story = {
  name: 'Update pending',
  args: { scenario: 'reference-image-pending' },
}
export const UpdateError: Story = {
  name: 'Update error',
  args: { scenario: 'reference-image-error' },
}
export const MultipleBoundingBoxes: Story = {
  name: 'Multiple bounding boxes',
  args: { scenario: 'bbox-nav-multi' },
  play: playReferenceBbox,
}
