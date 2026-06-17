import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterChipRow } from './filter-chip-row'

const items = [
  { id: 'd-1', label: 'Wafer line A', count: 312 },
  { id: 'd-2', label: 'Surface defects', count: 187 },
  { id: 'd-3', label: 'Pixel segmentation', count: 94 },
  { id: 'd-4', label: 'Keypoint annotations', count: 41 },
]

const meta: Meta<typeof FilterChipRow> = {
  title: 'Components/Inputs/FilterChipRow',
  component: FilterChipRow,
  decorators: [(Story) => <div style={{ background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const AllActive: Story = {
  args: { label: 'Dataset', items, activeIds: new Set() },
}

export const SomeActive: Story = {
  args: { label: 'Dataset', items, activeIds: new Set(['d-1', 'd-3']) },
}

export const Loading: Story = {
  args: { label: 'Dataset', items: [], activeIds: new Set(), loading: true },
}

export const Empty: Story = {
  args: { label: 'Dataset', items: [], activeIds: new Set() },
}

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState<Set<string>>(new Set())
    return (
      <FilterChipRow
        label="Dataset"
        items={items}
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
