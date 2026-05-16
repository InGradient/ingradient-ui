import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatasetSelectorMobile } from './dataset-selector-mobile'

const datasets = [
  { id: 'd1', name: 'Wafer line A — production batch 2024Q4' },
  { id: 'd2', name: 'Surface defects' },
  { id: 'd3', name: 'Pixel segmentation' },
  { id: 'd4', name: 'Keypoint annotations' },
  { id: 'd5', name: 'Mixed batch — staging' },
]

const meta: Meta<typeof DatasetSelectorMobile> = {
  title: 'Patterns/Shells/DatasetSelectorMobile',
  component: DatasetSelectorMobile,
  decorators: [(Story) => <div style={{ width: 360, padding: 14, background: 'var(--ig-color-surface-raised)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: { datasets, currentId: 'd1', open: false, onToggle: () => undefined, onSelect: () => undefined },
}

export const Open: Story = {
  args: { datasets, currentId: 'd1', open: true, onToggle: () => undefined, onSelect: () => undefined },
}

export const Loading: Story = {
  args: { datasets: [], loading: true, open: false, onToggle: () => undefined, onSelect: () => undefined },
}
