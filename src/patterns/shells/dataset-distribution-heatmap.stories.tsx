import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatasetDistributionHeatmap } from './dataset-distribution-heatmap'

const meta: Meta<typeof DatasetDistributionHeatmap> = {
  title: 'Patterns/DatasetDistributionHeatmap',
  component: DatasetDistributionHeatmap,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 600 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    rowLabels: ['Wafer A', 'Wafer B', 'Surface', 'Pixel seg', 'Keypoint'],
    columnLabels: ['Crack', 'Scratch', 'Dent', 'Stain', 'Rust'],
    matrix: [
      [120, 80, 45, 12, 0],
      [95, 110, 30, 8, 5],
      [60, 75, 88, 0, 20],
      [40, 50, 60, 25, 0],
      [10, 15, 5, 0, 30],
    ],
  },
}
