import type { Meta, StoryObj } from '@storybook/react-vite'
import { DistributionHeatmap } from './distribution-heatmap'

const meta: Meta<typeof DistributionHeatmap> = {
  title: 'Platform Pages/Dashboard/DistributionHeatmap',
  component: DistributionHeatmap,
  decorators: [(Story) => <div style={{ padding: 24, width: 720 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    rowLabels: ['Class A', 'Class B', 'Class C', 'Class D'],
    columnLabels: ['Dataset 1', 'Dataset 2', 'Dataset 3'],
    matrix: [
      [120, 88, 42],
      [45, 210, 18],
      [9, 36, 180],
      [0, 5, 220],
    ],
  },
}

export const FormattedValues: Story = {
  args: {
    rowLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    columnLabels: ['9am', '12pm', '3pm', '6pm'],
    matrix: [
      [2, 18, 32, 9],
      [3, 22, 41, 12],
      [1, 14, 28, 6],
      [4, 19, 35, 11],
      [0, 8, 16, 3],
    ],
    formatValue: (v) => `${v} h`,
  },
}

export const Sparse: Story = {
  args: {
    rowLabels: ['Row 1', 'Row 2', 'Row 3'],
    columnLabels: ['A', 'B', 'C', 'D'],
    matrix: [
      [0, 5, 0, 0],
      [0, 0, 12, 0],
      [3, 0, 0, 0],
    ],
  },
}
