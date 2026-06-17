import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  PerDatasetDistributionWidget,
  type PerDatasetDistributionDataset,
} from './per-dataset-distribution-widget'

const distribution: PerDatasetDistributionDataset[] = [
  {
    dataset_id: 'ds-1', name: 'Wafer line A',
    class_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 312 },
      { class_id: 'cl-2', name: 'Scratch', count: 187 },
      { class_id: 'cl-3', name: 'Stain', count: 94 },
      { class_id: 'cl-4', name: 'Contamination', count: 41 },
    ],
  },
  {
    dataset_id: 'ds-2', name: 'Surface defects',
    class_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 218 },
      { class_id: 'cl-5', name: 'Discoloration', count: 56 },
    ],
  },
  {
    dataset_id: 'ds-3', name: 'Empty dataset',
    class_counts: [],
  },
]

const meta: Meta<typeof PerDatasetDistributionWidget> = {
  title: 'Platform Pages/Dashboard Widgets/PerDatasetDistributionWidget',
  component: PerDatasetDistributionWidget,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 700, padding: 20, background: 'var(--ig-color-bg-canvas)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { datasetDistribution: distribution } }
export const SingleDataset: Story = { args: { datasetDistribution: [distribution[0]] } }
export const Empty: Story = { args: { datasetDistribution: [] } }
