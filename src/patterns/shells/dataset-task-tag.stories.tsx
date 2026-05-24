import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatasetTaskTag } from './dataset-task-tag'
import { Inline, Stack } from '../../primitives'

const meta: Meta<typeof DatasetTaskTag> = {
  title: 'Patterns/Shells/DatasetTaskTag',
  component: DatasetTaskTag,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const AllTypes: Story = {
  render: () => (
    <Stack gap={3}>
      <Inline gap={3}>
        <DatasetTaskTag taskType="object_detection" />
        <DatasetTaskTag taskType="classification" />
        <DatasetTaskTag taskType="segmentation" />
        <DatasetTaskTag taskType="point" />
      </Inline>
      <Inline gap={3}>
        <DatasetTaskTag taskType="object_detection" format="full" />
        <DatasetTaskTag taskType="classification" format="full" />
        <DatasetTaskTag taskType="segmentation" format="full" />
        <DatasetTaskTag taskType="point" format="full" />
      </Inline>
    </Stack>
  ),
}

export const ObjectDetection: Story = { args: { taskType: 'object_detection' } }
export const Classification: Story = { args: { taskType: 'classification' } }
export const Segmentation: Story = { args: { taskType: 'segmentation' } }
export const Point: Story = { args: { taskType: 'point' } }
