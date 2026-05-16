import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatasetFilterChipRow } from './dataset-filter-chip-row'

const datasets = [
  { id: 'd-1', name: 'Wafer line A', image_count: 312 },
  { id: 'd-2', name: 'Surface defects', image_count: 187 },
  { id: 'd-3', name: 'Pixel segmentation', image_count: 94 },
  { id: 'd-4', name: 'Keypoint annotations', image_count: 41 },
]

const meta: Meta<typeof DatasetFilterChipRow> = {
  title: 'Patterns/Shells/DatasetFilterChipRow',
  component: DatasetFilterChipRow,
  decorators: [(Story) => <div style={{ background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const AllActive: Story = {
  args: { datasets, activeIds: new Set() },
}

export const SomeActive: Story = {
  args: { datasets, activeIds: new Set(['d-1', 'd-3']) },
}

export const Loading: Story = {
  args: { datasets: [], activeIds: new Set(), loading: true },
}

export const Empty: Story = {
  args: { datasets: [], activeIds: new Set() },
}

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState<Set<string>>(new Set())
    return (
      <DatasetFilterChipRow
        datasets={datasets}
        activeIds={active}
        onToggle={(id) => setActive((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id); else next.add(id)
          return next
        })}
      />
    )
  },
}
